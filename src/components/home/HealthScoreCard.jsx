import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const HealthScoreCard = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/health/score");
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Health Score Assessment
          </h3>
          <p className="text-sm text-gray-600">
            Calculate your health score and get personalized recommendations
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
