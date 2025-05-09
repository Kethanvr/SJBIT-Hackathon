import React from "react";
import { FiMail } from "react-icons/fi";

export default function EmailInput({ email, setEmail }) {
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-lg blur opacity-0 group-hover:opacity-25 transition-all duration-500"></div>
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-lg transform scale-y-0 origin-top group-focus-within:scale-y-100 transition-transform duration-300"></div>
        <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500" />
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-white/80 backdrop-blur-sm"
          required
        />
      </div>
    </div>
  );
}
