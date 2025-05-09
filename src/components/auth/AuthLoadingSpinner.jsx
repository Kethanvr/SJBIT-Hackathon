import React from "react";

export default function AuthLoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-pulse">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg
                title="Loading spinner animation"
                className="animate-spin w-8 h-8 text-blue-600"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="text-white font-medium">Authenticating...</div>
      </div>
    </div>
  );
}
