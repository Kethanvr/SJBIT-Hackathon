import React from "react";
import { useNavigate } from "react-router-dom";
import { FiMessageSquare } from "react-icons/fi";
import { useTranslation } from "react-i18next";

/**
 * Component for the Chat access card on the account page
 */
const ChatCard = () => {
  const { t } = useTranslation("account");
  const navigate = useNavigate();
  
  const handleNewChat = () => {
    // Clear any existing chat data from localStorage
    localStorage.removeItem("currentChatId");
    localStorage.removeItem("currentChatMessages");
    localStorage.removeItem("currentChatTitle");
    // Navigate to chat without any chatId parameter to start fresh
    navigate("/chat", { replace: true });
  };

  return (
    <button
      onClick={handleNewChat}
      className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition text-left"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <FiMessageSquare className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-medium">{t("chatTitle")}</h3>
          <p className="text-sm text-gray-500">
            {t("chatDescription")}
          </p>
        </div>      </div>
    </button>
  );
};

export default ChatCard;
