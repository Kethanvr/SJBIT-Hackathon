// src/utils/profileUtils.js
import { uploadToCloudinary } from "./cloudinaryUtils";

export async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function handleProfileImageUpload({
  event,
  profileId,
  setUploading,
  setProfile,
  profile,
}) {
  try {
    setUploading(true);
    const file = event.target.files[0];
    if (!file) return;
    const base64Image = await fileToBase64(file);
    const folderPath = `profiles/${profileId}`;
    const cloudinaryUrl = await uploadToCloudinary(base64Image, folderPath);
    if (!cloudinaryUrl) throw new Error("Failed to upload image to Cloudinary");
    setProfile({ ...profile, avatar_url: cloudinaryUrl });
    return cloudinaryUrl;
  } finally {
    setUploading(false);
  }
}
