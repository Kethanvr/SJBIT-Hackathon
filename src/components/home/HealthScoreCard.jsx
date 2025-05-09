import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiActivity, FiArrowRight } from "react-icons/fi";

const HealthScoreCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/health/score");
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-yellow-400 to-yellow-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <FiActivity className="w-8 h-8 text-yellow-100" />
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-800">
              {t("healthScore.title", "Health Score Assessment")}
            </h3>
          </div>
          <p className="text-base sm:text-lg mt-2 sm:mt-3 text-yellow-900">
            {t(
              "healthScore.subtitle",
              "Calculate your health score and get personalized recommendations"
            )}
          </p>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-yellow-800">
              {t("healthScore.cta", "Check Your Score")}
            </span>
            <FiArrowRight className="w-5 h-5 ml-2 text-yellow-900" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
