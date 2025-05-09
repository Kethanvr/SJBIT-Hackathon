import React from "react";
import { FiPlusCircle, FiDatabase } from "react-icons/fi"; // Using FiDatabase for coins icon
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CoinsCard = ({ coins }) => {
  const { t } = useTranslation("account");
  const navigate = useNavigate();

  const handleAddCoin = () => {
    navigate("/account/payments"); // Navigate to the payments page
  };

  return (
    <div className="p-4 border-t border-yellow-300 bg-gradient-to-br from-white via-yellow-400 to-yellow-500">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <FiDatabase className="w-6 h-6 text-yellow-800" />
          <h3 className="text-lg font-semibold text-yellow-800">
            {t("coinsCard.title", "Your Coins")}
          </h3>
        </div>
        <button
          onClick={handleAddCoin}
          className="flex items-center space-x-1 text-sm text-yellow-800 hover:text-yellow-900 font-semibold"
        >
          <FiPlusCircle className="w-4 h-4" />
          <span>{t("coinsCard.addCoins", "Add Coins")}</span>
        </button>
      </div>
      <p className="text-sm text-yellow-700 mb-2">
        {t(
          "coinsCard.description",
          "Coins are used for premium features like AI and also  for each scan."
        )}
      </p>
      <div className="text-center bg-yellow-50 border border-yellow-300 rounded-lg p-3">
        <p className="text-sm text-yellow-700 mb-1">
          {t("coinsCard.currentBalance", "Current Balance")}
        </p>
        <p className="text-2xl font-bold text-yellow-800">
          {typeof coins === "number"
            ? coins
            : t("coinsCard.loading", "Loading...")}
        </p>
      </div>
    </div>
  );
};

export default CoinsCard;
