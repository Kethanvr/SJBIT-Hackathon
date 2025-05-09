import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiArrowRight, FiUser } from "react-icons/fi";
import { useProTheme } from "../../utils/useProTheme";

const DoctorConsultationCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { isPro } = useProTheme();

  const handleClick = () => {
    navigate("/health/doctors");
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isPro
          ? "bg-gradient-to-br from-purple-400 to-purple-600"
          : "bg-gradient-to-br from-indigo-500 to-indigo-700"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <FiUser
              className={`w-8 h-8 ${isPro ? "text-purple-900" : "text-white"}`}
            />
            <h3
              className={`text-xl sm:text-2xl font-bold ${
                isPro ? "text-purple-900" : "text-white"
              }`}
            >
              {t("doctorConsultation.title", "Doctor Consultation")}
            </h3>
          </div>
          <p
            className={`text-base sm:text-lg mt-2 sm:mt-3 ${
              isPro ? "text-purple-900" : "text-white/90"
            }`}
          >
            {t(
              "doctorConsultation.subtitle",
              "Book a video consultation with top specialists"
            )}
          </p>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${
                isPro ? "text-purple-900" : "text-white"
              }`}
            >
              {t("doctorConsultation.cta", "Find Doctors")}
            </span>
            <FiArrowRight
              className={`w-5 h-5 ml-2 ${
                isPro ? "text-purple-900" : "text-white"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorConsultationCard;
