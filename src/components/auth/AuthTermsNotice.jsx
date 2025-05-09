import React from 'react';
import { Link } from "react-router-dom";

export default function AuthTermsNotice() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <div className="text-center text-xs text-gray-400">
        By continuing, you agree to our
        <Link to="/terms" className="text-purple-500 hover:text-purple-700 ml-1">Terms of Service</Link>
        <span className="mx-1">and</span>
        <Link to="/privacy" className="text-purple-500 hover:text-purple-700">Privacy Policy</Link>
      </div>
    </div>
  );
}
