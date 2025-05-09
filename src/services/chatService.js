import { fetchWithFallback } from '../utils/apiUtils'; // Import the utility

const chatService = {
  /**
   * Sends a message (and optionally an image) to the AI backend.
   * Uses fetchWithFallback to try the local API first, then fall back to production.
   * @param {string} message - The user's text message.
   * @param {string} userId - The user's ID.
   * @param {Array} chatHistory - The previous messages in the conversation.
   * @param {string|null} chatId - The current chat ID (if exists).
   * @param {AbortSignal} signal - AbortController signal for cancellation.
   * @param {string|null} base64Image - Optional base64 encoded image string.
   * @returns {Promise<Object>} - The AI's response object.
   */  
  sendMessageToAI: async (message, userId, chatHistory, chatId, signal, base64Image = null) => {
    const payload = {
      message,
      userId,
      chatHistory,
      chatId,
      base64Image, // Include the image data in the payload
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary auth headers if required by your API
        // 'Authorization': `Bearer ${getToken()}` 
      },
      body: JSON.stringify(payload),
      signal, // Pass the abort signal to the fetch request
    };

    try {
      // Use fetchWithFallback to handle requests with automatic fallback
      return await fetchWithFallback('/api/chat', options);
    } catch (error) {
      console.error(`Chat request failed: ${error.message}`);
      throw error; // Re-throw the error to be caught by the calling component
    }
  },

  /**
   * Generates a title for a chat based on the first message.
   * Uses fetchWithFallback to try local first, then production.
   * @param {string} firstMessage - The first user message of the chat.
   * @returns {Promise<string>} - The generated title.
   */  
  generateTitle: async (firstMessage) => {
    const payload = { message: firstMessage };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    };

    try {
      // Use fetchWithFallback to handle requests with automatic fallback
      const data = await fetchWithFallback('/api/generate-title', options);
      return data.title;
    } catch (error) {
      console.error(`Title generation failed: ${error.message}`);
      // Fallback to a simple title in case of error
      return firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
    }
  },
};

export default chatService;