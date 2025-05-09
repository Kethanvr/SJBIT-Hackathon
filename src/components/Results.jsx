import React, { useRef, useState } from "react";
import {
  FiX,
  FiAlertCircle,
  FiClock,
  FiThermometer,
  FiDollarSign,
  FiInfo,
  FiExternalLink,
  FiShare2,
  FiDownload,
  FiShoppingCart,
  FiImage,
} from "react-icons/fi";
import { MdMedication } from "react-icons/md";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import BottomNav from "./common/BottomNav";
import AskWithAiOverlay from "./AskWithAiOverlay";

const HighlightBadge = ({ children, type = "default" }) => {
  const colors = {
    warning: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    default: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-medium ${colors[type]}`}
    >
      {children}
    </span>
  );
};

const ResultCard = ({ title, data, icon: Icon, highlight = [] }) => {
  if (!data || Object.values(data).every((value) => !value)) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        {Icon && <Icon className="w-6 h-6 text-blue-600" />}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="space-y-4">
        {Object.entries(data).map(([key, value]) => {
          if (!value) return null;

          const isHighlighted = highlight.includes(key);
          const formattedKey = key.replace(/_/g, " ");

          return (
            <div
              key={key}
              className={`${isHighlighted ? "bg-blue-50 p-3 rounded-lg" : ""}`}
            >
              <span className="text-sm font-medium text-gray-500 capitalize block mb-1">
                {formattedKey}
              </span>
              <span
                className={`${
                  isHighlighted
                    ? "text-lg font-medium text-blue-900"
                    : "text-gray-800"
                }`}
              >
                {value}
                {key === "expiry_date" && (
                  <HighlightBadge type="warning">Important</HighlightBadge>
                )}
                {key === "prescription_required" &&
                  value.toLowerCase() === "yes" && (
                    <HighlightBadge type="warning">
                      Prescription Required
                    </HighlightBadge>
                  )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Results = ({ scanData, previewImage, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadAlert, setShowDownloadAlert] = useState(false);
  const [showAskAi, setShowAskAi] = useState(false);
  const resultRef = useRef(null);

  const handleShare = async () => {
    try {
      const shareData = {
        title: "Medicine Scan Results",
        text: `Medicine: ${scanData.product_identification?.medicine_name}\nGeneric Name: ${scanData.product_identification?.generic_name}\nUsage: ${scanData.usage_information?.dosage}`,
      };

      // Check if running in a PWA or standalone mode
      const isPWA = window.matchMedia("(display-mode: standalone)").matches;
      const isShareSupported = navigator.share && !isPWA;

      if (isShareSupported) {
        await navigator.share({
          ...shareData,
          url: window.location.href,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.text);
        const alert = document.createElement("div");
        alert.className =
          "fixed top-4 left-4 right-4 bg-green-500 text-white py-2 px-4 rounded-lg text-center z-50 animate-fade-in";
        alert.textContent = "Results copied to clipboard!";
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Show error message
      const alert = document.createElement("div");
      alert.className =
        "fixed top-4 left-4 right-4 bg-red-500 text-white py-2 px-4 rounded-lg text-center z-50 animate-fade-in";
      alert.textContent = "Failed to share results. Please try again.";
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    }
  };

  const exportToPDF = async () => {
    try {
      setIsDownloading(true);
      setShowDownloadAlert(true);

      // Create a clone of the result content to manipulate for PDF export
      const contentElement = resultRef.current.cloneNode(true);

      // Remove top navigation bar and bottom navigation from the clone
      const topBar = contentElement.querySelector(".fixed.top-0");
      if (topBar) topBar.remove();

      const bottomNav = contentElement.querySelector("nav");
      if (bottomNav) bottomNav.remove();

      const downloadAlert = contentElement.querySelector(".fixed.top-4");
      if (downloadAlert) downloadAlert.remove();

      // Temporarily append the clone to the document body but hide it
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.appendChild(contentElement);
      document.body.appendChild(tempDiv);

      // Configure html2canvas for better quality
      const canvas = await html2canvas(contentElement, {
        scale: 2, // Increase scale for better quality
        useCORS: true, // Enable CORS for images
        logging: false,
        backgroundColor: "#f9fafb", // Match bg-gray-50
        windowWidth: 1920, // Force desktop width for better quality
      });

      // Remove the temporary element
      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Use JPEG with max quality
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
      const imgY = 0;

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

      // Add a footer with date
      const today = new Date();
      const dateStr = `Generated on: ${today.toLocaleDateString()}`;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(dateStr, pdfWidth - 60, pdfHeight - 10);

      pdf.save(
        `${
          scanData.product_identification?.medicine_name || "medicine"
        }-scan.pdf`
      );

      setTimeout(() => setShowDownloadAlert(false), 3000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBuyNow = (url) => {
    window.open(url, "_blank");
  };

  if (!scanData) return null;

  return (
    <div className="min-h-screen bg-gray-50" ref={resultRef}>
      {/* Download Alert */}
      {showDownloadAlert && (
        <div className="fixed top-4 left-4 right-4 bg-blue-500 text-white py-2 px-4 rounded-lg text-center z-50 animate-fade-in">
          {isDownloading ? "Generating PDF..." : "PDF downloaded successfully!"}
        </div>
      )}

      {/* Ask with AI Overlay */}
      <AskWithAiOverlay
        open={showAskAi}
        onClose={() => setShowAskAi(false)}
        scanData={scanData}
      />

      {/* Top Bar with Actions */}
      <div className="fixed top-0 left-0 right-0 flex items-center px-3 py-2 bg-white shadow-sm z-50">
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FiX className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 ml-2 flex-1">
          Scan Results
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
          >
            <FiShare2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={exportToPDF}
            disabled={isDownloading}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 disabled:opacity-50"
          >
            <FiDownload className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-14 pb-20">
        {/* Scanned Image - Enhanced with better Supabase image_url handling */}
        <div className="mb-8">
          {previewImage ? (
            <div className="rounded-lg overflow-hidden shadow-lg mx-auto">
              <img
                src={previewImage}
                alt={
                  scanData.product_identification?.medicine_name ||
                  "Scanned medicine"
                }
                className="w-full max-w-2xl mx-auto"
                onError={(e) => {
                  console.error("Image failed to load from URL:", previewImage);
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/400x300?text=Image+Not+Available";
                }}
                onLoad={() =>
                  console.log(
                    "Successfully loaded image from Supabase:",
                    previewImage
                  )
                }
              />
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center max-w-2xl mx-auto">
              <FiImage className="w-16 h-16 text-gray-400 mb-2" />
              <p className="text-gray-500">No image available for this scan</p>
            </div>
          )}
        </div>
        {/* Ask with AI Button */}
        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-6 shadow hover:bg-blue-700 transition"
          onClick={() => setShowAskAi(true)}
        >
          Ask with AI
        </button>
        {/* Important Warnings Section - Move to Top, Red Color Theme */}
        {(scanData.product_identification?.prescription_required === "Yes" ||
          scanData.safety_and_storage?.warnings) && (
          <div className="bg-red-500 border-2 border-red-600 rounded-xl p-5 mb-6 shadow-lg animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <FiAlertCircle className="w-7 h-7 text-white bg-red-700 rounded-full p-1 shadow" />
              <h3
                className="font-bold text-lg text-white tracking-wide"
                style={{ fontFamily: "Inter, Arial, sans-serif" }}
              >
                Important Warnings
              </h3>
            </div>
            <div className="text-white space-y-2 text-base font-medium">
              {scanData.product_identification?.prescription_required ===
                "Yes" && (
                <p>
                  ⚠️ This medicine{" "}
                  <span className="underline font-bold">
                    requires a prescription
                  </span>
                </p>
              )}
              {scanData.safety_and_storage?.warnings && (
                <p>{scanData.safety_and_storage.warnings}</p>
              )}
            </div>
          </div>
        )}

        {/* Generic Alternatives Section */}
        {scanData.generic_alternatives && (
          <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-3 text-blue-700">
              Generic Alternatives
            </h2>
            <div className="space-y-3">
              {scanData.generic_alternatives.map((alt) => (
                <div
                  key={alt.name}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-blue-50 rounded-lg gap-2 border border-blue-200"
                >
                  <div>
                    <h3 className="font-semibold text-blue-800">{alt.name}</h3>
                    <p className="text-sm text-blue-600">
                      Price: <span className="font-bold">${alt.price}</span> •
                      Savings: <span className="font-bold">{alt.savings}%</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBuyNow(alt.purchase_url)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 shadow"
                  >
                    <FiShoppingCart />
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medicine Name */}
        {scanData.product_identification?.medicine_name && (
          <div className="text-center mb-8">
            <h2
              className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight"
              style={{ fontFamily: "Inter, Arial, sans-serif" }}
            >
              {scanData.product_identification.medicine_name}
            </h2>
          </div>
        )}

        {/* Additional Details Card */}
        {scanData.additional_details && (
          <ResultCard
            title="Additional Details"
            icon={FiInfo}
            data={scanData.additional_details}
            highlight={["categories", "manufacturer", "batch_number"]}
          />
        )}

        {/* Usage Information (Priority Display) */}
        <ResultCard
          title="Usage Information"
          icon={MdMedication}
          data={scanData.usage_information}
          highlight={[
            "dosage",
            "administration_method",
            "indications",
            "directions_for_use",
            "contraindications",
            "side_effects",
            "uses",
          ]}
        />

        {/* Main Information Cards - Responsive for mobile, more color */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <ResultCard
            title="Product Details"
            icon={FiInfo}
            data={scanData.product_identification}
            highlight={[
              "expiry_date",
              "batch_number",
              "brands",
              "dosage_form",
              "strength",
              "code",
            ]}
          />
          <ResultCard
            title="Ingredients & Allergens"
            icon={FiThermometer}
            data={scanData.ingredients_and_allergens}
            highlight={[
              "active_ingredients",
              "inactive_ingredients",
              "allergens",
              "warnings",
            ]}
          />
          <ResultCard
            title="Safety & Storage"
            icon={FiClock}
            data={scanData.safety_and_storage}
            highlight={[
              "storage_conditions",
              "manufacture_date",
              "expiry_date",
              "warnings",
            ]}
          />
          <ResultCard
            title="Pricing Information"
            icon={FiDollarSign}
            data={scanData.pricing_information}
            highlight={["price", "price_per_unit"]}
          />
        </div>

        {/* Learn More Card with simplified link */}
        {scanData.search?.google_search_url && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 mt-8 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Want to Learn More?
                </h3>
                <p className="text-blue-100">
                  Find detailed information about this medicine online
                </p>
              </div>
              <div>
                <a
                  href={scanData.search.google_search_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 justify-center shadow"
                >
                  Click to know more
                  <FiExternalLink />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-24" />
      </div>

      {/* Add BottomNav component */}
      <BottomNav />
    </div>
  );
};

export default Results;