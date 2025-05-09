import { useState, useEffect } from "react";
import { getOneSignalTags, setOneSignalTag } from "../utils/notificationUtils";

export function useNotificationSettings(user) {
  const [notifications, setNotifications] = useState({
    scanResults: true,
    updates: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    async function setup() {
      if (user) {
        const tags = await getOneSignalTags(user);
        if (tags) setNotifications(tags);
        if (window.OneSignal) {
          await window.OneSignal.User.addExternalUserId(user.id);
        }
      }
    }
    setup();
  }, [user]);

  const handleToggle = (key) => {
    setNotifications((prev) => {
      const newState = { ...prev, [key]: !prev[key] };
      setOneSignalTag(key, newState[key]);
      return newState;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return { notifications, handleToggle, saved };
}
