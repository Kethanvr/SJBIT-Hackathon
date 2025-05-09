
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase, saveChat, updateChat, getChatById, addMessage } from "../lib/supabase";
import chatService from "../services/chatService";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading AI response
  const [isProcessing, setIsProcessing] = useState(false); // Input disabled during send/response
  const [isFetchingHistory, setIsFetchingHistory] = useState(false); // Loading initial chat history
  const [chatId, setChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [displayedText, setDisplayedText] = useState({});
  const [typingInterval, setTypingInterval] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const imageInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // --- Utility Functions ---

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  const typeMessage = useCallback((message, timestamp) => {
    if (!message || !message.content) return;

    setTypingInterval(prevInterval => {
      if (prevInterval) clearInterval(prevInterval);
      return null;
    });

    const content = message.content;
    let charIndex = 0;
    const typingSpeed = 30;

    setDisplayedText(prev => ({ ...prev, [timestamp]: "" }));

    const interval = setInterval(() => {
      setDisplayedText(prev => {
        if (charIndex <= content.length) {
          return { ...prev, [timestamp]: content.substring(0, charIndex) };
        } else {
          clearInterval(interval);
          setTypingInterval(null);
          return prev;
        }
      });
      charIndex++;
    }, typingSpeed);

    setTypingInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const stopTypingAnimation = useCallback(() => {
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
      setDisplayedText((prev) => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.timestamp && lastMessage.content) {
          return { ...prev, [lastMessage.timestamp]: lastMessage.content };
        }
        return prev;
      });
    }
  }, [typingInterval, messages]);

  const stopSpeech = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    }
  }, [isSpeaking]);

  const stopAllProcessing = useCallback(() => {
    stopTypingAnimation();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    stopSpeech();
    setIsLoading(false);
    setIsProcessing(false);
  }, [stopTypingAnimation, stopSpeech]);

  const cleanTextForSpeech = (text) => {
    return text.replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      ""
    );
  };

  // --- Event Handlers ---

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 30;
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom && messages.length > 2);
  }, [messages.length]);

  const handleNewChat = useCallback(() => {
    stopAllProcessing();
    setMessages([]);
    setChatId(null);
    setNewMessage("");
    setChatTitle("New Chat");
    setImageBase64(null);
    setImagePreviewUrl(null);
    setSelectedImageFile(null);
    localStorage.removeItem("currentChatId");
    localStorage.removeItem("currentChatTitle");
    navigate("/chat", { replace: true });
    inputRef.current?.focus();
  }, [navigate, stopAllProcessing]);

  const removeSelectedImage = useCallback(() => {
    setSelectedImageFile(null);
    setImageBase64(null);
    setImagePreviewUrl(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  }, []);

  const handleImageChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
        setImagePreviewUrl(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } else {
      removeSelectedImage();
      if (file) {
        alert("Please select a valid image file (e.g., JPG, PNG, GIF).");
      }
    }
    event.target.value = null;
  }, [removeSelectedImage]);

  const triggerImageInput = useCallback(() => {
    imageInputRef.current?.click();
  }, []);
  const generateAndUpdateTitle = useCallback(async (chatIdToUpdate, userIdForUpdate, currentMessages) => {
    // Always use the latest messages from state if not explicitly provided
    // This helps prevent stale closure issues
    const messagesToUse = currentMessages || messages;
    
    if (!messagesToUse.length || !chatIdToUpdate) return;
    const firstUserMessageContent = messagesToUse.find(m => m.role === 'user')?.content;
    if (!firstUserMessageContent) return;

    try {
      const title = await chatService.generateTitle(firstUserMessageContent);
      setChatTitle(title);
      await updateChat(chatIdToUpdate, userIdForUpdate, { title });
      localStorage.setItem("currentChatTitle", title);
    } catch (error) {
      console.error('Error generating title:', error);
      const fallbackTitle = firstUserMessageContent.split(' ').slice(0, 4).join(' ') + '...';
      setChatTitle(fallbackTitle);
      try {
        await updateChat(chatIdToUpdate, userIdForUpdate, { title: fallbackTitle });
        localStorage.setItem("currentChatTitle", fallbackTitle);
      } catch (updateError) {
        console.error("Error updating fallback title:", updateError);
      }
    }
  }, []);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imageBase64) || !user || isProcessing) return;

    stopAllProcessing(); // Stop any previous processing

    const userMessageContent = newMessage;
    const userMessage = {
      role: "user",
      content: userMessageContent,
      timestamp: new Date().toISOString(),
      imagePreview: imagePreviewUrl,
    };
    const sendingImageBase64 = imageBase64;

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    removeSelectedImage();

    setIsLoading(true);
    setIsProcessing(true);
    setIsAtBottom(true);
    setTimeout(scrollToBottom, 0);

    let currentChatId = chatId;
    let isFirstMessage = !currentChatId;
    let tempChatId = null; // To store newly created chat ID before state update

    try {
      // 1. Save/Get Chat ID & Save User Message
      if (isFirstMessage) {
        const initialTitle = userMessageContent.slice(0, 30) + (userMessageContent.length > 30 ? '...' : '');
        const newChatData = await saveChat(user.id, initialTitle, [userMessage], sendingImageBase64);
        if (newChatData && newChatData.id) {
          tempChatId = newChatData.id; // Use temp variable
          setChatId(newChatData.id);
          setChatTitle(initialTitle);
          localStorage.setItem("currentChatId", newChatData.id);
          localStorage.setItem("currentChatTitle", initialTitle);
          navigate(`/chat?chatId=${newChatData.id}`, { replace: true });
        } else {
          throw new Error("Failed to create new chat session.");
        }
      } else {
        await addMessage(currentChatId, user.id, userMessageContent, true, sendingImageBase64);
      }

      const finalChatId = tempChatId || currentChatId; // Use the correct ID

      // 2. Get AI Response
      abortControllerRef.current = new AbortController();
      const aiResponseData = await chatService.sendMessageToAI(
        userMessageContent,
        user.id,
        messages, // Pass previous messages state *before* adding the new user message
        finalChatId,
        abortControllerRef.current.signal,
        sendingImageBase64
      );

      const assistantMessage = {
        role: "assistant",
        content: aiResponseData.content,
        timestamp: aiResponseData.timestamp || new Date().toISOString(),
      };

      // 3. Save AI Response
      await addMessage(finalChatId, user.id, assistantMessage.content, false);

      // 4. Update UI with AI response
      setIsLoading(false); // Stop loading indicator *before* typing starts
      setMessages(prev => [...prev, assistantMessage]);
      typeMessage(assistantMessage, assistantMessage.timestamp); // Start typing animation

      // 5. Update Title if it was the first exchange
      if (isFirstMessage && finalChatId) {
         // Pass the updated messages array including the user message
         generateAndUpdateTitle(finalChatId, user.id, [...messages, userMessage]);
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('AI response generation cancelled.');
        const cancelMessage = { role: "assistant", content: "Response generation cancelled.", timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, cancelMessage]);
        if (tempChatId || currentChatId) {
          try { await addMessage(tempChatId || currentChatId, user.id, cancelMessage.content, false); }
          catch (dbError) { console.error("Failed to save cancel message:", dbError); }
        }
      } else {
        console.error("Error sending message:", error);
        const errorMessage = { role: "assistant", content: "Sorry, I couldn't get a response. Please try again.", timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, errorMessage]);
        if (tempChatId || currentChatId) {
          try { await addMessage(tempChatId || currentChatId, user.id, errorMessage.content, false); }
          catch (dbError) { console.error("Failed to save error message:", dbError); }
        }
        alert("Failed to get a response. Please check your connection and try again.");
      }
      setIsLoading(false);
    } finally {
      abortControllerRef.current = null;
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  }, [
    newMessage, imageBase64, user, isProcessing, chatId, imagePreviewUrl,
    messages, navigate, removeSelectedImage, scrollToBottom, stopAllProcessing,
    typeMessage, generateAndUpdateTitle
  ]);

  const copyToClipboard = useCallback((text) => {
    navigator.clipboard.writeText(text);
    // Consider adding a visual feedback mechanism here (e.g., toast)
  }, []);

  const speakText = useCallback((text) => {
    stopSpeech();
    const cleanedText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female'));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  }, [stopSpeech]);

  // --- Effects ---

  // Fetch User
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
    inputRef.current?.focus();
  }, [navigate]);

  // Load Chat Data Logic
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
      setIsFetchingHistory(false);
    }
  }, [handleNewChat, scrollToBottom]); // Add dependencies if needed

  // Effect to Load Chat based on URL or LocalStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlChatId = params.get("chatId");

    if (user) {
      if (urlChatId) {
        // If URL has chatId, load it, even if it's the same as current
        // Ensures refresh when navigating from history
        if (urlChatId !== chatId) { // Only load if different from current state
           loadChatData(urlChatId, user.id);
        }
      } else {
        // No chatId in URL, check localStorage
        const savedChatId = localStorage.getItem("currentChatId");
        if (savedChatId && savedChatId !== chatId) { // Only load if different
          loadChatData(savedChatId, user.id);
        } else if (!savedChatId && chatId) {
          // If no saved chat but we have one in state, means user navigated away
          // Reset to new chat state if desired, or keep current state
           handleNewChat(); // Example: Reset if URL is cleared
        } else if (!savedChatId && !chatId) {
           // Truly a new session, ensure state is clean
           setMessages([]);
           setChatTitle("New Chat");
        }
      }
    }
  }, [location.search, user, loadChatData, chatId, handleNewChat]);


  // Scroll Handling Effect
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Auto-scroll Effect
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages.length, isAtBottom, scrollToBottom]); // Trigger on new messages if at bottom

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingInterval) clearInterval(typingInterval);
      stopSpeech(); // Also stop speech on unmount
    };
  }, [typingInterval, stopSpeech]);

  // Mobile scroll fix
  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = '';
    return () => {
      document.documentElement.style.overflowX = '';
      document.body.style.overflowX = '';
    };
  }, []);

  return {
    // State
    messages,
    newMessage,
    selectedImageFile,
    imageBase64,
    imagePreviewUrl,
    user,
    isLoading,
    isProcessing,
    isFetchingHistory,
    chatId,
    chatTitle,
    displayedText,
    isSpeaking,
    showScrollButton,
    isAtBottom,

    // Refs
    messagesEndRef,
    chatContainerRef,
    inputRef,
    imageInputRef,

    // Handlers & Methods
    setNewMessage,
    handleSendMessage,
    handleNewChat,
    handleImageChange,
    triggerImageInput,
    removeSelectedImage,
    stopAllProcessing,
    copyToClipboard,
    speakText,
    stopSpeech,
    scrollToBottom,
    setIsAtBottom, // Expose if needed by ChatInput directly
  };
}
