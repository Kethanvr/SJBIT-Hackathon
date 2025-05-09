import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProTheme } from '../../utils/useProTheme';

const HealthRecordImage = ({ imageUrl }) => {
  const { t } = useTranslation("healthRecords");
  const { isPro } = useProTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  if (!imageUrl) {
    return null;
  }
  
  return (
    <div className={`mb-4 border rounded-lg overflow-hidden ${isPro ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-200"}`}>
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${isPro ? "border-yellow-500" : "border-blue-500"}`}></div>
          </div>
        )}
        {hasError && (
          <div className="p-4 text-center">
            <div className="text-red-500 text-sm">Unable to load image</div>
          </div>
        )}
        <img
          src={imageUrl}
          alt="Health Record"
          className={`w-full h-auto max-h-64 object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
    </div>
  );
};

export default HealthRecordImage;
