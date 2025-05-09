/**
 * Centralized error handling utility for MediScan application
 */

/**
 * Standard error types for consistent error handling
 */
export const ErrorTypes = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  VALIDATION: 'validation',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  NETWORK: 'network',
  PAYMENT: 'payment',
  DATABASE: 'database',
  API: 'api',
  UNKNOWN: 'unknown'
};

/**
 * Custom application error with standardized structure
 */
export class AppError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, originalError = null, context = {}) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Handle errors in a consistent way across the application
 * @param {Error} error - The error to handle
 * @param {Object} options - Options for error handling
 * @returns {Object} Standardized error response
 */
export const handleError = (error, options = {}) => {
  const {
    showToUser = true,
    logToConsole = true,
    logToAnalytics = false,
    defaultMessage = 'An unexpected error occurred'
  } = options;

  // Convert to AppError if it's not already one
  const appError = error instanceof AppError 
    ? error 
    : createAppError(error);

  // Log error to console if requested
  if (logToConsole) {
    console.error('[MediScan Error]', appError.message, {
      type: appError.type,
      context: appError.context,
      originalError: appError.originalError,
      stack: appError.stack
    });
  }

  // Log to analytics if requested
  if (logToAnalytics) {
    // In a real app, you would send to your analytics service
    // analyticsTracker.trackError(appError);
  }

  // Create user-friendly message
  const userMessage = getUserFriendlyMessage(appError, defaultMessage);

  return {
    error: true,
    message: userMessage,
    type: appError.type,
    showToUser,
    details: process.env.NODE_ENV !== 'production' ? {
      context: appError.context,
      originalError: appError.originalError?.message,
      stack: appError.stack
    } : undefined
  };
};

/**
 * Create a standardized AppError from various error types
 * @param {Error} error - The original error
 * @returns {AppError} Standardized error
 */
export const createAppError = (error) => {
  // Already an AppError
  if (error instanceof AppError) {
    return error;
  }

  // Supabase errors
  if (error?.code && (error?.message || error?.error_description)) {
    return handleSupabaseError(error);
  }

  // Network errors
  if (error instanceof TypeError && error.message.includes('Network')) {
    return new AppError(
      'Network connection error. Please check your internet connection.',
      ErrorTypes.NETWORK,
      error
    );
  }

  // External API errors
  if (error?.status && error?.statusText) {
    return handleApiError(error);
  }

  // Payment provider errors
  if (error?.code && error?.description && error?.source === 'payment') {
    return new AppError(
      error.description || 'Payment processing error',
      ErrorTypes.PAYMENT,
      error,
      { code: error.code }
    );
  }

  // Handle generic Error objects
  return new AppError(
    error?.message || 'Unknown error occurred',
    ErrorTypes.UNKNOWN,
    error
  );
};

/**
 * Handle Supabase specific errors
 * @param {Object} error - Supabase error
 * @returns {AppError} Formatted error
 */
const handleSupabaseError = (error) => {
  // Authentication errors
  if (error.code.startsWith('auth')) {
    return new AppError(
      getAuthErrorMessage(error),
      ErrorTypes.AUTHENTICATION,
      error,
      { code: error.code }
    );
  }
  
  // Database errors
  if (error.code === '42P01' || error.code === '42P02') {
    return new AppError(
      'Database table error',
      ErrorTypes.DATABASE,
      error,
      { code: error.code }
    );
  }
  
  if (error.code === '23505') {
    return new AppError(
      'This record already exists',
      ErrorTypes.VALIDATION,
      error,
      { code: error.code }
    );
  }
  
  if (error.code.startsWith('23')) {
    return new AppError(
      'Database constraint violation',
      ErrorTypes.VALIDATION,
      error,
      { code: error.code }
    );
  }
  
  // Default Supabase error
  return new AppError(
    error.message || error.error_description || 'Database error',
    ErrorTypes.DATABASE,
    error,
    { code: error.code }
  );
};

/**
 * Handle API specific errors
 * @param {Object} error - API error
 * @returns {AppError} Formatted error
 */
