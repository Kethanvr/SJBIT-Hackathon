import React from "react";
import { FiCreditCard, FiLoader } from "react-icons/fi";

const ProPlanCard = ({ loading, onBuy }) => (
  <div className="p-4 pb-6 text-center">
    <h3 className="text-xl font-semibold mb-2">MediScan Gold</h3>
    <p className="text-3xl font-bold mb-4">₹100</p>
    <p className="text-sm text-gray-500 mb-6">One-time payment for lifetime access.</p>
    <button
      onClick={onBuy}
      disabled={loading}
      className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
    >
      {loading ? (
        <FiLoader className="w-5 h-5 animate-spin" />
      ) : (
        <FiCreditCard className="w-5 h-5" />
      )}
      <span>{loading ? "Processing..." : "Buy Pro Plan"}</span>
    </button>
  </div>
);

export default ProPlanCard;
