import axios from 'axios';
import queryString from 'query-string';

// Zoom API Service
export interface ZoomMeeting {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  status: 'waiting' | 'started' | 'ended';
  join_url: string;
  host_id: string;
  participants?: ZoomParticipant[];
  recording_files?: ZoomRecording[];
  transcript?: string;
}

export interface ZoomParticipant {
  id: string;
  user_id: string;
  name: string;
  user_email: string;
  join_time: string;
  leave_time?: string;
  duration: number;
}

export interface ZoomRecording {
  id: string;
  meeting_id: string;
  recording_start: string;
  recording_end: string;
  file_type: 'MP4' | 'M4A' | 'TIMELINE' | 'TRANSCRIPT' | 'CHAT';
  file_size: number;
  play_url: string;
  download_url: string;
}

export interface ZoomWebhookEvent {
  event: string;
  payload: {
    account_id: string;
    object: ZoomMeeting;
  };
}

class ZoomApiService {
  private baseUrl = 'https://api.zoom.us/v2';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private pollingInterval: number | null = null;

  constructor() {
    // Load saved tokens from localStorage
    this.loadSavedTokens();
  }

  private loadSavedTokens(): void {
    try {
      this.accessToken = localStorage.getItem('zoom_access_token');
      this.refreshToken = localStorage.getItem('zoom_refresh_token');
      const expiryStr = localStorage.getItem('zoom_token_expiry');
      this.tokenExpiry = expiryStr ? parseInt(expiryStr, 10) : null;
    } catch (error) {
      console.error('Error loading Zoom tokens:', error);
      this.accessToken = null;
      this.refreshToken = null;
      this.tokenExpiry = null;
    }
  }

  private saveTokens(): void {
    try {
      if (this.accessToken) {
        localStorage.setItem('zoom_access_token', this.accessToken);
      } else {
        localStorage.removeItem('zoom_access_token');
      }
      
      if (this.refreshToken) {
        localStorage.setItem('zoom_refresh_token', this.refreshToken);
      } else {
        localStorage.removeItem('zoom_refresh_token');
      }
      
      if (this.tokenExpiry) {
        localStorage.setItem('zoom_token_expiry', this.tokenExpiry.toString());
      } else {
        localStorage.removeItem('zoom_token_expiry');
      }
    } catch (error) {
      console.error('Error saving Zoom tokens:', error);
    }
  }

  // Get the correct redirect URI based on environment
  private getRedirectUri(): string {
    const currentOrigin = window.location.origin;
    const configuredUri = import.meta.env.VITE_ZOOM_REDIRECT_URI;
    return configuredUri || `${currentOrigin}/zoom/callback`;
  }

