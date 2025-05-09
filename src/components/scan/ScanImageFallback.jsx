import React from "react";
import { FiImage } from "react-icons/fi";

export function ScanImageFallback({ imageUrl, alt, t }) {
  if (imageUrl) {
    return (
      <div className="mb-6 rounded-lg overflow-hidden shadow-md max-w-md mx-auto">
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-auto object-cover"
          onError={e => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
          }}
        />
      </div>
    );
  }
  return (
    <div className="mb-6 bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center text-center h-48 max-w-md mx-auto">
      <FiImage className="w-12 h-12 text-gray-400 mb-2" />
      <p className="text-gray-500 text-sm">{t('results:imageNotAvailable')}</p>
    </div>
  );
}