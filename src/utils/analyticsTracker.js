import { supabase } from '../lib/supabase';

/**
 * Utility for tracking user analytics events
 */
const AnalyticsTrackerObj = {
  /**
   * Track a user interaction event
   * 
   * @param {string} eventType - Type of event (e.g., 'tutorial_view', 'tooltip_click')
   * @param {Object} eventData - Additional data about the event
   * @returns {Promise} Result of the tracking operation
   */
  trackEvent: async (eventType, eventData = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_analytics')
        .insert([{
          user_id: user.id,
          event_type: eventType,
          event_data: { ...eventData, timestamp: new Date().toISOString() }
        }]);
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error tracking ${eventType}:`, error);
      return null;
    }
  },
  
  /**
   * Track tutorial related events
   */
  trackTutorialView: async () => {
    return AnalyticsTracker.trackEvent('tutorial_view', { 
      source: 'how_to_use_page' 
    });
  },
  
  trackTutorialComplete: async () => {
    return AnalyticsTracker.trackEvent('tutorial_complete', { 
      completed_at: new Date().toISOString() 
    });
  },
  
  trackTutorialSkipped: async () => {
    return AnalyticsTracker.trackEvent('tutorial_skipped', { 
      skipped_at: new Date().toISOString() 
    });
  },
  
  /**
   * Track tooltip related events
   */
  trackTooltipView: async (tooltipId) => {
    return AnalyticsTracker.trackEvent('tooltip_view', { tooltipId });
  },
  
  trackTooltipClick: async (tooltipId, action) => {
    return AnalyticsTracker.trackEvent('tooltip_interaction', { 
      tooltipId, 
      action 
    });
  },
  
  /**
   * Get user's onboarding summary
   * 
   * @returns {Promise<Array>} Summary of user's onboarding analytics
   */
  getOnboardingSummary: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .rpc('get_user_onboarding_summary', { user_uuid: user.id });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting onboarding summary:', error);      return [];    }
  }
};

// Export both as named export and default export
export const AnalyticsTracker = AnalyticsTrackerObj;
export default AnalyticsTrackerObj;
