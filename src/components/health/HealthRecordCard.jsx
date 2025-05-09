import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiShare2, FiImage } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Card from '../ui/Card';
import { useProTheme } from '../../utils/useProTheme';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const HealthRecordCard = ({ record, onDelete, className = '' }) => {
  const navigate = useNavigate();
  const recordCardRef = useRef(null);
  const { isPro, theme } = useProTheme();
  const { t } = useTranslation("healthRecords");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle edit by navigating to the management page
  const handleEdit = () => {
    navigate(`/health/management?id=${record.id}`);
  };
    // Handle download record as PDF
  const handleDownload = () => {
    if (!record.record_data.image_url) {
      alert(t("recordDetails.noImageToDownload", "No image available to download"));
      return;
    }

    // Navigate to the health management page with the PDF print parameter
    // This will trigger automatic PDF generation and download
    navigate(`/health/management?id=${record.id}&print=true`);
  };
  
  // Share record
  const handleShare = async () => {
    if (navigator.share && record.record_data.image_url) {
      navigator.share({
        title: record.record_data.name || 'Health Record',
        text: 'Check out my health record',
        url: record.record_data.image_url
      })
      .catch(error => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support Navigator.share
      await navigator.clipboard.writeText(
        `Health Record: ${record.record_data.name || 'Unnamed'}\n` +
        `Type: ${record.record_type}\n` +
        `Date: ${formatDate(record.record_data.date || record.created_at)}\n` +
        `${record.record_data.description ? `Description: ${record.record_data.description}` : ''}`
      );
      alert("Details copied to clipboard!");
    }  };
    return (
    <>
    <Card key={record.id} className={`p-4 ${isPro ? theme.cardBg : ""} ${className}`} ref={recordCardRef}>
      {/* Record header and image */}
      <div className="flex items-start mb-3">
        {/* Record image (if available) */}
        {(record.image_url || (record.record_data && record.record_data.image_url)) ? (
          <div className="mr-4 w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
            <img
              src={record.image_url || record.record_data.image_url}
              alt={record.record_data?.name || "Health Record"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/100?text=No+Image";
              }}
            />
          </div>
        ) : (
          <div className={`mr-4 w-20 h-20 flex-shrink-0 rounded-md ${isPro ? "bg-yellow-100" : "bg-gray-100"} flex items-center justify-center`}>
            <FiImage className={`w-6 h-6 ${isPro ? "text-yellow-400" : "text-gray-400"}`} />
          </div>
        )}

        {/* Record details */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-medium text-lg ${isPro ? "text-yellow-900" : ""}`}>
                {record.record_data.name || 'Unnamed Record'}
              </h3>
              <p className={`${isPro ? "text-yellow-700" : "text-gray-500"} text-sm`}>
                {record.record_type.charAt(0).toUpperCase() + record.record_type.slice(1)} • {formatDate(record.record_data.date || record.created_at)}
              </p>
            </div>            <div className="flex space-x-2 ml-2">              <button 
                onClick={handleEdit}
                className={`${isPro ? "text-yellow-600 hover:text-yellow-800" : "text-blue-600 hover:text-blue-800"}`}
              >
                {t("recordDetails.editRecord", "Edit")}
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-800"
              >
                {t("recordDetails.deleteRecord", "Delete")}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Record description */}
      {record.record_data.description && (
        <p className={`text-sm mt-2 mb-3 ${isPro ? "text-yellow-800" : ""}`}>
          {record.record_data.description}
        </p>
      )}
        {/* Action buttons */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t">        <div className={`text-xs ${isPro ? "text-yellow-600" : "text-gray-500"}`}>
          {t("recordDetails.date", "Date")}: {formatDate(record.created_at)}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleShare}
            className={`flex items-center space-x-1 text-sm ${
              isPro 
                ? "text-yellow-600 hover:text-yellow-800" 
                : "text-blue-600 hover:text-blue-800"
            } py-1 px-2 transition-colors`}
            aria-label={t("recordDetails.shareRecord", "Share Record")}
          >
            <FiShare2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className={`flex items-center space-x-1 text-sm ${
              isPro 
                ? "text-yellow-600 hover:text-yellow-800" 
                : "text-blue-600 hover:text-blue-800"
            } py-1 px-2 transition-colors`}
            aria-label={t("recordDetails.downloadPdf", "Download PDF")}
          >
            <FiDownload className="w-4 h-4" />
          </button>          <button
            onClick={handleEdit}
            className={`flex items-center space-x-1 text-sm ${
              isPro 
                ? "text-yellow-600 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100" 
                : "text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100"
            } py-1.5 px-3 rounded-md transition-colors`}
          >
            <span>{t("recordDetails.viewDetails", "View Details")}</span>
          </button>        </div>
      </div>
    </Card>
    <DeleteConfirmationModal
      isOpen={showDeleteConfirm}
      onClose={() => setShowDeleteConfirm(false)}
      onConfirm={() => {
        onDelete(record.id);
        setShowDeleteConfirm(false);
      }}      recordName={record.record_data.name}
    />
    </>
  );
};

export default HealthRecordCard;
