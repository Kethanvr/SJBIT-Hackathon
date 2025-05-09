import React from "react";

export function ScanInfoCard({ scan, t }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="font-semibold text-lg text-gray-800 mb-3">
        {scan.medicine_name || t('scanHistory:untitledScan')}
      </h3>
      <div className="space-y-2 text-sm text-gray-600">
        {scan.uses && (
          <div className="flex">
            <span className="font-medium w-24 flex-shrink-0">{t('results:noDetailedData.usesLabel')}:</span>
            <span>{scan.uses}</span>
          </div>
        )}
        <div className="flex">
          <span className="font-medium w-24 flex-shrink-0">{t('scanHistory:scannedOnLabel')}:</span>
          <span>{scan.created_at ? new Date(scan.created_at).toLocaleDateString() : ''}</span>
        </div>
      </div>
      <p className="mt-4 text-sm text-yellow-700 bg-yellow-50 p-3 rounded border border-yellow-200">
        {t('results:noDetailedData.message')}
      </p>
    </div>
  );
}