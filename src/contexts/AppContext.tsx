import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Tool, Task, Meeting, Flashcard, Email, User, SocialPost } from '../types';

export type UserRole = 'professional' | 'student';

interface AppState {
  user: User | null;
  userRole: UserRole;
  tools: Tool[];
  tasks: Task[];
  meetings: Meeting[];
  flashcards: Flashcard[];
  emails: Email[];
  socialPosts: SocialPost[];
  isZoomConnected: boolean;
  activeTool: string | null;
  isPremiumUser: boolean;
  unlockedFeatures: string[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'TOGGLE_TOOL'; payload: string }
  | { type: 'TRACK_TOOL_USAGE'; payload: { toolId: string; success: boolean } }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'LOAD_TASKS'; payload: Task[] }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_MEETING'; payload: Meeting }
  | { type: 'UPDATE_MEETING'; payload: { id: string; updates: Partial<Meeting> } }
  | { type: 'ADD_FLASHCARD'; payload: Flashcard }
  | { type: 'LOAD_FLASHCARDS'; payload: Flashcard[] }
  | { type: 'ADD_EMAIL'; payload: Email }
  | { type: 'UPDATE_EMAIL'; payload: { id: string; updates: Partial<Email> } }
  | { type: 'DELETE_EMAIL'; payload: string }
  | { type: 'ADD_SOCIAL_POST'; payload: SocialPost }
  | { type: 'TOGGLE_ZOOM_CONNECTION' }
  | { type: 'SET_ACTIVE_TOOL'; payload: string | null }
  | { type: 'UNLOCK_PREMIUM_FEATURE'; payload: string }
  | { type: 'ACTIVATE_PREMIUM_TRIAL' };

const initialState: AppState = {
  user: null,
  userRole: 'professional', // Default role
  tools: [
    {
      id: 'flashcard-creator',
      name: 'Flashcard Creator',
      description: 'Generate intelligent flashcards from meeting content',
      category: 'education',
      icon: 'BookOpen',
      isActive: true,
      features: ['Auto-generate from transcripts', 'Spaced repetition', 'Progress tracking'],
      usageCount: 12,
      efficiency: 95,
      totalOperations: 15,
      successfulOperations: 14,
      lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 'research-assistant',
      name: 'Research Assistant',
      description: 'AI-powered research and fact-checking',
      category: 'education',
      icon: 'Search',
      isActive: true,
      features: ['Real-time fact checking', 'Source validation', 'Summary generation'],
      usageCount: 8,
      efficiency: 92,
      totalOperations: 10,
      successfulOperations: 9,
      lastUsed: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    {
      id: 'quiz-generator',
      name: 'Quiz Generator',
      description: 'Create intelligent quizzes from any content',
      category: 'education',
      icon: 'HelpCircle',
      isActive: true,
      features: ['AI-powered questions', 'Multiple formats', 'Difficulty scaling'],
      usageCount: 5,
      efficiency: 88,
      totalOperations: 7,
      successfulOperations: 6,
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: 'meeting-scheduler',
      name: 'Meeting Scheduler',
      description: 'Smart scheduling with calendar integration',
      category: 'productivity',
      icon: 'Calendar',
      isActive: true,
      features: ['Smart scheduling', 'Conflict detection', 'Auto-invites'],
      usageCount: 20,
      efficiency: 96,
      totalOperations: 22,
      successfulOperations: 21,
      lastUsed: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: 'todo-manager',
      name: 'Todo List Manager',
      description: 'Intelligent task management and prioritization',
      category: 'productivity',
      icon: 'CheckSquare',
      isActive: true,
      features: ['Priority sorting', 'Due date tracking', 'Progress analytics'],
      usageCount: 35,
      efficiency: 94,
      totalOperations: 38,
      successfulOperations: 36,
      lastUsed: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: 'timeline-manager',
      name: 'Timeline Manager',
      description: 'Visual project timeline and milestone tracking',
      category: 'productivity',
      icon: 'Clock',
      isActive: false,
      features: ['Visual timelines', 'Milestone tracking', 'Progress reports'],
      usageCount: 3,
      efficiency: 90,
      totalOperations: 4,
      successfulOperations: 3,
      lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
    {
      id: 'email-assistant',
      name: 'Email Assistant',
      description: 'AI-powered email generation from meeting content',
      category: 'email',
      icon: 'Mail',
      isActive: true,
      features: ['Auto-generate emails', 'Smart templates', 'Approval workflow'],
      usageCount: 15,
      efficiency: 93,
      totalOperations: 17,
      successfulOperations: 16,
      lastUsed: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
  ],
  tasks: [],
  meetings: [],
  flashcards: [],
  emails: [],
  socialPosts: [],
  isZoomConnected: false,
  activeTool: null,
  isPremiumUser: false,
  unlockedFeatures: [],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_USER_ROLE':
      return { ...state, userRole: action.payload };
    case 'TOGGLE_TOOL':
      return {
        ...state,
        tools: state.tools.map(tool =>
          tool.id === action.payload ? { ...tool, isActive: !tool.isActive } : tool
        ),
      };
    case 'TRACK_TOOL_USAGE':
      return {
        ...state,
        tools: state.tools.map(tool =>
          tool.id === action.payload.toolId ? {
            ...tool,
            usageCount: tool.usageCount + 1,
            totalOperations: tool.totalOperations + 1,
            successfulOperations: tool.successfulOperations + (action.payload.success ? 1 : 0),
            efficiency: Math.round(((tool.successfulOperations + (action.payload.success ? 1 : 0)) / (tool.totalOperations + 1)) * 100),
            lastUsed: new Date(),
          } : tool
        ),
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'ADD_MEETING':
      return {
        ...state,
        meetings: [...state.meetings, action.payload],
      };
    case 'UPDATE_MEETING':
      return {
        ...state,
        meetings: state.meetings.map(meeting =>
          meeting.id === action.payload.id 
            ? { ...meeting, ...action.payload.updates }
            : meeting
        ),
      };
    case 'ADD_FLASHCARD':
      return {
        ...state,
        flashcards: [...state.flashcards, action.payload],
      };
    case 'LOAD_FLASHCARDS':
      return {
        ...state,
        flashcards: action.payload,
      };
    case 'ADD_EMAIL':
      return {
        ...state,
        emails: [...state.emails, action.payload],
      };
    case 'UPDATE_EMAIL':
      return {
        ...state,
        emails: state.emails.map(email =>
          email.id === action.payload.id 
            ? { ...email, ...action.payload.updates }
            : email
        ),
      };
    case 'DELETE_EMAIL':
      return {
        ...state,
        emails: state.emails.filter(email => email.id !== action.payload),
      };
    case 'ADD_SOCIAL_POST':
      return {
        ...state,
        socialPosts: [...state.socialPosts, action.payload],
      };
    case 'TOGGLE_ZOOM_CONNECTION':
      return {
        ...state,
        isZoomConnected: !state.isZoomConnected,
      };
    case 'SET_ACTIVE_TOOL':
      return {
        ...state,
        activeTool: action.payload,
      };
    case 'UNLOCK_PREMIUM_FEATURE':
      return {
        ...state,
        unlockedFeatures: [...state.unlockedFeatures, action.payload],
      };
    case 'ACTIVATE_PREMIUM_TRIAL':
      return {
        ...state,
        isPremiumUser: true,
        unlockedFeatures: ['Quiz Generator', 'Email Management', 'AI Assistant', 'AI Tools'],
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};