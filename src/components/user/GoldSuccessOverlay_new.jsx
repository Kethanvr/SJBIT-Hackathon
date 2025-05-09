// This file has been simplified to remove Pro/Gold functionality
// The component is retained for backward compatibility

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const GoldSuccessOverlay = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Blue header */}
            <div className="bg-blue-600 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">MediScan</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-100"
                aria-label="Close"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-2">
                <span className="text-5xl">🎉</span>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 text-center">
                Thank you for using MediScan!
              </h3>
              
              <p className="text-gray-600 text-center">
                We hope you're enjoying the app.
              </p>
              
              <div className="flex flex-col space-y-3 pt-2">
                <button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 font-medium py-2 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoldSuccessOverlay;
