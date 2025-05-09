// Utility functions for notification settings
export const notificationItems = [
  {
    key: "scanResults",
    title: "Scan Results",
    description: "Get notified when your scan is complete",
    icon: "🔍"
  },
  {
    key: "updates",
    title: "App Updates",
    description: "Learn about new features and improvements",
    icon: "⚡"
  },
  {
    key: "marketing",
    title: "Marketing & Promotions",
    description: "Receive offers and updates from us",
    icon: "🎯"
  }
];

export async function getOneSignalTags(user) {
  if (window.OneSignal && user) {
    try {
      const permission = await window.OneSignal.Notifications.permission;
      if (permission) {        const tags = await window.OneSignal.User.getTags();
        // Default preferences if no tags set
        return {
          scanResults: tags?.scanResults === 'true' || false,
          updates: tags?.updates === 'true' || false,
          marketing: tags?.marketing === 'true' || false,
        };
      }
    } catch (error) {
      console.error("Error getting OneSignal tags:", error);
    }
  }
  return null;
}

export async function requestNotificationPermission() {
  if (!window.OneSignal) return false;
  
  try {
    const permission = await window.OneSignal.Notifications.permission;
    if (!permission) {
      await window.OneSignal.Notifications.requestPermission();
      return true;
    }
    return permission;
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

export async function setOneSignalTag(key, value) {
  if (window.OneSignal) {
    try {
      const permission = await window.OneSignal.Notifications.permission;
      if (!permission) {
        await window.OneSignal.Notifications.requestPermission();
      }
      await window.OneSignal.User.addTag(key, value.toString());
    } catch (error) {
      console.error("Error setting OneSignal tag:", error);
    }
  }
}
