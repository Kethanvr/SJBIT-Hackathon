/**
 * Form validation utility functions
 */

/**
 * Check if a value is empty (null, undefined, empty string, or only whitespace)
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
export const isEmpty = (value) => {
  return value === null || 
         value === undefined || 
         (typeof value === 'string' && value.trim() === '');
};

/**
 * Check if a value is a valid email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if a value is a valid phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if the phone number is valid
 */
export const isValidPhone = (phone) => {
  // Basic phone validation (digits, spaces, dashes, parentheses, plus)
  const phoneRegex = /^[0-9\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

/**
 * Check if a password meets complexity requirements
 * @param {string} password - The password to validate
 * @returns {boolean} - True if the password meets requirements
 */
export const isValidPassword = (password) => {
  if (!password || password.length < 8) return false;
  
  // Require at least one each: uppercase, lowercase, digit
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  
  return hasUppercase && hasLowercase && hasDigit;
};

/**
 * Check if two passwords match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {boolean} - True if the passwords match
 */
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Check if a date is valid and in the past
 * @param {string} dateString - The date string to validate
 * @returns {boolean} - True if the date is valid and in the past
 */
export const isPastDate = (dateString) => {
  if (isEmpty(dateString)) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid and in the past
  return !isNaN(date) && date < now;
};

/**
 * Check if a date is valid and in the future
 * @param {string} dateString - The date string to validate
 * @returns {boolean} - True if the date is valid and in the future
 */
export const isFutureDate = (dateString) => {
  if (isEmpty(dateString)) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid and in the future
  return !isNaN(date) && date > now;
};

/**
 * Validate a form field
 * @param {string} name - Field name
 * @param {*} value - Field value
 * @param {Object} validations - Validation rules
 * @returns {string} - Empty string if valid, error message otherwise
 */
export const validateField = (name, value, validations) => {
  if (validations.required && isEmpty(value)) {
    return `${name} is required`;
  }
  
  if (!isEmpty(value)) {
    if (validations.email && !isValidEmail(value)) {
      return 'Please enter a valid email address';
    }
    
    if (validations.phone && !isValidPhone(value)) {
      return 'Please enter a valid phone number';
    }
    
    if (validations.minLength && value.length < validations.minLength) {
      return `${name} must be at least ${validations.minLength} characters`;
    }
    
    if (validations.maxLength && value.length > validations.maxLength) {
      return `${name} must be less than ${validations.maxLength} characters`;
    }
    
    if (validations.pattern && !validations.pattern.test(value)) {
      return validations.patternMessage || `${name} format is invalid`;
    }
  }
  
  return '';
};