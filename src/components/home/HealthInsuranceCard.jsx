import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiShield } from "react-icons/fi";
import { useProTheme } from "../../utils/useProTheme";

const HealthInsuranceCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { isPro } = useProTheme();

  const handleClick = () => {
    navigate("/health/insurance-providers");
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isPro
          ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
          : "bg-gradient-to-br from-blue-500 to-blue-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <FiShield
              className={`w-8 h-8 ${isPro ? "text-yellow-900" : "text-white"}`}
            />
            <h3
              className={`text-xl sm:text-2xl font-bold ${
                isPro ? "text-yellow-900" : "text-white"
              }`}
            >
              {t("healthInsurance.title", "Health Insurance Providers")}
            </h3>
          </div>
          <p
            className={`text-base sm:text-lg mt-2 sm:mt-3 ${
              isPro ? "text-yellow-900" : "text-white/90"
            }`}
          >
            {t("healthInsurance.subtitle", "Find and compare insurance plans")}
          </p>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${
                isPro ? "text-yellow-900" : "text-white"
              }`}
            >
              {t("healthInsurance.cta", "Explore Plans")}
            </span>
            <FiArrowRight
              className={`w-5 h-5 ml-2 ${
                isPro ? "text-yellow-900" : "text-white"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInsuranceCard;
