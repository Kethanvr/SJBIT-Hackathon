
import { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

// Removes common emoji patterns
const cleanTextForSpeech = (text) => {
  if (!text) return "";
  return text.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
    ""
  ).trim();
};


export function useChatUI(messages, chatContainerRef, messagesEndRef, isLoading, isProcessing, abortControllerRef) {
  const [displayedText, setDisplayedText] = useState({});
  const [typingInterval, setTypingInterval] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const speechSynthesisRef = useRef(null);

  // Ref for intersection observer on the last message
  const { ref: lastMessageRef } = useInView({ threshold: 0.1 });

  // Typing animation
  const typeMessage = useCallback((message, timestamp) => {
    if (!message || !message.content) return;

    if (typingInterval) {
      clearInterval(typingInterval);
    }

    const content = message.content;
    let charIndex = 0;
    const typingSpeed = 30;

    setDisplayedText(prev => ({ ...prev, [timestamp]: "" }));

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

    // Cleanup function
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [typingInterval]); // Dependency on typingInterval to clear previous

  // Scroll handling
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messagesEndRef]);

  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 30;
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom && messages.length > 2);
  }, [chatContainerRef, messages.length]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [chatContainerRef, handleScroll]);

  // Auto-scroll when new messages arrive and user is at the bottom
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages.length, isAtBottom, scrollToBottom]); // Trigger on message count change if at bottom

  // Speech synthesis
  const speakText = useCallback((text) => {
    if (isSpeaking) { // Stop previous before starting new
        window.speechSynthesis.cancel();
    }

    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) {
        console.warn("Skipping empty text for speech synthesis.");
        setIsSpeaking(false); // Ensure state is reset if text is empty
        return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.lang.startsWith('en') && voice.name.includes('Female') // More robust check
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true); // Set speaking true when it actually starts
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false); // Reset state on error
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSpeaking]); // Dependency on isSpeaking to cancel previous

  const stopSpeech = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      // onend handler should set isSpeaking to false
    }
  }, [isSpeaking]);

  // Stop all processing (typing, fetching, speaking)
  const stopAllProcessing = useCallback(() => {
    console.log("stopAllProcessing called in useChatUI");
    // Stop typing animation
    if (typingInterval) {
      clearInterval(typingInterval);
      setTypingInterval(null);
      // Ensure the last message text is fully displayed
      setDisplayedText((prev) => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.timestamp && prev[lastMessage.timestamp] !== lastMessage.content) {
          return { ...prev, [lastMessage.timestamp]: lastMessage.content };
        }
        return prev;
      });
    }

    // Stop speech
    stopSpeech();

    // Abort fetch (signal comes from useChatLogic via props)
    if (abortControllerRef?.current) {
        console.log("Aborting fetch request via ref...");
        abortControllerRef.current.abort();
    } else {
        console.log("No active abort controller ref passed to abort.");
    }

    // Note: isLoading and isProcessing states are managed by useChatLogic
    // This function primarily handles UI-related cancellations.

  }, [typingInterval, messages, stopSpeech, abortControllerRef]);


  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingInterval) clearInterval(typingInterval);
      stopSpeech(); // Stop speech on unmount too
    };
  }, [typingInterval, stopSpeech]);

  // Copy to clipboard utility (can remain in component or be moved to utils)
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Basic feedback - consider a toast library for better UX
      console.log("Copied to clipboard");
      // You might want to show a temporary visual cue here
    }).catch(err => {
      console.error("Failed to copy text: ", err);
    });
  };


  return {
    displayedText,
    setDisplayedText, // Expose if needed for direct manipulation (e.g., clearing on new chat)
    typeMessage,
    isSpeaking,
    speakText,
    stopSpeech,
    showScrollButton,
    isAtBottom,
    setIsAtBottom, // Expose if needed by parent
    scrollToBottom,
    lastMessageRef,
    isSidebarOpen,
    setIsSidebarOpen,
    showShareModal,
    setShowShareModal,
    stopAllProcessing,
    copyToClipboard,
  };
}
