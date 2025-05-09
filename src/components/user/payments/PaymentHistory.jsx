import React from "react";
import TransactionRow from "./TransactionRow";
import TransactionSearch from "./TransactionSearch";
import { FiInfo } from "react-icons/fi";

/**
 * PaymentHistory component to display transaction history
 * 
 * @param {Object} props - Component props
 * @param {Array} props.transactions - List of transactions
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.setSearchQuery - Function to update search query
 * @param {string} props.filterStatus - Current filter status
 * @param {Function} props.setFilterStatus - Function to update filter status
 */
const PaymentHistory = ({
  transactions,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus
}) => {
  // Filter transactions based on search query and status filter
  const filteredTransactions = transactions.filter(transaction => {
    // Apply status filter
    if (filterStatus !== "all" && transaction.status !== filterStatus) {
      return false;
    }
    
    // Apply search filter if there's a query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        transaction.description?.toLowerCase().includes(query) ||
        transaction.date?.toLowerCase().includes(query) ||
        transaction.amount?.toString().includes(query)
      );
    }
    
    return true;
  });
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <TransactionSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />
      <div className="p-4 sm:p-5 border-b">
        <h2 className="text-base sm:text-lg font-medium">Transaction History</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
          Recent payments and reimbursements
        </p>
      </div>
      
      {/* Feature Coming Soon Note */}
      <div className="p-4 sm:p-5 bg-yellow-50 border-b border-yellow-100 flex items-start space-x-3 sm:space-x-4">
        <FiInfo className="text-yellow-500 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
        <p className="text-xs sm:text-sm text-yellow-700 font-medium">
          The transaction history feature will be available soon. Currently displaying sample data to demonstrate how this feature will work in the future.
        </p>
      </div>      <div className="divide-y divide-gray-100">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="py-6 sm:py-8 text-center text-xs sm:text-sm text-gray-500">
            No transactions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
