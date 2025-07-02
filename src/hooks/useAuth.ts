import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import { auth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { User } from '../types'

export interface UserProfile {
  id: string
  name: string
  avatar_url: string | null
  user_role: 'professional' | 'student'
  is_premium: boolean
  premium_expires_at: string | null
  created_at: string
  updated_at: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const { dispatch } = useApp()

  useEffect(() => {
    // Get initial session
    auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      setSession(session)
      
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (supabaseUser: any) => {
    try {
      // Transform Supabase user to our User type
      const transformedUser: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        avatar: supabaseUser.user_metadata?.avatar_url || null,
        preferences: {
          theme: 'light',
          notifications: true,
          autoSync: true,
        }
      }
      
      setUser(transformedUser)

      // Try to get user profile from database
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error loading user profile:', error)
      }

      let userProfile: UserProfile
      if (profile) {
        userProfile = profile
      } else {
        // Create default profile if none exists
        userProfile = {
          id: supabaseUser.id,
          name: transformedUser.name,
          avatar_url: transformedUser.avatar || null,
          user_role: 'professional',
          is_premium: false,
          premium_expires_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        // Insert the profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([userProfile])

        if (insertError) {
          console.error('Error creating user profile:', insertError)
        }
      }
      
      // Update app context with user data
      dispatch({
        type: 'SET_USER',
        payload: {
          id: transformedUser.id,
          name: transformedUser.name,
          email: transformedUser.email,
          avatar: transformedUser.avatar,
          preferences: transformedUser.preferences
        }
      })
      
      dispatch({ type: 'SET_USER_ROLE', payload: userProfile.user_role })
      
      if (userProfile.is_premium) {
        dispatch({ type: 'ACTIVATE_PREMIUM_TRIAL' })
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    return auth.signUp(email, password, name)
  }

  const signIn = async (email: string, password: string) => {
    return auth.signIn(email, password)
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn
  }
}

export const signOut = async () => {
  return auth.signOut()
}