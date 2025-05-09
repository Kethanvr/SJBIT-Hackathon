import React from "react";
import { Link } from "react-router-dom";
import { BsQrCodeScan } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useProTheme } from "../../utils/useProTheme";

const QuickActionsCard = () => {
  const { t } = useTranslation("home");
  const { isPro, theme } = useProTheme();

  return (
    <div className={`${theme.cardBg} rounded-xl p-6 mb-6`}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{t('quickActions.title')}</h2>
      </div>      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/scanner"
          className={`${theme.linkBg} rounded-lg p-4 flex flex-col items-center`}
          data-tooltip="scan-button"
        >
          <BsQrCodeScan className={`text-2xl mb-2 ${theme.icon}`} />
          <span className="text-sm">{t('quickActions.scan')}</span>
        </Link>
        <Link
          to="/scan/history"
          className={`${theme.linkBg} rounded-lg p-4 flex flex-col items-center`}
          data-tooltip="health-records"
        >
          <FiClock className={`text-2xl mb-2 ${theme.icon}`} />
          <span className="text-sm">{t('quickActions.history')}</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActionsCard;
