import React from "react";
import { FiSearch } from "react-icons/fi";

/**
 * Search and filter component for transactions
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - The current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {string} props.filterStatus - The current filter status
 * @param {Function} props.setFilterStatus - Function to update filter status
 */
const TransactionSearch = ({ searchQuery, setSearchQuery, filterStatus, setFilterStatus }) => {  return (
    <div className="p-4 sm:p-5 border-b flex flex-col space-y-3 sm:space-y-4">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border rounded-lg text-xs sm:text-sm w-full"
        />
        <div className="absolute left-3 sm:left-3.5 top-2.5 sm:top-3 text-gray-400">
          <FiSearch className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="border rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm w-full"
      >
        <option value="all">All Transactions</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
};

export default TransactionSearch;
