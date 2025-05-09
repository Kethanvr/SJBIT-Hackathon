import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiArrowRight } from "react-icons/fi";
import { useProTheme } from "../../utils/useProTheme";

const HealthScoreCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { isPro } = useProTheme();

  const handleClick = () => {
    navigate("/health/score");
  };

  return (
    <div
      onClick={handleClick}      className={`p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isPro
          ? "bg-gradient-to-br from-teal-400 to-teal-600"
          : "bg-gradient-to-br from-blue-500 to-blue-700"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start space-x-3">
          <FiActivity
            className={`w-8 h-8 ${isPro ? "text-teal-900" : "text-white"}`}
          />
          <div>
            <h3              className={`text-xl sm:text-2xl font-bold ${
                isPro ? "text-teal-900" : "text-white"
              }`}
            >
              {t("healthScore.title", "Health Score Assessment")}
            </h3>
            <p              className={`text-base sm:text-lg mt-2 sm:mt-3 ${
                isPro ? "text-teal-900" : "text-white/90"
              }`}
            >
              {t(
                "healthScore.subtitle",
                "Calculate your health score and get personalized recommendations"
              )}
            </p>
            <div className="mt-4 flex items-center">
              <span                className={`text-sm font-medium ${
                  isPro ? "text-teal-900" : "text-white"
                }`}
              >
                {t("healthScore.cta", "Check Your Score")}
              </span>
              <FiArrowRight                className={`w-5 h-5 ml-2 ${
                  isPro ? "text-teal-900" : "text-white"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
