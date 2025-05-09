import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiX, FiMessageSquare, FiShare2, FiTrash2 } from "react-icons/fi";
import { supabase } from "../../lib/supabase";
import Results from "../../components/Results";
import BottomNav from "../../components/common/BottomNav";
import { useTranslation } from 'react-i18next';
import ScanHistoryItem from '../../components/scan/ScanHistoryItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import BasicInfoBlock from '../../components/scan/BasicInfoBlock';
import ScanActionButtons from '../../components/scan/ScanActionButtons';
import { formatDate, saveScanToLocalStorage, getScanFromLocalStorage } from '../../utils/scanUtils';
import DeleteConfirmationModal from "../../components/common/DeleteConfirmationModal";

export default function ScanHistory() {
  const { t } = useTranslation('scanHistory');  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [scanToDelete, setScanToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndScans = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        setUser(user);
        await fetchScans(user.id);
      } catch (error) {
        console.error("Error fetching user:", error.message);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndScans();
  }, [navigate]);

  const fetchScans = async (userId) => {
    try {
      setProcessingAction(true);
      const { data: scans, error } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setScans(scans || []);
    } catch (error) {
      console.error("Error fetching scans:", error.message);
    } finally {
      setProcessingAction(false);
    }
  };
  const handleDeleteScan = async (scanId) => {
    const scanToRemove = scans.find(scan => scan.id === scanId);
    setScanToDelete(scanToRemove);
    setShowDeleteModal(true);
  };

  const confirmDeleteScan = async () => {
    if (!scanToDelete) return;
    
    try {
      setProcessingAction(true);
      const { error } = await supabase.from("scans").delete().eq("id", scanToDelete.id);
      if (error) throw error;
      setScans(scans.filter((scan) => scan.id !== scanToDelete.id));
    } catch (error) {
      console.error("Error deleting scan:", error.message);
      alert(t('deleteError'));
    } finally {
      setProcessingAction(false);
      setShowDeleteModal(false);
      setScanToDelete(null);
    }
  };

  const cancelDeleteScan = () => {
    setShowDeleteModal(false);
    setScanToDelete(null);
  };

  const filteredScans = scans.filter((scan) => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    return searchTerms.every(term => 
      scan.medicine_name?.toLowerCase().includes(term)
    );
  });

  const handleViewScan = (scanId) => {
    navigate(`/scan/${scanId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-gray-600"
          >
            <FiArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">{t('title')}</h1>
        </div>
        <div className="mt-4">
          <div className="relative">            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 space-y-4">
        {loading ? (
          <LoadingSpinner />
        ) : filteredScans.length > 0 ? (
          filteredScans.map((scan) => (
            <ScanHistoryItem
              key={scan.id}
              scan={scan}
              onDelete={handleDeleteScan}
              onView={handleViewScan}
              processing={processingAction}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">{t('noScans.title')}</h3>
            <p className="text-gray-500 mt-1">
              {t('noScans.description')}
            </p>
            <Link
              to="/scanner"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {t('noScans.newScanButton')}
            </Link>
          </div>        )}
      </div>
      <BottomNav />
        {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeleteScan}
        onConfirm={confirmDeleteScan}
        itemName={scanToDelete?.medicine_name || t('item.untitledScan')}
        itemType={t('scanItemType')}
        t={t}
      />
    </div>
  );
}

export function ScanDetails() {
  const { t } = useTranslation(['results', 'scanHistory']);
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
        if (id === "history") {
          navigate("/scan/history");
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }
        // Use utility for localStorage
        const localScan = getScanFromLocalStorage(id);
        if (localScan) {
          setScan(localScan);
        } else {
          const { data, error } = await supabase
            .from("scans")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();
          if (error) throw error;
          if (!data) throw new Error("Scan not found");
          setScan(data);
          saveScanToLocalStorage(data);
        }
      } catch (error) {
        console.error("Error fetching scan details:", error);
        setError(t('results:fetchError'));
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
      const { error } = await supabase.from("scans").delete().eq("id", id);
      if (error) throw error;
      setShowDeleteModal(false);
      navigate("/scan/history");
    } catch (error) {
      console.error("Error deleting scan:", error);
      setError(t('results:deleteError'));
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleShare = async () => {
    if (!scan) return;
    try {
      const shareText = `${t('results:share.medicineLabel')}: ${scan.medicine_name || t('results:unknown')}
${scan.scan_data?.product_identification?.active_ingredients ? `${t('results:share.ingredientsLabel')}: ${scan.scan_data.product_identification.active_ingredients}\n` : ''}${scan.scan_data?.usage_information?.indications ? `${t('results:share.usesLabel')}: ${scan.scan_data.usage_information.indications}` : ''}`;
      if (navigator.share) {
        await navigator.share({
          title: t('results:share.title'),
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert(t('results:share.copied'));
      }
    } catch (error) {
      console.error("Error sharing:", error);
      setError(t('results:share.error'));
    }
  };

  const askAI = () => {
    if (scan) {
      localStorage.setItem("medicationToAsk", scan.medicine_name);
      localStorage.setItem("medicationDetails", JSON.stringify({
        name: scan.medicine_name,
        ingredients: scan.scan_data?.product_identification?.active_ingredients || "",
        uses: scan.scan_data?.usage_information?.indications || ""
      }));
      navigate(`/chat?context=medication&scanId=${id}`);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
          <button type="button" onClick={() => navigate("/scan/history")}
            className="text-gray-600">
            <FiArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          <ErrorAlert title={t('results:errorTitle')} message={error} />
        </div>
        <BottomNav />
      </div>
    );
  }
  if (!scan) return null;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
        <button type="button" onClick={() => navigate("/scan/history")}
          className="text-gray-600">
          <FiArrowLeft className="w-6 h-6" />
        </button>
        <ScanActionButtons
          t={t}
          onAskAI={askAI}
          onShare={handleShare}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </div>
      {scan.scan_data ? (
        <Results
          scanData={scan.scan_data}
          previewImage={(() => {
            const img = scan.image_url;
            if (img && typeof img === "object") {
              return img.secure_url || img.url || "";
            } else if (typeof img === "string") {
              try {
                const parsed = JSON.parse(img);
                return parsed.secure_url || parsed.url || img;
              } catch {
                return img;
              }
            }
            return null;
          })()}
          onClose={() => navigate("/scan/history")}
        />
      ) : (
        <div className="p-4 pb-20">
          <BasicInfoBlock t={t} scan={scan} />
          <div className="mt-6">
            <button
              onClick={askAI}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <FiMessageSquare className="w-5 h-5" />
              <span>{t('results:askAIButton')}</span>
            </button>
          </div>        </div>
      )}
      <BottomNav />
        {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={scan?.medicine_name || t('item.untitledScan')}
        itemType={t('scanItemType')}
        t={t}
      />
    </div>
  );
}