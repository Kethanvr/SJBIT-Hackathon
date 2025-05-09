import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FiShield,
  FiHeart,
  FiCreditCard,
  FiBell,
  FiMessageCircle,
  FiInfo,
  FiUser,
  FiGlobe,
} from "react-icons/fi";
import FeedbackButton from "../../components/ui/FeedbackButton";
import { useProTheme } from '../../utils/useProTheme';

/**
 * Component for the settings menu section on the account page
 */
const SettingsMenu = ({ hidePro = false }) => {
  const { t } = useTranslation("account");
  const { isPro } = useProTheme();

  // Define menu items for better maintainability
  const menuItems = [
    {
      id: "security",
      icon: <FiShield className="w-6 h-6 text-gray-400" />,
      label: t("security"),
      to: "/account/security",
    },
    {
      id: "health",
      icon: <FiHeart className="w-6 h-6 text-gray-400" />,
      label: t("healthManagement"),
      to: "/health/coming-soon?feature=health-management",
    },
    // Only show payments if hidePro is false
    ...(!hidePro ? [{
      id: "payments",
      icon: <FiCreditCard className="w-6 h-6 text-gray-400" />,
      label: t("payments"),
      to: "/account/payments",
    }] : []),
    {
      id: "notifications",
      icon: <FiBell className="w-6 h-6 text-gray-400" />,
      label: t("notifications"),
      to: "/account/notifications",
    },
    {
      id: "language",
      icon: <FiGlobe className="w-6 h-6 text-gray-400" />,
      label: t("language"),
      to: "/account/language",
    },
    {
      id: "about",
      icon: <FiInfo className="w-6 h-6 text-gray-400" />,
      label: t("aboutCreators"),
      to: "/about-creators",
    },
  ];

  return (
    <>
      <div className="p-4 border-b">
        <h3 className="font-medium">{t("settingsSubtitle")}</h3>
      </div>
      <div className="divide-y">
        {/* Map through menu items */}
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <FiUser className="w-5 h-5 text-gray-400" />
          </Link>
        ))}

        {/* Feedback section with button */}
        <div className="flex items-center justify-between p-4 hover:bg-gray-50">
          <div className="flex items-center space-x-3">
            <FiMessageCircle className="w-6 h-6 text-gray-400" />
            <span>{t("feedback")}</span>
          </div>
          <FeedbackButton
            variant="ghost"
            className={isPro ? "text-yellow-700" : "text-blue-600"}
            label={t("shareFeedback")}
          />
        </div>
      </div>
    </>
  );
};

export default SettingsMenu;
