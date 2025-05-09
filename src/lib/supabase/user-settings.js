








import { supabase } from './client';

export const getUserSettings = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Settings not found, should have been created automatically with the profile
        // But let's create it just in case
        return await createDefaultUserSettings(userId);
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getUserSettings:", error.message);
    throw error;
  }
};

const createDefaultUserSettings = async (userId) => {
  try {
    const defaultSettings = {
      user_id: userId,
      notification_preferences: {
        email: true,
        push: true
      },
      accessibility_settings: {}
    };

    const { data, error } = await supabase
      .from("user_settings")
      .insert([defaultSettings])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in createDefaultUserSettings:", error.message);
    throw error;
  }
};

export const updateUserSettings = async (userId, updates) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!updates) throw new Error("Updates object is required");

    // Only allow updating notification_preferences and accessibility_settings
    const validUpdates = {
      notification_preferences: updates.notification_preferences,
      accessibility_settings: updates.accessibility_settings
    };

    // Remove undefined fields
    Object.keys(validUpdates).forEach(key => {
      if (validUpdates[key] === undefined) {
        delete validUpdates[key];
      }
    });

    const { data, error } = await supabase
      .from("user_settings")
      .update(validUpdates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in updateUserSettings:", error.message);
    throw error;
  }
};
