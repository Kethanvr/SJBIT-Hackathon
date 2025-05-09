import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { requestNotificationPermission } from "../../utils/notificationUtils";

const HomeHeader = ({ onOpenSidebar, onOpenNotifications, coins = 0, onAddCoin }) => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  
  return (
    <div className="bg-white px-4 py-6 sticky top-0 z-10 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <FiPlus className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <h1 className="text-xl font-semibold">{t('headerTitle')}</h1>        <button
          type="button"
          onClick={() => {
            navigate('/account/notifications');
          }}
          className="relative"
          data-tooltip="notifications"
        >
          <IoNotificationsOutline className="w-6 h-6 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </div>
  );
};

export default HomeHeader;
