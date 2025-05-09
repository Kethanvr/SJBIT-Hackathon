import { supabase } from '../lib/supabase';
import profileService from './profileService';

/**
 * Service for handling authentication-related operations
 */
const authService = {
  /**
   * Get the current authenticated user
   * @returns {Promise<Object>} User object if authenticated, null otherwise
   */
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Sign up a new user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {Object} metadata - Optional metadata for the user
   * @returns {Promise<Object>} Result object with user data or error
   */
  signUp: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;

      // Initialize user profile if signup is successful
      if (data?.user) {
        await profileService.createProfile(data.user.id, {
          email: data.user.email,
          ...metadata
        });
      }

      return {
        success: true,
        user: data?.user || null,
        session: data?.session || null
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        success: false,
        error: error.message || 'Failed to sign up'
      };
    }
  },

  /**
   * Sign in with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Result object with user data or error
   */
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return {
        success: true,
        user: data?.user || null,
        session: data?.session || null
      };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        success: false,
        error: error.message || 'Failed to sign in'
      };
    }
  },

  /**
   * Sign in with a third-party provider
   * @param {string} provider - Provider name ('google', 'facebook', etc.)
   * @returns {Promise<void>}
   */
  signInWithProvider: async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      throw error;
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise<Object>} Result object indicating success or failure
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return {
        success: false,
        error: error.message || 'Failed to sign out'
      };
    }
  },

  /**
   * Send password reset email
   * @param {string} email - User's email
   * @returns {Promise<Object>} Result object indicating success or failure
   */
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      
      return { 
        success: true,
        message: 'Password reset email sent' 
      };
    } catch (error) {
      console.error('Error sending reset password email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send reset email'
      };
    }
  },

  /**
   * Update user's password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Result object indicating success or failure
   */
  updatePassword: async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      return { 
        success: true,
        message: 'Password updated successfully' 
      };
    } catch (error) {
      console.error('Error updating password:', error);
      return {
        success: false,
        error: error.message || 'Failed to update password'
      };
    }
  },

  /**
   * Update user's email
   * @param {string} newEmail - New email address
   * @returns {Promise<Object>} Result object indicating success or failure
   */
  updateEmail: async (newEmail) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;
      
      return { 
        success: true,
        message: 'Email update confirmation sent to new address' 
      };
    } catch (error) {
      console.error('Error updating email:', error);
      return {
        success: false,
        error: error.message || 'Failed to update email'
      };
    }
  },

  /**
   * Get auth session
   * @returns {Promise<Object>} Current session or null
   */
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  /**
   * Set up auth state change listener
   * @param {Function} callback - Function to call when auth state changes
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange: (callback) => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session ? session.user : null;
      callback(user, session, event);
    });
    
    return data.subscription.unsubscribe;
  }
};

export default authService;
