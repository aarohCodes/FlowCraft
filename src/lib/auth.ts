import { supabase } from './supabase';
import { User } from '../types';

// In-memory storage for users
const users: Record<string, User> = {};

// In-memory session storage
let currentUser: User | null = null;

// Check if we have a saved user in localStorage
try {
  const savedUser = localStorage.getItem('flowcraft_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
} catch (error) {
  console.error('Error loading saved user:', error);
}

export const auth = {
  // Sign up a new user
  signUp: async (email: string, password: string, name: string): Promise<{ data: any; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Sign in an existing user
  signIn: async (email: string, password: string): Promise<{ data: any; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  },

  // Sign out the current user
  signOut: async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Get the current session
  getSession: async (): Promise<{ data: { session: any | null } }> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        return { data: { session: null } };
      }

      return { data: { session } };
    } catch (error) {
      console.error('Error getting session:', error);
      return { data: { session: null } };
    }
  },

  // Get the current user
  getUser: async (): Promise<{ data: { user: User | null } }> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return { data: { user: null } };
      }

      // Transform Supabase user to our User type
      const transformedUser: User = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url || null,
        preferences: {
          theme: 'light',
          notifications: true,
          autoSync: true,
        }
      };

      return { data: { user: transformedUser } };
    } catch (error) {
      console.error('Error getting user:', error);
      return { data: { user: null } };
    }
  },

  // Listen for auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return { data: { subscription } };
  }
};