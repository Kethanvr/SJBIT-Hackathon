import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import PageHeader from "../../components/layout/PageHeader";
import HealthRecordCard from "../../components/health/HealthRecordCard";
import UploadHealthRecordModal from "../../components/health/UploadHealthRecordModal";
import Spinner from "../../components/ui/Spinner";
import HealthRecordsTabs from "../../components/health/HealthRecordsTabs";
import RecordsStatus from "../../components/health/RecordsStatus";
import { uploadToCloudinary as uploadFileToCloudinary } from "../../utils/cloudinaryUtils";
import prepareRecordToSave from "../../utils/healthRecordUtils";
import { useHealthRecords } from "../../hooks/useHealthRecords";
import { useProTheme } from "../../utils/useProTheme";
import FeedbackButton from "../../components/ui/FeedbackButton";

const HealthRecords = () => {  const { t } = useTranslation("healthRecords");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const { theme } = useProTheme();

  // Use custom hook for logic
  const {
    records,
    loading,
    error,
    user,
    fetchRecords,
    deleteRecord,
    setError,
  } = useHealthRecords(activeTab, t);
  // Save record handler
  const handleSaveRecord = async (recordData, file) => {
    if (!user || !file) return;
    setUploading(true);
    setUploadMessage(t("uploadMessages.uploadingFile"));
    setError("");
    setUploadModalOpen(false);
    try {
      // Upload the file to Cloudinary
      const uploadResult = await uploadFileToCloudinary(file);
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error("Failed to get image URL from Cloudinary");
      }
      
      const fileUrl = uploadResult.secure_url;
      const filePublicId = uploadResult.public_id;
      
      setUploadMessage(t("uploadMessages.savingRecord"));
      // Save both in record_data and in the new image_url column
      const healthRecordServiceModule = await import(
        "../../services/healthRecordService"
      );
      await healthRecordServiceModule.default.saveRecordWithUrl(
        user.id,
        recordData.type,
        { ...recordData, image_url: fileUrl, file_public_id: filePublicId },
        fileUrl // Pass fileUrl for the new image_url column
      );
      fetchRecords();
    } catch (err) {
      console.error("Error saving health record:", err); // <-- log the error for debugging
      setError(t("errors.saveFailed"));
    } finally {
      setUploading(false);
      setUploadMessage("");
    }
  };

  const handleOpenUploadModal = () => {
    setError("");
    setUploadModalOpen(true);
  };

  return (
    <div className="container-narrow pb-4 px-4 md:px-0 mx-auto flex flex-col gap-4">
      <PageHeader title={t("title")} onBack={() => navigate(-1)} />      <HealthRecordsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="mt-4">
        <RecordsStatus
          loading={loading}
          error={error}
          records={records}
          activeTab={activeTab}
          onAddClick={handleOpenUploadModal}        />
        {!loading && !error && records.length > 0 && (
          <div className="space-y-4 health-record-grid">
            {records.map((record) => (
              <HealthRecordCard
                key={record.id}                record={record}
                onDelete={(recordId) => {
                  if (window.confirm(t("deleteConfirm.message"))) {
                    deleteRecord(recordId);
                  }
                }}
                className="health-card"
              />
            ))}{" "}
          </div>
        )}
      </div>
      <UploadHealthRecordModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSave={handleSaveRecord}
        isSaving={uploading}
      />
      {uploading && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 animate-fade-in">          <div className="text-white text-center">            <Spinner
              size="h-12 w-12"
              color="border-white border-t-transparent"
              className="mx-auto mb-4"
            />
            <p className="text-lg font-medium">
              {uploadMessage || t("uploadMessages.processing")}
            </p>
            <p className="text-sm opacity-70 mt-2">
              {t("uploadMessages.dontClose")}
            </p>
          </div>
        </div>
      )}      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={handleOpenUploadModal}
          className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          aria-label={t("addRecordButtonLabel")}
        >
          <FiPlus className="w-6 h-6" />
        </button>
      </div>
      <FeedbackButton isFloating={true} />
    </div>
  );
};

export default HealthRecords;
