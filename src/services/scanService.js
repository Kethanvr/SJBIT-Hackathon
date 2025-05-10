import { supabase } from "../lib/supabase";
import profileService from "./profileService";
import { handleError, ErrorTypes, AppError } from "../utils/errorHandler";

/**
 * Service for handling scan-related operations
 */
const scanService = {
  /**
   * Process a new scan
   * @param {string} userId - User ID
   * @param {Object} scanData - Data for the scan
   * @returns {Promise<Object>} - Scan result with processed data
   */
  processScan: async (userId, scanData) => {
    if (!userId) {
      throw new AppError("User ID is required", ErrorTypes.VALIDATION);
    }
    if (!scanData) {
      throw new AppError("Scan data is required", ErrorTypes.VALIDATION);
    }

    try {
      // Process the scan data and get the result
      const processedResult = await processImageData(scanData);

      // Save the scan record
      const { data: scanRecord, error: scanError } = await supabase
        .from("scans")
        .insert([
          {
            user_id: userId,
            medicine_name: scanData.medicine_name || "Unknown",
            ingredients: scanData.ingredients || null,
            warnings: scanData.warnings || null,
            scan_data: scanData.rawData,
            created_at: new Date().toISOString(),
            image_url: scanData.image_url || null,
          },
        ])
        .select()
        .single();

      if (scanError) throw scanError;

      // Return the scan results
      return {
        success: true,
        scanId: scanRecord.id,
        results: processedResult,
        timestamp: scanRecord.created_at,
      };
    } catch (error) {
      throw handleError(error, {
        defaultMessage: "Failed to process scan",
      }).error
        ? error
        : new AppError("Failed to process scan", ErrorTypes.SERVER, error);
    }
  },

  /**
   * Get scan history for a user
   * @param {string} userId - User ID
   * @param {Object} options - Options for filtering and pagination
   * @returns {Promise<Array>} - Array of scan records
   */
  getScanHistory: async (userId, options = {}) => {
    if (!userId) {
      throw new AppError("User ID is required", ErrorTypes.VALIDATION);
    }

    try {
      let query = supabase.from("scans").select("*").eq("user_id", userId);

      // Apply filters if provided
      if (options.scanType) {
        query = query.eq("scan_type", options.scanType);
      }

      if (options.fromDate) {
        query = query.gte("created_at", options.fromDate);
      }

      if (options.toDate) {
        query = query.lte("created_at", options.toDate);
      }

      // Apply sorting and pagination
      query = query.order("created_at", {
        ascending: options.ascending || false,
      });

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      throw handleError(error, {
        defaultMessage: "Failed to fetch scan history",
      }).error
        ? error
        : new AppError(
            "Failed to fetch scan history",
            ErrorTypes.DATABASE,
            error
          );
    }
  },

  /**
   * Get details of a specific scan
   * @param {string} scanId - ID of the scan
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<Object>} - Scan details
   */
  getScanDetails: async (scanId, userId) => {
    if (!scanId) {
      throw new AppError("Scan ID is required", ErrorTypes.VALIDATION);
    }

    try {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .eq("id", scanId)
        .single();

      if (error) throw error;
      if (!data) throw new AppError("Scan not found", ErrorTypes.NOT_FOUND);

      // Verify ownership
      if (userId && data.user_id !== userId) {
        throw new AppError(
          "You do not have permission to access this scan",
          ErrorTypes.AUTHORIZATION
        );
      }

      return data;
    } catch (error) {
      throw handleError(error, {
        defaultMessage: "Failed to fetch scan details",
      }).error
        ? error
        : new AppError(
            "Failed to fetch scan details",
            ErrorTypes.DATABASE,
            error
          );
    }
  },
};

/**
 * Process the image data to extract scan results
 * (This is a placeholder for your actual image processing logic)
 * @param {Object} scanData - Raw scan data
 * @returns {Promise<Object>} - Processed scan results
 */
async function processImageData(scanData) {
  // This would be replaced with your actual image processing logic
  // For example, calling your ML model API or processing library

  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    detectedItems: scanData.predetectedItems || ["Unknown medicine"],
    confidence: 0.95,
    warnings: [],
    dosage: "Unknown",
    processedAt: new Date().toISOString(),
  };
}

export default scanService;
