// Utility functions for chat overlay and related components
import DOMPurify from "dompurify";

// Helper function to get a unique key for storage
export const getStorageKey = (scanData) => {
  const medicineName = scanData?.product_identification?.medicine_name || "unknown_medicine";
  // Sanitize the name to be a valid key
  const sanitizedName = medicineName.replace(/[^a-zA-Z0-9_-]/g, '_');
  return `askAiChat_${sanitizedName}`;
};

// Helper function to format text with markdown-like syntax
export const formatText = (text) => {
  if (!text) return "";
  // Replace ** for bold text
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Replace * or _ for italic text
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formattedText = formattedText.replace(/_(.*?)_/g, '<em>$1</em>');
  // Replace line breaks with <br>
  formattedText = formattedText.replace(/\n/g, '<br>');
  // Sanitize the HTML to prevent XSS attacks
  return DOMPurify.sanitize(formattedText);
};
