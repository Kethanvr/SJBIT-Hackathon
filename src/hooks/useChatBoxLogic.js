import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  supabase,
  saveChat,
  updateChat,
  getChatById,
  addMessage,
} from "../lib/supabase";
import { useInView } from "react-intersection-observer";
import chatService from "../services/chatService";
// import { copyToClipboard, cleanTextForSpeech } from "../utils/chatUtils";

export function useChatBoxLogic() {
  // State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState({});
  const [typingInterval, setTypingInterval] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [typingMessageTimestamp, setTypingMessageTimestamp] = useState(null); // Track active typing animation
  const abortControllerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { ref: lastMessageRef } = useInView({ threshold: 0.1 });
  // Typing animation function
  const typeMessage = useCallback(
    (message, timestamp) => {
      if (!message || !message.content) return;

      // Clear any existing typing animation
      if (typingInterval) {
        clearInterval(typingInterval);
        setTypingInterval(null);
      }

      const content = message.content;
      let charIndex = 0;

      // Calculate adaptive typing speed
      const baseSpeed = 65;
      const contentLength = content.length;
      const typingSpeed =
        contentLength > 500
          ? baseSpeed / 2
          : contentLength > 200
          ? baseSpeed
          : baseSpeed * 1.5;

      // Set up typing animation
      setTypingMessageTimestamp(timestamp);
      setDisplayedText((prev) => ({ ...prev, [timestamp]: "" }));
      setIsLoading(false); // Ensure loading indicator is hidden during typing

      const interval = setInterval(() => {
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        charIndex = Math.min(charIndex + chunkSize, content.length);

        setDisplayedText((prev) => ({
          ...prev,
          [timestamp]: content.substring(0, charIndex),
        }));

        if (charIndex >= content.length) {
          clearInterval(interval);
          setTypingInterval(null);

          // Short delay before removing typing indicator
          setTimeout(() => {
            setTypingMessageTimestamp(null);
          }, 300);
        }
      }, typingSpeed);

      setTypingInterval(interval);
    },
    [typingInterval]
  );

  // Scroll handling
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 30;
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom && messages.length > 2);
  }, [messages.length]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  // Load chat data
  const loadChatData = useCallback(async (chatIdToLoad, userId) => {
    if (!chatIdToLoad || !userId) return;

    try {
      setIsLoading(true);

      // Use getChatById to fetch chat metadata AND messages
      const chatData = await getChatById(chatIdToLoad, userId);

      if (chatData) {
        // Map messages from the format returned by getChatById
        const formattedMessages = chatData.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp:
            msg.created_at || msg.timestamp || new Date().toISOString(),
          imagePreview: msg.image_url || null,
        }));

        setMessages(formattedMessages);
        setChatId(chatData.id);
        setChatTitle(chatData.title || "Chat Session");

        // Store chat session essentials in localStorage
        localStorage.setItem("currentChatId", chatData.id);
        localStorage.setItem(
          "currentChatTitle",
          chatData.title || "Chat Session"
        );

        // Auto scroll to bottom after loading chat
        setTimeout(scrollToBottom, 100);
      } else {
        console.warn(`Chat with ID ${chatIdToLoad} not found.`);
        handleNewChat();
      }
    } catch (error) {
      console.error("Error loading chat:", error);
      alert("Failed to load chat history. Starting a new chat.");
      handleNewChat();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle new chat
  const handleNewChat = useCallback(() => {
    // Clear all states
    setMessages([]);
    setChatId(null);
    setNewMessage("");
    setChatTitle("New Chat");
    setImageBase64(null);
    setImagePreviewUrl(null);
    setSelectedImageFile(null);

    // Clear localStorage
    localStorage.removeItem("currentChatId");
    localStorage.removeItem("currentChatMessages");
    localStorage.removeItem("currentChatTitle");

    // Reset URL
    navigate("/chat", { replace: true });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [navigate]);

  // Function to generate and update title
  const generateAndUpdateTitle = useCallback(
    async (chatIdToUpdate, userIdForUpdate, currentMessages) => {
      if (!currentMessages.length || !chatIdToUpdate) return;

      try {
        const firstUserMessage = currentMessages.find(
          (m) => m.role === "user"
        )?.content;
        if (!firstUserMessage) return;

        // Use the chatService which will try local first, then production
        const title = await chatService.generateTitle(firstUserMessage);

        setChatTitle(title); // Update local state

        // Update chat title in database
        await updateChat(chatIdToUpdate, userIdForUpdate, { title });
        localStorage.setItem("currentChatTitle", title);
      } catch (error) {
        console.error("Error generating title:", error);
        // Use first few words of user message as fallback title
        const firstUserMessage = currentMessages.find(
          (m) => m.role === "user"
        )?.content;
        if (firstUserMessage) {
          const fallbackTitle =
            firstUserMessage.split(" ").slice(0, 4).join(" ") + "...";
          setChatTitle(fallbackTitle);
          try {
            await updateChat(chatIdToUpdate, userIdForUpdate, {
              title: fallbackTitle,
            });
            localStorage.setItem("currentChatTitle", fallbackTitle);
          } catch (updateError) {
            console.error("Error updating fallback title:", updateError);
          }
        }
      }
    },
    []
  );

  // Handle send message
  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault();

      // Allow sending only image, only text, or both
      if ((!newMessage.trim() && !imageBase64) || !user || isProcessing) return;

      const userMessageContent = newMessage;
      const userMessage = {
        role: "user",
        content: userMessageContent,
        timestamp: new Date().toISOString(),
        imagePreview: imagePreviewUrl,
      };

      // Optimistically update UI
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage("");
      const sendingImageBase64 = imageBase64; // Capture current image base64

      // Clear image state immediately after capturing
      removeSelectedImage();

      setIsLoading(true); // Show loading indicator for AI response
      setIsProcessing(true); // Disable input
      setIsAtBottom(true); // Ensure scroll happens
      setTimeout(scrollToBottom, 0); // Scroll immediately after adding user message

      let currentChatId = chatId;
      let isFirstMessage = !currentChatId;

      try {
        // 1. Save/Get Chat ID & Save User Message
        if (isFirstMessage) {
          const initialTitle =
            userMessageContent.slice(0, 30) +
            (userMessageContent.length > 30 ? "..." : "");
          // Pass the user message AND the image (if any) to saveChat
          const newChatData = await saveChat(
            user.id,
            initialTitle,
            [userMessage],
            sendingImageBase64
          );

          if (newChatData && newChatData.id) {
            currentChatId = newChatData.id;
            setChatId(currentChatId); // Update state
            setChatTitle(initialTitle); // Use initial title for now
            localStorage.setItem("currentChatId", currentChatId);
            localStorage.setItem("currentChatTitle", initialTitle);
            navigate(`/chat?chatId=${currentChatId}`, { replace: true });
          } else {
            throw new Error("Failed to create new chat session.");
          }
        } else {
          // If not the first message, just save the user message (and potentially image indicator)
          await addMessage(
            currentChatId,
            user.id,
            userMessageContent,
            true,
            sendingImageBase64
          );
        }

        // 2. Get AI Response - Pass the image base64 to the service
        abortControllerRef.current = new AbortController();
        let aiResponseData;
        try {
          aiResponseData = await chatService.sendMessageToAI(
            userMessageContent,
            user.id,
            messages, // Pass previous messages for context
            currentChatId,
            abortControllerRef.current.signal, // Pass the signal
            sendingImageBase64 // Pass the base64 image data
          );
        } catch (error) {
          // Handle backend file upload limit error (403)
          if (
            error?.response?.status === 403 &&
            error?.response?.data?.error?.includes("Daily file upload limit")
          ) {
            // Dispatch a custom event for ChatInput to show overlay
            window.dispatchEvent(
              new CustomEvent("chat-backend-error", {
                detail: {
                  type: "file-upload-limit",
                  message: error.response.data.error,
                },
              })
            );
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content:
                  "You have reached your daily file upload limit. Upgrade to Gold for unlimited uploads.",
                timestamp: new Date().toISOString(),
              },
            ]);
            setIsLoading(false);
            setIsProcessing(false);
            // Do NOT try production if this is a file upload limit error
            return;
          }
          throw error;
        }

        const assistantMessage = {
          role: "assistant",
          content: aiResponseData.content,
          timestamp: aiResponseData.timestamp || new Date().toISOString(),
        };

        // 3. Save AI Response
        await addMessage(
          currentChatId,
          user.id,
          assistantMessage.content,
          false
        );

        // 4. Update UI with AI response (using typing effect)
        setIsLoading(false); // Hide loading indicator

        // Add assistant message to the messages array
        setMessages((prev) => [...prev, assistantMessage]);

        // Start typing animation for the response
        typeMessage(assistantMessage, assistantMessage.timestamp);

        // 5. Update Title if it was the first exchange
        if (isFirstMessage && currentChatId) {
          generateAndUpdateTitle(currentChatId, user.id, [
            ...messages,
            userMessage,
            assistantMessage,
          ]);
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("AI response generation cancelled.");
          const cancelMessage = {
            role: "assistant",
            content: "Response generation cancelled.",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, cancelMessage]);

          // Attempt to save cancel message
          if (currentChatId) {
            try {
              await addMessage(
                currentChatId,
                user.id,
                cancelMessage.content,
                false
              );
            } catch (dbError) {
              console.error("Failed to save cancel message to DB:", dbError);
            }
          }
        } else {
          console.error("Error sending message:", error);
          const errorMessage = {
            role: "assistant",
            content: "Sorry, I couldn't get a response. Please try again.",
            timestamp: new Date().toISOString(),
            isError: true, // Flag to identify this as an error message for consistent styling
          };
          setMessages((prev) => [...prev, errorMessage]);

          if (currentChatId) {
            try {
              await addMessage(
                currentChatId,
                user.id,
                errorMessage.content,
                false
              );
            } catch (dbError) {
              console.error("Failed to save error message to DB:", dbError);
            }
          }

          // Dispatch a standardized error event that components can listen for
          const errorEvent = new CustomEvent("chat-error", {
            detail: {
              message:
                "Failed to get a response. Please check your connection and try again.",
              type: "connection-error",
            },
          });
          window.dispatchEvent(errorEvent);
        }

        setIsLoading(false); // Ensure loading stops on error
      } finally {
        abortControllerRef.current = null;
        setIsProcessing(false); // Re-enable input

        // Refocus input after sending/error
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [
      newMessage,
      imageBase64,
      user,
      isProcessing,
      chatId,
      imagePreviewUrl,
      messages,
      navigate,
      scrollToBottom,
      typeMessage,
      generateAndUpdateTitle,
    ]
  );

  // Animation state for file upload
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // Function to handle image selection (add animation trigger)
  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setIsUploadingFile(true); // Start animation
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result); // Store base64 string
        setImagePreviewUrl(URL.createObjectURL(file)); // Create preview URL
        setTimeout(() => setIsUploadingFile(false), 900); // End animation after 0.9s
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
    event.target.value = null;
  }, []);

  // Function to trigger the hidden file input
  const triggerImageInput = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  // Function to remove the selected image
  const removeSelectedImage = useCallback(() => {
    setSelectedImageFile(null);
    setImageBase64(null);
    setImagePreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = null; // Clear the file input
    }
  }, []);

  // Handle stop generation
  const handleStopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log("Attempting to stop generation...");
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, []);

  // Add method to stop all processing
  const stopAllProcessing = useCallback(() => {
    console.log("stopAllProcessing called"); // Add log for debugging

    // Stop typing animation
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
      setTypingMessageTimestamp(null); // Ensure typing state is cleared
      setDisplayedText((prev) => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.timestamp && lastMessage.role === "assistant") {
          // Ensure the full message is displayed when stopped
          return { ...prev, [lastMessage.timestamp]: lastMessage.content };
        }
        return prev;
      });
    }

    // Abort any ongoing fetch
    if (abortControllerRef.current) {
      console.log("Aborting fetch request..."); // Add log
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    } else {
      console.log("No active abort controller to abort."); // Add log
    }

    // Stop any speech synthesis
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    }

    setIsLoading(false);
    setIsProcessing(false); // Ensure processing state is reset
  }, [isSpeaking, messages, typingInterval]);

  // Stop the ongoing speech
  const stopSpeech = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    }
  }, [isSpeaking]);

  // Function to speak text
  const speakText = useCallback(
    (text) => {
      // Stop any ongoing speech
      stopSpeech();

      const cleanedText = cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(cleanedText);

      // Better voice settings for more natural speech
      utterance.rate = 0.95; // Slightly slower for better clarity
      utterance.pitch = 1.0; // Natural pitch

      // Try to get a better voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (voice) => voice.lang.includes("en") && voice.name.includes("Female")
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => setIsSpeaking(false); // Reset speaking state when done
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    },
    [stopSpeech]
  );

  // Effect to watch URL/localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlChatId = params.get("chatId");      if (user && urlChatId) {
        // Always load from DB if chatId is in URL, even if it matches current chatId
        // This ensures data is fresh when navigating from history
        loadChatData(urlChatId, user.id);
      } else if (user && !urlChatId) {
        // Fallback: Check for saved session ONLY if no chatId in URL
        const savedChatId = localStorage.getItem("currentChatId");
        // Don't load messages from localStorage anymore
      if (savedChatId) {
        // Load the chat data from DB using the saved ID
        loadChatData(savedChatId, user.id);
      } else {
        // No URL param, no saved session -> truly a new chat
        setMessages([]);
        setChatId(null);
        setChatTitle("New Chat");
      }
    }
  }, [location.search, user, loadChatData]);

  // Fetch user effect
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        navigate("/auth");
      }
    };

    fetchUser();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [navigate]);

  // Scroll handling effect
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Auto-scroll effect
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages.length, isAtBottom, scrollToBottom]);

  // Mobile scroll fix
  useEffect(() => {
    // Add CSS to prevent horizontal scroll on mobile
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "";

    return () => {
      // Remove CSS when component unmounts
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingInterval) clearInterval(typingInterval);
      setTypingMessageTimestamp(null); // Clear on unmount
      stopSpeech(); // Also stop speech on unmount
    };
  }, [typingInterval, stopSpeech]);

  return {
    messages,
    setMessages,
    newMessage,
    setNewMessage,
    selectedImageFile,
    setSelectedImageFile,
    imageBase64,
    setImageBase64,
    imagePreviewUrl,
    setImagePreviewUrl,
    user,
    setUser,
    isLoading,
    setIsLoading,
    isSidebarOpen,
    setIsSidebarOpen,
    displayedText,
    setDisplayedText,
    typingInterval,
    setTypingInterval,
    isSpeaking,
    setIsSpeaking,
    chatId,
    setChatId,
    chatTitle,
    setChatTitle,
    showShareModal,
    setShowShareModal,
    showScrollButton,
    setShowScrollButton,
    isAtBottom,
    setIsAtBottom,
    isProcessing,
    setIsProcessing,
    abortControllerRef,
    messagesEndRef,
    chatContainerRef,
    inputRef,
    speechSynthesisRef,
    imageInputRef,
    navigate,
    location,
    lastMessageRef,
    typingMessageTimestamp, // Expose the new state
    isUploadingFile,
    // Handler functions
    typeMessage,
    handleScroll,
    scrollToBottom,
    loadChatData,
    handleNewChat,
    handleSendMessage,
    generateAndUpdateTitle,
    handleImageChange,
    triggerImageInput,
    removeSelectedImage,
    handleStopGeneration,
    stopAllProcessing,
    speakText,
    stopSpeech,
  };
}
