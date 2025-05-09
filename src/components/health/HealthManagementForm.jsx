// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\health\HealthManagementForm.jsx
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useProTheme } from "../../utils/useProTheme";

const HealthManagementForm = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
  saving,
  recordId,
  handleFileChange,
  imageUrl,
  setImageUrl
}) => {
  const { t } = useTranslation("healthManagement");
  const { isPro } = useProTheme();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Form container classes with responsive margins
  const containerClasses = "p-4 sm:p-6 health-form-container mb-16 sm:mb-0";

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Create a synthetic event object to pass to handleFileChange
      const event = { target: { files: files } };
      handleFileChange(event);
    }
  };
  
  return (
    <Card className="p-4">      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("form.recordType")}
          </label>
          <select
            name="recordType"
            value={formData.recordType}
            onChange={onChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="medication">{t("form.recordTypeOptions.medication")}</option>
            <option value="allergy">{t("form.recordTypeOptions.allergy")}</option>
            <option value="vaccination">{t("form.recordTypeOptions.vaccination")}</option>
            <option value="procedure">{t("form.recordTypeOptions.procedure")}</option>
            <option value="immunization">{t("form.recordTypeOptions.immunization")}</option>
            <option value="lab_result">{t("form.recordTypeOptions.labResult")}</option>
            <option value="insurance">{t("form.recordTypeOptions.insurance")}</option>
            <option value="other">{t("form.recordTypeOptions.other")}</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("form.name")}
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder={t("form.namePlaceholder")}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("form.date")}
          </label>
          <Input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
          />        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("form.description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="3"
            placeholder={t("form.descriptionPlaceholder")}
          />
        </div>
        {formData.recordType === "medication" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.dosage")}
              </label>
              <Input
                type="text"
                name="dosage"
                value={formData.dosage}
                onChange={onChange}
                placeholder={t("form.dosagePlaceholder")}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("form.frequency")}
              </label>
              <Input
                type="text"
                name="frequency"
                value={formData.frequency}
                onChange={onChange}
                placeholder={t("form.frequencyPlaceholder")}
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("form.notes")}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="3"
            placeholder={t("form.notesPlaceholder")}
          />
        </div>
        <div className="mb-4">
          <label className={`block text-sm font-medium ${isPro ? "text-yellow-800" : "text-gray-700"} mb-1`}>
            {t("form.uploadImage")}
          </label>          <div 
            className={`border-2 border-dashed rounded-lg p-4 upload-area ${
              isDragging 
                ? (isPro ? "border-yellow-500 bg-yellow-100" : "border-blue-500 bg-blue-50") 
                : (isPro ? "border-yellow-300 bg-yellow-50" : "border-gray-300 bg-gray-50")
            } transition-colors hover:bg-opacity-80`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              {!imageUrl ? (
                <>
                  <svg className={`h-12 w-12 ${isPro ? "text-yellow-500" : "text-gray-400"}`} stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>                  <div className="flex text-sm mt-2">
                    <label htmlFor="file-upload" className={`relative cursor-pointer rounded-md font-medium ${isPro ? "text-yellow-600 hover:text-yellow-700" : "text-blue-600 hover:text-blue-700"}`}>
                      <span>{t("form.uploadInstructions.uploadLink")}</span>
                      <input 
                        id="file-upload" 
                        ref={fileInputRef}
                        name="image" 
                        type="file" 
                        accept="image/*,.pdf,.heic,.heif"
                        onChange={handleFileChange} 
                        className="sr-only" 
                        disabled={saving}
                      />
                    </label>
                    <p className="pl-1 text-gray-500">{t("form.uploadInstructions.dragDrop")}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {t("form.uploadInstructions.formats")}
                  </p>
                </>
              ) : (                <div className="relative w-full image-preview">
                  <div className="flex justify-center">
                    <img src={imageUrl} alt="Record Preview" className={`max-h-48 rounded ${isPro ? "border-2 border-yellow-300 shadow-md" : "border border-gray-300"}`} />
                  </div><button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className={`absolute top-2 right-2 rounded-full p-1 ${
                      isPro ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-label={t("form.removeImage")}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className={`mt-3 inline-flex items-center px-3 py-1.5 text-sm rounded-md ${
                      isPro 
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" 
                        : "bg-gray-100 text-blue-600 hover:bg-gray-200"
                    }`}
                  >
                    <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {t("form.changeImage")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>        <div className="flex justify-end sm:justify-end form-buttons">
          <Button
            type="button"
            variant="secondary"
            className="mr-2"
            onClick={onCancel}
          >
            {t("buttons.cancel")}
          </Button>
          <Button 
            type="submit" 
            variant={isPro ? "gold" : "primary"}
            isLoading={saving}
          >
            {recordId ? t("buttons.update") : t("buttons.save")}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HealthManagementForm;
