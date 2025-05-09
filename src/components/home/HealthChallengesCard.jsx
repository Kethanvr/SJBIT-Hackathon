import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaTrophy } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HealthChallengesCard = () => {  const { t } = useTranslation("home");
  const navigate = useNavigate();

  const handleViewChallenges = () => {
    navigate("/challenges");
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleViewChallenges}
      className="p-4 sm:p-5 rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-orange-400 to-orange-600"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <FaTrophy className="w-8 h-8 text-white" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {t("healthChallenges.title", "Health Challenges")}
            </h3>
          </div>
          <p className="text-base sm:text-lg mt-2 sm:mt-3 text-white/90">
            {t("healthChallenges.subtitle", "Complete challenges to earn rewards")}
          </p>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-white">
              {t("healthChallenges.cta", "View Challenges")}
            </span>
            <FiArrowRight className="w-5 h-5 ml-2 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthChallengesCard;
