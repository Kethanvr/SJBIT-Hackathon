import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ChatHeader from "./chat/ChatHeader";
import ChatMessageBubble from "./chat/ChatMessageBubble";
import ModalContainer from "./common/ModalContainer";
import ChatInput from "./chat/ChatInput";
import Button from "./ui/Button";
import toast from "../utils/toast.jsx";
import { fetchWithFallback } from "../utils/apiUtils";
import { getStorageKey, formatText } from "../utils/chatUtils";
import StandardLoadingIndicator from "./common/StandardLoadingIndicator";
import StandardErrorMessage from "./common/StandardErrorMessage";

export default function AskWithAiOverlay({ open, onClose, scanData }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState({});
  const [typingInterval, setTypingInterval] = useState(null);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const modalRef = useRef(null);
  const storageKey = getStorageKey(scanData);

  // Listen for standardized error events
  useEffect(() => {
    const handleErrorEvent = (event) => {
      setError(event.detail);
      
      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    };
    
    window.addEventListener('chat-error', handleErrorEvent);
    
    return () => {
      window.removeEventListener('chat-error', handleErrorEvent);
    };
  }, []);

  // Typing animation function
  const typeMessage = (message, timestamp) => {
    if (!message || !message.content) return;

    // Clear any existing typing animation
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
    }

    const content = message.content;
    let charIndex = 0;
    const typingSpeed = 30; // milliseconds per character

    // Start with empty text
    setDisplayedText(prev => ({ ...prev, [timestamp]: "" }));

    // Set up interval to add characters one by one
    const interval = setInterval(() => {
      if (charIndex <= content.length) {
        setDisplayedText(prev => ({
          ...prev,
          [timestamp]: content.substring(0, charIndex)
        }));
        charIndex++;
      } else {
        clearInterval(interval);
        setTypingInterval(null);
      }
    }, typingSpeed);

    setTypingInterval(interval);

    // Clean up interval on component unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  };

  // Load messages from local storage on open
  useEffect(() => {
    if (open) {
      const storedMessages = localStorage.getItem(storageKey);
      const initialSystemMessage = {
        role: "system",
        content: `You scanned: ${scanData?.product_identification?.medicine_name || "a medicine"}. Ask any questions about this medicine.`,
      };
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          // Ensure the system message is always first and reflects current scan
          setMessages([initialSystemMessage, ...parsedMessages.filter(m => m.role !== 'system')]);
        } catch (e) {
          console.error("Failed to parse messages from local storage:", e);
          setMessages([initialSystemMessage]);
        }
      } else {
        setMessages([initialSystemMessage]);
      }
      setNewMessage("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open, scanData, storageKey]);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 1) {
      try {
        const messagesToStore = messages.filter(m => m.role !== 'system');
        localStorage.setItem(storageKey, JSON.stringify(messagesToStore));
      } catch (e) {
        console.error("Failed to save messages to local storage:", e);
      }
    }
  }, [messages, storageKey]);

  // Scroll to bottom effect
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, displayedText]);

  // Clean up typing animation when component unmounts
  useEffect(() => {
    return () => {
      if (typingInterval) {
        clearInterval(typingInterval);
      }
    };
  }, [typingInterval]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (open) {
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [open, onClose]);

    const handleSend = async (userMessage) => {
    setLoading(true);
    
    // Add timestamp to messages for typing effect
    const timestamp = new Date().toISOString();
    const userMsg = { role: "user", content: userMessage, timestamp };
    
    // Add user message to conversation immediately
    setMessages(msgs => [...msgs, userMsg]);
    setNewMessage("");

    try {
      // Use fetchWithFallback to try local first, then production URL
      const responseData = await fetchWithFallback(
        '/api/ask-ai',
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            userId: "overlay-user",
            chatHistory: messages.filter(m => m.role !== "system"),
            scanContext: scanData,
          }),
        }
      );

      // Create AI response with timestamp for typing effect
      const aiResponseTimestamp = new Date().toISOString();
      const aiResponse = {
        role: "ai",
        content: responseData.content,
        timestamp: aiResponseTimestamp
      };
      
      // Add AI message to conversation
      setMessages(msgs => [...msgs, aiResponse]);
      
      // Start typing animation
      typeMessage(aiResponse, aiResponseTimestamp);    } catch (error) {
      console.error("Failed to get AI response:", error);
      
      // Handle error case
      const errorTimestamp = new Date().toISOString();
      const errorMessage = {
        role: "ai",
        content: "Sorry, could not connect to the AI service. Please try again later.",
        timestamp: errorTimestamp,
        isError: true // Mark as error for consistent styling
      };
      setMessages(msgs => [...msgs, errorMessage]);
      
      // Display standardized error using event system
      const errorEvent = new CustomEvent('chat-error', { 
        detail: { 
          message: "Could not connect to the AI service. Please try again later.",
          type: "connection-error"
        } 
      });      window.dispatchEvent(errorEvent);
      setDisplayedText(prev => ({ ...prev, [errorTimestamp]: errorMessage.content }));
      
      // Optional: Show toast notification for better UX
      toast("Failed to connect to AI service", {
        type: "error",
        duration: 3000
      });
    }

    setLoading(false);
  };
  // Handler for file upload attempt
const handleFileUploadAttempt = () => {
    toast("File upload feature is coming soon!", {
        duration: 3000,
        position: "top-center",
        style: {
            background: "#f3f4f6",
            color: "#111827",
            border: "1px solid #d1d5db",
            fontWeight: "500",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
        },
        icon: "ℹ️",
    });
};

  if (!open) return null;

  return createPortal(
    <ModalContainer modalRef={modalRef}>      <ChatHeader onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <ChatMessageBubble key={i} msg={msg} displayedText={displayedText} />
        ))}
        {loading && messages.length > 0 && (
          <div className="flex justify-center my-4">
            <StandardLoadingIndicator size="md" variant="spinner" />
          </div>
        )}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-center mb-4">Ask any questions about this medicine</p>
            <StandardLoadingIndicator size="lg" variant="dots" />
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-2 border-t bg-white">
        <ChatInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={e => {
            if (e) e.preventDefault();
            if (newMessage && newMessage.trim()) handleSend(newMessage.trim());
          }}
          isProcessing={loading}
          placeholder="Ask about this medicine..."
          setIsAtBottom={() => {}}
          triggerImageInput={handleFileUploadAttempt}
        />
      </div>
    </ModalContainer>,
    document.body
  );
}
