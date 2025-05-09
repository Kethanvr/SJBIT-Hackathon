/**
 * String formatting utility functions
 */

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitalize the first letter of each word in a string
 * @param {string} str - The string to title case
 * @returns {string} - Title cased string
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert a string to camelCase
 * @param {string} str - The string to convert
 * @returns {string} - camelCased string
 */
export const toCamelCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

/**
 * Truncate a string if it's longer than maxLength and add an ellipsis
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} - Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Format a number with commas for thousands
 * @param {number} value - The number to format
 * @param {number} decimalPlaces - Number of decimal places
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value, decimalPlaces = 0) => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
};

/**
 * Convert a string to kebab-case
 * @param {string} str - The string to convert
 * @returns {string} - kebab-cased string
 */
export const toKebabCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

/**
 * Create a slug from a string (for URLs)
 * @param {string} str - The string to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Extract initials from a name (first letter of first and last name)
 * @param {string} name - The full name
 * @returns {string} - Initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  const names = name.split(' ').filter(Boolean);
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};