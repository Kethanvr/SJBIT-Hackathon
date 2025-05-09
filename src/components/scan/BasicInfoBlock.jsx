import React from 'react';
import { FiImage } from 'react-icons/fi';

const BasicInfoBlock = ({ t, scan }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    {scan.image_url ? (
      <div className="mb-6 rounded-lg overflow-hidden">
        <img
          src={scan.image_url}
          alt={scan.medicine_name || t('scanHistory:untitledScan')}
          className="w-full max-w-md mx-auto rounded-lg shadow-md"
          onError={e => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Available";
          }}
        />
      </div>
    ) : (
      <div className="mb-6 bg-gray-100 rounded-lg p-8 flex flex-col items-center justify-center">
        <FiImage className="w-16 h-16 text-gray-400 mb-2" />
        <p className="text-gray-500">{t('results:imageNotAvailable')}</p>
      </div>
    )}
    <h3 className="font-medium text-yellow-800">{t('results:noDetailedData.title')}</h3>
    <p className="mt-1 text-yellow-700">{t('results:noDetailedData.basicInfoLabel')}:</p>
    <div className="mt-3 space-y-2">
      <div className="flex">
        <span className="font-medium w-32">{t('results:noDetailedData.medicineLabel')}:</span>
        <span>{scan.medicine_name || t('results:unknown')}</span>
      </div>
      {scan.uses && (
        <div className="flex">
          <span className="font-medium w-32">{t('results:noDetailedData.usesLabel')}:</span>
          <span>{scan.uses}</span>
        </div>
      )}
    </div>
  </div>
);

export default BasicInfoBlock;
