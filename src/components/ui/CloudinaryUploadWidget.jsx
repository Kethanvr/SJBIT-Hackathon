import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

export const CloudinaryUploadWidget = ({ onUpload, className, folder = "mediscan_uploads" }) => {
  const { t } = useTranslation();
  const [widget, setWidget] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeWidget = useCallback(() => {
    if (!window.cloudinary) return null;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Missing Cloudinary configuration");
      setError("Configuration error");
      return null;
    }

    return window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        folder: folder,
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFiles: 1,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
        maxFileSize: 5000000, // 5MB
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
        },
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          setError("Upload failed");
          return;
        }
        if (result?.event === "success") {
          setError(null);
          onUpload(result.info);
        }
      }
    );
  }, [onUpload, folder]);

  useEffect(() => {
    // Load the Cloudinary script
    if (!document.getElementById("cloudinary-widget-script")) {
      const script = document.createElement("script");
      script.id = "cloudinary-widget-script";
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;

      script.onload = () => {
        setIsLoading(false);
        const widgetInstance = initializeWidget();
        if (widgetInstance) {
          setWidget(widgetInstance);
        }
      };

      script.onerror = () => {
        console.error("Failed to load Cloudinary widget script");
        setError("Failed to load upload widget");
        setIsLoading(false);
      };

      document.body.appendChild(script);
    } else if (window.cloudinary) {
      setIsLoading(false);
      const widgetInstance = initializeWidget();
      if (widgetInstance) {
        setWidget(widgetInstance);
      }
    }

    return () => {
      if (widget) {
        widget.destroy();
      }
    };
  }, [initializeWidget]);

  const handleClick = useCallback(() => {
    if (widget) {
      widget.open();
    } else {
      setError("Upload widget is not ready. Please try again.");
    }
  }, [widget]);

  if (isLoading) {
    return (
      <button
        type="button"
        className={`bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-wait ${className}`}
        disabled
      >
        {t("Loading...")}
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ${
          error ? "opacity-50" : ""
        } ${className}`}
        onClick={handleClick}
        disabled={!!error || isLoading}
      >
        {t("Upload Image")}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};
