import { supabase } from "../lib/supabase";
import { uploadToCloudinary } from "../utils/cloudinaryUtils";
import { saveHealthRecord, deleteHealthRecord } from "../lib/supabase/health-records";

const healthRecordService = {
  /**
   * Upload a health record image to Cloudinary and save the health record data to the database
   * @param {string} userId - User ID
   * @param {string} base64Image - Base64 encoded image
   * @param {string} recordType - Type of health record (e.g., 'lab_result', 'prescription', 'medical_report')
   * @param {string} recordName - Name of the health record
   * @param {object} additionalData - Additional data about the health record
   * @returns {Promise<object>} Saved health record data
   */
  async uploadHealthRecord(userId, base64Image, recordType, recordName, additionalData = {}) {
    if (!userId) throw new Error("User ID is required");
    if (!base64Image) throw new Error("Image is required");
    if (!recordType) throw new Error("Record type is required");
    if (!recordName) throw new Error("Record name is required");

    try {
      // Upload image to Cloudinary
      const imageUrl = await this.uploadImageToCloudinary(base64Image, recordName);

      // Prepare record data
      const recordData = {
        name: recordName,
        description: additionalData.description || '',
        date: additionalData.date || new Date().toISOString().split('T')[0],
        notes: additionalData.notes || '',
        image_url: imageUrl
      };

      // Save to database
      const savedRecord = await saveHealthRecord(userId, recordType, recordData);
      
      return savedRecord;
    } catch (error) {
      console.error("Error uploading health record:", error);
      throw error;
    }
  },

  /**
   * Upload an image to Cloudinary
   * @param {string} base64Image - Base64 encoded image
   * @param {string} recordName - Name of the health record for folder organization
   * @returns {Promise<string>} URL of the uploaded image
   */
  async uploadImageToCloudinary(base64Image, recordName) {
    try {
      // Format recordName for folder path (replace spaces with underscores, lowercase)
      const folderPath = `health_records/${recordName.toLowerCase().replace(/\s+/g, '_')}`;
      
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(base64Image, folderPath);
      
      return imageUrl;    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  },

  /**
   * Save a health record directly with a Cloudinary URL (no upload)
   * @param {string} userId - User ID
   * @param {string} recordType - Type of health record
   * @param {object} recordData - All record data (should include image_url)
   * @returns {Promise<object>} Saved health record data
   */
  async saveRecordWithUrl(userId, recordType, recordData, imageUrl) {
    if (!userId) throw new Error("User ID is required");
    if (!recordType) throw new Error("Record type is required");
    if (!recordData) throw new Error("Record data is required");
    try {
      // Save to both record_data and image_url column
      const { data, error } = await supabase
        .from("health_records")
        .insert([
          {
            user_id: userId,
            record_type: recordType,
            record_data: recordData,
            image_url: imageUrl || recordData.image_url || null,
          },
        ])
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {      console.error("Error saving health record with URL:", error);
      throw error;
    }
  },

  /**
   * Delete a health record
   * @param {string} recordId - ID of the record to delete
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success indicator
   */
  async deleteRecord(recordId, userId) {
    if (!recordId) throw new Error("Record ID is required");
    if (!userId) throw new Error("User ID is required");
    
    try {
      await deleteHealthRecord(recordId, userId);
      return true;
    } catch (error) {
      console.error("Error deleting health record:", error);
      throw error;
    }
  }
};

export { healthRecordService };
export default healthRecordService;
