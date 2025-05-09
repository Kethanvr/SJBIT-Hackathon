import React from 'react';
import { useRef, useEffect } from "react";
import { HistoryItem, ScanItem } from "../../components/user/HistoryItem";
import EmptyStateComponent from "../../components/user/EmptyState";
import { useHistoryLogic } from "../../hooks/useHistoryLogic";
import { formatDate, getChatPreview, filterItems } from "../../utils/historyUtils";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiTrash2, FiX, FiImage, FiMessageSquare } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import { useTranslation } from "react-i18next";
import BottomNav from "../../components/common/BottomNav";
import { useProTheme } from "../../utils/useProTheme";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import FeedbackButton from "../../components/ui/FeedbackButton";

export default function History() {
  const horizontalScrollRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation('history');
  // Use custom hook for logic
  const {
    items,
    setItems,
    loading,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    user,
    processingAction,
    handleDeleteItem,
    showDeleteModal,
    itemToDelete,
    confirmDelete,
    cancelDelete
  } = useHistoryLogic(navigate, t);

  // Filtering logic using utility
  const filteredItems = filterItems(items, searchQuery, activeTab, getChatPreview, t);
  const filteredScans = items.filter(item => item.type === "scan" && filterItems([item], searchQuery, "scans", getChatPreview, t).length);
  const filteredChats = items.filter(item => item.type === "chat" && filterItems([item], searchQuery, "chats", getChatPreview, t).length);

  useEffect(() => {
    if (horizontalScrollRef.current) {
      const activeTabElement = document.querySelector(`.tab-${activeTab}`);
      if (activeTabElement) {
        horizontalScrollRef.current.scrollLeft = activeTabElement.offsetLeft - 16;
      }
    }
  }, [activeTab]);

  const viewScanDetails = async (scan) => {
    try {
      localStorage.setItem("currentScanId", scan.id);
      localStorage.setItem("currentScanData", JSON.stringify(scan.scan_data || {}));
      localStorage.setItem("currentScanName", scan.medicine_name || "Untitled Scan");
      localStorage.setItem("currentScanImage", scan.image_url || "");
      navigate(`/scan/${scan.id}`);
    } catch (error) {
      console.error("Error viewing scan details:", error);
    }
  };
  const continueChat = async (chat) => {
    try {
      localStorage.setItem("currentChatId", chat.id);
      localStorage.setItem("currentChatMessages", JSON.stringify(chat.messages || []));
      localStorage.setItem("currentChatTitle", chat.title || "Chat Session");
      navigate(`/chat?chatId=${chat.id}`);
    } catch (error) {
      console.error("Error continuing chat:", error);
    }
  };

  // Get theme support from our hook with safe fallback
  let proThemeProps = { isPro: false, theme: {} };
  try {
    // Safely use the theme hook
    const result = useProTheme();
    if (result) {
      proThemeProps = result;
    }
  } catch (error) {
    console.error('Error using ProTheme in History:', error);
    // Continue with defaults if the hook fails
  }
  
  const { isPro, theme } = proThemeProps;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate(-1)} 
              className={theme.navInactive}
              aria-label={t('backButtonLabel')}
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-xl font-semibold ${theme.title}`}>{t('title')}</h1>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t(`searchPlaceholder.${activeTab}`)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 ${isPro ? 'focus:ring-yellow-400' : 'focus:ring-blue-500'}`}
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div 
          ref={horizontalScrollRef}
          className="flex space-x-2 mt-4 overflow-x-auto py-1 scrollbar-hide"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`tab-all px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 ${
              activeTab === "all"
                ? `${isPro ? 'bg-gradient-to-tr from-yellow-300 to-yellow-500 text-yellow-900 border-2 border-yellow-400' : 'bg-blue-600 text-white'}`
                : `${isPro ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`
            }`}
          >
            {t('tabs.all')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("scans")}
            className={`tab-scans px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 ${
              activeTab === "scans"
                ? `${isPro ? 'bg-gradient-to-tr from-yellow-300 to-yellow-500 text-yellow-900 border-2 border-yellow-400' : 'bg-blue-600 text-white'}`
                : `${isPro ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`
            }`}
          >
            {t('tabs.scans')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chats")}
            className={`tab-chats px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 ${
              activeTab === "chats"
                ? `${isPro ? 'bg-gradient-to-tr from-yellow-300 to-yellow-500 text-yellow-900 border-2 border-yellow-400' : 'bg-blue-600 text-white'}`
                : `${isPro ? 'bg-yellow-50 text-yellow-700' : 'bg-gray-100 text-gray-600'}`
            }`}
          >
            {t('tabs.chats')}
          </button>
        </div>
      </div>      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isPro ? 'border-yellow-400' : 'border-blue-600'}`} aria-label={t('loading')} />
          </div>
        ) : (
          <>
            {activeTab === "all" && (
              filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteItem}
                    onAction={item.type === "scan" ? viewScanDetails : continueChat}
                    processingAction={processingAction}
                    t={t}
                  />
                ))              ) : (
                <EmptyStateComponent
                  title={t('emptyState.noItems.title')}
                  message={t('emptyState.noItems.message')}
                  icon={isPro ? <FiSearch className="w-8 h-8 text-yellow-500" /> : undefined}
                  actions={[
                    { to: "/scanner", label: t('emptyState.noItems.newScanButton') },
                    { to: "/chat", label: t('emptyState.noItems.newChatButton') },
                  ]}
                />
              )
            )}
            {activeTab === "scans" && (
              filteredScans.length > 0 ? (
                filteredScans.map((scan) => (
                  <ScanItem
                    key={scan.id}
                    scan={scan}
                    onDelete={handleDeleteItem}
                    onView={viewScanDetails}
                    processingAction={processingAction}
                    t={t}
                  />
                ))              ) : (
                <EmptyStateComponent
                  title={t('emptyState.noScans.title')}
                  message={t('emptyState.noScans.message')}
                  icon={isPro ? <FiImage className="w-8 h-8 text-yellow-500" /> : undefined}
                  actions={[
                    { to: "/scanner", label: t('emptyState.noScans.newScanButton') },
                  ]}
                />
              )
            )}
            {activeTab === "chats" && (
              filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <HistoryItem
                    key={chat.id}
                    item={chat}
                    onDelete={handleDeleteItem}
                    onAction={continueChat}
                    processingAction={processingAction}
                    t={t}
                  />
                ))              ) : (
                <EmptyStateComponent
                  title={t('emptyState.noChats.title')}
                  message={t('emptyState.noChats.message')}
                  icon={isPro ? <FiMessageSquare className="w-8 h-8 text-yellow-500" /> : undefined}
                  actions={[
                    { to: "/chat", label: t('emptyState.noChats.newChatButton') },
                  ]}
                />
              )
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.type === "scan" 
          ? (itemToDelete?.medicine_name || t('item.untitledScan')) 
          : (itemToDelete?.title || t('item.untitledChat'))}
        itemType={itemToDelete?.type === "scan" ? t('tabs.scans') : t('tabs.chats')}
        t={t}
      />

      {/* Feedback Button */}
      <FeedbackButton isFloating={true} />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}