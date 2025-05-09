/**
 * Application Constants
 * 
 * This file contains centralized constants used throughout the MediScan application.
 * By keeping them in a single location, we improve maintenance and consistency.
 */

// Routes for navigation
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  SPLASH: '/splash',
  SCANNER: '/scanner',
  HISTORY: '/history',
  ACCOUNT: '/account',
  PERSONAL_INFO: '/account/personal-info',
  CHAT: '/chat',
  CHAT_HISTORY: '/chat/history',  SCAN_DETAILS: '/scan/:id',
  HEALTH_RECORDS: '/health/records',
  UPDATES: '/updates',
  PAYMENTS: '/account/payments',
  ABOUT_CREATORS: '/about-creators',
  HELP: '/help',
  HOW_TO_USE: '/how-to-use',
  SETTINGS: '/settings',
  ACCESSIBILITY: '/accessibility',
  LANGUAGE: '/language',
};

// LocalStorage keys
export const STORAGE_KEYS = {
  PRO_USER: 'pro_user',
  CURRENT_CHAT_ID: 'currentChatId',
  CURRENT_CHAT_MESSAGES: 'currentChatMessages',
  CURRENT_CHAT_TITLE: 'currentChatTitle',
  CURRENT_SCAN_ID: 'currentScanId',
  CURRENT_SCAN_DATA: 'currentScanData',
  CURRENT_SCAN_NAME: 'currentScanName',
  CURRENT_SCAN_IMAGE: 'currentScanImage',
  LANGUAGE: 'appLanguage',
  THEME: 'appTheme',
  LAST_LOGIN: 'lastLogin',
  AUTH_TOKEN: 'authToken',
  USER_ID: 'userId',
  ONBOARDING_COMPLETE: 'onboardingComplete',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  FIRST_LOGIN: 'firstLogin',
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  SPLASH_REDIRECT: 1500,
  PAGE_TRANSITION: 300,
  TOAST_DURATION: 3000,
  MODAL_TRANSITION: 200,
  DROPDOWN_TRANSITION: 150,
  ERROR_MESSAGE_TIMEOUT: 5000,
  SCAN_ANIMATION: 1000,
};

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://mediscan-api.vercel.app',
  SCAN: '/api/scan',
  CHAT: '/api/chat',
  HEALTH_RECORDS: '/api/health-records',
  NOTIFICATIONS: '/api/notifications',
  UPDATES: '/api/updates',
  PAYMENTS: '/api/payments',
};

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
};

// Feature limits based on tier
export const FEATURE_LIMITS = {
  [SUBSCRIPTION_TIERS.FREE]: {
    MAX_SCANS_PER_DAY: 5,
    MAX_CHATS_PER_DAY: 3,
    HISTORY_RETENTION_DAYS: 30,
    EXPORT_FORMATS: ['PDF'],
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    MAX_SCANS_PER_DAY: 20,
    MAX_CHATS_PER_DAY: 15,
    HISTORY_RETENTION_DAYS: 90,
    EXPORT_FORMATS: ['PDF', 'CSV', 'JSON'],
  },
  [SUBSCRIPTION_TIERS.PREMIUM]: {
    MAX_SCANS_PER_DAY: 100,
    MAX_CHATS_PER_DAY: 50,
    HISTORY_RETENTION_DAYS: 365,
    EXPORT_FORMATS: ['PDF', 'CSV', 'JSON', 'XML'],
  },
};

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
];

// Regex patterns for validation
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
  PHONE: /^(\+\d{1,3}[- ]?)?\d{10}$/,
  NAME: /^[a-zA-Z ]{2,30}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NAME: 'Please enter a valid name (2-30 characters, letters only)',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  RATE_LIMIT_EXCEEDED: 'You have exceeded the rate limit. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};

// Default app settings
export const DEFAULT_SETTINGS = {
  LANGUAGE: 'en',
  THEME: 'system',
  NOTIFICATIONS: true,
  SOUND: true,
  VIBRATION: true,
  AUTO_SCAN: false,
  SHOW_TUTORIAL: true,
};

// App info
export const APP_INFO = {
  NAME: 'MediScan',
  VERSION: '1.0.0',
  DESCRIPTION: 'Smart Medicine Scanner',
  DEVELOPER: 'Your Name',
  WEBSITE: 'https://mediscan.example.com',
  EMAIL: 'contact@mediscan.example.com',
  PRIVACY_POLICY: 'https://mediscan.example.com/privacy',
  TERMS_OF_SERVICE: 'https://mediscan.example.com/terms',
};

// Image upload constraints
export const IMAGE_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  MAX_DIMENSION: 2048, // Pixels
  ASPECT_RATIO: 16 / 9, // Preferred aspect ratio
};

// Toast types for consistent notifications
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Theme configuration
export const THEME_CONFIG = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Media queries for responsive design
export const MEDIA_QUERIES = {
  MOBILE: '(max-width: 640px)',
  TABLET: '(min-width: 641px) and (max-width: 1024px)',
  DESKTOP: '(min-width: 1025px)',
};

// Analytics events
export const ANALYTICS_EVENTS = {
  SCAN_INITIATED: 'scan_initiated',
  SCAN_COMPLETED: 'scan_completed',
  SCAN_ERROR: 'scan_error',
  CHAT_STARTED: 'chat_started',
  MESSAGE_SENT: 'message_sent',
  LOGIN: 'login',
  SIGNUP: 'signup',
  SUBSCRIPTION_CHANGED: 'subscription_changed',
  FEATURE_USED: 'feature_used',
  SETTINGS_CHANGED: 'settings_changed',
};

// Maximum retry attempts for API calls
export const MAX_RETRY_ATTEMPTS = 3;

// Default pagination limits
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  HISTORY_PAGE_SIZE: 15,
  CHAT_MESSAGES_PAGE_SIZE: 20,
};
