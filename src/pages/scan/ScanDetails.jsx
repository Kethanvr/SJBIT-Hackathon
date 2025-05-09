import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiTrash2, FiShare2, FiAlertCircle } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import Results from "../../components/Results";
import BottomNav from "../../components/common/BottomNav";
import { useTranslation } from 'react-i18next';
import ScanDetailsHeader from "../../components/scan/ScanDetailsHeader";
import { ScanImageFallback } from "../../components/scan/ScanImageFallback";
import { ScanInfoCard } from "../../components/scan/ScanInfoCard";
import { AskAIButton } from "../../components/scan/AskAIButton";
import { formatDate, generateShareText } from "../../utils/scanUtils";
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";
import StandardLoadingIndicator from "../../components/common/StandardLoadingIndicator";
import StandardErrorMessage from "../../components/common/StandardErrorMessage";

export default function ScanDetails() {
  const { t } = useTranslation(['results', 'scanHistory']); // Use multiple namespaces
  const { id } = useParams();
  const navigate = useNavigate();  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUserAndScanDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // If the URL is /scan/history, redirect to the history page instead of treating "history" as a scan ID
        if (id === "history") {
          navigate("/scan/history");
          return;
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        // First try to load from localStorage (Consider if this caching is still desired)
        const currentScanId = localStorage.getItem("currentScanId");
        const currentScanData = localStorage.getItem("currentScanData");

        if (currentScanId === id && currentScanData) {
          // Use scan data from localStorage
          const parsedScan = {
            id: currentScanId,
            medicine_name: localStorage.getItem("currentScanName") || "Untitled Scan",
            scan_data: JSON.parse(currentScanData),
            // Retrieve the image URL from localStorage
            image_url: localStorage.getItem("currentScanImage") || null
          };
          setScan(parsedScan);
        } else {
          // Fetch from database with user verification
          const { data, error: dbError } = await supabase
            .from("scans")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

          if (dbError) throw dbError;
          if (!data) throw new Error("Scan not found or access denied");

          setScan(data);          // Update localStorage for future reference (Consider implications of stale data)
          localStorage.setItem("currentScanId", data.id);
          localStorage.setItem("currentScanData", JSON.stringify(data.scan_data || {}));
          localStorage.setItem("currentScanName", data.medicine_name || "Untitled Scan");
          
          // Ensure we're storing just the URL string, not the whole object
          let imageUrl = data.image_url || "";
          if (typeof imageUrl === 'object' && imageUrl !== null) {
            imageUrl = imageUrl.secure_url || imageUrl.url || "";
          }
          localStorage.setItem("currentScanImage", imageUrl);
        }
      } catch (err) {
        console.error("Error fetching scan details:", err);
        setError(err.message === 'Scan not found or access denied' ? t('results:fetchErrorNotFound') : t('results:fetchErrorGeneric'));
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndScanDetails();
  }, [id, navigate, t]);
  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      setError(null);

      const { error: deleteError } = await supabase.from("scans").delete().eq("id", id);
      if (deleteError) throw deleteError;

      // Clear related localStorage items on successful delete
      localStorage.removeItem("currentScanId");
      localStorage.removeItem("currentScanData");
      localStorage.removeItem("currentScanName");
      localStorage.removeItem("currentScanImage");

      navigate("/scan/history"); // Navigate back to the list
    } catch (err) {
      console.error("Error deleting scan:", err);
      setError(t('results:deleteError'));
      setDeleting(false);
    }
  };

  const handleShare = async () => {
    if (!scan) return;
    try {
      const shareText = generateShareText(scan, t);
      if (navigator.share) {
        await navigator.share({
          title: t('results:share.title'),
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
        alert(t('results:share.copiedWithLink'));
      }
    } catch (err) {
      console.error("Error sharing:", err);
      alert(t('results:share.error'));
    }
  };

  const askAI = () => {
    if (scan) {
      // Store medication info in localStorage to reference in chat
      localStorage.setItem("medicationToAsk", scan.medicine_name || t('results:unknown'));
      localStorage.setItem("medicationDetails", JSON.stringify({
        name: scan.medicine_name || t('results:unknown'),
        ingredients: scan.scan_data?.product_identification?.active_ingredients || "",
        uses: scan.scan_data?.usage_information?.indications || ""
      }));
      // Navigate to chat with context about this medication
      navigate(`/chat?context=medication&scanId=${id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <StandardLoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
          <button
            type="button"
            onClick={() => navigate("/scan/history")}
            className="text-gray-600"
            aria-label={t('scanHistory:backButtonLabel')}
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          {/* Optionally add title or other elements here */}
        </div>
        <div className="p-4">
          <StandardErrorMessage 
            title={t('results:errorTitle')}
            message={error}
            onClose={() => setError(null)}
          />
        </div>
        <BottomNav /> {/* Keep navigation accessible even on error */}
      </div>
    );
  }

  if (!scan) return null; // Should ideally be handled by the error state

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <ScanDetailsHeader
        onBack={() => navigate("/scan/history")}
        onAskAI={askAI}
        onShare={handleShare}
        onDelete={handleDelete}
        deleting={deleting}
        t={t}
      />
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">        {scan.scan_data ? (
          <Results
            scanData={scan.scan_data}
            previewImage={(() => {
              let imageUrl = scan.image_url || null;
              if (imageUrl && typeof imageUrl === 'object') {
                imageUrl = imageUrl.secure_url || imageUrl.url || null;
              }
              return imageUrl;
            })()}
            medicineName={scan.medicine_name || t('scanHistory:untitledScan')}
          />
        ) : (
          <div className="p-4 pb-20">
            <ScanImageFallback 
              imageUrl={(() => {
                let imageUrl = scan.image_url || null;
                if (imageUrl && typeof imageUrl === 'object') {
                  imageUrl = imageUrl.secure_url || imageUrl.url || null;
                }
                return imageUrl;
              })()} 
              alt={scan.medicine_name || t('scanHistory:untitledScan')} 
              t={t} 
            />
            <ScanInfoCard scan={{ ...scan, created_at: scan.created_at, uses: scan.uses }} t={t} />
            <div className="mt-6">
              <AskAIButton onClick={askAI} t={t} />
            </div>
          </div>
        )}      </div>
      <BottomNav />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={scan?.medicine_name || t('scanHistory:untitledScan')}
        itemType={t('scanHistory:scanItemType')}
        t={t}
      />
    </div>
  );
}