import React from "react";
import { cn } from "../../utils/cn";
import { formatTime } from "../../utils/formatters"; // Import formatTime
import { FaCopy, FaVolumeUp } from "react-icons/fa";
import DOMPurify from "dompurify";
import { marked } from "marked";

// Function to format message content (moved from ChatBox)
const formatMessageContent = (message) => {
  if (!message || !message.content) return "<i>No response available.</i>";

  // Configure marked options
  marked.setOptions({
    breaks: true, // Enable line breaks
    gfm: true, // GitHub Flavored Markdown
    pedantic: false, // Be forgiving of non-conforming markdown
    smartLists: true, // Use smarter list behavior
    smartypants: true, // Use "smart" typographic punctuation
    headerIds: false, // Don't add ids to headers (for security)
  });

  // Convert markdown to HTML using marked
  let formattedContent = marked(message.content);

  return DOMPurify.sanitize(formattedContent, {
    ADD_ATTR: ["target", "rel", "style", "class"], // Allow style and class attributes
    ADD_TAGS: ["iframe", "img", "span"], // Allow iframes, images, and spans for highlighting
  });
};

const ChatMessage = React.forwardRef(
  (
    { message, displayedText, onCopy, onSpeak, isLast, typingMessageTimestamp },
    ref
  ) => {
    const timestamp = message.timestamp || Date.now();
    const isUser = message.role === "user";
    const isError = !isUser && message.isError; // Check if this is an error message
    const isTyping = !isUser && typingMessageTimestamp === timestamp;

    const handleImageClick = () => {
      if (message.imagePreview) {
        window.open(message.imagePreview, "_blank");
      }
    };
    return (
      <div
        ref={ref} // Forward the ref to the outer div
        className={cn(
          "flex w-full", // Ensure message takes full width container
          isUser ? "justify-end" : "justify-start",
          "mb-4",
          isUser ? "animate-slide-in-right" : "animate-slide-in-left" // Different animations based on sender
        )}
      >
        <div
          className={cn(
            "flex flex-col", // Stack content vertically
            "max-w-[88%] md:max-w-[75%]", // Wider on mobile for better readability
            isUser ? "items-end" : "items-start" // Align items based on user/assistant
          )}
        >
          <div
            className={cn(
              "rounded-2xl p-4 shadow-md", // Enhanced shadow for depth
              isUser
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-none" // Blue gradient for user messages
                : isError
                ? "bg-red-50 text-red-800 border border-red-200 rounded-bl-none" // Error styling
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm", // White for assistant
              "transform transition-all duration-200 hover:shadow-lg" // Add smooth transition effects
            )}
          >
            {isUser && message.imagePreview && (
              <img
                src={message.imagePreview}
                alt="Uploaded content"
                className="max-w-full h-auto max-h-48 rounded-lg mb-3 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={handleImageClick}
              />
            )}
            <div
              className="whitespace-pre-wrap text-base message-content break-words leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  !isUser && displayedText && displayedText[timestamp]
                    ? formatMessageContent({
                        content: displayedText[timestamp],
                        role: "assistant",
                      })
                    : formatMessageContent(message),
              }}
            />
            {/* Blinking cursor for the message currently being typed */}
            {isTyping && <span className="typing-cursor"></span>}

            {/* Timestamp - only show if not currently typing */}
            {!isTyping && (
              <span className="mt-2 block text-xs opacity-70 font-light">
                {formatTime(timestamp)}
              </span>
            )}
          </div>
          {/* Action buttons below the message bubble for assistant */}
          {!isUser && message.content && !isTyping && (
            <div className="mt-2 flex gap-2 pl-1">
              <button
                type="button"
                onClick={() => onCopy(message.content)}
                className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center"
                title="Copy to clipboard"
                aria-label="Copy message"
              >
                <FaCopy className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onSpeak(message.content)}
                className="text-gray-500 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center"
                title="Listen to this message"
                aria-label="Listen to message"
              >
                <FaVolumeUp className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage"; // Add display name

export default ChatMessage;
