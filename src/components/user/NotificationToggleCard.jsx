import React from "react";
import { motion } from "framer-motion";
import { useProTheme } from "../../utils/useProTheme";

export default function NotificationToggleCard({
  item,
  checked,
  onToggle,
  index
}) {
  const { isPro, theme } = useProTheme();
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      className={`${isPro ? "bg-white border border-yellow-100" : "bg-white"} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4">
          <div className={`text-2xl ${isPro ? "text-yellow-500" : ""}`}>{item.icon}</div>
          <div>
            <h3 className={`font-medium text-lg ${isPro ? "text-yellow-900" : "text-gray-800"}`}>{item.title}</h3>
            <p className={`${isPro ? "text-yellow-700" : "text-gray-500"} mt-1`}>{item.description}</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={onToggle}
            className="sr-only peer"
          />
          <div className={`w-14 h-7 bg-gray-200 peer-focus:ring-4 ${isPro ? "peer-focus:ring-yellow-300" : "peer-focus:ring-blue-300"} rounded-full 
            peer peer-checked:after:translate-x-full peer-checked:after:border-white 
            after:content-[''] after:absolute after:top-0.5 after:left-[4px] 
            after:bg-white after:border-gray-300 after:border after:rounded-full 
            after:h-6 after:w-6 after:shadow-md after:transition-all 
            ${isPro ? "peer-checked:bg-yellow-600" : "peer-checked:bg-blue-600"}`}
          />
        </label>
      </div>
    </motion.div>
  );
}
