import React from "react";

export default function PasswordRequirements({ criteria, strength }) {
  return (
    <div className="mb-6 bg-gray-100 p-4 rounded-lg">
      <div className="flex justify-between mb-2">
        <p className="text-gray-800">Your password must include</p>
        <p
          className={`$ {
            strength === "Too weak"
              ? "text-red-500"
              : strength === "Medium"
              ? "text-orange-500"
              : "text-green-500"
          }`}
        >
          {strength}
        </p>
      </div>
      <ul className="space-y-2">
        <li className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 $ {
              criteria.hasMinLength ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            {criteria.hasMinLength && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                role="img"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className={criteria.hasMinLength ? "text-green-500" : "text-gray-500"}>
            At least 8 characters
          </span>
        </li>
        <li className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 $ {
              criteria.hasLetter ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            {criteria.hasLetter && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                role="img"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className={criteria.hasLetter ? "text-green-500" : "text-gray-500"}>
            At least one letter
          </span>
        </li>
        <li className="flex items-center">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 $ {
              criteria.hasNumber ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            {criteria.hasNumber && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
                role="img"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
          <span className={criteria.hasNumber ? "text-green-500" : "text-gray-500"}>
            At least one number
          </span>
        </li>
      </ul>
    </div>
  );
}
