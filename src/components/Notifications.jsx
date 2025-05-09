import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { IoClose } from "react-icons/io5";
import { FiMoreVertical, FiTrash2, FiCheck, FiBell } from "react-icons/fi";
import { getNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead } from '../lib/supabase/notifications';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import StandardLoadingIndicator from './common/StandardLoadingIndicator';
import StandardErrorMessage from './common/StandardErrorMessage';

export default function Notifications({ isOpen, onClose }) {
  const { t } = useTranslation('notifications');
  const { user } = useAuth ? useAuth() : { user: null };
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permitStatus, setPermitStatus] = useState('default');

  const fetchUserNotifications = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotifications(user.id);
      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        console.error('Unexpected response format:', data);
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(t('errors.fetchFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [user, t]);
  // Register OneSignal events when component mounts
  useEffect(() => {
    if (window.OneSignal) {
      try {
        // Check notification permission status in a safe way
        if (typeof window.OneSignal.Notifications.permission === 'boolean') {
          // Handle case where permission is a boolean value
          setPermitStatus(window.OneSignal.Notifications.permission ? 'granted' : 'default');
        } else if (typeof window.OneSignal.Notifications.permission === 'function') {
          // Try to handle case where permission is a function that returns a promise
          window.OneSignal.Notifications.permission()
            .then(permission => {
              setPermitStatus(permission ? 'granted' : 'default');
            })
            .catch(err => {
              console.error("Error checking OneSignal permission:", err);
              setPermitStatus('default');
            });
        } else {
          // Fallback to browser's notification permission API
          setPermitStatus(Notification.permission || 'default');
        }

        // Listen for changes in notification permission
        const onPermissionChange = (isEnabled) => {
          setPermitStatus(isEnabled ? 'granted' : 'default');
        };

        const attachListener = () => {
          if (window.OneSignal.User && window.OneSignal.User.PushSubscription) {
            window.OneSignal.User.PushSubscription.addEventListener('change', onPermissionChange);
            return true;
          }
          return false;
        };

        // Try to attach listener, if not possible (due to mocked OneSignal or API change)
        // we'll just move on without causing errors
        const listenerAttached = attachListener();
        
        // Safely add event listeners for different notification events
        const addEventListenerSafely = (event, handler) => {
          if (window.OneSignal.Notifications && 
              typeof window.OneSignal.Notifications.addEventListener === 'function') {
            window.OneSignal.Notifications.addEventListener(event, handler);
            return true;
          }
          return false;
        };

        // Listen for new notifications and refresh the list
        const onNotificationReceived = (event) => {
          console.log("OneSignal notification received:", event);
          // Refresh notifications when the panel is open
          if (isOpen && user) {
            fetchUserNotifications();
          }
        };
        
        // Add event listeners for different notification events
        const clickListenerAdded = addEventListenerSafely('click', onNotificationReceived);
        const displayListenerAdded = addEventListenerSafely('foregroundWillDisplay', onNotificationReceived);
        
        // Set user ID for OneSignal if available
        if (user && window.OneSignal.User && typeof window.OneSignal.User.addExternalUserId === 'function') {
          window.OneSignal.User.addExternalUserId(user.id);
        }

        // Clean up event listeners
        return () => {
          if (listenerAttached && window.OneSignal.User && window.OneSignal.User.PushSubscription) {
            try {
              window.OneSignal.User.PushSubscription.removeEventListener('change', onPermissionChange);
            } catch (e) {
              console.warn('Failed to remove OneSignal subscription listener', e);
            }
          }
          
          if (clickListenerAdded && window.OneSignal.Notifications) {
            try {
              window.OneSignal.Notifications.removeEventListener('click', onNotificationReceived);
            } catch (e) {
              console.warn('Failed to remove OneSignal click listener', e);
            }
          }
          
          if (displayListenerAdded && window.OneSignal.Notifications) {
            try {
              window.OneSignal.Notifications.removeEventListener('foregroundWillDisplay', onNotificationReceived);
            } catch (e) {
              console.warn('Failed to remove OneSignal display listener', e);
            }
          }
        };
      } catch (error) {
        console.error("Error setting up OneSignal:", error);
      }
    }
  }, [isOpen, user, fetchUserNotifications]);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserNotifications();
    } else {
      setNotifications([]);
      setError(null);
    }
  }, [isOpen, user, fetchUserNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    if (!user) return;
    try {
      await markNotificationAsRead(notificationId, user.id);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch {}
  };

  const handleMarkAllRead = async () => {
    if (!user || notifications.filter(n => !n.is_read).length === 0) return;
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const handleDelete = async (notificationId) => {
    if (!user) return;
    try {
      await deleteNotification(notificationId, user.id);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch {}
  };

  const formatTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return '';
    }
  };  const requestNotificationPermission = () => {
    if (window.OneSignal && window.OneSignal.Notifications) {
      try {
        if (typeof window.OneSignal.Notifications.requestPermission === 'function') {
          window.OneSignal.Notifications.requestPermission();
        } else {
          console.log("OneSignal requestPermission method is not available");
          // Fallback to browser's native API if available
          if ('Notification' in window && Notification.requestPermission) {
            Notification.requestPermission();
          }
        }
      } catch (error) {
        console.error("Error showing notification permission prompt:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      {/* Notifications Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-lg animate-slide-in flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100">
              <IoClose className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold">{t('title')}</h2>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            disabled={notifications.filter(n => !n.is_read).length === 0}
            title={t('markAllRead')}
          >
            {t('markAllRead')}
          </button>
        </div>
        
        {/* Permission Banner (shown only if not granted) */}
        {permitStatus !== 'granted' && (
          <div className="p-4 bg-blue-50 border-b">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <FiBell className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">
                  {t('enableNotifications')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('stayUpdated')}
                </p>
              </div>
              <button 
                onClick={requestNotificationPermission}
                className="flex-shrink-0 bg-blue-600 px-3 py-1 rounded text-white text-sm font-medium hover:bg-blue-700"
              >
                {t('enable')}
              </button>
            </div>
          </div>
        )}
        
        {/* Notifications List */}        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <StandardLoadingIndicator message={t('loading')} variant="dots" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full p-4">
              <StandardErrorMessage type="error" message={error} />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <FiBell className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">{t('empty')}</p>
              <p className="text-xs text-gray-400 mt-2 max-w-xs">
                {t('emptyDescription')}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 hover:bg-gray-50 ${notification.is_read ? 'opacity-70' : 'font-medium'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 mr-2">
                      {!notification.is_read && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className={`text-base ${notification.is_read ? 'font-normal' : 'font-semibold'}`}>{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 break-words">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {formatTimeAgo(notification.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100"
                          title={t('markAsRead')}
                        >
                          <FiCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100"
                        title={t('delete')}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
