import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const PaymentSuccessMessage = () => (
  <div className="flex flex-col items-center text-green-600">
    <FiCheckCircle className="w-12 h-12 mb-2" />
    <p className="font-medium">Payment Successful!</p>
    <p className="text-sm text-gray-600">Your Pro plan is now active.</p>
  </div>
);

export default PaymentSuccessMessage;
