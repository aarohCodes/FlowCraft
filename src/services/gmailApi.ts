import axios from 'axios';
import queryString from 'query-string';

// Gmail API Service for AI-powered email generation and management
export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body: { data?: string };
  };
}

export interface EmailTemplate {
  type: 'follow_up' | 'action_items' | 'meeting_summary' | 'thank_you' | 'reminder';
  subject: string;
  body: string;
  priority: 'low' | 'medium' | 'high';
}

class GmailApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private isConnected: boolean = false;
  private baseUrl: string = 'https://gmail.googleapis.com/gmail/v1';

  constructor() {
    // Load saved tokens from localStorage
    this.loadSavedTokens();
  }

  private loadSavedTokens(): void {
    try {
      this.accessToken = localStorage.getItem('gmail_access_token');
      this.refreshToken = localStorage.getItem('gmail_refresh_token');
      const expiryStr = localStorage.getItem('gmail_token_expiry');
      this.tokenExpiry = expiryStr ? parseInt(expiryStr, 10) : null;
      this.isConnected = !!this.accessToken;
    } catch (error) {
      console.error('Error loading Gmail tokens:', error);
      this.accessToken = null;
      this.refreshToken = null;
      this.tokenExpiry = null;
      this.isConnected = false;
    }
  }

  private saveTokens(): void {
    try {
      if (this.accessToken) {
        localStorage.setItem('gmail_access_token', this.accessToken);
      } else {
        localStorage.removeItem('gmail_access_token');
      }
      
      if (this.refreshToken) {
        localStorage.setItem('gmail_refresh_token', this.refreshToken);
      } else {
        localStorage.removeItem('gmail_refresh_token');
      }
      
      if (this.tokenExpiry) {
        localStorage.setItem('gmail_token_expiry', this.tokenExpiry.toString());
      } else {
        localStorage.removeItem('gmail_token_expiry');
      }
    } catch (error) {
      console.error('Error saving Gmail tokens:', error);
    }
  }

  // Get the correct redirect URI based on environment
  private getRedirectUri(): string {
    const currentOrigin = window.location.origin;
    const configuredUri = import.meta.env.VITE_GMAIL_REDIRECT_URI;
    return configuredUri || `${currentOrigin}/gmail/callback`;
  }

  // OAuth 2.0 Authorization for Gmail
  async authorize(): Promise<string> {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(this.getRedirectUri());
    const scope = encodeURIComponent('https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.send');
    
    return `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;
  }

  // Exchange code for access token
  async exchangeCodeForToken(code: string): Promise<void> {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
      const redirectUri = this.getRedirectUri();

      const response = await axios.post('https://oauth2.googleapis.com/token', 
        queryString.stringify({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        this.isConnected = true;
        
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

  // Demo mode for development
  async simulateConnection(): Promise<void> {
    this.accessToken = 'mock_gmail_access_token';
    this.refreshToken = 'mock_gmail_refresh_token';
    this.tokenExpiry = Date.now() + 3600000; // 1 hour from now
    this.isConnected = true;
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
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

      const response = await axios.post('https://oauth2.googleapis.com/token', 
        queryString.stringify({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
          client_id: clientId,
          client_secret: clientSecret
        }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      if (response.data.access_token) {
        this.accessToken = response.data.access_token;
        
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

  // Make authenticated requests to Gmail API
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const accessToken = localStorage.getItem('gmail_access_token');
    
    if (!accessToken || accessToken.startsWith('mock_access_token_')) {
      // Return empty results for demo mode or when not connected
      return this.getEmptyResponse(endpoint);
    }

    const url = `${this.baseUrl}${endpoint}`;
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
        throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Gmail API request failed:', error);
      throw error;
    }
  }

  private getEmptyResponse(endpoint: string): any {
    // Return appropriate empty responses based on endpoint
    if (endpoint === '/users/me/profile') {
      return null; // No user data when not connected
    }

    if (endpoint === '/users/me/messages') {
      return { messages: [] };
    }

    if (endpoint.startsWith('/users/me/messages/') && !endpoint.includes('send')) {
      return null; // No message data when not connected
    }

    return {};
  }

  // Generate AI-powered emails based on meeting content
  async generateEmailsFromMeeting(meetingId: string, meetingData: {
    topic: string;
    participants: string[];
    transcript?: string;
    actionItems?: string[];
    keyPoints?: string[];
  }): Promise<EmailTemplate[]> {
    const emails: EmailTemplate[] = [];

    // Follow-up email with meeting summary
    emails.push({
      type: 'meeting_summary',
      subject: `Meeting Summary: ${meetingData.topic}`,
      body: `Hi team,

Thank you for joining today's meeting on "${meetingData.topic}".

Key Discussion Points:
${meetingData.keyPoints?.map(point => `• ${point}`).join('\n') || '• Project updates discussed\n• Timeline reviewed\n• Next steps identified'}

Action Items:
${meetingData.actionItems?.map(item => `• ${item}`).join('\n') || '• Follow up on pending tasks\n• Schedule next review meeting'}

Please let me know if I missed anything or if you have any questions.

Best regards,
[Your Name]`,
      priority: 'medium'
    });

    // Action items email to specific participants
    if (meetingData.actionItems && meetingData.actionItems.length > 0) {
      emails.push({
        type: 'action_items',
        subject: `Action Items from ${meetingData.topic}`,
        body: `Hi there,

Following up on our meeting today, here are the action items that were assigned:

${meetingData.actionItems.map(item => `• ${item}`).join('\n')}

Please confirm receipt and let me know if you have any questions about these tasks.

Thanks!
[Your Name]`,
        priority: 'high'
      });
    }

    // Thank you email to external participants
    const externalParticipants = meetingData.participants.filter(p => 
      !p.includes('@yourcompany.com') && p.includes('@')
    );

    if (externalParticipants.length > 0) {
      emails.push({
        type: 'thank_you',
        subject: `Thank you for joining our meeting`,
        body: `Dear colleagues,

Thank you for taking the time to join our meeting on "${meetingData.topic}" today. Your insights and contributions were valuable.

We'll follow up with the meeting notes and next steps shortly.

Looking forward to our continued collaboration.

Best regards,
[Your Name]`,
        priority: 'low'
      });
    }

    return emails;
  }

  // Send email through Gmail API
  async sendEmail(emailData: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
  }): Promise<string> {
    const message = this.createEmailMessage(emailData);
    const encodedMessage = btoa(message)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await this.makeRequest('/users/me/messages/send', {
      method: 'POST',
      body: JSON.stringify({ raw: encodedMessage })
    });

    return response.id;
  }

  // Create RFC 2822 formatted email message
  private createEmailMessage(emailData: {
    to: string[];
    cc?: string[];
    bcc?: string[];
    subject: string;
    body: string;
  }): string {
    const lines = [];
    
    lines.push(`To: ${emailData.to.join(', ')}`);
    if (emailData.cc && emailData.cc.length > 0) {
      lines.push(`Cc: ${emailData.cc.join(', ')}`);
    }
    if (emailData.bcc && emailData.bcc.length > 0) {
      lines.push(`Bcc: ${emailData.bcc.join(', ')}`);
    }
    lines.push(`Subject: ${emailData.subject}`);
    lines.push('Content-Type: text/plain; charset=utf-8');
    lines.push('');
    lines.push(emailData.body);

    return lines.join('\r\n');
  }

  // Get user profile
  async getUserProfile(): Promise<any> {
    return this.makeRequest('/users/me/profile');
  }

  // Get messages
  async getMessages(maxResults: number = 10, query: string = ''): Promise<GmailMessage[]> {
    const queryParams = new URLSearchParams({ maxResults: maxResults.toString() });
    if (query) {
      queryParams.append('q', query);
    }
    
    const response = await this.makeRequest(`/users/me/messages?${queryParams.toString()}`);
    
    // For real implementation, you'd fetch each message's details
    // For demo, we'll return simplified messages
    if (this.accessToken === 'mock_gmail_access_token') {
      return [
        {
          id: 'mock_message_1',
          threadId: 'mock_thread_1',
          labelIds: ['INBOX', 'UNREAD'],
          snippet: 'Meeting summary for yesterday\'s call...',
          payload: {
            headers: [
              { name: 'From', value: 'team@company.com' },
              { name: 'Subject', value: 'Meeting Summary: Q4 Planning' }
            ],
            body: { data: btoa('Full email content here') }
          }
        },
        {
          id: 'mock_message_2',
          threadId: 'mock_thread_2',
          labelIds: ['INBOX'],
          snippet: 'Here are the action items from our meeting...',
          payload: {
            headers: [
              { name: 'From', value: 'manager@company.com' },
              { name: 'Subject', value: 'Action Items: Project Alpha' }
            ],
            body: { data: btoa('Full email content here') }
          }
        }
      ];
    }
    
    // For real implementation
    const messages = [];
    for (const msg of response.messages || []) {
      const fullMessage = await this.makeRequest(`/users/me/messages/${msg.id}`);
      messages.push(fullMessage);
    }
    
    return messages;
  }

  // Check connection status
  isGmailConnected(): boolean {
    return this.isConnected;
  }

  // Disconnect from Gmail
  disconnect(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    this.isConnected = false;
    localStorage.removeItem('gmail_access_token');
    localStorage.removeItem('gmail_refresh_token');
    localStorage.removeItem('gmail_token_expiry');
  }

  // Smart email suggestions based on context
  async getEmailSuggestions(context: {
    meetingType: string;
    participants: string[];
    urgency: 'low' | 'medium' | 'high';
  }): Promise<string[]> {
    const suggestions = [];

    if (context.meetingType.toLowerCase().includes('standup')) {
      suggestions.push('Daily standup summary and blockers');
      suggestions.push('Follow-up on yesterday\'s action items');
    }

    if (context.meetingType.toLowerCase().includes('review')) {
      suggestions.push('Code review feedback and next steps');
      suggestions.push('Performance review summary');
    }

    if (context.urgency === 'high') {
      suggestions.push('Urgent: Immediate action required');
      suggestions.push('Time-sensitive follow-up needed');
    }

    return suggestions;
  }
}

export const gmailApi = new GmailApiService();