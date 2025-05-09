import React from "react";
import { FiCreditCard, FiLoader } from "react-icons/fi";

/**
 * CoinPackageCard component to display a purchasable coin package
 *
 * @param {Object} props - Component props
 * @param {Object} props.package - The coin package data
 * @param {boolean} props.loading - Whether a purchase is in progress
 * @param {Function} props.onBuy - Function to handle purchase
 */
const CoinPackageCard = ({ package: pkg, loading, onBuy }) => (
  <div className="p-4 sm:p-5 pb-5 sm:pb-7 border-b hover:bg-gray-50 transition-colors">
    <div className="flex items-center justify-between mb-3 sm:mb-5">
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
          {pkg.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">{pkg.description}</p>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-blue-600">
        {pkg.coins} <span className="text-yellow-500">coins</span>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <p className="text-base sm:text-lg font-medium">₹{pkg.price}</p>
      <button
        onClick={() => onBuy(pkg)}
        disabled={loading}
        className="flex items-center justify-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {" "}
        {loading ? (
          <>
            <FiLoader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <FiCreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Buy Now</span>
          </>
        )}
      </button>
    </div>
  </div>
);

export default CoinPackageCard;
