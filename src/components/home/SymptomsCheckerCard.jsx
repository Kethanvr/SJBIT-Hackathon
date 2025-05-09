import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiActivity } from "react-icons/fi";
import { useProTheme } from "../../utils/useProTheme";

const SymptomsCheckerCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { isPro } = useProTheme();

  const handleClick = () => {
    navigate("/symptoms/checker");
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-transform duration-200 hover:scale-[1.02] ${
        isPro
          ? "bg-gradient-to-br from-cyan-400 to-cyan-600"
          : "bg-gradient-to-br from-teal-500 to-teal-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-3">
          <FiActivity
            className={`w-6 h-6 mt-1 ${isPro ? "text-cyan-900" : "text-white"}`}
          />
          <div>
            <h3
              className={`text-lg sm:text-xl font-bold ${
                isPro ? "text-cyan-900" : "text-white"
              }`}
            >
              {t("symptomsChecker.title", "Symptoms Checker")}
            </h3>
            <p
              className={`text-sm ${
                isPro ? "text-cyan-900/80" : "text-white/80"
              }`}
            >
              {t(
                "symptomsChecker.subtitle",
                "Describe your symptoms for quick guidance"
              )}
            </p>
            <div className="mt-3 flex items-center">
              <span
                className={`text-sm font-medium ${
                  isPro ? "text-cyan-900" : "text-white"
                }`}
              >
                {t("symptomsChecker.cta", "Check Symptoms")}
              </span>
              <FiArrowRight
                className={`w-4 h-4 ml-2 ${
                  isPro ? "text-cyan-900" : "text-white"
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomsCheckerCard;
