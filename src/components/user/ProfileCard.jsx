import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useProTheme } from '../../utils/useProTheme';

/**
 * Component to display user profile information with avatar
 */
const ProfileCard = ({ profile, user }) => {
  const { t } = useTranslation("account");
  const { isPro, theme } = useProTheme();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img
              src={
                profile?.avatar_url ||
                `https://ui-avatars.com/api/?name=${
                  profile?.full_name || "User"
                }`
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {profile?.username ||
                user?.email?.split("@")[0] ||
                t("defaultUser")}
            </h2>            <Link
              to="/account/personal-info"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {t("viewProfile")}
            </Link>
          </div>
        </div>
      </div>      <Link
        to="/account/personal-info"
        className="block px-4 py-3 bg-gray-50 text-blue-600 hover:bg-gray-100 text-sm font-medium"
      >
        {t("editProfile")}
      </Link>
    </div>
  );
};

export default ProfileCard;
