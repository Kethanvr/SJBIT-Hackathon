import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import LoadingScreen from "../../components/ui/LoadingSpinner";
import CustomHeader from "../../components/layout/PageHeader";
import { FiDownload, FiShare2 } from "react-icons/fi";
import HealthRecordErrorAlert from "../../components/health/HealthRecordErrorAlert";
import HealthRecordImage from "../../components/health/HealthRecordImage";
import HealthManagementForm from "../../components/health/HealthManagementForm";
import { useProTheme } from "../../utils/useProTheme";
import {
  saveHealthRecord,
  getHealthRecordById,
  updateHealthRecord,
} from "../../lib/supabase/health-records";
import { exportToPDF } from "../../utils/exportUtils";
import {
  handleShareRecord,
  handleDownloadPDF,
} from "../../utils/healthManagementUtils";

const HealthManagementContainer = () => {
  const { t } = useTranslation("healthManagement");
  const { user } = useAuth();
  const { isPro, theme } = useProTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recordId = queryParams.get("id");
  const recordRef = useRef();

  const [loading, setLoading] = useState(!!recordId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    recordType: "medication",
    name: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    dosage: "",
    frequency: "",
    notes: "",
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchRecordData = async () => {
      if (recordId && user) {
        try {          setLoading(true);
          const record = await getHealthRecordById(recordId, user.id);
          if (record && record.record_data) {
            // Set the image URL if it exists in the record data
            if (record.record_data.image_url) {
              setImageUrl(record.record_data.image_url);
            }
            setFormData({
              recordType: record.record_type || "medication",
              name: record.record_data.name || "",
              description: record.record_data.description || "",
              date: record.record_data.date || new Date().toISOString().split("T")[0],
              dosage: record.record_data.dosage || "",
              frequency: record.record_data.frequency || "",
              notes: record.record_data.notes || "",
            });          } else {
            setError(t("errors.fetchFailed"));
          }
        } catch (err) {
          console.error("Error fetching health record:", err);
          setError(t("errors.fetchFailed"));
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRecordData();
  }, [recordId, user, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input change
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSaving(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        // Dynamically import Cloudinary upload utility
        const { uploadToCloudinary } = await import('../../utils/cloudinaryUtils');
        const url = await uploadToCloudinary(base64String, 'mediscan');
        setImageUrl(url);
        setImageFile(file);
      };      reader.readAsDataURL(file);
    } catch (err) {
      setError(t("errors.uploadFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      const recordData = {
        name: formData.name,
        description: formData.description,
        date: formData.date,
        notes: formData.notes,
        image_url: imageUrl || null,
      };
      if (formData.recordType === "medication") {
        recordData.dosage = formData.dosage;
        recordData.frequency = formData.frequency;
      }
      if (recordId) {
        await updateHealthRecord(recordId, user.id, {
          record_type: formData.recordType,
          record_data: recordData,
        });
      } else {
        await saveHealthRecord(user.id, formData.recordType, recordData);
      }      navigate("/health/records");
    } catch (err) {
      console.error("Error saving health record:", err);
      setError(t("errors.saveFailed"));
    } finally {
      setSaving(false);
    }  };

  if (loading) {
    return <LoadingScreen message={t("loading")} />;
  }  return (
    <div className="pb-20 px-2 sm:px-4 md:px-6" ref={recordRef}>
      <CustomHeader
        title={recordId ? t("editRecord") : t("addRecord")}
        networkError={false}
        actions={          recordId && (
            <>              <button
                onClick={() => handleDownloadPDF({ recordRef, formData, exportToPDF, t })}
                className={`p-2 ${isPro ? "text-yellow-600 hover:text-yellow-800" : "text-gray-600 hover:text-blue-600"} transition-colors`}
                aria-label={t("ariaLabels.downloadPDF")}
              >
                <FiDownload className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShareRecord({ recordId, formData, imageUrl, t })}
                className={`p-2 ${isPro ? "text-yellow-600 hover:text-yellow-800" : "text-gray-600 hover:text-blue-600"} transition-colors`}
                aria-label={t("ariaLabels.share")}
              >
                <FiShare2 className="w-5 h-5" />
              </button>
            </>
          )
        }
      />      <HealthRecordErrorAlert error={error} />
      <HealthRecordImage imageUrl={imageUrl} />      
      <HealthManagementForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/health/records")}
        saving={saving}
        recordId={recordId}
        handleFileChange={handleFileChange}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
      />
    </div>
  );
};

export default HealthManagementContainer;
