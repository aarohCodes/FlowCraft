import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          user_role: 'professional' | 'student'
          is_premium: boolean
          premium_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          user_role?: 'professional' | 'student'
          is_premium?: boolean
          premium_expires_at?: string | null
        }
        Update: {
          name?: string
          avatar_url?: string | null
          user_role?: 'professional' | 'student'
          is_premium?: boolean
          premium_expires_at?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          completed: boolean
          priority: 'low' | 'medium' | 'high'
          category: string
          start_date: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          category?: string
          start_date?: string | null
          due_date?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          category?: string
          start_date?: string | null
          due_date?: string | null
        }
      }
      flashcards: {
        Row: {
          id: string
          user_id: string
          question: string
          answer: string
          category: string
          difficulty: 'easy' | 'medium' | 'hard'
          correct_count: number
          total_attempts: number
          last_reviewed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          question: string
          answer: string
          category?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          correct_count?: number
          total_attempts?: number
          last_reviewed?: string | null
        }
        Update: {
          question?: string
          answer?: string
          category?: string
          difficulty?: 'easy' | 'medium' | 'hard'
          correct_count?: number
          total_attempts?: number
          last_reviewed?: string | null
        }
      }
    }
  }
}