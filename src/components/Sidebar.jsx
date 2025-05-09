import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiPlus, FiX, FiClock, FiBell } from "react-icons/fi";
import { requestNotificationPermission } from "../utils/notificationUtils";
import { supabase, getChatHistory } from "../lib/supabase";
import FeedbackButton from "./ui/FeedbackButton";
import { formatDate } from "../utils/formatters";
import Notifications from "./Notifications";
import { getUnreadNotificationsCount } from "../lib/supabase/notifications";

export default function Sidebar({ isOpen, onClose }) {
  const [chatHistory, setChatHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation("sidebar");

  useEffect(() => {
    const fetchUserAndChatHistory = async () => {
      try {
        // Get the authenticated user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth"); // Redirect to login if user is not authenticated
          return;
        }

        setUser(user);
        await fetchChatHistory(user.id);
      } catch (error) {
        console.error("Error fetching user or chat history:", error.message);
        navigate("/auth");
      }
    };

    fetchUserAndChatHistory();
  }, [navigate]);

  useEffect(() => {
    const fetchUnread = async () => {
      if (user) {
        try {
          const count = await getUnreadNotificationsCount(user.id);
          setUnreadCount(count);
        } catch (e) {
          setUnreadCount(0);
        }
      }
    };
    fetchUnread();
  }, [user, showNotifications]);

  const fetchChatHistory = async (userId) => {
    try {
      const chats = await getChatHistory(userId);
      // Show as many as possible (let's use 10 for a tall sidebar, or all if you want)
      setChatHistory(chats.slice(0, 10));
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
      setChatHistory([]);
    }
  };

  const handleNewChat = () => {
    // Clear localStorage chat data when starting a new chat
    localStorage.removeItem("currentChatId");
    localStorage.removeItem("currentChatMessages");
    localStorage.removeItem("currentChatTitle");
    navigate("/chat");
    onClose();
  };

  const handleChatHistory = () => {
    navigate("/chat/history"); // Navigate to dedicated chat history page
    onClose();
  };

  const handleScanHistory = () => {
    navigate("/history"); // Redirect to the scan history page
    onClose();
  };

  const handleChatClick = async (chatId, title = "") => {
    try {
      // First, fetch the complete chat data to ensure we have the full conversation
      const { data: chatData, error } = await supabase
        .from("chats")
        .select("*")
        .eq("id", chatId)
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      if (chatData) {
        // Store chat data in localStorage for state persistence
        localStorage.setItem("currentChatId", chatData.id);
        localStorage.setItem(
          "currentChatMessages",
          JSON.stringify(chatData.messages || [])
        );
        localStorage.setItem(
          "currentChatTitle",
          chatData.title || "Chat Session"
        );

        // Navigate to the chat with chatId in URL
        navigate(`/chat?chatId=${chatId}`);
        onClose();
      }

      // Hide bottom nav if present
      const bottomNav = document.querySelector(".bottom-nav");
      if (bottomNav) {
        bottomNav.style.display = "none";
      }
    } catch (error) {
      console.error("Error navigating to chat:", error.message);
    }
  };

  // Get user display name for the account section
  const userName = user
    ? user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
    : "User";

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={0}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {" "}
              <Link to="/" onClick={onClose}>
                <img
                  src="/Mediscan.png"
                  alt="MediScan"
                  className="w-8 h-8 object-contain"
                />
              </Link>
              <Link to="/" onClick={onClose}>
                <span className="font-semibold text-gray-800">MediScan</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              {/* Notification Bell */}{" "}
              <button
                type="button"
                className="relative p-2 hover:bg-gray-100 rounded-full"
                onClick={() => {
                  navigate("/account/notifications");
                  onClose();
                }}
                aria-label="Notifications"
              >
                <FiBell className="w-5 h-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            type="button"
            onClick={handleNewChat}
            className={`w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg transition`}
          >
            <FiPlus className="text-white" />
            <span>{t("actions.newChat")}</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase">
              {t("labels.recentChats")}
            </h3>
          </div>
          {/* Display recent chat history */}
          <div className="px-4 space-y-2">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id, chat.title)}
                  className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-800 truncate">
                    {chat.title || t("chat.untitledChat")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDate(chat.created_at)}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                {t("labels.noRecentChats")}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 pt-2 border-t">
          {/* View Full History Button */}
          <button
            type="button"
            onClick={handleChatHistory}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition mb-4"
          >
            <FiClock className="text-gray-600" />
            <span>{t("actions.viewFullHistory")}</span>
          </button>
          {/* Feedback Button */}
          <div className="mb-4">
            <FeedbackButton
              variant="outline"
              size="md"
              label="Share Feedback"
              className={`w-full justify-center`}
            />
          </div>
          <Link
            to="/account/payments"
            onClick={onClose}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm">{userName}</span>
          </Link>
        </div>

        {/* Notifications Panel */}
        <Notifications
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />
      </div>
    </>
  );
}
