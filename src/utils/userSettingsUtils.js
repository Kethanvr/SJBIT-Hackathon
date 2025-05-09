// Utility functions for user settings logic

export function toggleNotification(settings, type) {
  return {
    ...settings,
    notification_preferences: {
      ...settings.notification_preferences,
      [type]: !settings.notification_preferences[type]
    }
  };
}

export function updateAccessibility(settings, key, value) {
  return {
    ...settings,
    accessibility_settings: {
      ...settings.accessibility_settings,
      [key]: value
    }
  };
}
