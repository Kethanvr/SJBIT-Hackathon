import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaTrophy, FaMedal, FaGift } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const HealthChallengesCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  const challenges = [
    {
      id: 1,
      title: "Daily Steps Challenge",
      progress: 75,
      reward: "10% off on next consultation",
      icon: <FaMedal className="text-yellow-500" />,
    },
    {
      id: 2,
      title: "Weekly Workout Streak",
      progress: 60,
      reward: "15% off on health supplements",
      icon: <FaTrophy className="text-blue-500" />,
    },
    {
      id: 3,
      title: "Monthly Health Goals",
      progress: 90,
      reward: "20% off on annual health checkup",
      icon: <FaGift className="text-green-500" />,
    },
  ];

  const handleViewAllChallenges = () => {
    navigate("/challenges");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold mb-4">
        Health Challenges & Rewards
      </h2>

      <div className="space-y-4">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {challenge.icon}
                <h3 className="font-medium">{challenge.title}</h3>
              </div>
              <span className="text-sm text-gray-600">
                {challenge.progress}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${challenge.progress}%` }}
              ></div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-600">Reward:</span>
              <span className="text-sm font-medium text-green-600">
                {challenge.reward}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleViewAllChallenges}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View All Challenges
      </button>
    </motion.div>
  );
};

export default HealthChallengesCard;
