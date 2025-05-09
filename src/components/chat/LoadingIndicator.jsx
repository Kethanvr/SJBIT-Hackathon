import React from "react";
import StandardLoadingIndicator from "../common/StandardLoadingIndicator";

export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-start animate-fade-in">
      <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
        <div className="flex space-x-2 items-center">
          <StandardLoadingIndicator size="sm" variant="dots" />
          <span className="text-xs text-gray-500 ml-1">Thinking...</span>
        </div>
      </div>
    </div>
  );
}
