/**
 * Date utility functions for consistent date handling across the application
 */

/**
 * Returns today's date in YYYY-MM-DD format for use in date inputs
 * @returns {string} Today's date formatted as YYYY-MM-DD
 */
export const getTodayFormatted = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Formats a date string into a locale-specific string
 * @param {string} date - The date string to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  const d = new Date(date);
  return d.toLocaleString("en-US", mergedOptions);
};

/**
 * Checks if a date string is expired (before today)
 * @param {string} dateStr - The date string to check
 * @returns {boolean} True if the date is in the past
 */
export const isExpired = (dateStr) => {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Strip time part for comparison
  return date < today;
};
