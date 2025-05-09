import { supabase } from './client';

export const saveScan = async (userId, scanData) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!scanData) throw new Error("Scan data is required");

    const scanEntry = {
      user_id: userId,
      medicine_name: scanData.product_identification?.medicine_name || null,
      ingredients: scanData.ingredients_and_allergens?.active_ingredients || null,
      uses: scanData.usage_information?.dosage || null,
      warnings: scanData.safety_and_storage?.warnings || null,
      scan_data: scanData
    };

    const { data, error } = await supabase
      .from("scans")
      .insert([scanEntry])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in saveScan:", error.message);
    throw error;
  }
};

export const getScanHistory = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getScanHistory:", error.message);
    throw error;
  }
};

export const getScanById = async (scanId, userId) => {
  try {
    if (!scanId) throw new Error("Scan ID is required");
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("scans")
      .select("*")
      .eq("id", scanId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getScanById:", error.message);
    throw error;
  }
};

export const deleteScan = async (scanId, userId) => {
  try {
    if (!scanId) throw new Error("Scan ID is required");
    if (!userId) throw new Error("User ID is required");

    const { error } = await supabase
      .from("scans")
      .delete()
      .eq("id", scanId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteScan:", error.message);
    throw error;
  }
};

export const linkScanToChat = async (userId, scanId, chatId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!scanId) throw new Error("Scan ID is required");
    if (!chatId) throw new Error("Chat ID is required");

    // Verify the user owns this scan
    const { data: scanData, error: scanError } = await supabase
      .from("scans")
      .select("id")
      .eq("id", scanId)
      .eq("user_id", userId)
      .single();

    if (scanError || !scanData) throw new Error("Scan not found or access denied");

    // Create the link
    const { error } = await supabase
      .from("scan_chat_links")
      .insert([{
        scan_id: scanId,
        chat_id: chatId
      }]);

    if (error) {
      // If it's a unique constraint violation, the link already exists
      if (error.code === '23505') {
        return { exists: true };
      }
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error in linkScanToChat:", error.message);
    throw error;
  }
};

export const getLinkedChatsForScan = async (userId, scanId) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!scanId) throw new Error("Scan ID is required");

    // Join scan_chat_links with chats to get chat information
    const { data, error } = await supabase
      .from("scan_chat_links")
      .select(`
        chat_id,
        chats:chat_id (
          id,
          title,
          created_at,
          updated_at
        )
      `)
      .eq("scan_id", scanId);

    if (error) throw error;

    // Return the chats data in a more usable format
    return data.map(item => item.chats);
  } catch (error) {
    console.error("Error in getLinkedChatsForScan:", error.message);
    throw error;
  }
};