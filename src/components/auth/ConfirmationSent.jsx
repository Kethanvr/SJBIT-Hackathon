import React from "react";

export default function ConfirmationSent({ email, onReturnToLogin }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white rounded-2xl p-8 shadow-xl animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center animate-checkmark">
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Almost There!</h2>
        <p className="text-gray-600 mb-8">
          We've sent a confirmation link to{" "}
          <span className="font-medium text-blue-600">{email}</span>.
          Please check your inbox to activate your account.
        </p>
        <button
          type="button"
          onClick={onReturnToLogin}
          className="text-blue-600 hover:text-blue-700 font-medium transition-all duration-300"
        >
          ← Return to Login
        </button>
      </div>
    </div>
  );
}
