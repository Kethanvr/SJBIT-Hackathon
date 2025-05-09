import React from 'react';
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { useNotificationSettings } from "../../hooks/useNotificationSettings";
import { notificationItems } from "../../utils/notificationUtils";
import NotificationToggleCard from "../../components/user/NotificationToggleCard";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBell, FiCheck } from "react-icons/fi";
import { useProTheme } from "../../utils/useProTheme";

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, handleToggle, saved } = useNotificationSettings(user);
  
  // Get theme support from our hook with safe fallback
  let proThemeProps = { isPro: false, theme: {} };
  try {
    // Safely use the theme hook
    const result = useProTheme();
    if (result) {
      proThemeProps = result;
    }
  } catch (error) {
    console.error('Error using ProTheme in Notifications:', error);
    // Continue with defaults if the hook fails
  }
  
  const { isPro, theme } = proThemeProps;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header with improved styling */}
      <div className={`px-4 py-4 shadow-sm sticky top-0 z-10 ${isPro ? "bg-gradient-to-tr from-yellow-50 to-white border-b border-yellow-200" : "bg-white border-b"}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">            <button 
              onClick={() => navigate(-1)}
              className={isPro ? theme.navInactive : "text-gray-600 hover:text-gray-900"}
            >
              <FiArrowLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-xl font-semibold ${isPro ? 'text-yellow-900' : ''}`}>Notifications</h1>
          </div>
          {/* Saved indicator */}
          {saved && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center ${isPro ? "text-yellow-600" : "text-green-600"} text-sm font-medium`}
            >
              <FiCheck className="mr-1" /> Settings saved
            </motion.div>
          )}
        </div>
      </div>      <div className="px-4 py-8 max-w-4xl mx-auto">
        {/* Hero section with animation */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`mb-10 ${isPro ? "bg-gradient-to-tr from-yellow-100 to-yellow-200 border border-yellow-200" : "bg-white"} p-6 rounded-xl shadow-sm`}
        >
          <div className={`w-16 h-16 ${isPro ? "bg-yellow-100 text-yellow-500" : "bg-blue-100 text-blue-600"} rounded-full flex items-center justify-center mb-5`}>
            <FiBell className="w-8 h-8" />
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${isPro ? "text-yellow-900" : "text-gray-800"}`}>Stay in the loop</h2>
          <p className={`${isPro ? "text-yellow-800" : "text-gray-600"} text-lg`}>
            Choose what you want to be notified about to personalize your experience
          </p>
        </motion.div>        <div className="space-y-4">
          {notificationItems.map((item, index) => (
            <NotificationToggleCard
              key={item.key}
              item={item}
              checked={notifications[item.key]}
              onToggle={() => handleToggle(item.key)}
              index={index}
            />
          ))}
        </div>
        <div className={`mt-10 text-center ${isPro ? "text-yellow-600" : "text-gray-500"} text-sm`}>
          <p>You can change these settings anytime</p>
        </div>
      </div>
    </motion.div>
  );
}
