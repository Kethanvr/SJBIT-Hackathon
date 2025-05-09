import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { getTodayFormatted } from '../../utils/helpers/dateUtils';
import { useProTheme } from '../../utils/useProTheme';

const UploadHealthRecordModal = ({ isOpen, onClose, onSave, initialRecordData = {}, isSaving }) => {
  const { t } = useTranslation('healthRecords');
  const { isPro, theme } = useProTheme();
  const [recordData, setRecordData] = useState({
    name: '',
    type: 'lab_result',
    date: getTodayFormatted(),
    description: '',
    notes: '',
    ...initialRecordData,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!isOpen) {
      setRecordData({
        name: '',
        type: 'lab_result',
        date: getTodayFormatted(),
        description: '',
        notes: '',
      });
      setSelectedFile(null);
      setPreviewImage(null);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialRecordData && Object.keys(initialRecordData).length > 0) {
      setRecordData(prevData => ({
        ...prevData,
        ...initialRecordData,
      }));
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/heic', 'image/heif'];
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.heic') && !file.name.endsWith('.heif')) {
      setError(t('uploadModal.errors.invalidFileType'));
      return;
    }
    
    setSelectedFile(file);
    setError('');
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null); // No preview for PDFs
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removePreview = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSave = () => {
    if (!selectedFile || !recordData.name) {
      setError(t('uploadModal.errors.missingInfo'));
      return;
    }
    setError('');
    // Directly pass the File object to the parent component
    onSave(recordData, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`${isPro ? 'bg-gradient-to-tr from-yellow-50 to-white' : 'bg-white'} rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto flex flex-col`}>
        {/* Header */}
        <div className={`p-4 border-b ${isPro ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-white'} sticky top-0 z-10`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-lg font-medium ${isPro ? 'text-yellow-900' : 'text-gray-900'}`}>
              {t("uploadModal.title")}
            </h2>
            <button
              onClick={onClose}
              className={`${isPro ? 'text-yellow-500 hover:text-yellow-700' : 'text-gray-500 hover:text-gray-700'}`}
              disabled={isSaving}
              aria-label={t('uploadModal.closeAriaLabel')}
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {error && (
            <div className={`${isPro ? 'bg-yellow-100 border-yellow-300 text-yellow-800' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded mb-4 text-sm border`}>
              {error}
            </div>
          )}

          {!selectedFile ? (
            <div>
              {/* File Upload Area */}
              <div 
                className={`border-2 border-dashed ${isPro ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-6 text-center cursor-pointer hover:bg-opacity-70 transition-colors`}
                onClick={handleBrowseClick}
              >
                <div className={`inline-flex p-3 rounded-full mb-4 ${isPro ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <FiUpload className={`w-6 h-6 ${isPro ? 'text-yellow-600' : 'text-gray-600'}`} />
                </div>
                <h3 className={`text-md font-medium ${isPro ? 'text-yellow-900' : 'text-gray-900'} mb-1`}>
                  {t("uploadModal.dropzoneTitle")}
                </h3>
                <p className={`text-sm ${isPro ? 'text-yellow-700' : 'text-gray-600'} mb-4`}>
                  {t("uploadModal.dropzoneDescription")}
                </p>
                <button
                  type="button"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isPro
                      ? 'bg-yellow-200 text-yellow-900 hover:bg-yellow-300 focus:ring-yellow-500'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  disabled={isSaving}
                >
                  {t("uploadModal.browseButton")}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Preview Area */}
              <div className={`relative mb-4 border ${isPro ? 'border-yellow-200' : 'border-gray-200'} rounded-lg overflow-hidden ${isPro ? 'bg-yellow-50' : 'bg-gray-100'} flex items-center justify-center min-h-[100px]`}>
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={t("uploadModal.previewAlt")}
                    className="w-full h-auto max-h-64 object-contain"
                  />
                ) : (
                  <div className="text-center p-4">
                     <p className={`${isPro ? 'text-yellow-800' : 'text-gray-600'} font-medium`}>{selectedFile.name}</p>
                     <p className={`${isPro ? 'text-yellow-700' : 'text-gray-500'} text-sm`}>{Math.round(selectedFile.size / 1024)} KB</p>
                  </div>
                )}
                <button
                  onClick={removePreview}
                  className={`absolute top-2 right-2 ${isPro ? 'bg-yellow-800/70 hover:bg-yellow-900/80' : 'bg-gray-800/70 hover:bg-gray-900/80'} text-white rounded-full p-1`}
                  disabled={isSaving}
                  aria-label={t('uploadModal.removePreviewAriaLabel')}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="record-name" className={`block text-sm font-medium ${isPro ? 'text-yellow-800' : 'text-gray-700'} mb-1`}>
                    {t("uploadModal.nameLabel")}*
                  </label>
                  <Input
                    id="record-name"
                    type="text"
                    name="name"
                    value={recordData.name}
                    onChange={handleInputChange}
                    placeholder={t("uploadModal.namePlaceholder")}
                    required
                    disabled={isSaving}
                    className={`w-full ${isPro ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500' : ''}`}
                  />
                </div>

                <div>
                  <label htmlFor="record-type" className={`block text-sm font-medium ${isPro ? 'text-yellow-800' : 'text-gray-700'} mb-1`}>
                    {t("uploadModal.typeLabel")}
                  </label>
                  <select
                    id="record-type"
                    name="type"
                    value={recordData.type}
                    onChange={handleInputChange}
                    className={`w-full rounded-md border-gray-300 ${isPro ? 'bg-yellow-50 text-yellow-900 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500' : 'bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'} shadow-sm`}
                    disabled={isSaving}
                  >
                    <option value="lab_result">{t("uploadModal.types.labResult")}</option>
                    <option value="prescription">{t("uploadModal.types.prescription")}</option>
                    <option value="medical_report">{t("uploadModal.types.medicalReport")}</option>
                    <option value="vaccination">{t("uploadModal.types.vaccination")}</option>
                    <option value="insurance">{t("uploadModal.types.insurance")}</option>
                    <option value="other">{t("uploadModal.types.other")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="record-date" className={`block text-sm font-medium ${isPro ? 'text-yellow-800' : 'text-gray-700'} mb-1`}>
                    {t("uploadModal.dateLabel")}
                  </label>
                  <Input
                    id="record-date"
                    type="date"
                    name="date"
                    value={recordData.date}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    className={`w-full ${isPro ? 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500' : ''}`}
                  />
                </div>

                <div>
                  <label htmlFor="record-description" className={`block text-sm font-medium ${isPro ? 'text-yellow-800' : 'text-gray-700'} mb-1`}>
                    {t("uploadModal.descriptionLabel")}
                  </label>
                  <textarea
                    id="record-description"
                    name="description"
                    value={recordData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full rounded-md ${isPro ? 'border-yellow-300 bg-yellow-50 text-yellow-900 focus:border-yellow-500 focus:ring-yellow-500' : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'} shadow-sm`}
                    placeholder={t("uploadModal.descriptionPlaceholder")}
                    disabled={isSaving}
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="record-notes" className={`block text-sm font-medium ${isPro ? 'text-yellow-800' : 'text-gray-700'} mb-1`}>
                    {t("uploadModal.notesLabel")}
                  </label>
                  <textarea
                    id="record-notes"
                    name="notes"
                    value={recordData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    className={`w-full rounded-md ${isPro ? 'border-yellow-300 bg-yellow-50 text-yellow-900 focus:border-yellow-500 focus:ring-yellow-500' : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'} shadow-sm`}
                    placeholder={t("uploadModal.notesPlaceholder")}
                    disabled={isSaving}
                  ></textarea>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${isPro ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'} flex justify-end sticky bottom-0 z-10`}>
          <Button
            variant={isPro ? "gold-secondary" : "secondary"}
            onClick={onClose}
            className="mr-2"
            disabled={isSaving}
          >
            {t("uploadModal.cancelButton")}
          </Button>
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!selectedFile || !recordData.name || isSaving}
            variant={isPro ? "gold" : "primary"}
          >
            {isSaving ? t("uploadModal.savingButton") : t("uploadModal.saveButton")}
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default UploadHealthRecordModal;
