import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrophy,
  FaMedal,
  FaGift,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaPlus,
} from "react-icons/fa";
import ScrollToTop from "../utils/helpers/ScrollToTop";
import { useProTheme } from "../utils/useProTheme";

const AllChallenges = () => {
  const navigate = useNavigate();
  const { isPro, theme } = useProTheme();
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [completedChallenge, setCompletedChallenge] = useState(null);
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Daily Steps Challenge",
      description: "Complete 10,000 steps daily",
      progress: 75,
      reward: "10% off on next consultation",
      icon: <FaMedal className="text-yellow-500" />,
      completed: false,
      target: 10000,
      current: 7500,
    },
    {
      id: 2,
      title: "Weekly Workout Streak",
      description: "Complete 5 workouts this week",
      progress: 60,
      reward: "15% off on health supplements",
      icon: <FaTrophy className="text-blue-500" />,
      completed: false,
      target: 5,
      current: 3,
    },
    {
      id: 3,
      title: "Monthly Health Goals",
      description: "Complete all monthly health check-ins",
      progress: 90,
      reward: "20% off on annual health checkup",
      icon: <FaGift className="text-green-500" />,
      completed: false,
      target: 4,
      current: 3,
    },
    {
      id: 4,
      title: "Water Intake Challenge",
      description: "Drink 8 glasses of water daily",
      progress: 50,
      reward: "5% off on health supplements",
      icon: <FaMedal className="text-blue-400" />,
      completed: false,
      target: 8,
      current: 4,
    },
    {
      id: 5,
      title: "Sleep Schedule Challenge",
      description: "Maintain 8 hours of sleep for 7 days",
      progress: 85,
      reward: "10% off on wellness products",
      icon: <FaTrophy className="text-purple-500" />,
      completed: false,
      target: 7,
      current: 6,
    },
  ]);

  const generateRewardCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleChallengeClick = (challengeId) => {
    const updatedChallenges = challenges.map((challenge) => {
      if (challenge.id === challengeId) {
        const newCompleted = !challenge.completed;
        if (newCompleted) {
          setCompletedChallenge(challenge);
          setShowCompletionOverlay(true);
        }
        return { ...challenge, completed: newCompleted };
      }
      return challenge;
    });
    setChallenges(updatedChallenges);
  };

  const handleAddProgress = (challengeId) => {
    setChallenges(
      challenges.map((challenge) => {
        if (challenge.id === challengeId && !challenge.completed) {
          const newCurrent = Math.min(challenge.current + 1, challenge.target);
          const newProgress = Math.round((newCurrent / challenge.target) * 100);
          return {
            ...challenge,
            current: newCurrent,
            progress: newProgress,
            completed: newProgress === 100,
          };
        }
        return challenge;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <ScrollToTop />

      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className={theme.navInactive}>
              <FaArrowLeft className="w-6 h-6" />
            </button>
            <h1 className={`text-xl font-semibold ${theme.title}`}>
              Health Challenges
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 space-y-4">
        <div className="grid gap-4">
          {challenges.map((challenge) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {challenge.icon}
                  <div>
                    <h3 className="font-semibold text-lg">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {challenge.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!challenge.completed && (
                    <button
                      onClick={() => handleAddProgress(challenge.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <FaPlus />
                    </button>
                  )}
                  <button
                    onClick={() => handleChallengeClick(challenge.id)}
                    className={`px-4 py-2 rounded-full ${
                      challenge.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {challenge.completed ? (
                      <FaCheck className="text-lg" />
                    ) : (
                      <FaTimes className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>
                    Progress: {challenge.current}/{challenge.target}
                  </span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-600">Reward:</span>
                <span className="text-sm font-medium text-green-600">
                  {challenge.reward}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {showCompletionOverlay && completedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCompletionOverlay(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="text-3xl text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
                <p className="text-gray-600 mb-4">
                  You've completed the {completedChallenge.title}!
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-1">
                    Your Reward Code:
                  </p>
                  <p className="text-lg font-mono font-bold text-green-600">
                    {generateRewardCode()}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Use this code to redeem your {completedChallenge.reward}
                </p>
                <button
                  onClick={() => setShowCompletionOverlay(false)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllChallenges;
