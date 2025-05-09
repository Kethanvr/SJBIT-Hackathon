import React from 'react';
import ImageWithFallback from '../common/ImageWithFallback';
import { FiTrash2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/scanUtils';
import { useProTheme } from '../../utils/useProTheme';

const ScanHistoryItem = ({ scan, onDelete, onView, processing }) => {
  const { t } = useTranslation('scanHistory');
  const { isPro, theme } = useProTheme();
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start">        <div className="mr-4 w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
          <ImageWithFallback
            src={(() => {
              let imageUrl = scan.image_url;
              if (imageUrl && typeof imageUrl === 'object') {
                imageUrl = imageUrl.secure_url || imageUrl.url || null;
              } else if (imageUrl && typeof imageUrl === 'string') {
                try {
                  const parsed = JSON.parse(imageUrl);
                  imageUrl = parsed.secure_url || parsed.url || imageUrl;
                } catch {
                  // It's a normal string URL, keep as is
                }
              }
              return imageUrl;
            })()}
            alt={scan.medicine_name || t('untitledScan')}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate pr-2">
              {scan.medicine_name || t('untitledScan')}
            </h3>
            <button
              type="button"
              onClick={() => onDelete(scan.id)}
              className="ml-2 text-red-600 hover:text-red-700 flex-shrink-0"
              disabled={processing}
            >
              <FiTrash2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1 truncate">
            {t('usesLabel')}: {scan.uses || t('expandHint')}
          </p>
          <span className="text-sm text-gray-500 block mt-1">
            {formatDate(scan.created_at)}
          </span>
          <button
            type="button"
            onClick={() => onView(scan.id)}
            className={`mt-3 w-full ${theme.button} py-2 px-4 rounded-lg transition-colors`}
            disabled={processing}
          >
            {t('viewDetailsButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanHistoryItem;