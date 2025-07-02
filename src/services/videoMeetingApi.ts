import axios from 'axios';
import queryString from 'query-string';

// Video Meeting API Service - Supports Zoom, Google Meet, Discord, Microsoft Teams
export interface VideoMeeting {
  id: string;
  topic: string;
  start_time: string;
  duration: number;
  status: 'waiting' | 'started' | 'ended';
  join_url: string;
  host_id: string;
  platform: 'zoom' | 'google-meet' | 'discord' | 'microsoft-teams';
  participants?: VideoParticipant[];
  recording_files?: VideoRecording[];
  transcript?: string;
}

export interface VideoParticipant {
  id: string;
  user_id: string;
  name: string;
  user_email: string;
  join_time: string;
  leave_time?: string;
  duration: number;
}

export interface VideoRecording {
  id: string;
  meeting_id: string;
  recording_start: string;
  recording_end: string;
  file_type: 'MP4' | 'M4A' | 'TIMELINE' | 'TRANSCRIPT' | 'CHAT';
  file_size: number;
  play_url: string;
  download_url: string;
}

export interface VideoWebhookEvent {
  event: string;
  platform: 'zoom' | 'google-meet' | 'discord' | 'microsoft-teams';
  payload: {
    account_id: string;
    object: VideoMeeting;
  };
}

class VideoMeetingApiService {
  private connectedPlatforms: Set<string> = new Set();
  private accessTokens: Map<string, string> = new Map();
  private refreshTokens: Map<string, string> = new Map();
  private tokenExpiry: Map<string, number> = new Map();
  private pollingInterval: number | null = null;

  constructor() {
    // Load saved connections from localStorage
    this.loadSavedConnections();
  }

  private loadSavedConnections(): void {
    try {
      const savedConnections = localStorage.getItem('video_meeting_connections');
      if (savedConnections) {
        const connections = JSON.parse(savedConnections);
        this.connectedPlatforms = new Set(connections.platforms || []);
        
        // Load tokens
        if (connections.tokens) {
          connections.tokens.forEach(([platform, token]: [string, string]) => {
            this.accessTokens.set(platform, token);
          });
        }
        
        // Load refresh tokens
        if (connections.refreshTokens) {
          connections.refreshTokens.forEach(([platform, token]: [string, string]) => {
            this.refreshTokens.set(platform, token);
          });
        }
        
        // Load token expiry times
        if (connections.tokenExpiry) {
          connections.tokenExpiry.forEach(([platform, expiry]: [string, number]) => {
            this.tokenExpiry.set(platform, expiry);
          });
        }
      }
    } catch (error) {
      console.error('Error loading saved connections:', error);
      // Reset connections if there's an error
      this.connectedPlatforms = new Set();
      this.accessTokens = new Map();
      this.refreshTokens = new Map();
      this.tokenExpiry = new Map();
    }
  }

  // Get the correct redirect URI based on environment
  private getRedirectUri(platform: string): string {
    const currentOrigin = window.location.origin;
    const configuredUri = import.meta.env[`VITE_${platform.toUpperCase().replace('-', '_')}_REDIRECT_URI`];
    return configuredUri || `${currentOrigin}/video-meeting/callback/${platform}`;
  }

  // Save connections to localStorage
  private saveConnections(): void {
    try {
      const connections = {
        platforms: Array.from(this.connectedPlatforms),
        tokens: Array.from(this.accessTokens.entries()),
        refreshTokens: Array.from(this.refreshTokens.entries()),
        tokenExpiry: Array.from(this.tokenExpiry.entries())
      };
      localStorage.setItem('video_meeting_connections', JSON.stringify(connections));
    } catch (error) {
      console.error('Error saving connections:', error);
    }
  }

  // Platform-specific authorization URLs
  async authorize(platform: 'zoom' | 'google-meet' | 'discord' | 'microsoft-teams'): Promise<string> {
    const redirectUri = encodeURIComponent(this.getRedirectUri(platform));
    
    switch (platform) {
      case 'zoom':
        const zoomClientId = import.meta.env.VITE_ZOOM_CLIENT_ID;
        const zoomScope = encodeURIComponent('meeting:read meeting:write recording:read user:read');
        return `https://zoom.us/oauth/authorize?response_type=code&client_id=${zoomClientId}&redirect_uri=${redirectUri}&scope=${zoomScope}`;
      
      case 'google-meet':
        const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const googleScope = encodeURIComponent('https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/meetings');
        return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=${googleScope}&access_type=offline&prompt=consent`;
      
      case 'discord':
        const discordClientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
        const discordScope = encodeURIComponent('identify guilds');
        return `https://discord.com/api/oauth2/authorize?response_type=code&client_id=${discordClientId}&redirect_uri=${redirectUri}&scope=${discordScope}`;
      
      case 'microsoft-teams':
        const teamsClientId = import.meta.env.VITE_TEAMS_CLIENT_ID;
        const teamsScope = encodeURIComponent('https://graph.microsoft.com/OnlineMeetings.ReadWrite');
        return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&client_id=${teamsClientId}&redirect_uri=${redirectUri}&scope=${teamsScope}`;
      
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(platform: string, code: string): Promise<void> {
    try {
      const redirectUri = this.getRedirectUri(platform);
      let tokenEndpoint: string;
      let clientId: string;
      let clientSecret: string;
      let params: Record<string, string>;

      switch (platform) {
        case 'zoom':
          tokenEndpoint = 'https://zoom.us/oauth/token';
          clientId = import.meta.env.VITE_ZOOM_CLIENT_ID;
          clientSecret = import.meta.env.VITE_ZOOM_CLIENT_SECRET;
          params = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri
          };
          break;
        case 'google-meet':
          tokenEndpoint = 'https://oauth2.googleapis.com/token';
          clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
          clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
          params = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
          };
          break;
        case 'discord':
          tokenEndpoint = 'https://discord.com/api/oauth2/token';
          clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
          clientSecret = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
          params = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
          };
          break;
        case 'microsoft-teams':
          tokenEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
          clientId = import.meta.env.VITE_TEAMS_CLIENT_ID;
          clientSecret = import.meta.env.VITE_TEAMS_CLIENT_SECRET;
          params = {
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret
          };
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      // For Zoom, we need to use Basic Auth
      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      
      if (platform === 'zoom') {
        headers['Authorization'] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
      }

      const response = await axios.post(tokenEndpoint, queryString.stringify(params), { headers });
      
      if (response.data.access_token) {
        this.accessTokens.set(platform, response.data.access_token);
        this.connectedPlatforms.add(platform);
        
        // Store refresh token if provided
        if (response.data.refresh_token) {
          this.refreshTokens.set(platform, response.data.refresh_token);
        }
        
        // Store token expiry time if provided
        if (response.data.expires_in) {
          const expiryTime = Date.now() + (response.data.expires_in * 1000);
          this.tokenExpiry.set(platform, expiryTime);
        }
        
        this.saveConnections();
      }
    } catch (error) {
      console.error(`Error exchanging code for token (${platform}):`, error);
      throw error;
    }
  }

  // Demo mode for WebContainer environments
  async simulateConnection(platform: string): Promise<void> {
    this.accessTokens.set(platform, `mock_access_token_${platform}`);
    this.connectedPlatforms.add(platform);
    this.saveConnections();
  }

  // Refresh token if expired
  private async refreshTokenIfNeeded(platform: string): Promise<boolean> {
    const expiryTime = this.tokenExpiry.get(platform);
    const refreshToken = this.refreshTokens.get(platform);
    
    // If token is not expired or we don't have a refresh token, no need to refresh
    if (!expiryTime || Date.now() < expiryTime || !refreshToken) {
      return false;
    }
    
    try {
      let tokenEndpoint: string;
      let clientId: string;
      let clientSecret: string;
      let params: Record<string, string>;

      switch (platform) {
        case 'zoom':
          tokenEndpoint = 'https://zoom.us/oauth/token';
          clientId = import.meta.env.VITE_ZOOM_CLIENT_ID;
          clientSecret = import.meta.env.VITE_ZOOM_CLIENT_SECRET;
          params = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken
          };
          break;
        case 'google-meet':
          tokenEndpoint = 'https://oauth2.googleapis.com/token';
          clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
          clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
          params = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret
          };
          break;
        case 'discord':
          tokenEndpoint = 'https://discord.com/api/oauth2/token';
          clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
          clientSecret = import.meta.env.VITE_DISCORD_CLIENT_SECRET;
          params = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret
          };
          break;
        case 'microsoft-teams':
          tokenEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
          clientId = import.meta.env.VITE_TEAMS_CLIENT_ID;
          clientSecret = import.meta.env.VITE_TEAMS_CLIENT_SECRET;
          params = {
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret
          };
          break;
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }

      // For Zoom, we need to use Basic Auth
      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      
      if (platform === 'zoom') {
        headers['Authorization'] = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
      }

      const response = await axios.post(tokenEndpoint, queryString.stringify(params), { headers });
      
      if (response.data.access_token) {
        this.accessTokens.set(platform, response.data.access_token);
        
        // Update refresh token if provided
        if (response.data.refresh_token) {
          this.refreshTokens.set(platform, response.data.refresh_token);
        }
        
        // Update token expiry time if provided
        if (response.data.expires_in) {
          const expiryTime = Date.now() + (response.data.expires_in * 1000);
          this.tokenExpiry.set(platform, expiryTime);
        }
        
        this.saveConnections();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error refreshing token (${platform}):`, error);
      return false;
    }
  }

  // Make API requests with platform-specific handling
  private async makeRequest(platform: string, endpoint: string, options: RequestInit = {}): Promise<any> {
    const accessToken = this.accessTokens.get(platform);
    
    if (!accessToken || accessToken.startsWith('mock_access_token_')) {
      // Return empty results for demo mode or when not connected
      return this.getEmptyResponse(platform, endpoint);
    }

    const baseUrl = this.getBaseUrl(platform);
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`${platform} API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`${platform} API request failed:`, error);
      throw error;
    }
  }

  private getBaseUrl(platform: string): string {
    switch (platform) {
      case 'zoom':
        return 'https://api.zoom.us/v2';
      case 'google-meet':
        return 'https://www.googleapis.com/calendar/v3';
      case 'discord':
        return 'https://discord.com/api/v10';
      case 'microsoft-teams':
        return 'https://graph.microsoft.com/v1.0';
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  private getEmptyResponse(platform: string, endpoint: string): any {
    // Return appropriate empty responses based on endpoint
    if (endpoint === '/users/me' || endpoint === '/me') {
      return null; // No user data when not connected
    }

    if (endpoint.includes('/meetings') || endpoint.includes('/events')) {
      return { meetings: [] };
    }

    return {};
  }

  // Get meetings from all connected platforms
  async getAllMeetings(): Promise<VideoMeeting[]> {
    const allMeetings: VideoMeeting[] = [];

    for (const platform of this.connectedPlatforms) {
      try {
        let endpoint: string;
        let method = 'GET';
        let params: any = {};
        
        switch (platform) {
          case 'zoom':
            endpoint = '/users/me/meetings';
            params = { type: 'scheduled' };
            break;
          case 'google-meet':
            endpoint = '/calendars/primary/events';
            params = { 
              timeMin: new Date().toISOString(),
              singleEvents: true,
              orderBy: 'startTime',
              maxResults: 10
            };
            break;
          case 'discord':
            endpoint = '/users/@me/guilds';
            break;
          case 'microsoft-teams':
            endpoint = '/me/onlineMeetings';
            break;
          default:
            continue;
        }

        const response = await this.makeRequest(platform, endpoint, { 
          method, 
          params 
        });
        
        // Normalize response based on platform
        let meetings: VideoMeeting[] = [];
        
        if (platform === 'zoom') {
          meetings = (response.meetings || []).map((meeting: any) => ({
            id: `${platform}_${meeting.id}`,
            topic: meeting.topic,
            start_time: meeting.start_time,
            duration: meeting.duration,
            status: meeting.status,
            join_url: meeting.join_url,
            host_id: meeting.host_id,
            platform: platform as any
          }));
        } else if (platform === 'google-meet') {
          meetings = (response.items || []).filter((event: any) => 
            event.conferenceData?.conferenceId
          ).map((event: any) => ({
            id: `${platform}_${event.id}`,
            topic: event.summary,
            start_time: event.start.dateTime || event.start.date,
            duration: event.end ? 
              Math.round((new Date(event.end.dateTime || event.end.date).getTime() - 
                new Date(event.start.dateTime || event.start.date).getTime()) / 60000) : 60,
            status: new Date(event.start.dateTime || event.start.date) > new Date() ? 'scheduled' : 'started',
            join_url: event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri || '',
            host_id: event.organizer?.email || '',
            platform: platform as any
          }));
        } else if (platform === 'discord') {
          // For Discord, we'll treat guilds/servers as "meetings"
          meetings = (response || []).map((guild: any) => ({
            id: `${platform}_${guild.id}`,
            topic: guild.name,
            start_time: new Date().toISOString(), // Discord doesn't have scheduled meetings
            duration: 60, // Default duration
            status: 'waiting',
            join_url: `https://discord.com/channels/${guild.id}`,
            host_id: guild.owner_id,
            platform: platform as any
          }));
        } else if (platform === 'microsoft-teams') {
          meetings = (response.value || []).map((meeting: any) => ({
            id: `${platform}_${meeting.id}`,
            topic: meeting.subject,
            start_time: meeting.startDateTime,
            duration: Math.round((new Date(meeting.endDateTime).getTime() - 
              new Date(meeting.startDateTime).getTime()) / 60000),
            status: new Date(meeting.startDateTime) > new Date() ? 'scheduled' : 'started',
            join_url: meeting.joinWebUrl,
            host_id: meeting.organizer?.id || '',
            platform: platform as any
          }));
        }
        
        allMeetings.push(...meetings);
      } catch (error) {
        console.error(`Error fetching meetings from ${platform}:`, error);
      }
    }

    return allMeetings;
  }

  // Create meeting on specific platform
  async createMeeting(platform: string, meetingData: {
    topic: string;
    start_time?: string;
    duration?: number;
    agenda?: string;
  }): Promise<VideoMeeting> {
    // Mock implementation for demo
    if (this.accessTokens.get(platform)?.startsWith('mock_access_token_')) {
      return {
        id: `${platform}_mock_meeting_${Date.now()}`,
        topic: meetingData.topic,
        start_time: meetingData.start_time || new Date().toISOString(),
        duration: meetingData.duration || 60,
        status: 'scheduled',
        join_url: `https://${platform}.example.com/join/mock${Math.random().toString().substr(2, 9)}`,
        host_id: `mock_user_${platform}`,
        platform: platform as any
      };
    }

    // Real implementation based on platform
    let endpoint: string;
    let body: any;
    let method = 'POST';

    switch (platform) {
      case 'zoom':
        endpoint = '/users/me/meetings';
        body = {
          topic: meetingData.topic,
          type: 2, // Scheduled meeting
          start_time: meetingData.start_time,
          duration: meetingData.duration,
          agenda: meetingData.agenda,
          settings: {
            host_video: true,
            participant_video: true,
            join_before_host: true,
            mute_upon_entry: false,
            auto_recording: 'cloud'
          }
        };
        break;
      case 'google-meet':
        endpoint = '/calendars/primary/events';
        const startTime = meetingData.start_time ? new Date(meetingData.start_time) : new Date();
        const endTime = new Date(startTime.getTime() + (meetingData.duration || 60) * 60000);
        
        body = {
          summary: meetingData.topic,
          description: meetingData.agenda,
          start: {
            dateTime: startTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          conferenceData: {
            createRequest: {
              requestId: Date.now().toString(),
              conferenceSolutionKey: { type: 'hangoutsMeet' }
            }
          }
        };
        params = { conferenceDataVersion: 1 };
        break;
      case 'microsoft-teams':
        endpoint = '/me/onlineMeetings';
        const teamsStartTime = meetingData.start_time ? new Date(meetingData.start_time) : new Date();
        const teamsEndTime = new Date(teamsStartTime.getTime() + (meetingData.duration || 60) * 60000);
        
        body = {
          subject: meetingData.topic,
          startDateTime: teamsStartTime.toISOString(),
          endDateTime: teamsEndTime.toISOString(),
          isEntryExitAnnounced: true,
          lobbyBypassSettings: { scope: 'organization' }
        };
        break;
      case 'discord':
        // Discord doesn't have a direct API for creating meetings
        // We could create a channel or event in a guild, but that's more complex
        throw new Error('Creating meetings in Discord is not supported');
      default:
        throw new Error(`Meeting creation not supported for ${platform}`);
    }

    const response = await this.makeRequest(platform, endpoint, {
      method,
      body,
      params
    });
    
    // Normalize response based on platform
    let meeting: VideoMeeting;
    
    if (platform === 'zoom') {
      meeting = {
        id: `${platform}_${response.id}`,
        topic: response.topic,
        start_time: response.start_time,
        duration: response.duration,
        status: 'scheduled',
        join_url: response.join_url,
        host_id: response.host_id,
        platform: platform as any
      };
    } else if (platform === 'google-meet') {
      meeting = {
        id: `${platform}_${response.id}`,
        topic: response.summary,
        start_time: response.start.dateTime,
        duration: Math.round((new Date(response.end.dateTime).getTime() - 
          new Date(response.start.dateTime).getTime()) / 60000),
        status: 'scheduled',
        join_url: response.hangoutLink,
        host_id: response.organizer?.email || '',
        platform: platform as any
      };
    } else if (platform === 'microsoft-teams') {
      meeting = {
        id: `${platform}_${response.id}`,
        topic: response.subject,
        start_time: response.startDateTime,
        duration: Math.round((new Date(response.endDateTime).getTime() - 
          new Date(response.startDateTime).getTime()) / 60000),
        status: 'scheduled',
        join_url: response.joinWebUrl,
        host_id: response.organizer?.id || '',
        platform: platform as any
      };
    } else {
      throw new Error(`Unsupported platform: ${platform}`);
    }
    
    return meeting;
  }

  // Generate insights from meeting transcript
  async generateMeetingInsights(meetingId: string): Promise<{
    summary: string;
    keyPoints: string[];
    actionItems: string[];
    participants: string[];
    duration: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    platform: string;
  }> {
    const [platform, id] = meetingId.split('_');
    
    // For real implementation, you would:
    // 1. Get the meeting transcript
    // 2. Send it to an AI service for analysis
    // 3. Return the structured insights
    
    // Mock insights for demo
    return {
      summary: `This ${platform} meeting covered project updates, budget discussions, and timeline planning.`,
      keyPoints: [
        'Q4 budget approved with 15% increase',
        'New feature rollout scheduled for next month',
        'Team expansion plans discussed',
        `${platform} integration working smoothly`
      ],
      actionItems: [
        'John to prepare budget breakdown by Friday',
        'Sarah to coordinate with design team',
        'Schedule follow-up meeting for next week',
        `Test ${platform} recording features`
      ],
      participants: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
      duration: 45,
      sentiment: 'positive',
      platform
    };
  }

  // Generate flashcards from meeting content
  async generateFlashcardsFromMeeting(meetingId: string): Promise<Array<{
    question: string;
    answer: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>> {
    const [platform, id] = meetingId.split('_');
    
    // For real implementation, you would:
    // 1. Get the meeting transcript
    // 2. Send it to an AI service to generate flashcards
    // 3. Return the structured flashcards
    
    // Mock flashcards for demo
    return [
      {
        question: `What was the main topic discussed in the ${platform} meeting?`,
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
      },
      {
        question: `Which platform was used for this meeting?`,
        answer: platform.charAt(0).toUpperCase() + platform.slice(1).replace('-', ' '),
        category: 'Meeting Details',
        difficulty: 'easy'
      }
    ];
  }

  // Check if any platform is connected
  isConnected(): boolean {
    return this.connectedPlatforms.size > 0;
  }

  // Get connected platforms
  getConnectedPlatforms(): string[] {
    return Array.from(this.connectedPlatforms);
  }

  // Disconnect from specific platform
  disconnectPlatform(platform: string): void {
    this.connectedPlatforms.delete(platform);
    this.accessTokens.delete(platform);
    this.refreshTokens.delete(platform);
    this.tokenExpiry.delete(platform);
    this.saveConnections();
  }

  // Disconnect from all platforms
  disconnectAll(): void {
    this.connectedPlatforms.clear();
    this.accessTokens.clear();
    this.refreshTokens.clear();
    this.tokenExpiry.clear();
    localStorage.removeItem('video_meeting_connections');
  }

  // Real-time monitoring
  async startRealTimeMonitoring(meetingId: string, callback: (data: any) => void): Promise<void> {
    const [platform, id] = meetingId.split('_');
    
    // Clear any existing polling
    this.stopRealTimeMonitoring();
    
    // For real implementation, you would:
    // 1. Use WebSockets if the platform supports it
    // 2. Otherwise, use polling to periodically check meeting status
    
    // Mock implementation using polling
    this.pollingInterval = window.setInterval(async () => {
      try {
        // In a real implementation, you would fetch actual data
        const mockData = {
          meeting: { 
            id: meetingId, 
            status: 'started', 
            platform,
            topic: `${platform.charAt(0).toUpperCase() + platform.slice(1).replace('-', ' ')} Meeting`,
            start_time: new Date().toISOString(),
            duration: 60,
            join_url: `https://${platform}.example.com/join/mock123456`,
            host_id: `mock_user_${platform}`
          },
          participants: [
            { 
              id: '1', 
              user_id: 'user1', 
              name: 'John Doe', 
              user_email: 'john@example.com',
              join_time: new Date(Date.now() - 300000).toISOString(), 
              duration: 300 
            },
            { 
              id: '2', 
              user_id: 'user2', 
              name: 'Sarah Smith', 
              user_email: 'sarah@example.com',
              join_time: new Date(Date.now() - 280000).toISOString(), 
              duration: 280 
            },
            { 
              id: '3', 
              user_id: 'user3', 
              name: 'Mike Johnson', 
              user_email: 'mike@example.com',
              join_time: new Date(Date.now() - 240000).toISOString(), 
              duration: 240 
            }
          ],
          timestamp: new Date().toISOString()
        };
        
        callback(mockData);
      } catch (error) {
        console.error('Error in real-time monitoring:', error);
      }
    }, 5000); // Poll every 5 seconds
  }

  stopRealTimeMonitoring(): void {
    if (this.pollingInterval !== null) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}

export const videoMeetingApi = new VideoMeetingApiService();