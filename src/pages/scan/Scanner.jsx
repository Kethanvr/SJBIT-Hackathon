import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { FiCamera, FiArrowLeft, FiWifi, FiWifiOff } from "react-icons/fi";
import Results from "../../components/Results";
import BottomNav from "../../components/common/BottomNav";
import { useTranslation } from "react-i18next";
import scanService from "../../services/scanService";
import { supabase } from "../../lib/supabase";
import { fetchWithFallback } from "../../utils/apiUtils";
import { optimizeImageIfPossible } from "../../utils/imageUtils";
import CameraError from "../../components/scan/CameraError";
import LoadingOverlay from "../../components/scan/LoadingOverlay";
import NetworkErrorBanner from "../../components/scan/NetworkErrorBanner";
import FileUploadButton from "../../components/scan/FileUploadButton";
import { getProfile } from "../../lib/supabase/profile";
import HomeHeader from "../../components/home/HomeHeader";
import Sidebar from "../../components/Sidebar";
import StandardLoadingIndicator from "../../components/common/StandardLoadingIndicator";
import FeedbackButton from "../../components/ui/FeedbackButton";

const Scanner = () => {
  const { t } = useTranslation("scanner");
  const [networkError, setNetworkError] = useState(!navigator.onLine);
  const [uploadMessage, setUploadMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [coinBalance, setCoinBalance] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const handleOnline = () => setNetworkError(false);
    const handleOffline = () => setNetworkError(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: "environment" },
  };

  const handleCameraError = (error) => {
    console.error("Camera error:", error);
    setCameraError(true);
    alert("Unable to access camera. Please check your camera permissions.");
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setPreviewImage(imageSrc);
      handleAnalyze(imageSrc);
    }
  }, [webcamRef]);

  const handleAnalyze = async (imageToAnalyze) => {
    const imageToSend = imageToAnalyze || capturedImage;
    if (!imageToSend) {
      alert("Please capture or upload an image first");
      return;
    }

    setIsProcessing(true);
    setNetworkError(false);
    setUploadMessage("Analyzing image...");

    try {
      // Step 1: Optimize the image
      const optimizedImage = await optimizeImageIfPossible(imageToSend);

      // Step 2: Analyze the image using fetchWithFallback
      const results = await fetchWithFallback("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: optimizedImage }),
      });

      setAnalysisResults(results.data);
      setUploadMessage("Analysis complete!");

      // Step 3: Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && results) {
        try {
          // Step 4: Get the medicine name for organization
          const medicineName =
            results.data?.product_identification?.medicine_name ||
            "Unknown Medicine";
          console.log("Saving scan with medicine name:", medicineName);

          // Step 5: Process the scan with coin deduction
          setUploadMessage("Saving scan to your history...");
          const scanResult = await scanService.processScan(user.id, {
            rawData: results.data,
            medicine_name:
              results.data?.product_identification?.medicine_name || "Unknown",
            ingredients:
              results.data?.product_identification?.ingredients || null,
            warnings: results.data?.product_identification?.warnings || null,
            image_url: optimizedImage,
          });

          if (scanResult) {
            console.log("Scan saved successfully:", scanResult.scanId);
            setPreviewImage(optimizedImage); // Keep using the optimized image for preview
          }
        } catch (saveError) {
          console.error("Error saving scan:", saveError);
          if (
            saveError.message &&
            saveError.message.includes("Insufficient coins")
          ) {
            setCoinBalance(0);
            alert("Insufficient coins to perform scan. Please add more coins.");
          } else {
            // Continue showing results even if saving failed
            alert("Error saving scan. Please try again.");
          }
        }
      }
      await refreshCoinBalance(); // Update coin balance after scan
    } catch (error) {
      console.error("Image analysis failed:", error);
      setNetworkError(true);

      // Simplified error handling as fetchWithFallback throws a consolidated error
      alert(
        `Analysis failed: ${error.message}. Please check your connection or try again.`
      );

      setUploadMessage("Analysis failed");
      if (error.message && error.message.includes("zero coins")) {
        setCoinBalance(0);
      }
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadMessage(""), 3000);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadstart = () => {
        setIsProcessing(true); // Start processing indicator
        setUploadMessage(t("uploading")); // Show uploading message
      };
      reader.onloadend = () => {
        const imageData = reader.result;
        setCapturedImage(imageData);
        setPreviewImage(imageData);
        setUploadMessage(t("uploadSuccess"));
        // Keep processing indicator until analysis is done
        handleAnalyze(imageData);
      };
      reader.onerror = () => {
        setIsProcessing(false);
        setUploadMessage(t("uploadError")); // Show error message
        console.error("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch profile to check theme preferences etc
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const profile = await getProfile(user.id);
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // After scan, refresh coin balance
  const refreshCoinBalance = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const profile = await getProfile(user.id);
        setCoinBalance(typeof profile.coins === "number" ? profile.coins : 0);
      }
    } catch {}
  };

  if (analysisResults) {
    return (
      <Results
        scanData={analysisResults}
        previewImage={previewImage}
        onClose={() => {
          setAnalysisResults(null);
          setPreviewImage(null);
          setCapturedImage(null);
          setIsProcessing(false); // Reset processing state
          setUploadMessage(""); // Clear message
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Use HomeHeader with sidebar button */}
      <HomeHeader
        onOpenSidebar={() => setIsSidebarOpen(true)} // Use sidebar button like in Home page
        onOpenNotifications={() => {}} // No notifications panel here
        coins={coinBalance}
        onAddCoin={handleAddCoin}
      />
      <div className="flex-1 flex flex-col items-center justify-between pt-2 pb-20">
        <div className="w-full h-[60vh] bg-gray-100 relative border-b border-gray-200">
          {cameraError ? (
            <CameraError message={cameraError} />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMediaError={handleCameraError}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
        </div>

        <div className="w-full px-6 py-4 space-y-3 sticky bottom-0 bg-white/80 backdrop-blur-sm z-10 border-t border-gray-200">
          <FileUploadButton
            onClick={() => fileInputRef.current.click()}
            disabled={isProcessing}
            label={t("uploadButton")}
            inputRef={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={capture}
            className="w-full bg-blue-600 text-white py-3 rounded-full font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-blue-200"
            disabled={isProcessing || cameraError}
          >
            {" "}
            <FiCamera className="w-5 h-5" />
            <span>{t("scanButton")}</span>
          </button>
        </div>
      </div>{" "}
      {isProcessing && (
        <div className="fixed inset-0 bg-white/80 flex flex-col items-center justify-center z-50 p-4">
          <StandardLoadingIndicator
            size="lg"
            variant="spinner"
            message={uploadMessage || t("processing")}
            note={t("processingNote")}
          />
        </div>
      )}
      {networkError && !isProcessing && (
        <NetworkErrorBanner message={t("connectionIssues")} />
      )}
      <FeedbackButton isFloating={true} />
      <BottomNav />
      {/* Add Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        coins={coinBalance}
        onAddCoin={handleAddCoin}
      />
    </div>
  );
};

export default Scanner;
