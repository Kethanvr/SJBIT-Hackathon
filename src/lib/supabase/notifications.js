import { supabase } from './client';

export const getNotifications = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, message, type, is_read, created_at, related_url")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getNotifications:", error.message);
    throw error;
  }
};

export const getUnreadNotificationsCount = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { data, error, count } = await supabase
      .from("notifications")
      .select("*", { count: 'exact' })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error in getUnreadNotificationsCount:", error.message);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    if (!notificationId) throw new Error("Notification ID is required");
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error.message);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in markAllNotificationsAsRead:", error.message);
    throw error;
  }
};

export const deleteNotification = async (notificationId, userId) => {
  try {
    if (!notificationId) throw new Error("Notification ID is required");
    if (!userId) throw new Error("User ID is required");

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteNotification:", error.message);
    throw error;
  }
};

export const createNotification = async (userId, title, message, type = 'info', relatedUrl = null) => {
  try {
    if (!userId || !title || !message) {
      throw new Error("User ID, title, and message are required for notification");
    }
    const { data, error } = await supabase
      .from("notifications")
      .insert([{
        user_id: userId,
        title: title,
        message: message,
        type: type,
        related_url: relatedUrl,
        is_read: false
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in createNotification:", error.message);
    return null;
  }
};
