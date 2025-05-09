import { supabase } from './client';

export const getProfile = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No authenticated user found");        // The profile should be created automatically via database trigger,
        // but we'll handle the case where it doesn't exist
        const newProfileData = {
          id: userId,
          username: user.email,
          email: user.email,
          full_name: user.user_metadata?.full_name || "",
          avatar_url: user.user_metadata?.avatar_url || "",
          language: "en",
          theme: "light",
          first_login: true, // Set first_login to true for new users
          updated_at: new Date().toISOString(),
        };

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert([newProfileData])
          .select()
          .single();

        if (insertError) throw insertError;
        return newProfile;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    throw error;
  }
};

export const updateProfile = async (userId, updates) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    throw error;
  }
};