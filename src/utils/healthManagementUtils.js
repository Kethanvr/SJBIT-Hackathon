// Utility functions for HealthManagement logic

export const formatShareText = (formData, t) => {
  return `${t ? t("share.title") : "Health Record"}: ${formData.name}
${t ? t("share.recordType") : "Type"}: ${formData.recordType}
${t ? t("share.recordDate") : "Date"}: ${new Date(formData.date).toLocaleDateString()}
${formData.description ? `${t ? t("share.description") : "Description"}: ${formData.description}` : ""}`;
};

export const handleShareRecord = async ({ recordId, formData, imageUrl, t }) => {
  if (!recordId) return;
  try {
    const shareText = formatShareText(formData, t);
    if (navigator.share) {
      await navigator.share({
        title: `${t ? t("share.title") : "Health Record"}: ${formData.name}`,
        text: shareText,
        url: imageUrl || window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(shareText);
      alert(t ? t("share.copySuccess") : "Health record details copied to clipboard!");
    }
  } catch (error) {
    console.error("Error sharing health record:", error);
    if (error.name !== "AbortError") {
      alert(t ? t("share.shareError") : "Failed to share health record. Please try again.");
    }
  }
};

export const handleDownloadPDF = async ({ recordRef, formData, exportToPDF, t }) => {
  if (!recordRef.current) {
    alert(t ? t("download.error") : "Record content not found");
    return;
  }
  try {
    const fileName = `health-record-${formData.name.replace(/\s+/g, "-").toLowerCase()}`;
    const success = await exportToPDF(recordRef.current, fileName);
    if (!success) {
      alert(t ? t("download.error") : "Failed to generate PDF. Please try again.");
    }
  } catch (error) {
    console.error("PDF generation error:", error);
    alert(t ? t("download.error") : "Error generating PDF. Please try again.");
  }
};
