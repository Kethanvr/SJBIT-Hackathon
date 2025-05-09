/**
 * Theme cache utilities (simplified)
 * 
 * This file has been simplified to remove Pro/Gold theme functionality.
 * It now only provides no-op functions for backward compatibility.
 */

/**
 * Gets cached Pro status (now always returns false)
 * @returns {boolean} Always returns false
 */
export const getCachedProStatus = () => {
  return false;
};

/**
 * Sets the Pro status in cache (now a no-op function)
 * @param {boolean} isPro - Pro status to cache (ignored)
 */
export const setCachedProStatus = (isPro) => {
  // No-op function
  return;
};

/**
 * Gets cached Pro theme object (now always returns null)
 * @returns {null} Always returns null
 */
export const getCachedProTheme = () => {
  return null;
};

/**
 * Sets the Pro theme in cache (now a no-op function)
 * @param {Object} themeData - Theme data to cache (ignored)
 */
export const setCachedProTheme = (themeData) => {
  // No-op function
  return;
};

/**
 * Clears Pro theme cache (now a no-op function)
 */
export const clearProThemeCache = () => {
  // No-op function
  return;
};

/**
 * Preloads theme assets (now a no-op function)
 */
export const preloadProThemeAssets = () => {
  // No-op function
  return Promise.resolve();
};