  // OAuth 2.0 Authorization
  async authorize(): Promise<string> {
    const clientId = import.meta.env.VITE_ZOOM_CLIENT_ID;
    const redirectUri = encodeURIComponent(this.getRedirectUri());
    const scope = encodeURIComponent('meeting:read meeting:write recording:read user:read');
    
    return `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  }

  async exchangeCodeForToken(code: string): Promise<void> {
    try {
      const clientId = import.meta.env.VITE_ZOOM_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_ZOOM_CLIENT_SECRET;
      const redirectUri = this.getRedirectUri();

      const response = await axios.post('https://zoom.us/oauth/token', 
        queryString.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
          }
        }
      );
      
      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        
        if (response.data.refresh_token) {
          this.refreshToken = response.data.refresh_token;
        }
        
        if (response.data.expires_in) {
          this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        }
        
        this.saveTokens();
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Demo mode for WebContainer environments
  async simulateConnection(): Promise<void> {
    this.accessToken = 'mock_access_token_for_demo';
    this.refreshToken = 'mock_refresh_token';
    this.tokenExpiry = Date.now() + 3600000; // 1 hour from now
    this.saveTokens();
  }

  private async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.refreshToken || !this.tokenExpiry) {
      return false;
    }
    
    // If token is not expired, no need to refresh
    if (Date.now() < this.tokenExpiry) {
      return false;
    }
    
    try {
      const clientId = import.meta.env.VITE_ZOOM_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_ZOOM_CLIENT_SECRET;

      const response = await axios.post('https://zoom.us/oauth/token', 
        queryString.stringify({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
          }
        }
      );
      
      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        
        if (response.data.refresh_token) {
          this.refreshToken = response.data.refresh_token;
        }
        
        if (response.data.expires_in) {
          this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
        }
        
        this.saveTokens();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }

  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Zoom');
    }

    // If using mock token, return mock data
    if (this.accessToken === 'mock_access_token_for_demo') {
      return this.getMockData(endpoint, options);
    }

    // Try to refresh token if needed
    await this.refreshTokenIfNeeded();

    try {
      const response = await axios({
        method: options.method || 'GET',
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        data: options.body,
        params: options.params
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshTokenIfNeeded();
        if (refreshed) {
          // Retry with new token
          const response = await axios({
            method: options.method || 'GET',
            url: `${this.baseUrl}${endpoint}`,
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json',
              ...options.headers
            },
            data: options.body,
            params: options.params
          });
          
          return response.data;
        }
      }
      
      throw error;
    }
  }

  private getMockData(endpoint: string, options: any = {}): any {
    // Return mock data for demo purposes
    if (endpoint === '/users/me') {
      return {
        id: 'mock_user_id',
        first_name: 'Demo',
        last_name: 'User',
        email: 'demo@example.com'
      };
    }

    if (endpoint.includes('/meetings')) {
      if (endpoint.includes('type=live')) {
        return {
          meetings: [
            {
              id: 'mock_meeting_live_1',
              topic: 'Demo Team Standup (Live)',
              start_time: new Date().toISOString(),
              duration: 30,
              status: 'started',
              join_url: 'https://zoom.us/j/mock123456',
              host_id: 'mock_user_id'
            }
          ]
        };
      }
      
      return {
        meetings: [
          {
            id: 'mock_meeting_1',
            topic: 'Demo Team Standup',
            start_time: new Date().toISOString(),
            duration: 30,
            status: 'scheduled',
            join_url: 'https://zoom.us/j/mock123456',
            host_id: 'mock_user_id'
          },
          {
            id: 'mock_meeting_2',
            topic: 'Product Review Meeting',
            start_time: new Date(Date.now() + 3600000).toISOString(),
            duration: 60,
            status: 'scheduled',
            join_url: 'https://zoom.us/j/mock789012',
            host_id: 'mock_user_id'
          }
        ]
      };
    }

    if (endpoint.includes('/metrics/meetings') && endpoint.includes('/participants')) {
      return {
        participants: [
          {
            id: 'participant1',
            user_id: 'user1',
            name: 'John Doe',
            user_email: 'john@example.com',
            join_time: new Date(Date.now() - 300000).toISOString(),
            duration: 300
          },
          {
            id: 'participant2',
            user_id: 'user2',
            name: 'Sarah Smith',
            user_email: 'sarah@example.com',
            join_time: new Date(Date.now() - 280000).toISOString(),
            duration: 280
          }
        ]
      };
    }

    if (endpoint.includes('/recordings')) {
      return {
        recording_files: [
          {
            id: 'recording1',
            meeting_id: endpoint.split('/')[2],
            recording_start: new Date(Date.now() - 3600000).toISOString(),
            recording_end: new Date(Date.now() - 3540000).toISOString(),
            file_type: 'MP4',
            file_size: 1024000,
            play_url: 'https://zoom.us/rec/play/mock123',
            download_url: 'https://zoom.us/rec/download/mock123'
          },
          {
            id: 'recording2',
            meeting_id: endpoint.split('/')[2],
            recording_start: new Date(Date.now() - 3600000).toISOString(),
            recording_end: new Date(Date.now() - 3540000).toISOString(),
            file_type: 'TRANSCRIPT',
            file_size: 10240,
            play_url: 'https://zoom.us/rec/play/mock123-transcript',
            download_url: 'https://zoom.us/rec/download/mock123-transcript'
          }
        ]
      };
    }

    // If it's a POST request to create a meeting
    if (endpoint === '/users/me/meetings' && options.method === 'POST') {
      const body = options.body ? JSON.parse(options.body) : {};
      return {
        id: `mock_meeting_${Date.now()}`,
        topic: body.topic || 'New Meeting',
        start_time: body.start_time || new Date().toISOString(),
        duration: body.duration || 60,
        status: 'scheduled',
        join_url: `https://zoom.us/j/mock${Math.random().toString().substr(2, 9)}`,
        host_id: 'mock_user_id'
      };
    }

    return {};
  }

  // Get user profile
  async getUser(): Promise<any> {
    return this.makeRequest('/users/me');
  }

  // List meetings
  async getMeetings(type: 'scheduled' | 'live' | 'upcoming' = 'scheduled'): Promise<ZoomMeeting[]> {
    const response = await this.makeRequest(`/users/me/meetings?type=${type}`);
    return response.meetings || [];
  }

  // Get specific meeting
  async getMeeting(meetingId: string): Promise<ZoomMeeting> {
    return this.makeRequest(`/meetings/${meetingId}`);
  }

  // Create meeting
  async createMeeting(meetingData: {
    topic: string;
    type: number;
    start_time?: string;
    duration?: number;
    timezone?: string;
    agenda?: string;
    settings?: any;
  }): Promise<ZoomMeeting> {
    return this.makeRequest('/users/me/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData)
    });
  }

  // Update meeting
  async updateMeeting(meetingId: string, updates: Partial<ZoomMeeting>): Promise<void> {
    return this.makeRequest(`/meetings/${meetingId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Delete meeting
  async deleteMeeting(meetingId: string): Promise<void> {
    return this.makeRequest(`/meetings/${meetingId}`, {
      method: 'DELETE'
    });
  }

  // Get meeting participants
  async getMeetingParticipants(meetingId: string): Promise<ZoomParticipant[]> {
    const response = await this.makeRequest(`/metrics/meetings/${meetingId}/participants`);
    return response.participants || [];
  }

  // Get meeting recordings
  async getMeetingRecordings(meetingId: string): Promise<ZoomRecording[]> {
    const response = await this.makeRequest(`/meetings/${meetingId}/recordings`);
    return response.recording_files || [];
  }

  // Get cloud recordings for a date range
  async getCloudRecordings(from: string, to: string): Promise<any> {
    return this.makeRequest(`/users/me/recordings?from=${from}&to=${to}`);
  }

  // Get meeting transcript (if available)
  async getMeetingTranscript(meetingId: string): Promise<string | null> {
    try {
      // For demo purposes, return mock transcript
      if (this.accessToken === 'mock_access_token_for_demo') {
        return `
          Demo Meeting Transcript:
          
          [00:00] John: Welcome everyone to today's standup meeting.
          [00:15] Sarah: Thanks John. I completed the user authentication feature yesterday.
          [00:30] Mike: Great work Sarah. I'm working on the dashboard components today.
          [00:45] John: Excellent progress. Any blockers?
          [01:00] Sarah: No blockers on my end.
          [01:15] Mike: All good here too.
          [01:30] John: Perfect. Let's wrap up. Same time tomorrow?
          [01:45] All: Sounds good!
        `;
      }

      const recordings = await this.getMeetingRecordings(meetingId);
      const transcriptFile = recordings.find(r => r.file_type === 'TRANSCRIPT');
      
      if (transcriptFile) {
        const response = await axios.get(transcriptFile.download_url, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      return null;
    }
  }

  // Webhook verification
  static verifyWebhook(payload: string, signature: string, secretToken: string): boolean {
    try {
      const crypto = require('crypto');
      const hash = crypto.createHmac('sha256', secretToken).update(payload).digest('hex');
      return hash === signature;
    } catch (error) {
      console.error('Error verifying webhook:', error);
      return false;
    }
  }

  // Process webhook events
  static processWebhookEvent(event: ZoomWebhookEvent): void {
    // Dispatch a custom event that components can listen for
    const customEvent = new CustomEvent('zoom-webhook', { 
      detail: event 
    });
    window.dispatchEvent(customEvent);
    
    switch (event.event) {
      case 'meeting.started':
        console.log('Meeting started:', event.payload.object);
        break;
      case 'meeting.ended':
        console.log('Meeting ended:', event.payload.object);
        break;
      case 'recording.completed':
        console.log('Recording completed:', event.payload.object);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }
  }

  // Real-time meeting monitoring
  async startRealTimeMonitoring(meetingId: string, callback: (data: any) => void): Promise<void> {
    // Clear any existing polling
    this.stopRealTimeMonitoring();
    
    // In a real implementation, you'd use Zoom's real-time APIs or WebSocket
    // For demo, we'll use polling
    this.pollingInterval = window.setInterval(async () => {
      try {
        // For mock token, return mock data
        if (this.accessToken === 'mock_access_token_for_demo') {
          callback({
            meeting: { 
              id: meetingId, 
              status: 'started', 
              topic: 'Demo Team Standup',
              start_time: new Date().toISOString(),
              duration: 30,
              join_url: 'https://zoom.us/j/mock123456',
              host_id: 'mock_user_id'
            },
            participants: [
              { 
                id: 'participant1', 
                user_id: 'user1', 
                name: 'John Doe', 
                user_email: 'john@example.com',
                join_time: new Date(Date.now() - 300000).toISOString(), 
                duration: 300 
              },
              { 
                id: 'participant2', 
                user_id: 'user2', 
                name: 'Sarah Smith', 
                user_email: 'sarah@example.com',
                join_time: new Date(Date.now() - 280000).toISOString(), 
                duration: 280 
              }
            ],
            timestamp: new Date().toISOString()
          });
          return;
        }
        
        // For real implementation
        const meeting = await this.getMeeting(meetingId);
        const participants = await this.getMeetingParticipants(meetingId);
        
        callback({
          meeting,
          participants,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error polling meeting data:', error);
      }
    }, 5000); // Poll every 5 seconds
  }

  stopRealTimeMonitoring(): void {
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // AI-powered meeting insights
  async generateMeetingInsights(meetingId: string): Promise<{
    summary: string;
    keyPoints: string[];
    actionItems: string[];
    participants: string[];
    duration: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }> {
    const transcript = await this.getMeetingTranscript(meetingId);
    const participants = await this.getMeetingParticipants(meetingId);
    
    // For real implementation, you'd send the transcript to an AI service
    // For demo, return mock insights
    return {
      summary: 'This meeting covered project updates, budget discussions, and timeline planning.',
      keyPoints: [
        'Q4 budget approved with 15% increase',
        'New feature rollout scheduled for next month',
        'Team expansion plans discussed'
      ],
      actionItems: [
        'John to prepare budget breakdown by Friday',
        'Sarah to coordinate with design team',
        'Schedule follow-up meeting for next week'
      ],
      participants: participants.map(p => p.name),
      duration: participants.reduce((max, p) => Math.max(max, p.duration), 0),
      sentiment: 'positive'
    };
  }

  // Generate flashcards from meeting content
  async generateFlashcardsFromMeeting(meetingId: string): Promise<Array<{
    question: string;
    answer: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>> {
    const transcript = await this.getMeetingTranscript(meetingId);
    
    // For real implementation, you'd send the transcript to an AI service
    // For demo, return mock flashcards
    return [
      {
        question: 'What was the main topic discussed in the meeting?',
        answer: 'Project updates and budget planning',
        category: 'Meeting Notes',
        difficulty: 'easy'
      },
      {
        question: 'What is the timeline for the new feature rollout?',
        answer: 'Next month',
        category: 'Project Planning',
        difficulty: 'medium'
      },
      {
        question: 'Who is responsible for preparing the budget breakdown?',
        answer: 'John',
        category: 'Action Items',
        difficulty: 'easy'
      }
    ];
  }

  // Check connection status
  isConnected(): boolean {
    return !!this.accessToken;
  }

  // Disconnect
  disconnect(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('zoom_access_token');
    localStorage.removeItem('zoom_refresh_token');
    localStorage.removeItem('zoom_token_expiry');
  }
}

export const zoomApi = new ZoomApiService();