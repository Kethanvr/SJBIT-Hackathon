import React from 'react';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { updates } from '../data/updatesData';

const UPDATES_SEEN_KEY = 'updatesSeenInSession';

export const UpdatesOverlay = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClose = () => {
    sessionStorage.setItem(UPDATES_SEEN_KEY, 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-yellow-50 to-yellow-200 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-8 relative border border-yellow-300">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-600 bg-white rounded-full p-2 shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={handleClose}
          aria-label="Close updates overlay"
        >
          <FiX className="w-7 h-7" />
        </button>
        <h2 className="text-3xl font-extrabold text-center mb-7 text-yellow-700 tracking-tight drop-shadow-sm">What's New</h2>
        <ul className="space-y-6 pr-2">
          {updates.map((update, idx) => (
            <li key={idx} className="relative bg-white/80 rounded-lg border border-yellow-100 shadow-sm px-5 py-4">
              <div className="flex items-center gap-3 mb-1">
                <FiCheckCircle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-lg text-gray-800">{update.title}</span>
                {update.badge && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${update.badge === 'New' ? 'bg-yellow-200 text-yellow-800' : update.badge === 'Improved' ? 'bg-yellow-100 text-yellow-700' : 'bg-yellow-50 text-yellow-600'}`}>{update.badge}</span>
                )}
              </div>
              <div className="text-yellow-700 text-xs mb-1 ml-8 font-semibold">{update.date}</div>
              <div className="text-gray-800 text-sm ml-8 leading-relaxed">{update.description}</div>
              {idx !== updates.length - 1 && (
                <div className="absolute left-4 right-4 bottom-0 border-b border-yellow-100 mt-4" />
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={handleClose}
          className="mt-8 w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-yellow-900 py-2.5 px-4 rounded-xl font-bold text-lg shadow-lg hover:from-yellow-600 hover:to-yellow-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          Got It
        </button>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};
