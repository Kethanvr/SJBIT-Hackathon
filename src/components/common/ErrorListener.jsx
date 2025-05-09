import React, { useState, useEffect } from 'react';
import StandardErrorMessage from './StandardErrorMessage';

/**
 * ErrorListener component that listens for global error events and displays them
 * 
 * This component listens for custom error events dispatched from anywhere in the app
 * and displays them using the StandardErrorMessage component
 * 
 * Usage:
 * - Add this component once at the app root level
 * - Dispatch errors using: 
 *   const errorEvent = new CustomEvent('app-error', { 
 *     detail: { message: "Error message", type: "error-type" } 
 *   });
 *   window.dispatchEvent(errorEvent);
 */
const ErrorListener = ({ position = 'bottom', autoDismissTime = 5000 }) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for different types of error events
    const handleChatError = (event) => {
      setError({
        message: event.detail.message,
        type: event.detail.type || 'error',
        source: 'chat'
      });
    };

    const handleAppError = (event) => {
      setError({
        message: event.detail.message,
        type: event.detail.type || 'error',
        source: 'app'
      });
    };

    const handleNetworkError = (event) => {
      setError({
        message: event.detail.message,
        type: 'error',
        source: 'network'
      });
    };

    // Add event listeners
    window.addEventListener('chat-error', handleChatError);
    window.addEventListener('app-error', handleAppError);
    window.addEventListener('network-error', handleNetworkError);

    // Clean up event listeners
    return () => {
      window.removeEventListener('chat-error', handleChatError);
      window.removeEventListener('app-error', handleAppError);
      window.removeEventListener('network-error', handleNetworkError);
    };
  }, []);

  // Auto-dismiss errors after a timeout
  useEffect(() => {
    let timeoutId;
    if (error && autoDismissTime > 0) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, autoDismissTime);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [error, autoDismissTime]);

  // No error, no display
  if (!error) return null;

  // Calculate position classes
  const positionClasses = {
    top: 'fixed top-5 left-1/2 transform -translate-x-1/2 z-50',
    bottom: 'fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50',
    'top-left': 'fixed top-5 left-5 z-50',
    'top-right': 'fixed top-5 right-5 z-50',
    'bottom-left': 'fixed bottom-5 left-5 z-50',
    'bottom-right': 'fixed bottom-5 right-5 z-50',
  };

  // Determine icon based on source and type
  let icon = error.type;
  if (error.source === 'network') icon = 'network';
  if (error.source === 'chat' && error.type === 'connection-error') icon = 'signal';

  return (
    <div className={positionClasses[position] || positionClasses.bottom}>
      <StandardErrorMessage
        message={error.message}
        type={error.type}
        onDismiss={() => setError(null)}
        icon={icon}
      />
    </div>
  );
};

export default ErrorListener;
