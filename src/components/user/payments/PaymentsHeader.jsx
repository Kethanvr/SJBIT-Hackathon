import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

/**
 * Header component for the Payments page
 */
const PaymentsHeader = () => {  return (
    <div className="bg-white px-2 sm:px-4 py-3 sm:py-4 border-b sticky top-0 z-20">
      <div className="flex items-center max-w-lg mx-auto">
        <Link
          to="/account"
          className="p-1.5 sm:p-2 -ml-1.5 sm:-ml-2 rounded-full hover:bg-gray-100"
        >
          <FiArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
        <h1 className="ml-3 sm:ml-4 text-lg sm:text-xl font-semibold truncate">Payments & Payouts</h1>
      </div>
    </div>
  );
};

export default PaymentsHeader;
