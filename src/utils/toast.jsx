import toast from 'react-hot-toast';
import { FiCheck, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

/**
 * Enhanced toast notification utility for MediScan
 * 
 * This provides a consistent way to show notifications across the app
 * with standardized styling and behavior.
 */

// Default toast duration in milliseconds
const DEFAULT_DURATION = 3000;

// Custom styling based on toast type
const getToastStyle = (type) => {
  const baseStyle = {
    borderRadius: '8px',
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxWidth: '320px',
  };
  
  switch (type) {
    case 'success':
      return {
        ...baseStyle,
        background: '#10B981', // Green
        color: 'white',
      };
    case 'error':
      return {
        ...baseStyle,
        background: '#EF4444', // Red
        color: 'white',
      };
    case 'warning':
      return {
        ...baseStyle,
        background: '#F59E0B', // Amber
        color: 'white',
      };
    case 'info':
    default:
      return {
        ...baseStyle,
        background: '#3B82F6', // Blue
        color: 'white',
      };
  }
};

// Icon components for different toast types
const ToastIcon = ({ type }) => {
  const iconStyle = { marginRight: '8px', fontSize: '1.25rem' };
  
  switch (type) {
    case 'success':
      return <FiCheck style={iconStyle} />;
    case 'error':
      return <FiX style={iconStyle} />;
    case 'warning':
      return <FiAlertTriangle style={iconStyle} />;
    case 'info':
    default:
      return <FiInfo style={iconStyle} />;
  }
};

/**
 * Success toast notification
 * 
 * @param {string} message - Toast message
 * @param {Object} options - Additional toast options
 */
export const successToast = (message, options = {}) => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        style={getToastStyle('success')}
      >
        <ToastIcon type="success" />
        <span>{message}</span>
      </div>
    ),
    {
      duration: options.duration || DEFAULT_DURATION,
      position: options.position || 'top-center',
      ...options,
    }
  );
};

/**
 * Error toast notification
 * 
 * @param {string} message - Toast message
 * @param {Object} options - Additional toast options
 */
export const errorToast = (message, options = {}) => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        style={getToastStyle('error')}
      >
        <ToastIcon type="error" />
        <span>{message}</span>
      </div>
    ),
    {
      duration: options.duration || DEFAULT_DURATION,
      position: options.position || 'top-center',
      ...options,
    }
  );
};

/**
 * Info toast notification
 * 
 * @param {string} message - Toast message
 * @param {Object} options - Additional toast options
 */
export const infoToast = (message, options = {}) => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        style={getToastStyle('info')}
      >
        <ToastIcon type="info" />
        <span>{message}</span>
      </div>
    ),
    {
      duration: options.duration || DEFAULT_DURATION,
      position: options.position || 'top-center',
      ...options,
    }
  );
};

/**
 * Warning toast notification
 * 
 * @param {string} message - Toast message
 * @param {Object} options - Additional toast options
 */
export const warningToast = (message, options = {}) => {
  toast.custom(
    (t) => (
      <div
        className={`flex items-center ${t.visible ? 'animate-enter' : 'animate-leave'}`}
        style={getToastStyle('warning')}
      >
        <ToastIcon type="warning" />
        <span>{message}</span>
      </div>
    ),
    {
      duration: options.duration || DEFAULT_DURATION,
      position: options.position || 'top-center',
      ...options,
    }
  );
};

/**
 * Promise toast - shows loading, success, and error states for a promise
 * 
 * @param {Promise} promise - The promise to track
 * @param {Object} messages - Loading, success and error messages
 * @param {Object} options - Additional toast options
 */
export const promiseToast = (
  promise,
  { loading = 'Loading...', success = 'Success!', error = 'Something went wrong' },
  options = {}
) => {
  return toast.promise(
    promise,
    {
      loading: {
        message: loading,
        icon: '⏳',
      },
      success: {
        message: success,
        icon: '✅',
      },
      error: {
        message: typeof error === 'function' ? error : error,
        icon: '❌',
      },
    },
    {
      success: {
        duration: options.duration || DEFAULT_DURATION,
        style: getToastStyle('success'),
      },
      error: {
        duration: options.duration || DEFAULT_DURATION,
        style: getToastStyle('error'),
      },
      loading: {
        duration: Infinity, // Loading state shows until promise resolves
        style: {
          borderRadius: '8px',
          padding: '8px 12px',
          background: '#6B7280', // Gray
          color: 'white',
        },
      },
      ...options,
    }
  );
};

// Main toast function to handle all toast types
export default function customToast(message, options = {}) {
  // If no type is specified, default to 'info'
  const type = options.type || 'info';
  
  // Call the appropriate toast method based on type
  switch (type) {
    case 'success':
      return successToast(message, options);
    case 'error':
      return errorToast(message, options);
    case 'warning':
      return warningToast(message, options);
    case 'info':
    default:
      return infoToast(message, options);
  }
};

// Export the original toast for custom use cases
export { toast };
