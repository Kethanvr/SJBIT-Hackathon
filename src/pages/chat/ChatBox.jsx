import React from "react";
import Sidebar from "../../components/Sidebar";
import { cn } from "../../utils/cn";
import ShareModal from "../../components/chat/ShareModal";
import ChatMessage from "../../components/chat/ChatMessage";
import ChatInput from "../../components/chat/ChatInput";
import ChatHeader from "../../components/chat/ChatHeader";
import LoadingIndicator from "../../components/chat/LoadingIndicator";
import ScrollToBottomButton from "../../components/chat/ScrollToBottomButton";
import { useChatBoxLogic } from "../../hooks/useChatBoxLogic";
import { useProTheme } from "../../utils/useProTheme";
import FeedbackButton from "../../components/ui/FeedbackButton";

export default function ChatBox() {
  const logic = useChatBoxLogic();
  const { isPro } = useProTheme();
  const userName = logic.user
    ? logic.user.user_metadata?.full_name || logic.user.email.split("@")[0]
    : "User";

  const welcomeTextGradient = isPro
    ? "bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent text-2xl font-bold"
    : "bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent text-2xl font-bold";

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        isOpen={logic.isSidebarOpen}
        onClose={() => logic.setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col w-full">
        <ChatHeader
          chatTitle={logic.chatTitle}
          onOpenSidebar={() => logic.setIsSidebarOpen(true)}
          onNewChat={logic.handleNewChat}
          onShareChat={() => logic.setShowShareModal(true)}
          chatId={logic.chatId}
        />
        <main
          ref={logic.chatContainerRef}
          className={cn(
            "flex-1 overflow-y-auto p-3 space-y-5 md:p-6 overflow-x-hidden",
            "[overscroll-behavior-y:contain] [-webkit-overflow-scrolling:touch]",
            "bg-gray-50"
          )}
        >
          {logic.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm shadow-lg max-w-[90%] mt-8 animate-fade-in border border-blue-200">
                <p className={welcomeTextGradient}>Hello, {userName} 👋</p>
                <p className="mt-4 text-gray-700 text-lg font-medium">
                  How can I help you today?
                </p>
                <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2">
                  {[
                    "I have a cold",
                    "I have a fever",
                    "I have a headache",
                    "I have stomach pain",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        logic.setNewMessage(suggestion);
                        setTimeout(
                          () => logic.handleSendMessage(new Event("click")),
                          100
                        );
                      }}
                      className="px-5 py-4 text-left text-base rounded-xl bg-white hover:bg-blue-50 border border-blue-200 shadow-sm transition-all transform hover:scale-[1.02] hover:shadow-md hover:border-blue-300 text-gray-700 font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {logic.messages.map((message, index) => (
                <ChatMessage
                  key={`${index}-${message.id || message.timestamp}`}
                  ref={
                    index === logic.messages.length - 1
                      ? logic.lastMessageRef
                      : null
                  }
                  message={message}
                  displayedText={logic.displayedText}
                  onSpeak={logic.speakText}
                  isLast={index === logic.messages.length - 1}
                  typingMessageTimestamp={logic.typingMessageTimestamp}
                />
              ))}
              {/* Only show loading indicator when we're waiting for a response and not during typing animation */}
              {logic.isLoading && !logic.typingMessageTimestamp && (
                <LoadingIndicator />
              )}
            </>
          )}
          <div ref={logic.messagesEndRef} className="h-[70px]" />
        </main>
        {logic.showScrollButton && (
          <ScrollToBottomButton onClick={logic.scrollToBottom} />
        )}
        <ChatInput
          newMessage={logic.newMessage}
          setNewMessage={logic.setNewMessage}
          handleSendMessage={logic.handleSendMessage}
          isProcessing={logic.isProcessing}
          isSpeaking={logic.isSpeaking}
          stopSpeech={logic.stopSpeech}
          stopAllProcessing={logic.stopAllProcessing}
          imageBase64={logic.imageBase64}
          imagePreviewUrl={logic.imagePreviewUrl}
          selectedImageFile={logic.selectedImageFile}
          handleImageChange={logic.handleImageChange}
          triggerImageInput={logic.triggerImageInput}
          removeSelectedImage={logic.removeSelectedImage}
          inputRef={logic.inputRef}
          imageInputRef={logic.imageInputRef}
          isAtBottom={logic.isAtBottom}
          setIsAtBottom={logic.setIsAtBottom}
          isUploadingFile={logic.isUploadingFile}
        />
        <ShareModal
          isOpen={logic.showShareModal}
          onClose={() => logic.setShowShareModal(false)}
          chatId={logic.chatId}
        />        {/* <FeedbackButton isFloating={true} /> */}
        <style jsx="true">{`
          /* Fix for iOS Safari 100vh issue */
          @supports (-webkit-touch-callout: none) {
            .h-screen {
              height: -webkit-fill-available;
            }
          }

          /* Improve message content styling */
          .message-content {
            line-height: 1.6;
            font-size: 0.95rem;
          }

          /* Fix message content overflow */
          .message-content img,
          .message-content pre,
          .message-content code {
            max-width: 100%;
            overflow-x: auto;
            border-radius: 6px;
          }

          /* Enhance list styling */
          .message-content ul {
            list-style-type: disc;
            margin-left: 1.5em;
            margin-bottom: 0.5em;
          }

          .message-content ol {
            list-style-type: decimal;
            margin-left: 1.5em;
            margin-bottom: 0.5em;
          }

          .message-content li {
            margin-bottom: 0.25em;
          }

          /* Style for blockquotes */
          .message-content blockquote {
            border-left: 3px solid #3b82f6;
            padding: 0.5em 1em;
            margin: 0.7em 0;
            color: #4b5563;
            background-color: #f3f4f6;
            border-radius: 0 6px 6px 0;
          }

          /* Style for code blocks */
          .message-content pre {
            background-color: #f8fafc;
            padding: 0.85em;
            border-radius: 0.5em;
            margin: 0.7em 0;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          }

          .message-content code {
            background-color: #f1f5f9;
            padding: 0.2em 0.4em;
            border-radius: 0.25em;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
              "Liberation Mono", "Courier New", monospace;
            font-size: 0.9em;
            color: #3b82f6;
          }

          /* Style for headings */
          .message-content h1,
          .message-content h2,
          .message-content h3,
          .message-content h4 {
            margin-top: 1em;
            margin-bottom: 0.5em;
            font-weight: 600;
            color: #1e3a8a;
          }

          /* Style for emphasis and strong */
          .message-content em {
            font-style: italic;
          }

          .message-content strong {
            font-weight: 600;
            color: #1e40af;
          }

          /* Links in message content */
          .message-content a {
            color: #2563eb;
            text-decoration: underline;
            transition: color 0.2s ease;
          }

          .message-content a:hover {
            color: #1d4ed8;
          }

          /* Animation classes */
          .animate-bounce-subtle {
            animation: bounce-subtle 2s infinite;
          }
          @keyframes bounce-subtle {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-in-out;
          }
          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.4s
              cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes slide-in-right {
            from {
              transform: translateX(15px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in-left {
            animation: slide-in-left 0.4s
              cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes slide-in-left {
            from {
              transform: translateX(-15px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          /* Blinking cursor animation */
          .typing-cursor {
            display: inline-block;
            width: 4px; /* Thinner cursor for a more modern look */
            height: 1.2em; /* Match line height */
            background-color: currentColor; /* Use text color */
            margin-left: 2px; /* Space from text */
            animation: blink 0.8s step-end infinite;
            vertical-align: text-bottom; /* Align with text */
            border-radius: 1px;
          }

          @keyframes blink {
            from,
            to {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
          }

          /* Better user interaction feedback */
          button:active:not(:disabled) {
            transform: scale(0.97);
          }

          /* Mobile enhancements */
          @media (max-width: 640px) {
            .message-content {
              font-size: 0.925rem;
            }

            /* Add smooth scrolling specifically for mobile */
            main {
              scroll-behavior: smooth;
              -webkit-overflow-scrolling: touch;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
