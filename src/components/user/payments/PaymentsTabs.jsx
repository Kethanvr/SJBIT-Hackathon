import React from "react";

/**
 * Tabs component for the Payments page
 * @param {Object} props - Component props
 * @param {string} props.activeTab - The currently active tab
 * @param {Function} props.setActiveTab - Function to change the active tab
 */
const PaymentsTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "payments", label: "Payment Methods" },
    { id: "payouts", label: "Payouts" },
    { id: "transactions", label: "Transaction History" }
  ];
    return (
    <div className="bg-white border-b sticky top-14 z-10 w-full">
      <div className="max-w-lg mx-auto px-2 sm:px-4">
        <div className="flex overflow-x-auto pb-1 scrollbar-hide -mx-2 px-2 sm:-mx-4 sm:px-4">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                "py-3 sm:py-4 px-2 sm:px-4 text-sm font-medium border-b-2 whitespace-nowrap flex-shrink-0 " + 
                (index < tabs.length - 1 ? "mr-2 sm:mr-6 " : "") +
                (activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700")
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentsTabs;
