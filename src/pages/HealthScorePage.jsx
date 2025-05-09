import React from "react";
import { useTranslation } from "react-i18next";
import HealthScoreCalculator from "../components/health/HealthScoreCalculator";

const HealthScorePage = () => {
  const { t } = useTranslation("home");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Health Score Assessment
        </h1>
        <HealthScoreCalculator />
      </div>
    </div>
  );
};

export default HealthScorePage;
