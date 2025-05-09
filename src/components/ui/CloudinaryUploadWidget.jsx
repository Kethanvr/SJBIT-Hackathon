import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const CloudinaryUploadWidget = ({ onUpload, className }) => {
  const { t } = useTranslation("common");

  useEffect(() => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;

    script.onload = () => {
      window.cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ["local", "url", "camera"],
          multiple: false,
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif"],
          maxFileSize: 5000000, // 5MB
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            onUpload(result.info);
          }
        }
      );
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onUpload]);

  return (
    <button
      className={`cloudinary-button ${className}`}
      onClick={() => window.cloudinary.openUploadWidget()}
    >
      {t("uploadImage", "Upload Image")}
    </button>
  );
};
