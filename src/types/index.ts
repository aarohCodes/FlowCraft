export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'education' | 'productivity' | 'email';
  icon: string;
  isActive: boolean;
  features: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  startDate?: Date;
  dueDate?: Date;
  category: string;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  duration: number;
  transcript?: string;
  participants: string[];
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  correctCount: number;
  totalAttempts: number;
}

export interface Email {
  id: string;
  subject: string;
  body: string;
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  status: 'draft' | 'pending_approval' | 'approved' | 'sent';
  priority: 'low' | 'medium' | 'high';
  meetingId?: string;
  emailType: 'follow_up' | 'action_items' | 'meeting_summary' | 'thank_you' | 'reminder' | 'custom';
  generatedAt: Date;
  scheduledSendTime?: Date;
  aiGenerated: boolean;
  editHistory?: {
    timestamp: Date;
    changes: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    autoSync: boolean;
  };
}

export interface SocialPost {
  id: string;
  content: string;
  platform: 'twitter' | 'linkedin' | 'facebook';
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate?: Date;
  createdAt: Date;
}