import React from "react";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

const WhatsNewCard = () => {
  const { t } = useTranslation("home");
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const isPro = profile?.pro_user;
  const cardBg = isPro ? "bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-200" : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100";
  const titleColor = isPro ? "text-yellow-900" : "text-blue-900";
  const descColor = isPro ? "text-yellow-900" : "text-blue-900";
  const iconColor = isPro ? "text-yellow-500" : "text-blue-600";

  return (
    <div className={`mt-8 ${cardBg} rounded-xl p-9 sm:p-9 shadow-sm`}>
      <Link to="/updates" className="flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${titleColor}`}>{t('whatsNewCard.title')}</h3>
          <p className={`text-sm mt-1 ${descColor}`}>{t('whatsNewCard.description')}</p>
        </div>
        <FiBell className={`w-8 h-8 flex-shrink-0 ml-5 ${iconColor}`} />
      </Link>
    </div>
  );
};

export default WhatsNewCard;
