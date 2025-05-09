/**
 * Generates a short preview text from chat messages.
 * @param {Array<object>} messages - Array of message objects.
 * @param {number} [maxLength=50] - Maximum length of the preview.
 * @returns {string} The chat preview text.
 */
export const getChatPreview = (messages, maxLength = 50) => {
  if (!messages || messages.length === 0) return "No messages yet";
  
  // Find the last message with content
  let lastMessage = null;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i] && messages[i].content) {
      lastMessage = messages[i];
      break;
    }
  }

  if (!lastMessage) return "No content";

  const content = lastMessage.content;
  return content.length > maxLength
    ? `${content.substring(0, maxLength)}...`
    : content;
};
