// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\utils\apiUtils.js

const localApiBaseUrl = import.meta.env.VITE_API_URL;
const productionApiBaseUrl = import.meta.env.VITE_PRODUCTION_URL;

/**
 * Makes an API request, trying the local URL first and falling back to production.
 * Ensures VITE_API_URL and VITE_PRODUCTION_URL are defined in your .env file.
 *
 * @param {string} endpoint - The API endpoint path (e.g., '/api/analyze'). Should start with '/'.
 * @param {RequestInit} options - The options for the fetch request (method, headers, body, etc.).
 * @param {boolean} [expectJson=true] - Whether to expect and parse a JSON response. Set to false for non-JSON responses.
 * @returns {Promise<any>} - The response from the successful API call (parsed JSON if expectJson is true, otherwise the Response object).
 * @throws {Error} - Throws an error if both requests fail or if required URLs are missing.
 */
export const fetchWithFallback = async (endpoint, options = {}, expectJson = true) => {
  if (!localApiBaseUrl || !productionApiBaseUrl) {
    console.error("Error: VITE_API_URL or VITE_PRODUCTION_URL is not defined in the environment variables.");
    throw new Error("API base URLs are not configured.");
  }

  // Ensure endpoint starts with a slash
  const apiPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // Remove trailing slash from base URLs if present
  const cleanLocalBase = localApiBaseUrl.endsWith('/') ? localApiBaseUrl.slice(0, -1) : localApiBaseUrl;
  const cleanProdBase = productionApiBaseUrl.endsWith('/') ? productionApiBaseUrl.slice(0, -1) : productionApiBaseUrl;

  const localUrl = `${cleanLocalBase}${apiPath}`;
  const productionUrl = `${cleanProdBase}${apiPath}`;

  let response;
  let errorDetails = {};

  // 1. Try Local URL
  try {
    console.log(`Attempting API request to local: ${localUrl}`);
    response = await fetch(localUrl, options);
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Could not read error body');
      errorDetails.local = { status: response.status, body: errorBody };
      console.warn(`Local request to ${localUrl} failed with status: ${response.status}. Body: ${errorBody}. Trying production.`);
      throw new Error(`Local request failed: ${response.status}`); // Trigger fallback
    }
    console.log(`Local request to ${localUrl} successful.`);
  } catch (localError) {
    if (!(localError instanceof Error && localError.message.startsWith('Local request failed'))) {
      // Only log network/fetch errors here, status errors logged above
      console.warn(`Local request failed: ${localError.message}. Falling back to production: ${productionUrl}`);
      errorDetails.local = { message: localError.message };
    }

    // 2. Try Production URL (Fallback)
    try {
      console.log(`Attempting API request to production: ${productionUrl}`);
      response = await fetch(productionUrl, options);
      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Could not read error body');
        errorDetails.production = { status: response.status, body: errorBody };
        console.error(`Production request to ${productionUrl} also failed with status: ${response.status}. Body: ${errorBody}`);
        throw new Error(`Production request failed: ${response.status} - ${errorBody}`);
      }
      console.log(`Production request to ${productionUrl} successful.`);
    } catch (productionError) {
      errorDetails.production = { message: productionError.message };
      console.error(`Both local and production requests failed for endpoint: ${apiPath}. Local Error: ${JSON.stringify(errorDetails.local)}, Production Error: ${JSON.stringify(errorDetails.production)}`);
      throw new Error(`API request failed on both local and production endpoints for ${apiPath}.`);
    }
  }

  // Process the successful response
  if (expectJson) {
    try {
      return await response.json();
    } catch (jsonError) {
      console.error(`Failed to parse JSON response from ${response.url}:`, jsonError);
      throw new Error(`Invalid JSON response received from ${response.url}.`);
    }
  } else {
    return response; // Return the raw Response object if JSON parsing is not expected
  }
};
