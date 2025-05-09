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
  };  return (
    <div
      onClick={handleClick}
      className={`p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg flex flex-col min-h-[180px] ${
        isPro
          ? "bg-gradient-to-br from-purple-400 to-purple-600"
          : "bg-gradient-to-br from-indigo-500 to-indigo-700"
      }`}
    >
      <div className="w-full">
        <div className="flex items-start space-x-2 sm:space-x-3">
          <FiUser
            className={`w-6 h-6 sm:w-8 sm:h-8 mt-1 flex-shrink-0 ${isPro ? "text-purple-900" : "text-white"}`}
          />
          <h3
            className={`text-md sm:text-2xl font-bold tracking-tight truncate sm:break-normal ${
              isPro ? "text-purple-900" : "text-white"
            }`}
          >
            {t("doctorConsultation.title", "Doctor Consultation")}
          </h3>
        </div>
        <p
          className={`text-xs sm:text-lg mt-2 sm:mt-3 line-clamp-2 sm:line-clamp-none ${
            isPro ? "text-purple-900" : "text-white/90"
          }`}
        >
          {t(
            "doctorConsultation.subtitle",
            "Book a video consultation with top specialists"
          )}
        </p>
      </div>
      
      {/* Book appointment button fixed at bottom */}
      <div className="mt-auto pt-3 sm:pt-4 flex justify-center w-full border-t border-white/20 mt-3">
        <div className="flex items-center justify-center py-1">
          <span
            className={`text-sm font-medium ${
              isPro ? "text-purple-900" : "text-white"
            }`}
          >
            {t("doctorConsultation.cta", "Find Doctors")}
          </span>
          <FiArrowRight
            className={`w-4 h-4 sm:w-5 sm:h-5 ml-2 ${
              isPro ? "text-purple-900" : "text-white"
            }`}
          />
        </div>      </div>
    </div>
  );
};

export default DoctorConsultationCard;
