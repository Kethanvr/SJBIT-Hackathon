import { FiTrash2, FiImage } from "react-icons/fi";
import React from "react";
import { formatDate, getChatPreview } from "../../utils/historyUtils";
import { useProTheme } from '../../utils/useProTheme';

export function HistoryItem({ item, onDelete, onAction, processingAction, t }) {
  const { theme } = useProTheme();
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate pr-2">
              {item.type === "scan"
                ? item.medicine_name || t('item.untitledScan')
                : item.title || t('item.untitledChat')}
            </h3>
            <span className="text-sm text-gray-500 ml-2 flex-shrink-0">
              {formatDate(item.created_at)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {item.type === "scan"
              ? `${t('item.usesPrefix')}${item.uses || t('item.usesFallback')}`
              : getChatPreview(item.messages, t)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="ml-4 text-red-600 hover:text-red-700 flex-shrink-0"
          disabled={processingAction}
        >
          <FiTrash2 className="w-5 h-5" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onAction(item)}
        className={`mt-4 w-full ${theme.button} py-2 px-4 rounded-lg transition-colors`}
        disabled={processingAction}
      >
        {item.type === "scan" ? t('item.viewDetails') : t('item.continueChat')}
      </button>
    </div>
  );
}

export function ScanItem({ scan, onDelete, onView, processingAction, t }) {
  const { theme } = useProTheme();
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start">
        {scan.image_url ? (
          <div className="mr-4 w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
            <img 
              src={scan.image_url} 
              alt={scan.medicine_name || "Scanned medicine"} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/100?text=No+Image";
              }}
            />
          </div>
        ) : (
          <div className="mr-4 w-24 h-24 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
            <FiImage className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate pr-2">
              {scan.medicine_name || t('item.untitledScan')}
            </h3>
            <button
              type="button"
              onClick={() => onDelete(scan)}
              className="ml-2 text-red-600 hover:text-red-700 flex-shrink-0"
              disabled={processingAction}
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {t('item.usesPrefix')}{scan.uses || t('item.usesFallback')}
          </p>
          <span className="text-sm text-gray-500 block mt-1">
            {formatDate(scan.created_at)}
          </span>
          <button
            type="button"
            onClick={() => onView(scan)}
            className={`mt-3 w-full ${theme.button} py-2 px-4 rounded-lg transition-colors`}
            disabled={processingAction}
          >
            {t('item.viewDetails')}
          </button>
        </div>
      </div>
    </div>
  );
}
