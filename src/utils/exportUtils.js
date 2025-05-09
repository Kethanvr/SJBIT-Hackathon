import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Exports an HTML element to a PDF file
 * @param {HTMLElement} element - The element to export
 * @param {string} fileName - The name of the file to be downloaded
 */
export const exportToPDF = async (element, fileName = "document") => {
  try {
    if (!element) {
      console.error("No element provided for PDF export");
      return null;
    }
    
    // Configure html2canvas for better quality
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10; // Small margin at top

    pdf.addImage(
      imgData,
      "JPEG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio,
      "",
      "FAST"
    );
    
    // Add footer with date
    const today = new Date();
    const dateStr = `Generated: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(dateStr, 10, pdfHeight - 10);

    // Save the PDF
    pdf.save(`${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return null;
  }
};
