
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase, saveChat, updateChat, getChatById, addMessage } from '../lib/supabase';
import chatService from '../services/chatService';

export function useChatLogic(user, initialMessages = [], initialChatId = null, initialChatTitle = "New Chat") {
  const [messages, setMessages] = useState(initialMessages);
  const [chatId, setChatId] = useState(initialChatId);
  const [chatTitle, setChatTitle] = useState(initialChatTitle);
  const [isLoading, setIsLoading] = useState(false); // Loading AI response
  const [isProcessing, setIsProcessing] = useState(false); // Input disabled during send/process
  const [isFetchingHistory, setIsFetchingHistory] = useState(false); // Loading initial chat history
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadChatData = useCallback(async (chatIdToLoad, userId) => {
    if (!chatIdToLoad || !userId) return;
    setIsFetchingHistory(true);
    try {
      const chatData = await getChatById(chatIdToLoad, userId);
      if (chatData) {
        const formattedMessages = chatData.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at || msg.timestamp || new Date().toISOString(),
          imagePreview: msg.image_url || null
        }));
        setMessages(formattedMessages);
        setChatId(chatData.id);
        setChatTitle(chatData.title || "Chat Session");
        localStorage.setItem("currentChatId", chatData.id);
        localStorage.setItem("currentChatTitle", chatData.title || "Chat Session");
        // Return true on success to indicate data was loaded
        return true;
      } else {
        console.warn(`Chat with ID ${chatIdToLoad} not found.`);
        // Return false if chat not found
        return false;
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      alert("Failed to load chat history.");
      // Return false on error
      return false;
    } finally {
      setIsFetchingHistory(false);
    }
  }, []); // Dependencies managed internally or stable

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setChatId(null);
    setChatTitle("New Chat");
    localStorage.removeItem("currentChatId");
    localStorage.removeItem("currentChatMessages");
    localStorage.removeItem("currentChatTitle");
    navigate("/chat", { replace: true });
  }, [navigate]);

  // Effect to load chat based on URL or localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlChatId = params.get("chatId");

    if (user && urlChatId) {
      loadChatData(urlChatId, user.id).then(loaded => {
        if (!loaded) handleNewChat(); // Reset if load failed
      });
    } else if (user && !urlChatId) {
      const savedChatId = localStorage.getItem("currentChatId");
      if (savedChatId) {
        loadChatData(savedChatId, user.id).then(loaded => {
          if (!loaded) handleNewChat(); // Reset if load failed
        });
      } else {
        // Ensure clean state for a truly new chat
        setMessages([]);
        setChatId(null);
        setChatTitle("New Chat");
      }
    }
  }, [location.search, user, loadChatData, handleNewChat]); // Add handleNewChat dependency


  const generateAndUpdateTitle = useCallback(async (chatIdToUpdate, userIdForUpdate, currentMessages) => {
    if (!currentMessages.length || !chatIdToUpdate || !userIdForUpdate) return;
    const firstUserMessageContent = currentMessages.find(m => m.role === 'user')?.content;
    if (!firstUserMessageContent) return;

    let generatedTitle = firstUserMessageContent.split(' ').slice(0, 4).join(' ') + '...'; // Fallback

    try {
      generatedTitle = await chatService.generateTitle(firstUserMessageContent);
    } catch (error) {
      console.error('Error generating title via service:', error);
    }

    setChatTitle(generatedTitle); // Update local state immediately
    localStorage.setItem("currentChatTitle", generatedTitle);

    try {
      await updateChat(chatIdToUpdate, userIdForUpdate, { title: generatedTitle });
    } catch (updateError) {
      console.error("Error updating title in DB:", updateError);
      // Optionally revert local state or notify user
    }
  }, []); // Dependencies are stable or managed internally

  const handleSendMessageLogic = useCallback(async (userMessageContent, imageBase64ToSend) => {
    if (!user || isProcessing) return;

    const userMessage = {
      role: "user",
      content: userMessageContent,
      timestamp: new Date().toISOString(),
      // Image preview URL is handled by the UI component/hook, not needed here directly
      // We only need the base64 to send to the backend/service
    };

    // Optimistic UI update for user message
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true); // Show loading for AI response
    setIsProcessing(true); // Disable input

    let currentChatId = chatId;
    let isFirstMessage = !currentChatId;
    let temporaryTitle = "New Chat"; // Hold temporary title if needed

    try {
      // 1. Save/Get Chat ID & Save User Message
      if (isFirstMessage) {
        temporaryTitle = userMessageContent.slice(0, 30) + (userMessageContent.length > 30 ? '...' : '');
        setChatTitle(temporaryTitle); // Optimistic title update
        const newChatData = await saveChat(user.id, temporaryTitle, [userMessage], imageBase64ToSend);
        if (newChatData?.id) {
          currentChatId = newChatData.id;
          setChatId(currentChatId);
          localStorage.setItem("currentChatId", currentChatId);
          localStorage.setItem("currentChatTitle", temporaryTitle); // Store temp title
          navigate(`/chat?chatId=${currentChatId}`, { replace: true });
        } else {
          throw new Error("Failed to create new chat session.");
        }
      } else {
        await addMessage(currentChatId, user.id, userMessageContent, true, imageBase64ToSend);
      }

      // 2. Get AI Response
      abortControllerRef.current = new AbortController();
      const aiResponseData = await chatService.sendMessageToAI(
        userMessageContent,
        user.id,
        messages, // Pass previous messages for context
        currentChatId,
        abortControllerRef.current.signal,
        imageBase64ToSend // Pass the base64 image data
      );

      const assistantMessage = {
        role: "assistant",
        content: aiResponseData.content,
        timestamp: aiResponseData.timestamp || new Date().toISOString(),
      };

      // 3. Save AI Response
      await addMessage(currentChatId, user.id, assistantMessage.content, false);

      // 4. Update UI with AI response (actual display handled by UI hook/component)
      setMessages(prev => [...prev, assistantMessage]);

      // 5. Generate and Update Title if it was the first exchange
      if (isFirstMessage && currentChatId) {
         // Pass the updated messages array including the user message
         const updatedMessages = [...messages, userMessage];
         generateAndUpdateTitle(currentChatId, user.id, updatedMessages);
      }    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('AI response generation cancelled.');
        const cancelMessage = { role: "assistant", content: "Response generation cancelled.", timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, cancelMessage]);
        if (currentChatId) {
          try { await addMessage(currentChatId, user.id, cancelMessage.content, false); }
          catch (dbError) { console.error("Failed to save cancel message:", dbError); }
        }
      } else {
        console.error("Error sending message:", error);
        const errorMessage = { 
          role: "assistant", 
          content: "Sorry, I couldn't get a response. Please try again.", 
          timestamp: new Date().toISOString(),
          isError: true // Flag to identify this as an error message for consistent styling
        };
        setMessages(prev => [...prev, errorMessage]);
        if (currentChatId) {
          try { await addMessage(currentChatId, user.id, errorMessage.content, false); }
          catch (dbError) { console.error("Failed to save error message:", dbError); }
        }
        
        // Dispatch a standardized error event that components can listen for
        const errorEvent = new CustomEvent('chat-error', { 
          detail: { 
            message: "Failed to get a response. Please check your connection and try again.",
            type: "connection-error"
          } 
        });
        window.dispatchEvent(errorEvent);
        
        // Revert optimistic title if chat creation failed implicitly
        if (isFirstMessage && !chatId) {
            setChatTitle("New Chat");
        }
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false); // Stop loading indicator
      setIsProcessing(false); // Re-enable input
    }
    // Return the assistant message (or null/error indicator) if needed by caller
    // For now, it just updates state.
  }, [user, isProcessing, chatId, navigate, messages, generateAndUpdateTitle]); // Add dependencies

  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("Attempting to stop generation...");
      // State updates (isLoading, isProcessing) are handled in handleSendMessageLogic's finally block
    }
  }, []);

  return {
    messages,
    setMessages,
    chatId,
    chatTitle,
    isLoading, // Loading AI response
    isProcessing, // Input disabled
    isFetchingHistory, // Loading initial chat
    loadChatData,
    handleNewChat,
    handleSendMessageLogic,
    handleStopGeneration,
    abortControllerRef // Expose ref if needed externally (e.g., for direct abort)
  };
}
