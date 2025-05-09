import React from 'react';
import StandardLoadingIndicator from '../common/StandardLoadingIndicator';

const LoadingOverlay = ({ message, note }) => (
  <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50 p-4">
    <StandardLoadingIndicator size="lg" variant="overlay" />
    <p className="text-blue-700 text-center mb-2 font-medium">{message}</p>
    <p className="text-gray-500 text-sm text-center max-w-xs">{note}</p>
  </div>
);
export default LoadingOverlay;
