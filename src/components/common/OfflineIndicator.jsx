import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ErrorState from "./ErrorState";

export default function OfflineIndicator() {
  const { t } = useTranslation("offlineIndicator");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Update online status
    const handleOnline = () => {
      setIsOnline(true);
      // Show a temporary "back online" message
      setShowOfflineMessage(true);
      setTimeout(() => setShowOfflineMessage(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showOfflineMessage) return null;
  if (!isOnline) {
    return (
      <div className="fixed inset-x-0 top-0 z-50">
        <ErrorState
          message={t('offline.title')}
          onRetry={() => window.location.reload()}
          retryText={t('offline.retry')}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-green-500 text-white p-2 text-center transition-all duration-300 ease-in-out">
      <p className="text-sm font-medium">{t('online.title')}</p>
    </div>
  );
}
