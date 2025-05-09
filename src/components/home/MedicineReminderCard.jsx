import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiBell } from "react-icons/fi";
import { useProTheme } from "../../utils/useProTheme";

const MedicineReminderCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { isPro } = useProTheme();

  const handleClick = () => {
    navigate("/health/medicine-reminder");
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-transform duration-200 hover:scale-[1.02] ${
        isPro
          ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
          : "bg-gradient-to-br from-green-500 to-green-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FiBell
            className={`w-6 h-6 ${isPro ? "text-emerald-900" : "text-white"}`}
          />
          <div>
            <h3
              className={`text-lg sm:text-xl font-bold ${
                isPro ? "text-emerald-900" : "text-white"
              }`}
            >
              {t("medicineReminder.title", "Medicine Reminder")}
            </h3>
            <p
              className={`text-sm ${
                isPro ? "text-emerald-900/80" : "text-white/80"
              }`}
            >
              {t(
                "medicineReminder.subtitle",
                "Set reminders for your medications"
              )}
            </p>
          </div>
        </div>
        <FiArrowRight
          className={`w-5 h-5 ${isPro ? "text-emerald-900" : "text-white"}`}
        />
      </div>
    </div>
  );
};

export default MedicineReminderCard;
