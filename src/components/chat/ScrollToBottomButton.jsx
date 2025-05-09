import React from "react";
import { FiArrowDown } from "react-icons/fi";

export default function ScrollToBottomButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed right-4 bottom-24 z-10 bg-white text-blue-600 rounded-full p-2.5 shadow-lg hover:bg-blue-50 transition-all border border-blue-200 transform hover:scale-110 group"
      aria-label="Scroll to bottom"
    >
      <div className="relative">
        <FiArrowDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
        <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          New messages
        </span>
      </div>
    </button>
  );
}
