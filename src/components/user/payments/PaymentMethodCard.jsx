import React from "react";
import { FiCreditCard } from "react-icons/fi";

const PaymentMethodCard = ({ method, onRemove }) => (
  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-3 sm:space-x-4">
      <div className="w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0">
        <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm sm:text-base font-medium flex items-center flex-wrap">
          <span className="mr-2">•••• {method.last4}</span>
          <span className="px-1.5 py-0.5 text-xs bg-gray-100 rounded text-gray-600">
            Visa
          </span>
        </div>
        <div className="text-xs sm:text-sm text-gray-500 flex items-center flex-wrap">
          <span>Expires {method.expiry}</span>
          {method.primary && (
            <span className="ml-2 text-xs text-green-600 font-medium">Default</span>
          )}
        </div>
      </div>
    </div>    <div className="flex items-center justify-end space-x-4 pt-1 sm:pt-0 border-t sm:border-t-0 mt-1 sm:mt-0">
      <button
        onClick={onRemove}
        className="text-xs sm:text-sm text-red-600 hover:text-red-700"
      >
        Remove
      </button>
    </div>
  </div>
);

export default PaymentMethodCard;
