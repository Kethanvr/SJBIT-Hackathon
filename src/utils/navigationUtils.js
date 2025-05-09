/**
 * Navigation utilities for MediScan
 * Contains functions for common navigation patterns and localStorage management
 */

/**
 * Navigates to scan details and stores necessary data in localStorage
 * @param {Function} navigate - React Router's navigate function
 * @param {Object} scan - The scan object containing details
 */
export const navigateToScanDetails = (navigate, scan) => {
  if (!scan || !scan.id) {
    console.error("Invalid scan object provided to navigateToScanDetails");
    return;
  }

  try {
    localStorage.setItem("currentScanId", scan.id);
    localStorage.setItem("currentScanData", JSON.stringify(scan.scan_data || {}));
    localStorage.setItem("currentScanName", scan.medicine_name || "Untitled Scan");
    localStorage.setItem("currentScanImage", scan.image_url || "");
    
    navigate(`/scan/${scan.id}`);
  } catch (error) {
    console.error("Error navigating to scan details:", error);
  }
};

/**
 * Navigates to a chat session and stores necessary data in localStorage
 * @param {Function} navigate - React Router's navigate function
 * @param {Object} chat - The chat object containing details and messages
 */
export const navigateToChat = (navigate, chat) => {
  if (!chat || !chat.id) {
    console.error("Invalid chat object provided to navigateToChat");
    return;
  }

  try {
    localStorage.setItem("currentChatId", chat.id);
    localStorage.setItem("currentChatTitle", chat.title || "Chat Session");
    
    navigate(`/chat?chatId=${chat.id}`);
  } catch (error) {
    console.error("Error navigating to chat:", error);
  }
};

/**
 * Clears a specific type of data from localStorage
 * @param {string} type - The type of data to clear ('scan' or 'chat')
 */
export const clearStoredData = (type) => {
  if (type === 'scan') {
    localStorage.removeItem("currentScanId");
    localStorage.removeItem("currentScanData");
    localStorage.removeItem("currentScanName");
    localStorage.removeItem("currentScanImage");
  } else if (type === 'chat') {
    localStorage.removeItem("currentChatId");
    localStorage.removeItem("currentChatMessages");
    localStorage.removeItem("currentChatTitle");
  }
};

/**
 * Prepares medication data for AI chat and navigates to chat page
 * @param {Function} navigate - React Router's navigate function
 * @param {Object} scan - The scan object containing medication details
 */
export const navigateToMedicationChat = (navigate, scan) => {
  if (!scan) return;
  
  try {
    localStorage.setItem("medicationToAsk", scan.medicine_name || "Unknown Medication");
    localStorage.setItem("medicationDetails", JSON.stringify({
      name: scan.medicine_name || "Unknown Medication",
      ingredients: scan.scan_data?.product_identification?.active_ingredients || "",
      uses: scan.scan_data?.usage_information?.indications || ""
    }));
    
    navigate(`/chat?context=medication&scanId=${scan.id}`);
  } catch (error) {
    console.error("Error navigating to medication chat:", error);
  }
};
