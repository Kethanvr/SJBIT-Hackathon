import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Custom hook for auth state management and authentication methods
 * 
 * Provides:
 * - Current auth state (user, session, loading, error)
 * - Authentication methods (signIn, signUp, signOut, etc.)
 * - Password reset functionality
 * - OAuth providers support
 * 
 * Usage:
 * const { user, session, loading, error, signIn, signUp, signOut } = useAuth();
 * 
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Initialize the auth state by getting the current session
   */
  useEffect(() => {
    // Get initial session on component mount
    const getInitialSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        // Set auth state
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Store user ID in localStorage for quicker access in components that need only the ID
        if (currentSession?.user) {
          localStorage.setItem(STORAGE_KEYS.USER_ID, currentSession.user.id);
        } else {
          localStorage.removeItem(STORAGE_KEYS.USER_ID);
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Error getting initial session:", e);
        setError(e);
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Update localStorage
      if (session?.user) {
        localStorage.setItem(STORAGE_KEYS.USER_ID, session.user.id);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_ID);
      }
      
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign in with email and password
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} Auth data or error
   */  const signIn = useCallback(async (email, password) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
        // Check if this is the user's first login
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_login')
          .eq('id', data.user.id)
          .single();
        
        // If first_login is true or null, this is their first login
        if (profile && (profile.first_login === true || profile.first_login === null)) {
          localStorage.setItem(STORAGE_KEYS.FIRST_LOGIN, 'true');
          
          // Track this as the first login in analytics
          try {
            await supabase
              .from('user_analytics')
              .insert([{
                user_id: data.user.id,
                event_type: 'first_login',
                event_data: { login_time: new Date().toISOString() }
              }]);
          } catch (analyticsError) {
            console.error('Failed to record first login analytics:', analyticsError);
          }
        } else {
          localStorage.removeItem(STORAGE_KEYS.FIRST_LOGIN);
        }
      }
      
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);
  
  /**
   * Sign up with email and password
   * 
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise} Auth data or error
   */
  const signUp = useCallback(async (email, password) => {
    setError(null);
    try {
      // Register user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // The profile creation is handled by the database trigger
      // No need to manually create a profile here
      
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);
  
  /**
   * Sign out the current user
   * 
   * @returns {Promise} Result of sign out operation
   */
  const signOut = useCallback(async () => {
    try {
      // Clear any app-specific storage
      Object.values(STORAGE_KEYS).forEach(key => {
        // Skip permanent settings like language preference
        if (key !== STORAGE_KEYS.LANGUAGE && key !== STORAGE_KEYS.THEME) {
          localStorage.removeItem(key);
        }
      });
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);
  
  /**
   * Request a password reset email
   * 
   * @param {string} email - User's email
   * @returns {Promise} Result of password reset request
   */
  const resetPassword = useCallback(async (email) => {
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);
  
  /**
   * Update user's password
   * 
   * @param {string} password - New password
   * @returns {Promise} Result of password update
   */
  const updatePassword = useCallback(async (password) => {
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);
  
  /**
   * Sign in with a third-party provider
   * 
   * @param {string} provider - Provider name (e.g., 'google', 'facebook')
   * @returns {Promise} Auth redirect
   */
  const signInWithProvider = useCallback(async (provider) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) throw error;
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  }, []);
  
  /**
   * Get the current session
   * 
   * @returns {Promise} Current session
   */
  const getSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (e) {
      setError(e.message);
      return null;
    }
  }, []);

  return {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    signInWithProvider,
    getSession
  };
};