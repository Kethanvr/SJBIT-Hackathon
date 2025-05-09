import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAccountLogic } from "../../hooks/useAccountLogic";
import { useIsAdmin } from "../../hooks/useIsAdmin";
import { FiArrowLeft } from "react-icons/fi";

// Import UI components
import ProfileCard from "../../components/user/ProfileCard";
import ChatCard from "../../components/user/ChatCard";
import SettingsMenu from "../../components/user/SettingsMenu";
import DataManagementSection from "../../components/user/DataManagementSection";
import AdminSection from "../../components/user/AdminSection";
import LogoutButton from "../../components/user/LogoutButton";
import FeedbackButton from "../../components/ui/FeedbackButton";

export default function Account() {
  const { t } = useTranslation("account");
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const {
    loading,
    user,
    profile,
    chatHistory,
    handleLogout,
    handleDeleteAllData,
    refreshProfile,
  } = useAccountLogic();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-sm flex items-center">
        <button
          type="button"
          className="mr-3 text-gray-600 hover:text-gray-900"
          onClick={() => window.history.back()}
          aria-label={t("back")}
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">{t("title")}</h1>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Account Settings Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {t("settings")}
          </h2>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Profile Section */}
            <ProfileCard profile={profile} user={user} />

            {/* Chat Section */}
            <ChatCard />

            {/* Settings Section */}
            <SettingsMenu hidePro={true} />

            {/* Admin: Send Notification Option */}
            {!adminLoading && isAdmin && <AdminSection />}

            {/* Data Management Section */}
            <DataManagementSection
              onDeleteAllData={handleDeleteAllData}
            />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="container mx-auto px-4 py-4">
        <LogoutButton onLogout={handleLogout} loading={loading} />
      </div>

      {/* Bottom spacing for mobile */}
      <div className="h-24" />

      {/* Feedback Button */}
      <FeedbackButton isFloating={true} />
    </div>
  );
}
