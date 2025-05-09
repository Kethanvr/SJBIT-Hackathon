// src/utils/scanUtils.js

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
}

export function generateShareText(scan, t) {
  if (!scan) return '';
  return `${t('results:share.medicineLabel')}: ${scan.medicine_name || t('results:unknown')}
${scan.scan_data?.product_identification?.active_ingredients ? `${t('results:share.ingredientsLabel')}: ${scan.scan_data.product_identification.active_ingredients}
` : ''}${scan.scan_data?.usage_information?.indications ? `${t('results:share.usesLabel')}: ${scan.scan_data.usage_information.indications}` : ''}`;
}

export function getScanFromLocalStorage() {
  const id = localStorage.getItem("currentScanId");
  const scanData = localStorage.getItem("currentScanData");
  if (!id || !scanData) return null;
  return {
    id,
    medicine_name: localStorage.getItem("currentScanName") || "Untitled Scan",
    scan_data: JSON.parse(scanData),
    image_url: localStorage.getItem("currentScanImage") || null
  };
}

export function saveScanToLocalStorage(scan) {
  if (!scan || !scan.id) return;
  localStorage.setItem("currentScanId", scan.id);
  localStorage.setItem("currentScanData", JSON.stringify(scan.scan_data || {}));
  localStorage.setItem("currentScanName", scan.medicine_name || "Untitled Scan");
  
  // Extract the image URL properly
  let imageUrl = scan.image_url || "";
  if (typeof imageUrl === "object" && imageUrl !== null) {
    // If it's an object, try to get the secure_url or url property
    imageUrl = imageUrl.secure_url || imageUrl.url || "";
  }
  localStorage.setItem("currentScanImage", imageUrl);
}
