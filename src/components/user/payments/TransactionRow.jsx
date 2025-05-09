import React from "react";

const safeString = (val) => {
  if (val == null) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
};

const TransactionRow = ({ transaction }) => (
  <div
    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between space-y-2.5 sm:space-y-0 hover:bg-gray-50 border-b"
  >
    <div className="min-w-0 flex-1">
      <div className="text-sm sm:text-base font-medium truncate pr-2">{safeString(transaction.description)}</div>
      <div className="text-xs sm:text-sm text-gray-500 flex items-center space-x-2 sm:space-x-3 mt-1 sm:mt-1.5">
        <span>{typeof transaction.date === 'string' || typeof transaction.date === 'number' ? new Date(transaction.date).toLocaleDateString() : safeString(transaction.date)}</span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            transaction.status === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {transaction.status === "completed" ? "Completed" : "Pending"}
        </span>
      </div>
    </div>
    <div className="text-right w-full sm:w-auto flex justify-between sm:block items-center mt-1 sm:mt-0">
      <div className="text-xs sm:text-sm md:text-base font-medium sm:mb-1">
        <span
          className={
            typeof transaction.amount === 'number' && transaction.amount > 0
              ? "text-green-600 font-medium"
              : "text-gray-900"
          }
        >          {typeof transaction.amount === 'number' ? (transaction.amount > 0 ? "+" : "") + transaction.amount.toFixed(2) + " USD" : safeString(transaction.amount)}
        </span>
      </div>
    </div>
  </div>
);

export default TransactionRow;
