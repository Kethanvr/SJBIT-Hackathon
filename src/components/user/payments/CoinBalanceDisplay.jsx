import React from "react";
import { FiDatabase } from "react-icons/fi";

/**
 * Component to display the user's current coin balance
 *
 * @param {Object} props - Component props
 * @param {number} props.coins - The user's current coin balance
 * @param {boolean} [props.isLoading] - Whether the coin balance is loading
 * @param {string} [props.variant] - Display variant ('default', 'compact', or 'large')
 */
const CoinBalanceDisplay = ({
  coins,
  isLoading = false,
  variant = "default",
}) => {
  // Styling variants
  const variants = {
    default: {
      container: "p-4 sm:p-5 bg-yellow-50 border border-yellow-200 rounded-lg",
      label: "text-xs sm:text-sm text-yellow-700 mb-1.5 sm:mb-2",
      balance: "text-xl sm:text-2xl font-bold text-yellow-800",
      icon: "w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mr-2 sm:mr-3",
    },
    compact: {
      container:
        "flex items-center py-2 sm:py-3 px-3 sm:px-4 bg-yellow-50 border border-yellow-200 rounded-full",
      label: "text-xs text-yellow-700 mr-2",
      balance: "text-xs sm:text-sm font-bold text-yellow-800",
      icon: "w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-600 mr-1.5 sm:mr-2",
    },
    large: {
      container:
        "p-5 sm:p-6 bg-gradient-to-tr from-yellow-100 to-yellow-200 border border-yellow-300 rounded-lg shadow-sm",
      label: "text-sm sm:text-base text-yellow-800 mb-1.5 sm:mb-2 font-medium",
      balance: "text-3xl sm:text-4xl font-bold text-yellow-900",
      icon: "w-5 h-5 sm:w-7 sm:h-7 text-yellow-700 mr-2.5 sm:mr-3",
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <div className={style.container}>
      {variant === "compact" ? (
        <div className="flex items-center">
          <FiDatabase className={style.icon} />
          <span className={style.label}>Balance:</span>
          <span className={style.balance}>{isLoading ? "..." : coins}</span>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2.5 sm:mb-3">
            <FiDatabase className={style.icon} />
            <h3 className={style.label}>Current Balance</h3>
          </div>
          <p className={style.balance}>{isLoading ? "Loading..." : coins}</p>
        </>
      )}
    </div>
  );
};

export default CoinBalanceDisplay;
