import React from "react";
import { FiInfo } from "react-icons/fi";
import CoinPackageCard from "./CoinPackageCard";
import CoinBalanceDisplay from "./CoinBalanceDisplay";

/**
 * Default coin packages available for purchase
 */
const DEFAULT_COIN_PACKAGES = [
  {
    id: "basic",
    name: "Basic Pack",
    description: "Perfect for occasional users",
    coins: 10,
    price: 50,
  },
  {
    id: "standard",
    name: "Standard Pack",
    description: "Most popular option",
    coins: 25,
    price: 100,
  },
  {
    id: "premium",
    name: "Premium Pack",
    description: "Best value for regular users",
    coins: 100,
    price: 300,
  },
];

/**
 * CoinsSection component to display purchasable coin packages
 * 
 * @param {Object} props - Component props
 * @param {Array} [props.coinPackages] - Available coin packages
 * @param {boolean} props.loading - Whether a purchase is in progress
 * @param {string} props.processingPackageId - ID of the package being processed
 * @param {Function} props.onBuyCoins - Function to handle coin purchase
 * @param {number} [props.currentCoins] - Current coin balance
 */
const CoinsSection = ({ 
  coinPackages = DEFAULT_COIN_PACKAGES, 
  loading, 
  processingPackageId,
  onBuyCoins,
  currentCoins = 0
}) => {  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 border-b">
        <h2 className="text-base sm:text-lg font-medium">Purchase Coins</h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Coins are used for scanning medicines and chats
        </p>
      </div>
      
      {/* Current Balance Display */}
      <div className="p-4 sm:p-5 border-b">
        <CoinBalanceDisplay coins={currentCoins} variant="default" />
      </div>      {/* Informational Note */}
      <div className="p-4 sm:p-5 bg-blue-50 border-b border-blue-100 flex items-start space-x-3 sm:space-x-4">
        <FiInfo className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
        <p className="text-xs sm:text-sm text-blue-700">
          Each scan costs 1 coin. Add coins to your account to scan more medicines or interact with the AI assistant. Gold members get discounted rates.
        </p>
      </div>

      {/* Important Warning */}
      <div className="p-4 sm:p-5 bg-red-50 border-b border-red-100 flex items-start space-x-3 sm:space-x-4">
        <FiInfo className="text-red-500 w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
        <p className="text-xs sm:text-sm text-red-700 font-medium">
          IMPORTANT: Coin purchase feature is currently under development. Please DO NOT make any payments as coins will not be credited to your account. Contact the owner if you require coins.
        </p>
      </div>
      
      {/* Coin Packages */}
      <div className="divide-y divide-gray-100">
        {coinPackages.map((pkg) => (
          <CoinPackageCard
            key={pkg.id}
            package={pkg}
            loading={loading && processingPackageId === pkg.id}
            onBuy={onBuyCoins}
          />
        ))}
      </div>
    </div>
  );
};

export default CoinsSection;
