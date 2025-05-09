import React, { useRef, useEffect, useState } from "react";
import { FiSend, FiSquare, FiVolumeX, FiX, FiPaperclip } from "react-icons/fi";
import { cn } from "../../utils/cn";
import OverlayModal from "../ui/OverlayModal";
import { useProfile } from "../../hooks/useProfile";
import { useProTheme } from "../../utils/useProTheme";

const ChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isProcessing,
  isSpeaking,
  stopSpeech,
  stopAllProcessing,
  imageBase64,
  imagePreviewUrl,
  selectedImageFile,
  handleImageChange,
  triggerImageInput,
  removeSelectedImage,
  inputRef,
  imageInputRef,
  isAtBottom,
  setIsAtBottom,
  isUploadingFile, // <-- Add this prop
}) => {
  const [uploadLimitInfo, setUploadLimitInfo] = useState(null);
  const [showLimitOverlay, setShowLimitOverlay] = useState(false);
  const { user } = useProfile();
  const { isPro } = useProTheme();
  const [fileUploadCount, setFileUploadCount] = useState(0);
  const [fileUploadLimitReached, setFileUploadLimitReached] = useState(false);

  // Add state for backend error
  const [backendError, setBackendError] = useState("");

  // Define conditional color classes based on isPro
  const colorClasses = {
    gold: "text-yellow-600",
    uploadingIcon: isPro ? "text-yellow-500" : "text-blue-500",
    uploadingText: isPro ? "text-yellow-600" : "text-blue-600",
    hoverIcon: isPro
      ? "hover:text-yellow-600 hover:bg-yellow-50"
      : "hover:text-blue-600 hover:bg-blue-50",
    button: isPro
      ? "bg-yellow-600 hover:bg-yellow-700"
      : "bg-blue-600 hover:bg-blue-700",
  };

  useEffect(() => {
    // Fetch upload limit info from backend
    async function fetchUploadLimitInfo() {
      if (user && user.id) {
        try {
          const res = await fetch(`/api/chat/upload-limit?userId=${user.id}`);
          if (!res.ok) return;
          const data = await res.json();
          setUploadLimitInfo(data);
          if (
            !data.pro_user &&
            data.file_upload_reset === new Date().toISOString().slice(0, 10) &&
            data.file_upload_count >= 3
          ) {
            setFileUploadLimitReached(true);
          } else {
            setFileUploadLimitReached(false);
          }
          setFileUploadCount(data.file_upload_count || 0);
        } catch (err) {
          setUploadLimitInfo(null);
        }
      }
    }
    fetchUploadLimitInfo();
  }, [user]);

  // Listen for backend error from parent (via props or global event)
  useEffect(() => {
    // Listen for a custom event dispatched from useChatBoxLogic on 403 error
    function handleBackendErrorEvent(e) {
      if (e.detail && e.detail.type === "file-upload-limit") {
        setBackendError(
          e.detail.message ||
            "You have reached your daily file upload limit. Please upgrade to MediScan Gold for unlimited uploads, or try again after 24 hours."
        );
        setShowLimitOverlay(true);
      }
    }
    window.addEventListener("chat-backend-error", handleBackendErrorEvent);
    return () =>
      window.removeEventListener("chat-backend-error", handleBackendErrorEvent);
  }, []);

  return (
    <>
      {showLimitOverlay && (
        <OverlayModal onClose={() => setShowLimitOverlay(false)}>
          <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center">
            <div className="text-3xl mb-2 text-yellow-500">⚠️</div>
            <h2 className="text-lg font-bold mb-2 text-gray-800">
              Limit Reached
            </h2>
            <p className="text-gray-700 text-center mb-4">
              {backendError ||
                "You have reached your daily file upload limit. Please upgrade to "}
              <span className={colorClasses.gold}>MediScan Gold</span> for
              unlimited uploads, or try again after 24 hours.
            </p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
              onClick={() => setShowLimitOverlay(false)}
            >
              Close
            </button>
          </div>
        </OverlayModal>
      )}{" "}
      <footer className="sticky bottom-0 border-t border-gray-200 bg-white p-2 sm:p-3 md:p-4 shadow-md">
        {/* Upload limit info banner */}
        {uploadLimitInfo && (
          <div className="mb-2 px-3 py-2 rounded-lg bg-yellow-50 text-yellow-800 text-sm font-medium border border-yellow-200 text-center">
            You have {uploadLimitInfo.remaining}/3 uploads remaining for today.
          </div>
        )}
        {/* Image Preview Area */}
        {imagePreviewUrl && (
          <div className="mb-2 p-2 sm:p-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between relative">
            {/* Upload animation overlay */}
            {isUploadingFile && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 rounded-xl">
                <div className="flex flex-col items-center">
                  <svg
                    className={`animate-spin h-8 w-8 ${colorClasses.uploadingIcon} mb-2`}
                    viewBox="0 0 24 24"
                    title="Loading spinner"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  <span className="text-sm text-blue-600 font-medium animate-pulse">
                    Uploading...
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={imagePreviewUrl}
                alt="Preview"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
              />
              <span className="text-sm text-gray-600 truncate max-w-[150px] sm:max-w-[200px]">
                {selectedImageFile?.name}
              </span>
            </div>
            <button
              type="button"
              onClick={removeSelectedImage}
              className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
              title="Remove image"
            >
              <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        )}{" "}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Stop button for AI answer */}
          {isProcessing && (
            <button
              type="button"
              onClick={stopAllProcessing}
              className="rounded-full bg-red-500 p-2.5 sm:p-3 text-white transition-colors hover:bg-red-600 shadow-sm animate-pulse flex-shrink-0"
              title="Stop AI response"
            >
              <FiSquare className="h-5 w-5" />
            </button>
          )}
          {/* Hidden file input */}
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />{" "}
          {/* Attach Image Button */}
          <button
            type="button"
            onClick={triggerImageInput}
            className={`p-2.5 sm:p-3 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0 ${
              fileUploadLimitReached
                ? "opacity-50 cursor-not-allowed"
                : "transform hover:scale-105"
            }`}
            title={
              fileUploadLimitReached
                ? "Daily upload limit reached"
                : "Attach image"
            }
            disabled={isProcessing || fileUploadLimitReached}
            aria-label="Attach image"
          >
            <FiPaperclip className="h-5 w-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={imageBase64 ? "Add a caption..." : "Ask Doc..."}
            className="flex-1 min-w-0 rounded-xl border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            onFocus={() => setIsAtBottom(true)} // Keep this for scroll behavior
            disabled={isProcessing}
          />
          {isSpeaking ? (
            <button
              type="button"
              onClick={stopSpeech}
              className="rounded-full bg-red-500 p-2.5 sm:p-3 text-white transition-colors hover:bg-red-600 shadow-sm flex-shrink-0"
              aria-label="Stop speaking"
            >
              <FiVolumeX className="h-5 w-5" />
            </button>
          ) : isProcessing ? (
            <button
              type="button"
              onClick={stopAllProcessing}
              className="rounded-full bg-red-500 p-2.5 sm:p-3 text-white transition-colors hover:bg-red-600 shadow-sm animate-pulse flex-shrink-0"
              title="Stop generating"
              aria-label="Stop generating"
            >
              <FiSquare className="h-5 w-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={(!newMessage.trim() && !imageBase64) || isProcessing}
              className={cn(
                "rounded-full p-2.5 sm:p-3 text-white shadow-sm transition-all flex-shrink-0",
                (newMessage.trim() || imageBase64) && !isProcessing
                  ? "bg-blue-600 hover:bg-blue-700 transform hover:scale-105"
                  : "bg-gray-400 cursor-not-allowed opacity-70"
              )}
              aria-label="Send message"
            >
              <FiSend className="h-5 w-5" />
            </button>
          )}
        </form>
      </footer>
      {fileUploadLimitReached && (
        <div className="mb-2 px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-medium border border-red-200 text-center">
          You have reached your daily file upload limit. Please upgrade to{" "}
          <span className="font-semibold text-blue-600">MediScan Gold</span> for
          unlimited uploads, or try again after 24 hours.
        </div>
      )}
    </>
  );
};

export default ChatInput;
