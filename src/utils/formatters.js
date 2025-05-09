
/**
 * Formats a date string or Date object into a locale-specific string.
 * @param {string | Date} date - The date to format.
 * @param {string} [locale='en-US'] - The locale to use.
 * @param {Intl.DateTimeFormatOptions} [options] - Formatting options.
 * @returns {string} The formatted date string.
 */
export const formatDate = (
  date,
  locale = "en-US",
  options = {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }
) => {
  try {
    const d = new Date(date);
    // Check if the date is valid before formatting
    if (isNaN(d.getTime())) {
      console.warn("Invalid date passed to formatDate:", date);
      return "Invalid Date";
    }
    return d.toLocaleString(locale, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Formats a date string or Date object into a locale-specific time string.
 * @param {string | Date} date - The date to format.
 * @param {string} [locale='en-US'] - The locale to use.
 * @param {Intl.DateTimeFormatOptions} [options] - Formatting options.
 * @returns {string} The formatted time string.
 */
export const formatTime = (
  date,
  locale = "en-US",
  options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Default to 12-hour format, adjust if needed
  }
) => {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      console.warn("Invalid date passed to formatTime:", date);
      return "Invalid Time";
    }
    return d.toLocaleTimeString(locale, options);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Time";
  }
};

