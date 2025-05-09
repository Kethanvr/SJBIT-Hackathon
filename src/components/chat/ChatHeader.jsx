import React from "react";
import Button from "../ui/Button";
import { FiMenu, FiX, FiShare2, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ChatHeader({
  chatTitle,
  onOpenSidebar,
  onNewChat,
  onShareChat,
  chatId,
}) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="mr-2 md:hidden hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiMenu className="h-5 w-5 text-gray-600" />
        </Button>
        <h2 className="font-medium text-gray-800 truncate max-w-[200px] sm:max-w-xs text-lg">
          {chatTitle || "New Chat"}
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        {chatId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onShareChat}
            aria-label="Share chat"
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <FiShare2 className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          aria-label="New chat"
          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <FiPlusCircle className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          aria-label="Close chat"
          className="text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
        >
          <FiX className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
