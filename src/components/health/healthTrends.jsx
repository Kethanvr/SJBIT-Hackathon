import React from "react";
import { FiTrendingUp } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";

// HealthTrends Component
function HealthTrends() {
  const { t } = useTranslation("healthManagement");
  const currentDate = new Date();
  
  const trends = [
    { 
      titleKey: "trends.fluCases", 
      defaultTitle: "Flu Cases", 
      valueKey: "trends.fluCasesValue", 
      defaultValue: "12% increase", 
      status: "up", 
      color: "red" 
    },
    { 
      titleKey: "trends.allergies", 
      defaultTitle: "Allergies", 
      valueKey: "trends.allergiesValue", 
      defaultValue: "8% decrease", 
      status: "down", 
      color: "green" 
    },
    { 
      titleKey: "trends.sleepIssues", 
      defaultTitle: "Sleep Issues", 
      valueKey: "trends.sleepIssuesValue", 
      defaultValue: "5% increase", 
      status: "up", 
      color: "yellow" 
    },
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 health-trends-container">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiTrendingUp className="w-5 h-5" /> {t("trends.title", "Health Trends")}
        </h3>
        <span className="text-xs text-gray-500">
          {t("trends.updated", "Updated")}: {format(currentDate, "MMM d, yyyy")}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 health-trends-grid">
        {trends.map((trend) => (
          <div
            key={trend.titleKey}
            className="p-3 rounded-md border border-gray-100"
          >
            <h4 className="text-sm font-medium text-gray-700">
              {t(trend.titleKey, trend.defaultTitle)}
            </h4>
            <p
              className={`text-sm font-semibold mt-1 ${
                trend.color === "red"
                  ? "text-red-600"
                  : trend.color === "green"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {t(trend.valueKey, trend.defaultValue)}{" "}
              <span className="text-xs">
                {trend.status === "up" ? "↑" : "↓"}
              </span>
            </p>
          </div>        ))}      </div>
    </div>
  );
}

export default HealthTrends;