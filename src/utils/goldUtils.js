/**
 * Utility functions for membership management in MediScan (simplified)
 * 
 * This file has been simplified to remove Gold/Pro functionality.
 * It now only provides no-op functions for backward compatibility.
 */

/**
 * Function that previously refreshed app state after gold activation.
 * Now a no-op function for backward compatibility.
 */
export const refreshAfterGoldActivation = () => {
  // No operation needed
  return;
};

/**
 * Function that previously checked if this is the first load after gold activation.
 * Now always returns false.
 * 
 * @returns {boolean} Always returns false
 */
export const isFirstLoadAfterGoldActivation = () => {
  return false;
};
