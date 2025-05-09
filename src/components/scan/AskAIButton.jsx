import React from "react";
import { FiMessageSquare } from "react-icons/fi";

export function AskAIButton({ onClick, t }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
    >
      <FiMessageSquare className="w-5 h-5" />
      <span>{t('results:askAIButton')}</span>
    </button>
  );
}
