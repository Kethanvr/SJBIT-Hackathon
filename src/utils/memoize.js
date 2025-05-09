// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\utils\memoize.js
/**
 * Memoization utilities for improving performance in the MediScan application
 * 
 * This file contains helper functions for memoizing expensive computations,
 * which can significantly improve performance, especially in list rendering
 * and complex calculations.
 */

/**
 * Simple memoize function for caching results of function calls
 * 
 * @param {Function} fn - The function to memoize
 * @returns {Function} - Memoized function
 * 
 * Usage:
 * const expensiveFunction = memoize((a, b) => {
 *   // expensive calculation here
 *   return result;
 * });
 */
export function memoize(fn) {
  const cache = new Map();
  
  return function(...args) {
    // Create a string key from the arguments
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    
    return result;
  };
}

/**
 * Creates a stable callback that only changes when its dependencies change
 * Similar to useCallback but can be used outside React or in class components
 * 
 * @param {Function} callback - The callback to stabilize
 * @param {Array} dependencies - Array of dependencies
 * @returns {Function} - Stable callback
 */
export function createStableCallback(callback, dependencies) {
  let lastDeps = null;
  let lastCallback = null;
  
  return function(...args) {
    const depsString = JSON.stringify(dependencies);
    
    if (lastDeps !== depsString) {
      lastDeps = depsString;
      lastCallback = callback;
    }
    
    return lastCallback.apply(this, args);
  };
}

/**
 * Memoize the result of a function based on its arguments and a max cache size
 * This is useful for functions that may be called with many different arguments
 * 
 * @param {Function} fn - The function to memoize
 * @param {Object} options - Options object
 * @param {number} options.maxSize - Maximum number of results to cache (default: 100)
 * @returns {Function} - Memoized function with LRU cache
 */
export function memoizeWithLRU(fn, { maxSize = 100 } = {}) {
  const cache = new Map();
  const keyOrder = [];
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      // Move this key to the end of the order (most recently used)
      const index = keyOrder.indexOf(key);
      keyOrder.splice(index, 1);
      keyOrder.push(key);
      
      return cache.get(key);
    }
    
    // Enforce the max cache size by removing least recently used items
    if (keyOrder.length >= maxSize) {
      const oldestKey = keyOrder.shift();
      cache.delete(oldestKey);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    keyOrder.push(key);
    
    return result;
  };
}

/**
 * Memoize a function with a timeout to automatically clear cached results
 * This is useful for data that may become stale over time
 * 
 * @param {Function} fn - The function to memoize
 * @param {number} timeout - Time in milliseconds before cache invalidation
 * @returns {Function} - Memoized function with timeout
 */
export function memoizeWithTimeout(fn, timeout = 60000) {
  const cache = new Map();
  const timestamps = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();
    
    if (cache.has(key)) {
      const timestamp = timestamps.get(key);
      
      if (now - timestamp < timeout) {
        return cache.get(key);
      }
      
      // Clear expired cache entry
      cache.delete(key);
      timestamps.delete(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    timestamps.set(key, now);
    
    return result;
  };
}

/**
 * Memoize a component's props to prevent unnecessary re-renders
 * This is similar to React.memo() but provides more control over equality checking
 * 
 * @param {Object} prevProps - Previous props
 * @param {Object} nextProps - New props
 * @param {Array} propsToCompare - List of prop names to compare, or null for all
 * @returns {boolean} - True if props are equal (no re-render needed)
 */
export function arePropsEqual(prevProps, nextProps, propsToCompare = null) {
  const propKeys = propsToCompare || Object.keys(prevProps);
  
  return propKeys.every(key => {
    const prev = prevProps[key];
    const next = nextProps[key];
    
    if (typeof prev === 'function' && typeof next === 'function') {
      // Consider functions equal since they can't be properly compared
      return true;
    }
    
    if (Array.isArray(prev) && Array.isArray(next)) {
      if (prev.length !== next.length) return false;
      return prev.every((val, i) => val === next[i]);
    }
    
    if (typeof prev === 'object' && prev !== null && 
        typeof next === 'object' && next !== null) {
      return JSON.stringify(prev) === JSON.stringify(next);
    }
    
    return prev === next;
  });
}

/**
 * Default export for common use case
 */
export default memoize;
