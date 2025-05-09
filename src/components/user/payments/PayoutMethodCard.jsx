import React from "react";
import { FiDollarSign } from "react-icons/fi";

const PayoutMethodCard = ({ method, onRemove }) => (
  <div className="p-4 sm:p-5 flex items-center justify-between">
    <div className="flex items-center space-x-3 sm:space-x-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center">
        <FiDollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </div>
      <div>
        <div className="text-sm sm:text-base font-medium mb-1">{method.bankName}</div>
        <div className="text-xs sm:text-sm text-gray-500">•••• {method.last4}</div>
      </div>
    </div>
    <button
      onClick={onRemove}
      className="text-red-600 text-xs sm:text-sm hover:text-red-700 font-medium"
    >
      Remove
    </button>
  </div>
);

export default PayoutMethodCard;
