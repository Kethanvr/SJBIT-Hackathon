import React from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  autoComplete,
  required,
  disabled
}) {
  return (
    <div className="mb-6">
      <label htmlFor={id} className="block text-gray-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full p-4 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:border-purple-500"
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}
