import { supabase } from '../lib/supabase';
import { handleError, ErrorTypes, AppError } from '../utils/errorHandler';

/**
 * Maximum number of retries for concurrent operations
 */
const MAX_RETRIES = 3;

/**
 * Delay between retries (in milliseconds)
 */
const RETRY_DELAY = 200;

/**
 * Service for handling profile operations
 */
const profileService = {
  /**
   * Get user profile data
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - User profile data
   */  getProfile: async (userId) => {
    if (!userId) {
      throw new AppError('User ID is required', ErrorTypes.VALIDATION);
    }
    
    try {      // First try to get the existing profile and user settings
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, email, updated_at, created_at, language, theme, role, recovery_email, phone, dob, gender')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to avoid error when no profile exists

      if (profileError) throw profileError;
      
      // Get user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('notification_preferences, accessibility_settings')
        .eq('user_id', userId)
        .maybeSingle();

      if (settingsError) throw settingsError;
        // Combine profile and settings data
      const data = {
        ...profileData,
        notification_preferences: settingsData?.notification_preferences || { email: true, push: false },
        accessibility_settings: settingsData?.accessibility_settings || { theme: 'light', language: 'en' }
      }
        
      if (!profileData) {
        // Profile doesn't exist, get user data and create new profile
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
          // Create new profile with default values
        const newProfileData = {
          id: userId,
          username: user?.email?.split('@')[0] || '',
          email: user?.email,
          full_name: user?.user_metadata?.full_name || '',
          avatar_url: user?.user_metadata?.avatar_url || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          language: 'en',
          theme: 'light'
        };

        // Create default user settings
        const newSettingsData = {
          user_id: userId,
          notification_preferences: { email: true, push: false },
          accessibility_settings: { theme: 'light', language: 'en' }
        };
          // Use upsert to handle race conditions for profile
        const { data: newProfile, error: insertProfileError } = await supabase
          .from('profiles')
          .upsert([newProfileData])
          .select()
          .single();
          
        if (insertProfileError) throw insertProfileError;

        // Insert user settings
        const { error: insertSettingsError } = await supabase
          .from('user_settings')
          .upsert([newSettingsData])
          .select()
          .single();
          
        if (insertSettingsError) throw insertSettingsError;

        // Return combined data
        return {
          ...newProfile,
          notification_preferences: newSettingsData.notification_preferences,
          accessibility_settings: newSettingsData.accessibility_settings
        };
      }
      
      return data;
    } catch (error) {
      throw handleError(error, {
        defaultMessage: 'Failed to retrieve user profile'
      }).error ? error : new AppError(
        'Failed to retrieve user profile', 
        ErrorTypes.DATABASE, 
        error
      );
    }
  },

  /**
   * Create a new user profile
   * @param {string} userId - The user ID
   * @param {Object} profileData - Initial profile data
   * @returns {Promise<Object>} - Created profile data
   */  createProfile: async (userId, profileData = {}) => {
    if (!userId) {
      throw new AppError('User ID is required', ErrorTypes.VALIDATION);
    }
    
    try {
      // Set default values with specific fields
      const newProfile = {
        id: userId,
        username: profileData.username || '',
        email: profileData.email || '',
        full_name: profileData.full_name || '',
        avatar_url: profileData.avatar_url || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        language: 'en',
        theme: 'light',
        ...profileData
      };
        // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();
        
      if (profileError) throw profileError;

      // Create default user settings
      const settingsData = {
        user_id: userId,
        notification_preferences: { email: true, push: false },
        accessibility_settings: { theme: 'light', language: 'en' }
      };

      // Insert user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert([settingsData])
        .select()
        .single();

      if (settingsError) throw settingsError;
      
      // Return combined data
      return {
        ...profileData,
        notification_preferences: settingsData.notification_preferences,
        accessibility_settings: settingsData.accessibility_settings
      };
    } catch (error) {
      throw handleError(error, {
        defaultMessage: 'Failed to create user profile'
      }).error ? error : new AppError(
        'Failed to create user profile', 
        ErrorTypes.DATABASE, 
        error
      );
    }
  },

  /**
   * Update user profile with optimistic concurrency control
   * @param {string} userId - The user ID 
   * @param {Object} updates - The profile updates
   * @returns {Promise<Object>} - Updated profile data
   */
  updateProfile: async (userId, updates) => {
    if (!userId) {
      throw new AppError('User ID is required', ErrorTypes.VALIDATION);
    }
    if (!updates || typeof updates !== 'object') {
      throw new AppError('Updates object is required', ErrorTypes.VALIDATION);
    }
    
    try {
      // Ensure updated_at is set
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };
        // First get current profile to check it exists
      const currentProfile = await profileService.getProfile(userId);

      // Separate updates for profile and settings
      const profileUpdates = {
        username: updates.username,
        full_name: updates.full_name,
        avatar_url: updates.avatar_url,
        email: updates.email,
        language: updates.language,
        theme: updates.theme,
        role: updates.role,
        recovery_email: updates.recovery_email,
        phone: updates.phone,
        dob: updates.dob,
        gender: updates.gender,
        updated_at: new Date().toISOString()
      };

      const settingsUpdates = {
        notification_preferences: updates.notification_preferences,
        accessibility_settings: updates.accessibility_settings,
        updated_at: new Date().toISOString()
      };

      // Remove undefined fields
      Object.keys(profileUpdates).forEach(key => 
        profileUpdates[key] === undefined && delete profileUpdates[key]
      );
      Object.keys(settingsUpdates).forEach(key => 
        settingsUpdates[key] === undefined && delete settingsUpdates[key]
      );

      // Update profile if there are profile-specific updates
      let profileData = currentProfile;
      if (Object.keys(profileUpdates).length > 0) {
        const { data, error: profileError } = await supabase
          .from('profiles')
          .update(profileUpdates)
          .eq('id', userId)
          .select()
          .single();
          
        if (profileError) throw profileError;
        profileData = data;
      }

      // Update settings if there are settings-specific updates
      if (Object.keys(settingsUpdates).length > 0) {
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert([{ user_id: userId, ...settingsUpdates }])
          .select()
          .single();
          
        if (settingsError) throw settingsError;
      }      // Return combined data
      return {
        ...profileData,
        notification_preferences: settingsUpdates.notification_preferences || currentProfile.notification_preferences,
        accessibility_settings: settingsUpdates.accessibility_settings || currentProfile.accessibility_settings
      };
    } catch (error) {
      throw handleError(error, {
        defaultMessage: 'Failed to update user profile'
      }).error ? error : new AppError(
        'Failed to update user profile', 
        ErrorTypes.DATABASE, 
        error
      );
    }
  },  // Coin-related functions and referral code functionality removed as they're not part of the current schema
};

export default profileService;
