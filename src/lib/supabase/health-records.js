import { supabase } from './client';

export const saveHealthRecord = async (userId, recordType, recordData) => {
  try {
    if (!userId) throw new Error("User ID is required");
    if (!recordType) throw new Error("Record type is required");
    if (!recordData) throw new Error("Record data is required");

    const healthRecord = {
      user_id: userId,
      record_type: recordType,
      record_data: recordData
    };

    const { data, error } = await supabase
      .from("health_records")
      .insert([healthRecord])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in saveHealthRecord:", error.message);
    throw error;
  }
};

export const getHealthRecords = async (userId, recordType = null) => {
  try {
    if (!userId) throw new Error("User ID is required");

    let query = supabase
      .from("health_records")
      .select("*")
      .eq("user_id", userId);
    
    if (recordType) {
      query = query.eq("record_type", recordType);
    }
    
    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getHealthRecords:", error.message);
    throw error;
  }
};

export const getHealthRecordById = async (recordId, userId) => {
  try {
    if (!recordId) throw new Error("Record ID is required");
    if (!userId) throw new Error("User ID is required");

    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .eq("id", recordId)
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in getHealthRecordById:", error.message);
    throw error;
  }
};

export const updateHealthRecord = async (recordId, userId, updates) => {
  try {
    if (!recordId) throw new Error("Record ID is required");
    if (!userId) throw new Error("User ID is required");
    if (!updates || typeof updates !== 'object') throw new Error("Updates object is required");

    const { data, error } = await supabase
      .from("health_records")
      .update({
        record_data: updates.record_data,
        record_type: updates.record_type
      })
      .eq("id", recordId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error in updateHealthRecord:", error.message);
    throw error;
  }
};

export const deleteHealthRecord = async (recordId, userId) => {
  try {
    if (!recordId) throw new Error("Record ID is required");
    if (!userId) throw new Error("User ID is required");

    const { error } = await supabase
      .from("health_records")
      .delete()
      .eq("id", recordId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error in deleteHealthRecord:", error.message);
    throw error;
  }
};
