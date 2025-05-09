import React, { useState, useEffect } from 'react';
import { FiCopy, FiTwitter, FiMail, FiX } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { makeShareable } from '../../lib/supabase/chats';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { toast } from '../../utils/toast.jsx'; // Import toast

const ShareModal = ({ isOpen, onClose, chatId }) => {
  const { user } = useAuth();
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkShareStatus = async () => {
      if (!chatId) return;
      try {
        const { data, error } = await supabase
          .from("chats")
          .select("is_shared")
          .eq("id", chatId)
          .single();
        
        if (error) throw error;
        setIsShared(data.is_shared || false);
      } catch (err) {
        console.error("Error checking share status:", err);
        setError("Failed to check share status");
      }
    };

    if (isOpen) {
      checkShareStatus();
    }
  }, [isOpen, chatId]);

  if (!isOpen || !chatId) return null;

  const chatUrl = `${window.location.origin}/chat?chatId=${chatId}`;

  const handleMakeShareable = async () => {
    try {
      setError(null);
      setIsLoading(true);      await makeShareable(chatId, user?.id);
      setIsShared(true);
      toast("Chat is now shareable with others!", {
        type: "success",
        duration: 3000
      });
    } catch (err) {
      console.error("Error making chat shareable:", err);
      setError("Failed to make chat shareable. Please try again.");
      toast("Failed to make chat shareable", {
        type: "error",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = async () => {
    if (!isShared) {
      await handleMakeShareable();
    }
    navigator.clipboard.writeText(chatUrl)
      .then(() => {
        toast("Link copied to clipboard!", {
          type: "success",
          duration: 3000
        });
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
        setError("Failed to copy link to clipboard");
        toast("Failed to copy link to clipboard", {
          type: "error",
          duration: 3000
        });
      });
  };

  const shareViaWhatsApp = () => {
    if (!isShared) return;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this MediScan chat: ${chatUrl}`)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareViaTwitter = () => {
    if (!isShared) return;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this MediScan chat: ${chatUrl}`)}`;
    window.open(twitterUrl, '_blank');
  };

  const shareViaEmail = () => {
    if (!isShared) return;
    const emailUrl = `mailto:?subject=${encodeURIComponent('Check out this MediScan chat')}&body=${encodeURIComponent(`I wanted to share this chat with you: ${chatUrl}`)}`;
    window.open(emailUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl max-w-sm w-full shadow-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-white">Share Chat</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        {!isShared && (
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
            <p className="mb-2">Make this chat viewable by others. Anyone with the link will be able to see and continue this conversation.</p>
            <button 
              onClick={handleMakeShareable} 
              disabled={isLoading}
              className="mt-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? "Making shareable..." : "Make Shareable"}
            </button>
          </div>
        )}

        {isShared && (
          <>
            <div className="mb-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm break-all dark:text-gray-200 mb-2">
                {chatUrl}
              </div>
              <button
                type="button"
                onClick={copyLink}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FiCopy className="mr-2" /> Copy Link
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={shareViaWhatsApp}
                className="flex flex-col items-center justify-center p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <FaWhatsapp className="text-xl mb-1" />
                <span className="text-xs">WhatsApp</span>
              </button>

              <button
                onClick={shareViaTwitter}
                className="flex flex-col items-center justify-center p-3 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                <FiTwitter className="text-xl mb-1" />
                <span className="text-xs">Twitter</span>
              </button>

              <button
                onClick={shareViaEmail}
                className="flex flex-col items-center justify-center p-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <FiMail className="text-xl mb-1" />
                <span className="text-xs">Email</span>
              </button>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
