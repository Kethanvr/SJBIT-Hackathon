import { useState, useEffect } from 'react';
import profileService from '../services/profileService';
import authService from '../services/authService';

/**
 * Hook for managing user profile data and operations
 */
export const useProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch profile data when userId changes
  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to get current user if userId not provided
      const currentUser = userId ? { id: userId } : await authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User not found');
      }

      const profileData = await profileService.getProfile(currentUser.id);
      if (!profileData) {
        throw new Error('Failed to fetch or create profile');
      }
      
      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfileData = async (updates) => {
    try {
      if (!profile) {
        throw new Error('Profile not loaded');
      }
      
      const updatedProfile = await profileService.updateProfile(profile.id, updates);
      setProfile(updatedProfile);
      return { success: true, profile: updatedProfile };
    } catch (err) {
      console.error('Error updating profile:', err);
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  };

  // Handle adding coins to profile
  const addCoins = async (amount) => {
    try {
      if (!profile) {
        throw new Error('Profile not loaded');
      }
      
      const updatedProfile = await profileService.addCoins(profile.id, amount);
      setProfile(updatedProfile);
      return { success: true, profile: updatedProfile };
    } catch (err) {
      console.error('Error adding coins:', err);
      return { success: false, error: err.message || 'Failed to add coins' };
    }
  };

  // Handle subtracting coins from profile
  const subtractCoins = async (amount) => {
    try {
      if (!profile) {
        throw new Error('Profile not loaded');
      }
      
      const updatedProfile = await profileService.subtractCoins(profile.id, amount);
      setProfile(updatedProfile);
      return { success: true, profile: updatedProfile };
    } catch (err) {
      console.error('Error subtracting coins:', err);
      return { success: false, error: err.message || 'Failed to subtract coins' };
    }
  };

  // Check if user has enough coins
  const hasEnoughCoins = async (amount) => {
    try {
      if (!profile) {
        throw new Error('Profile not loaded');
      }
      
      return await profileService.hasEnoughCoins(profile.id, amount);
    } catch (err) {
      console.error('Error checking coins:', err);
      return false;
    }
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    try {
      setUploading(true);
      if (!profile) {
        throw new Error('Profile not loaded');
      }
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicURLData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile with new avatar URL  
      const updatedProfile = await profileService.updateProfile(profile.id, {
        avatar_url: publicURLData.publicUrl
      });
      
      setProfile(updatedProfile);
      return { success: true, profile: updatedProfile };
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return { success: false, error: err.message || 'Failed to upload avatar' };
    } finally {
      setUploading(false);
    }
  };

  // Fetch profile on mount and when userId changes
  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    loading,
    error,
    uploading,
    fetchProfile,
    updateProfile: updateProfileData,
    addCoins,
    subtractCoins,
    hasEnoughCoins,
    uploadAvatar
  };
};

export default useProfile;
