import { create } from 'zustand';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface UserState {
  // Auth state
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  
  // User profile (extended data)
  profile: {
    id: string;
    email: string;
    display_name: string | null;
    avatar_url: string | null;
    plan: 'free' | 'pro' | 'enterprise';
    storage_used: number;
    storage_limit: number;
    created_at: string;
  } | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserState['profile']) => void;
  setError: (error: AuthError | null) => void;
  
  // Auth methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  
  // Profile methods
  updateProfile: (updates: Partial<UserState['profile']>) => Promise<void>;
  fetchProfile: () => Promise<void>;
  
  // Initialize auth state from session
  initialize: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  // Initial state
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  profile: null,
  
  // Setters
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setError: (error) => set({ error }),
  
  // Sign in with email/password
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({
        user: data.user,
        session: data.session,
        isAuthenticated: true,
        isLoading: false,
      });
      
      await get().fetchProfile();
    } catch (error) {
      set({ error: error as AuthError, isLoading: false });
      throw error;
    }
  },
  
  // Sign up with email/password
  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      set({
        user: data.user,
        session: data.session,
        isAuthenticated: !!data.user,
        isLoading: false,
      });
      
      // Create user profile
      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          email: data.user.email,
          plan: 'free',
          storage_used: 0,
          storage_limit: 100 * 1024 * 1024, // 100MB for free plan
        });
        
        await get().fetchProfile();
      }
    } catch (error) {
      set({ error: error as AuthError, isLoading: false });
      throw error;
    }
  },
  
  // Sign out
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        profile: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error as AuthError, isLoading: false });
      throw error;
    }
  },
  
  // Sign in with Google
  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });
      
      if (error) throw error;
      
      // OAuth flow will redirect, so we don't need to set state here
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as AuthError, isLoading: false });
      throw error;
    }
  },
  
  // Reset password
  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as AuthError, isLoading: false });
      throw error;
    }
  },
  
  // Update password
  updatePassword: async (newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      set({ isLoading: false });
    } catch (error) {
      set({ error: error as AuthError, isLoading: false });
      throw error;
    }
  },
  
  // Fetch user profile
  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  },
  
  // Update user profile
  updateProfile: async (updates) => {
    const { user, profile } = get();
    if (!user || !profile) return;
    
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
      
      set({
        profile: { ...profile, ...updates },
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  
  // Initialize from existing session
  initialize: async () => {
    set({ isLoading: true });
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session) {
        set({
          user: session.user,
          session,
          isAuthenticated: true,
        });
        await get().fetchProfile();
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({
          user: session?.user ?? null,
          session,
          isAuthenticated: !!session?.user,
        });
        
        if (session?.user) {
          await get().fetchProfile();
        } else {
          set({ profile: null });
        }
      });
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },
}));
