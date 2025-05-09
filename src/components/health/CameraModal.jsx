import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { FiX, FiCamera, FiCheck, FiUpload } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const { t } = useTranslation("healthRecords");
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(false);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: { ideal: "environment" },
  };
  const handleCameraError = useCallback((error) => {
    console.error("Camera error:", error);
    setCameraError(true);
    alert(t("camera.errors.accessDenied", "Unable to access camera. Please check your camera permissions."));
  }, [t]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setCapturedImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
      setCapturedImage(null);
    }
  };

  const reset = () => {
    setCapturedImage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="bg-gray-900/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={onClose} className="text-white">          <FiX className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium text-white">
          {capturedImage ? t("camera.previewTitle", "Preview Image") : t("camera.takePhotoTitle", "Take Photo")}
        </h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between">
        {capturedImage ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-black">
            <img
              src={capturedImage}
              alt="Captured"
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-[80vh] bg-black relative">
            {cameraError ? (              <div className="w-full h-full flex flex-col items-center justify-center text-white bg-red-900/50 p-4">
                <FiX className="w-12 h-12 mb-4 text-red-400" />
                <p className="text-center font-semibold">{t("camera.errors.title", "Camera Error")}</p>
                <p className="text-center text-sm mt-1">{cameraError}</p>
                <p className="text-center text-xs mt-2">
                  {t("camera.errors.checkPermissions", "Please check browser permissions.")}
                </p>
              </div>
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
        )}

        <div className="w-full px-6 py-4 space-y-3 bg-gray-900 z-10">
          {capturedImage ? (
            <div className="flex space-x-3">
              <button
                onClick={reset}                className="flex-1 bg-gray-800 text-white py-3 rounded-full font-medium flex items-center justify-center space-x-2 border border-white/20"
              >
                <FiX className="w-5 h-5" />
                <span>{t("camera.buttons.retake", "Retake")}</span>
              </button>
              <button
                onClick={confirmImage}
                className="flex-1 bg-green-600 text-white py-3 rounded-full font-medium flex items-center justify-center space-x-2"
              >
                <FiCheck className="w-5 h-5" />
                <span>{t("camera.buttons.usePhoto", "Use Photo")}</span>
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current.click()}                className="w-full bg-white/10 text-white py-3 rounded-full font-medium flex items-center justify-center space-x-2 border border-white/20"
              >
                <FiUpload className="w-5 h-5" />
                <span>{t("camera.buttons.uploadImage", "Upload Image")}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={capture}
                className="w-full bg-blue-600 text-white py-3 rounded-full font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                disabled={cameraError}
              >
                <FiCamera className="w-5 h-5" />
                <span>{t("camera.buttons.takePhoto", "Take Photo")}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