const handleApiError = (error) => {
  const status = error.status;
  let type = ErrorTypes.API;
  let message = 'API error';
  
  // Map HTTP status codes to error types
  if (status === 401 || status === 403) {
    type = ErrorTypes.AUTHORIZATION;
    message = 'You are not authorized to perform this action';
  } else if (status === 404) {
    type = ErrorTypes.NOT_FOUND;
    message = 'The requested resource was not found';
  } else if (status >= 500) {
    type = ErrorTypes.SERVER;
    message = 'Server error occurred. Please try again later';
  } else if (status >= 400) {
    type = ErrorTypes.VALIDATION;
    message = error.data?.message || 'Invalid request';
  }
  
  return new AppError(
    message,
    type,
    error,
    { status }
  );
};

/**
 * Get a user-friendly authentication error message
 * @param {Object} error - Authentication error
 * @returns {string} User-friendly error message
 */
const getAuthErrorMessage = (error) => {
  const code = error.code;
  
  const authErrorMessages = {
    'auth/email-already-exists': 'An account with this email already exists',
    'auth/email-already-in-use': 'An account with this email already exists',
    'auth/invalid-email': 'The email address is invalid',
    'auth/invalid-password': 'The password is invalid',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/weak-password': 'The password is too weak',
    'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later',
    'auth/user-disabled': 'This account has been disabled',
    'auth/requires-recent-login': 'Please log in again to complete this action',
    'auth/invalid-login-credentials': 'Incorrect email or password',
  };
  
  return authErrorMessages[code] || error.message || 'Authentication error';
};

/**
 * Get a user-friendly error message
 * @param {AppError} error - The error
 * @param {string} defaultMessage - Default message
 * @returns {string} User-friendly error message
 */
const getUserFriendlyMessage = (error, defaultMessage) => {
  // If we have a specific message for this error, return it
  if (error.message) {
    return error.message;
  }
  
  // Generic messages based on error type
  const typeMessages = {
    [ErrorTypes.AUTHENTICATION]: 'There was a problem with your account authentication',
    [ErrorTypes.AUTHORIZATION]: 'You don\'t have permission to perform this action',
    [ErrorTypes.VALIDATION]: 'Please check your information and try again',
    [ErrorTypes.NOT_FOUND]: 'The requested information could not be found',
    [ErrorTypes.SERVER]: 'Our servers are experiencing issues. Please try again later',
    [ErrorTypes.NETWORK]: 'Network connection error. Please check your internet connection',
    [ErrorTypes.PAYMENT]: 'There was a problem processing your payment',
    [ErrorTypes.DATABASE]: 'There was an issue with our database',
    [ErrorTypes.API]: 'There was a problem connecting to our services',
    [ErrorTypes.UNKNOWN]: defaultMessage
  };
  
  return typeMessages[error.type] || defaultMessage;
};

/**
 * Utility for safely running async functions with error handling
 * @param {Function} asyncFn - Async function to run
 * @param {Object} errorOptions - Options for error handling
 * @returns {Promise<Object>} Result with data or error
 */
export const safeAsync = async (asyncFn, errorOptions = {}) => {
  try {
    const result = await asyncFn();
    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      ...handleError(error, errorOptions)
    };
  }
};

/**
 * Validate data against requirements
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result
 */
export const validateData = (data, schema) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(schema).forEach(field => {
    const value = data[field];
    const fieldRules = schema[field];
    
    // Check required fields
    if (fieldRules.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${fieldRules.label || field} is required`;
      isValid = false;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if ((value === undefined || value === null || value === '') && !fieldRules.required) {
      return;
    }
    
    // Validate pattern
    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      errors[field] = fieldRules.patternMessage || `Invalid ${fieldRules.label || field}`;
      isValid = false;
    }
    
    // Validate min length
    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      errors[field] = `${fieldRules.label || field} must be at least ${fieldRules.minLength} characters`;
      isValid = false;
    }
    
    // Validate max length
    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      errors[field] = `${fieldRules.label || field} must be less than ${fieldRules.maxLength} characters`;
      isValid = false;
    }
    
    // Validate custom function
    if (fieldRules.validate && typeof fieldRules.validate === 'function') {
      const validationResult = fieldRules.validate(value, data);
      if (validationResult !== true) {
        errors[field] = validationResult;
        isValid = false;
      }
    }
  });
  
  return {
    isValid,
    errors,
    ...(isValid ? {} : {
      message: 'Validation failed. Please check the form for errors.'
    })
  };
};

export default {
  handleError,
  createAppError,
  safeAsync,
  validateData,
  ErrorTypes,
  AppError
};
