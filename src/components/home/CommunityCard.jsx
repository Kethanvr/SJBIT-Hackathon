import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; 
import { FiUsers, FiArrowRight } from "react-icons/fi";
import { useProTheme } from "../../utils/useProTheme";

// Rest of the component code...

const CommunityCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { isPro } = useProTheme();
  const [isUploading, setIsUploading] = useState(false);

  const handleViewCommunity = () => {
    navigate("/community");
  };

  const handleCreatePost = () => {
    navigate("/community/create");
  };

  return (
    <div
      onClick={handleViewCommunity}
      className={`p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isPro
          ? "bg-gradient-to-br from-blue-400 to-blue-600"
          : "bg-gradient-to-br from-cyan-500 to-cyan-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <FiUsers
              className={`w-8 h-8 ${isPro ? "text-blue-900" : "text-white"}`}
            />
            <h3
              className={`text-xl sm:text-2xl font-bold ${
                isPro ? "text-blue-900" : "text-white"
              }`}
            >
              {t("community.title", "Community")}
            </h3>
          </div>
          <p
            className={`text-base sm:text-lg mt-2 sm:mt-3 ${
              isPro ? "text-blue-900" : "text-white/90"
            }`}
          >
            {t("community.description", "Share your health journey and connect with others")}
          </p>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${
                isPro ? "text-blue-900" : "text-white"
              }`}
            >
              {t("community.viewAll", "View Community")}
            </span>
            <FiArrowRight
              className={`w-5 h-5 ml-2 ${
                isPro ? "text-blue-900" : "text-white"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
