/**
 * Utility functions for handling Cloudinary uploads
 */

/**
 * Upload an image to Cloudinary
 * @param {string|File} imageData - The image data as a base64 string or File object
 * @param {string} folder - The folder name for storing the image
 * @returns {Promise<object>} The response data from Cloudinary including secure_url
 */
export const uploadToCloudinary = async (imageData, folder = 'mediscan') => {
  if (!imageData) throw new Error("Image data is required");

  // Get cloudName and uploadPreset from environment variables if available
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "drp9pr8up";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "mediscan_uploads";

  try {
    // Create form data for the upload
    const formData = new FormData();
    
    // Handle different types of image data (File object or base64 string)
    if (imageData instanceof File) {
      // If it's a File object, just append it directly
      formData.append('file', imageData);
    } else if (typeof imageData === 'string') {
      // If it's a string, ensure it has the data URL prefix
      let uploadData = imageData;
      if (imageData.indexOf('data:') !== 0) {
        uploadData = `data:image/jpeg;base64,${imageData}`;
      }
      formData.append('file', uploadData);
    } else {
      throw new Error('Invalid image data format');
    }
    
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', folder);
    
    // Add a timestamp for cache-busting
    formData.append('timestamp', Date.now().toString());

    console.log(`Uploading image to Cloudinary (folder: ${folder})`);
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cloudinary error response:', errorData);
      throw new Error(`Cloudinary upload failed: HTTP ${response.status}`);
    }

    const data = await response.json();    console.log('Cloudinary upload successful:', data);
    
    if (!data.secure_url) {
      throw new Error('Cloudinary response missing secure_url');
    }
    
    // Return the full data object
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error; // Re-throw so the caller can handle it
  }
};

/**
 * Generate a unique folder name for uploads based on the user ID
 * @param {string} userId - The user ID
 * @returns {string} A unique folder name
 */
export const generateUploadFolder = (userId) => {
  if (!userId) return 'anonymous';
  return `user_${userId.substring(0, 8)}`;
};