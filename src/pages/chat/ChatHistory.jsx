import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTrash2, FiHome, FiUser, FiClock } from "react-icons/fi";
import { BsQrCodeScan } from "react-icons/bs";
import { supabase, getChatHistory, deleteChat } from "../../lib/supabase";
import { formatDate } from "../../utils/formatters";
import SearchInput from "../../components/common/SearchInput";
import ChatCard from "../../components/chat/ChatCard";
import EmptyState from "../../components/chat/EmptyState";
import { getChatPreview } from "../../utils/textUtils";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import { useTranslation } from "react-i18next";
import FeedbackButton from "../../components/ui/FeedbackButton";

export default function ChatHistory() {
  const { t } = useTranslation('chatHistory');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndChatHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        setUser(user);
        await fetchChatHistory(user.id);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndChatHistory();
  }, [navigate]);

  const fetchChatHistory = async (userId) => {
    try {
      // Fetch only chat metadata initially for performance
      const chatsData = await getChatHistory(userId); 
      setChats(chatsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (error) {
      console.error("Error fetching chat history:", error.message);
    }
  };
  const handleDeleteChat = async (chatId) => {
    const chatToRemove = chats.find(chat => chat.id === chatId);
    setChatToDelete(chatToRemove);
    setShowDeleteModal(true);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    try {
      await deleteChat(chatToDelete.id, user.id);
      setChats(chats.filter((chat) => chat.id !== chatToDelete.id));
      
      // If we deleted the currently active chat, also clear localStorage
      const currentChatId = localStorage.getItem("currentChatId");
      if (currentChatId === chatToDelete.id) {
        localStorage.removeItem("currentChatId");
        localStorage.removeItem("currentChatMessages");
        localStorage.removeItem("currentChatTitle");
      }    } catch (error) {
      console.error("Error deleting chat:", error.message);
      alert(t('deleteError'));
    } finally {
      setShowDeleteModal(false);
      setChatToDelete(null);
    }
  };

  const cancelDeleteChat = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  const continueChat = async (chat) => {
    try {
      // Store only essential info in localStorage
      localStorage.setItem("currentChatId", chat.id);
      localStorage.setItem("currentChatTitle", chat.title || "Chat Session");
      // Remove storing messages in localStorage
      // localStorage.setItem("currentChatMessages", JSON.stringify(chat.messages || []));
      
      // Navigate to chat - ChatBox will load messages based on ID
      navigate(`/chat?chatId=${chat.id}`);
    } catch (error) {
      console.error("Error continuing chat:", error);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    return searchTerms.every(term => 
      chat.title?.toLowerCase().includes(term) || 
      (chat.messages && getChatPreview(chat.messages).toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      {/* Fixed Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-600"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>          <h1 className="text-xl font-semibold">Chat History</h1>
        </div>
        <div className="mt-4">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder={t('searchPlaceholder')}
            className="w-full"
          />
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatCard
              key={chat.id}
              chat={chat}
              onContinue={continueChat}
              onDelete={handleDeleteChat}
              getChatPreview={getChatPreview}
              formatDate={formatDate}
            />
          ))
        ) : (
          <EmptyState />        )}
      </div>      {/* ... Bottom Navigation ... */}
      <FeedbackButton isFloating={true} />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteChat}
        onConfirm={confirmDeleteChat}
        itemName={chatToDelete?.title || t('chatItem.untitledChat')} 
        itemType={t('title')}
        t={t}
      />
    </div>
  );
}