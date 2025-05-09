import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { getUserSettings, updateUserSettings } from '../../lib/supabase/user-settings';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { LoadingScreen } from '../../components/ui/LoadingSpinner';
import NotificationToggle from '../../components/ui/NotificationToggle';
import SelectField from '../../components/ui/SelectField';
import AlertMessage from '../../components/ui/AlertMessage';
import { toggleNotification, updateAccessibility } from '../../utils/userSettingsUtils';
import FeedbackButton from '../../components/ui/FeedbackButton';

const UserSettings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, languages, changeLanguage } = useLanguage();
  const { t, i18n } = useTranslation(['userSettings', 'accessibility']);
  
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch user settings when component mounts
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const userSettings = await getUserSettings(user.id);
        setSettings(userSettings);
      } catch (err) {
        console.error('Error fetching user settings:', err);
        setError('Failed to load settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  // Update notification preferences
  const handleNotificationToggle = (type) => {
    if (!settings) return;
    setSettings(toggleNotification(settings, type));
  };

  // Update accessibility settings
  const handleAccessibilityChange = (key, value) => {
    if (!settings) return;
    setSettings(updateAccessibility(settings, key, value));
  };

  // Save settings to database
  const handleSaveSettings = async () => {
    if (!user || !settings) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      await updateUserSettings(user.id, {
        notification_preferences: settings.notification_preferences,
        accessibility_settings: settings.accessibility_settings
      });
      
      // Apply theme and language settings locally
      if (settings.accessibility_settings.theme && settings.accessibility_settings.theme !== theme) {
        toggleTheme();
      }
      
      if (settings.accessibility_settings.language && settings.accessibility_settings.language !== currentLanguage) {
        changeLanguage(settings.accessibility_settings.language);
      }
      
      setSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving user settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading settings..." />;
  }

  return (
    <div className="min-h-screen bg-background container-narrow pb-20">
      <PageHeader title={t('title', {ns: 'userSettings'})} />

      {error && (
        <AlertMessage type="error">{error}</AlertMessage>
      )}

      {success && (
        <AlertMessage type="success">
          {t('settingsSaved', {ns: 'userSettings', defaultValue: 'Settings saved successfully!'})}
        </AlertMessage>
      )}
      <Card className="p-4 mb-4">
        <h2 className="text-lg font-medium mb-4">{t('notifications', {ns: 'userSettings'})}</h2>
        <div className="space-y-3">
          <NotificationToggle
            label={t('emailNotifications', {ns: 'userSettings', defaultValue: 'Email Notifications'})}
            checked={settings?.notification_preferences?.email || false}
            onChange={() => handleNotificationToggle('email')}
          />
          <NotificationToggle
            label={t('pushNotifications', {ns: 'userSettings', defaultValue: 'Push Notifications'})}
            checked={settings?.notification_preferences?.push || false}
            onChange={() => handleNotificationToggle('push')}
          />
        </div>
      </Card>
      <Card className="p-4 mb-4">
        <h2 className="text-lg font-medium mb-4">{t('title', {ns: 'accessibility'})}</h2>
        <div className="space-y-4">
          <SelectField
            label={t('theme', {ns: 'accessibility'})}
            value={settings?.accessibility_settings?.theme || theme}
            onChange={e => handleAccessibilityChange('theme', e.target.value)}
          >
            <option value="light">{t('lightTheme', {ns: 'accessibility', defaultValue: 'Light'})}</option>
            <option value="dark">{t('darkTheme', {ns: 'accessibility', defaultValue: 'Dark'})}</option>
          </SelectField>
          <SelectField
            label={t('language', {ns: 'userSettings'})}
            value={settings?.accessibility_settings?.language || currentLanguage}
            onChange={e => handleAccessibilityChange('language', e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label={t('fontSize', {ns: 'accessibility', defaultValue: 'Text Size'})}
            value={settings?.accessibility_settings?.textSize || 'medium'}
            onChange={e => handleAccessibilityChange('textSize', e.target.value)}
          >
            <option value="small">{t('small', {ns: 'accessibility', defaultValue: 'Small'})}</option>
            <option value="medium">{t('medium', {ns: 'accessibility', defaultValue: 'Medium'})}</option>
            <option value="large">{t('large', {ns: 'accessibility', defaultValue: 'Large'})}</option>
          </SelectField>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          variant="primary"
          isLoading={saving}
        >
          Save Settings
        </Button>
      </div>

      <FeedbackButton isFloating={true} />
    </div>
  );
};

export default UserSettings;
