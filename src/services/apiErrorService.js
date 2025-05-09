import { handleError, ErrorTypes, AppError } from '../utils/errorHandler';

/**
 * Service for handling API errors and responses consistently
 */
const apiErrorService = {
  /**
   * Create a standardized error response
   * @param {Error} error - The error object
   * @param {string} defaultMessage - Default error message
   * @returns {Object} - Standardized error response
   */
  createErrorResponse: (error, defaultMessage) => {
    const result = handleError(error, {
      showToUser: true,
      logToConsole: true,
      defaultMessage,
    });
    
    return {
      success: false,
      error: true,
      message: result.message,
      type: result.type,
      ...(process.env.NODE_ENV !== 'production' ? {
        details: result.details
      } : {})
    };
  },
  
  /**
   * Create a standardized success response
   * @param {Object} data - The data to include in the response
   * @param {string} message - Success message
   * @returns {Object} - Standardized success response
   */
  createSuccessResponse: (data, message = 'Operation successful') => {
    return {
      success: true,
      message,
      data
    };
  },
  
  /**
   * Handle a database query and return standardized response
   * @param {Function} queryFn - Async function that performs the database query
   * @param {string} errorMessage - Error message if the query fails
   * @param {Function} transformFn - Optional function to transform the result
   * @returns {Promise<Object>} - Standardized response
   */
  async handleQuery(queryFn, errorMessage, transformFn = null) {
    try {
      const result = await queryFn();
      
      // Handle Supabase error
      if (result.error) {
        throw new AppError(
          result.error.message,
          ErrorTypes.DATABASE,
          result.error
        );
      }
      
      // Transform data if transform function is provided
      const data = transformFn ? transformFn(result.data) : result.data;
      
      return this.createSuccessResponse(data);
    } catch (error) {
      return this.createErrorResponse(error, errorMessage);
    }
  },
  
  /**
   * Handle a service operation and return standardized response
   * @param {Function} operationFn - Async function that performs the operation
   * @param {string} errorMessage - Error message if the operation fails
   * @returns {Promise<Object>} - Standardized response
   */
  async handleOperation(operationFn, errorMessage) {
    try {
      const result = await operationFn();
      return this.createSuccessResponse(result);
    } catch (error) {
      return this.createErrorResponse(error, errorMessage);
    }
  },
  
  /**
   * Validate input data
   * @param {Object} data - The data to validate
   * @param {Array<Object>} validations - Array of validation rules
   * @returns {Object} - Validation result
   */
  validateInput(data, validations) {
    const errors = {};
    
    for (const validation of validations) {
      const { field, value, required, validator, message } = validation;
      
      // Check required fields
      if (required && (value === undefined || value === null || value === '')) {
        errors[field] = message || `${field} is required`;
        continue;
      }
      
      // Skip other validations if field is empty and not required
      if (!required && (value === undefined || value === null || value === '')) {
        continue;
      }
      
      // Custom validator
      if (validator && typeof validator === 'function' && !validator(value, data)) {
        errors[field] = message || `Invalid ${field}`;
      }
    }
    
    const hasErrors = Object.keys(errors).length > 0;
    
    return {
      isValid: !hasErrors,
      errors,
      ...(hasErrors ? {
        message: 'Validation failed',
        success: false
      } : {})
    };
  }
};

export default apiErrorService;
