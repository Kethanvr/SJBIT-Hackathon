import React, { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Import components
import Sidebar from "../components/Sidebar";
import Notifications from "../components/Notifications";
import { UpdatesOverlay } from "../components/UpdatesOverlay";
import FeedbackButton from "../components/ui/FeedbackButton";
import WelcomeScreen from "../components/auth/WelcomeScreen";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { withErrorBoundary } from "../components/ui/ErrorBoundary";
import ToolTipsGuide from "../components/onboarding/ToolTipsGuide";

// Import home page components
import HomeHeader from "../components/home/HomeHeader";
import QuickActionsCard from "../components/home/QuickActionsCard";
import RecommendationsSection from "../components/home/RecommendationsSection";
import HealthInsuranceCard from "../components/home/HealthInsuranceCard";

import LoggedOutView from "../components/home/LoggedOutView";

// Import custom hook for logic
import { useHomePageLogic } from "../hooks/useHomePageLogic";
import { ROUTES } from "../utils/constants";

function Home() {
  // Get the translation function and i18n instance
  const { t, i18n } = useTranslation("home");

  // Check if translations are ready for the home namespace
  const ready =
    i18n.isInitialized && i18n.hasResourceBundle(i18n.language, "home");

  // Use our custom hook for page logic
  const {
    session,
    isSidebarOpen,
    setIsSidebarOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    showUpdatesOverlay,
    showWelcome,
    handleWelcomeComplete,
    handleCloseUpdatesOverlay,
    handleNewChat,
  } = useHomePageLogic();

  // State for ProUser modal and code redemption
  if (session) {
    return (
      <div className="relative min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Render Updates Overlay */}
        <UpdatesOverlay
          isOpen={showUpdatesOverlay}
          onClose={handleCloseUpdatesOverlay}
        />

        <AnimatePresence>
          {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
        </AnimatePresence>

        {!showWelcome && (
          <>
            {/* Header - Using the new HomeHeader component */}
            <HomeHeader
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
            />            {/* Main Content */}
            <div className="h-screen overflow-y-auto pb-4">
              <div className="p-4">
                {/* Quick Actions Card - Using the new component */}
                <QuickActionsCard />
                
                {/* Recommendations Section - Using the new component */}
                <RecommendationsSection onStartNewChat={handleNewChat} />

                {/* Health Insurance Card */}
                <div className="mt-3">
                  <HealthInsuranceCard />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // If translations aren't ready yet, show loading
  if (!ready && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading..." />
      </div>
    );
  }

  // Logged out view - Using the new LoggedOutView component
  return <LoggedOutView />;
}

export default withErrorBoundary(Home, {
  errorKey: "home-page",
});
