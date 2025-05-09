
import { useState, useRef, useCallback } from 'react';

export function useImageHandling() {
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const imageInputRef = useRef(null);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Store base64 string
        setImagePreviewUrl(URL.createObjectURL(file)); // Create preview URL
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        alert("Failed to read the image file.");
        removeSelectedImage(); // Clean up on error
      };
      reader.readAsDataURL(file); // Read file as base64
    } else {
      setSelectedImageFile(null);
      setImageBase64(null);
      setImagePreviewUrl(null);
      if (file) {
        alert("Please select a valid image file (e.g., JPG, PNG, GIF).");
      }
    }
    // Reset the input value to allow selecting the same file again
    if (event.target) {
        event.target.value = null;
    }
  }, []); // No dependencies needed for this logic

  const triggerImageInput = useCallback(() => {
    imageInputRef.current?.click();
  }, []); // Depends only on the ref

  const removeSelectedImage = useCallback(() => {
    // Revoke the old object URL to prevent memory leaks
    if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImageFile(null);
    setImageBase64(null);
    setImagePreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = null; // Clear the file input
    }
  }, [imagePreviewUrl]); // Dependency on imagePreviewUrl for cleanup

  return {
    selectedImageFile,
    imageBase64,
    imagePreviewUrl,
    imageInputRef,
    handleImageChange,
    triggerImageInput,
    removeSelectedImage,
    // Expose setters if needed, though actions are preferred
    // setSelectedImageFile,
    // setImageBase64,
    // setImagePreviewUrl,
  };
}
