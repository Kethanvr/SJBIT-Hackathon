// This file has been simplified to remove Pro/Gold functionality
// The component is retained but simplified for backward compatibility

import React from "react";

export default function ProUser({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">MediScan Standard Plan</h2>
        <ul className="list-disc pl-6 text-gray-800 mb-4 space-y-1">
          <li>Full access to all scanning features</li>
          <li>Medication information and analysis</li>
          <li>AI-powered health insights</li>
          <li>Health record management</li>
          <li>Regular app updates and improvements</li>
        </ul>
        <div className="text-blue-900 font-medium mb-4">
          Thank you for using MediScan!
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-white transition bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
        >
          Close
        </button>
      </div>
      <style>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
