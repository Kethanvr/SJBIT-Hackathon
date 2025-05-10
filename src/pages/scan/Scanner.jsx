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

  const handleAddCoin = () => {
    navigate("/account/coins");
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
      const optimizedImage = await optimizeImageIfPossible(imageToSend);
      const results = await fetchWithFallback("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: optimizedImage }),
      });

      setAnalysisResults(results.data);
      setUploadMessage("Analysis complete!");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && results) {
        try {
          const medicineName =
            results.data?.product_identification?.medicine_name ||
            "Unknown Medicine";
          console.log("Saving scan with medicine name:", medicineName);

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
            setPreviewImage(optimizedImage);
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
            alert("Error saving scan. Please try again.");
          }
        }
      }
      await refreshCoinBalance();
    } catch (error) {
      console.error("Image analysis failed:", error);
      setNetworkError(true);
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
        setIsProcessing(true);
        setUploadMessage(t("uploading"));
      };
      reader.onloadend = () => {
        const imageData = reader.result;
        setCapturedImage(imageData);
        setPreviewImage(imageData);
        setUploadMessage(t("uploadSuccess"));
        handleAnalyze(imageData);
      };
      reader.onerror = () => {
        setIsProcessing(false);
        setUploadMessage(t("uploadError"));
        console.error("Error reading file");
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const profile = await getProfile(user.id);
          setCoinBalance(typeof profile.coins === "number" ? profile.coins : 0);
        }
      } catch (e) {
        console.error("Error fetching profile:", e);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
          setIsProcessing(false);
          setUploadMessage("");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <HomeHeader
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenNotifications={() => {}}
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
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="w-full px-4 py-4 flex flex-col items-center space-y-4">
          <button
            onClick={capture}
            className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          >
            <FiCamera className="w-8 h-8 text-white" />
          </button>

          <FileUploadButton
            onFileSelect={handleFileUpload}
            isProcessing={isProcessing}
          />

          {uploadMessage && (
            <div className="text-sm text-gray-600 mt-2">{uploadMessage}</div>
          )}
        </div>
      </div>

      {isProcessing && <LoadingOverlay message={uploadMessage} />}
      {networkError && <NetworkErrorBanner />}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </div>
  );
};

export default Scanner;
