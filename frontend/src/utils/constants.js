/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Application Information
export const APP_INFO = {
  NAME: "HerbTrace",
  VERSION: "1.0.0",
  DESCRIPTION: "Blockchain-powered traceability for medicinal herbs",
  AUTHOR: "HerbTrace Team",
  SUPPORT_EMAIL: "support@herbtrace.com",
  WEBSITE: "https://herbtrace.com",
};

// User Types
export const USER_TYPES = {
  FARMER: "FARMER",
  LAB: "LAB",
  PROCESSOR: "PROCESSOR",
  CONSUMER: "CONSUMER",
  ADMIN: "ADMIN",
};

export const USER_TYPE_LABELS = {
  [USER_TYPES.FARMER]: "Farmer",
  [USER_TYPES.LAB]: "Laboratory",
  [USER_TYPES.PROCESSOR]: "Processor",
  [USER_TYPES.CONSUMER]: "Consumer",
  [USER_TYPES.ADMIN]: "Administrator",
};

export const USER_TYPE_DESCRIPTIONS = {
  [USER_TYPES.FARMER]: "Collect and cultivate medicinal herbs",
  [USER_TYPES.LAB]: "Perform quality testing and certification",
  [USER_TYPES.PROCESSOR]: "Process herbs into final products",
  [USER_TYPES.CONSUMER]: "Purchase and trace herb products",
  [USER_TYPES.ADMIN]: "System administration and oversight",
};

// Herb and Batch Status
export const HERB_STATUS = {
  COLLECTED: "COLLECTED",
  TESTED: "TESTED",
  PROCESSED: "PROCESSED",
  DISTRIBUTED: "DISTRIBUTED",
  FAILED: "FAILED",
  EXPIRED: "EXPIRED",
};

export const HERB_STATUS_LABELS = {
  [HERB_STATUS.COLLECTED]: "Collected",
  [HERB_STATUS.TESTED]: "Quality Tested",
  [HERB_STATUS.PROCESSED]: "Processed",
  [HERB_STATUS.DISTRIBUTED]: "Distributed",
  [HERB_STATUS.FAILED]: "Failed Quality Test",
  [HERB_STATUS.EXPIRED]: "Expired",
};

export const HERB_STATUS_COLORS = {
  [HERB_STATUS.COLLECTED]: "blue",
  [HERB_STATUS.TESTED]: "mint",
  [HERB_STATUS.PROCESSED]: "sage",
  [HERB_STATUS.DISTRIBUTED]: "green",
  [HERB_STATUS.FAILED]: "red",
  [HERB_STATUS.EXPIRED]: "gray",
};

// Event Types for Blockchain
export const EVENT_TYPES = {
  COLLECTION: "COLLECTION",
  QUALITY_TEST: "QUALITY_TEST",
  PROCESSING: "PROCESSING",
  DISTRIBUTION: "DISTRIBUTION",
  TRANSFER: "TRANSFER",
  RECALL: "RECALL",
};

export const EVENT_TYPE_LABELS = {
  [EVENT_TYPES.COLLECTION]: "Herb Collection",
  [EVENT_TYPES.QUALITY_TEST]: "Quality Testing",
  [EVENT_TYPES.PROCESSING]: "Processing Step",
  [EVENT_TYPES.DISTRIBUTION]: "Distribution",
  [EVENT_TYPES.TRANSFER]: "Ownership Transfer",
  [EVENT_TYPES.RECALL]: "Product Recall",
};

// Processing Steps
export const PROCESSING_STEPS = {
  CLEANING: "CLEANING",
  DRYING: "DRYING",
  GRINDING: "GRINDING",
  EXTRACTION: "EXTRACTION",
  PACKAGING: "PACKAGING",
  LABELING: "LABELING",
};

export const PROCESSING_STEP_LABELS = {
  [PROCESSING_STEPS.CLEANING]: "Cleaning",
  [PROCESSING_STEPS.DRYING]: "Drying",
  [PROCESSING_STEPS.GRINDING]: "Grinding",
  [PROCESSING_STEPS.EXTRACTION]: "Extraction",
  [PROCESSING_STEPS.PACKAGING]: "Packaging",
  [PROCESSING_STEPS.LABELING]: "Labeling",
};

// Quality Test Types
export const TEST_TYPES = {
  PURITY: "PURITY",
  CONTAMINATION: "CONTAMINATION",
  MOISTURE: "MOISTURE",
  HEAVY_METALS: "HEAVY_METALS",
  PESTICIDES: "PESTICIDES",
  MICROBIAL: "MICROBIAL",
  AUTHENTICITY: "AUTHENTICITY",
};

export const TEST_TYPE_LABELS = {
  [TEST_TYPES.PURITY]: "Purity Analysis",
  [TEST_TYPES.CONTAMINATION]: "Contamination Check",
  [TEST_TYPES.MOISTURE]: "Moisture Content",
  [TEST_TYPES.HEAVY_METALS]: "Heavy Metals",
  [TEST_TYPES.PESTICIDES]: "Pesticide Residue",
  [TEST_TYPES.MICROBIAL]: "Microbial Testing",
  [TEST_TYPES.AUTHENTICITY]: "Authenticity Verification",
};

// Quality Grades
export const QUALITY_GRADES = {
  A_PLUS: { min: 4.5, max: 5.0, label: "A+", description: "Premium Grade" },
  A: { min: 4.0, max: 4.4, label: "A", description: "High Grade" },
  B_PLUS: { min: 3.5, max: 3.9, label: "B+", description: "Good Grade" },
  B: { min: 3.0, max: 3.4, label: "B", description: "Standard Grade" },
  C: { min: 2.0, max: 2.9, label: "C", description: "Lower Grade" },
  F: { min: 0, max: 1.9, label: "F", description: "Failed Grade" },
};

// Common Medicinal Herbs
export const COMMON_HERBS = [
  "Ashwagandha",
  "Turmeric",
  "Ginger",
  "Neem",
  "Tulsi (Holy Basil)",
  "Brahmi",
  "Amla",
  "Giloy",
  "Triphala",
  "Shatavari",
  "Arjuna",
  "Bael",
  "Fenugreek",
  "Cinnamon",
  "Cardamom",
  "Black Pepper",
  "Cloves",
  "Fennel",
  "Ajwain",
  "Jeera (Cumin)",
];

// Indian States for Location
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

// Storage Keys for localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: "token",
  USER_DATA: "userData",
  THEME_PREFERENCE: "themePreference",
  LANGUAGE_PREFERENCE: "languagePreference",
  RECENT_SEARCHES: "recentSearches",
  RECENT_HERBS: "recentHerbs",
  USER_PREFERENCES: "userPreferences",
  CACHED_DATA: "cachedData",
  ONBOARDING_COMPLETED: "onboardingCompleted",
};

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    mint: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
    sage: {
      50: "#f8faf8",
      100: "#e8f2e8",
      200: "#d3e5d3",
      300: "#a8c8a8",
      400: "#7a9f7a",
      500: "#5a7c5a",
      600: "#4a6b4a",
      700: "#3d5a3d",
      800: "#2f4a2f",
      900: "#243d24",
    },
    cream: {
      50: "#fefefe",
      100: "#fdfcfc",
      200: "#fbf9f9",
      300: "#f8f5f5",
      400: "#f5f0f0",
      500: "#f1ebeb",
      600: "#e8dede",
      700: "#d4c4c4",
      800: "#b8a3a3",
      900: "#9a8080",
    },
  },
};

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "text/plain",
    "application/msword",
  ],
  MAX_FILES_PER_UPLOAD: 10,
};

// Date and Time Configuration
export const DATE_CONFIG = {
  DEFAULT_FORMAT: "DD/MM/YYYY",
  DATETIME_FORMAT: "DD/MM/YYYY HH:mm",
  TIME_FORMAT: "HH:mm",
  API_DATE_FORMAT: "YYYY-MM-DD",
  API_DATETIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
  LOCALE: "en-IN",
  TIMEZONE: "Asia/Kolkata",
};

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_BUTTONS: 5,
};

// Search Configuration
export const SEARCH_CONFIG = {
  DEBOUNCE_DELAY: 300,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  MAX_RECENT_SEARCHES: 10,
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: false,
  },
  PHONE: {
    COUNTRY_CODE: "IN",
    FORMAT: "+91 XXXXX XXXXX",
  },
  HERB_ID: {
    PATTERN: /^[A-Z]{3}\d{10}$/,
    FORMAT: "ABC1234567890",
  },
  COORDINATES: {
    LATITUDE_RANGE: { min: -90, max: 90 },
    LONGITUDE_RANGE: { min: -180, max: 180 },
  },
  QUALITY_RATING: {
    MIN: 0,
    MAX: 5,
    DECIMAL_PLACES: 1,
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Network connection failed. Please check your internet connection.",
  SERVER_ERROR: "Server error occurred. Please try again later.",
  UNAUTHORIZED: "Your session has expired. Please log in again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FILE_TOO_LARGE: "File size exceeds the maximum allowed limit.",
  INVALID_FILE_TYPE: "File type is not supported.",
  LOCATION_PERMISSION_DENIED:
    "Location access denied. Please enable location services.",
  CAMERA_PERMISSION_DENIED:
    "Camera access denied. Please enable camera permissions.",
  QR_SCAN_FAILED: "Failed to scan QR code. Please try again.",
  OFFLINE: "You are currently offline. Some features may not be available.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in!",
  LOGOUT_SUCCESS: "Successfully logged out!",
  REGISTRATION_SUCCESS: "Registration successful! Welcome to HerbTrace.",
  PROFILE_UPDATED: "Profile updated successfully!",
  HERB_COLLECTED: "Herb collection recorded successfully!",
  TEST_RECORDED: "Quality test results recorded successfully!",
  PROCESSING_RECORDED: "Processing step recorded successfully!",
  QR_GENERATED: "QR code generated successfully!",
  DATA_EXPORTED: "Data exported successfully!",
  PASSWORD_CHANGED: "Password changed successfully!",
};

// Navigation Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  HERB_COLLECTION: "/collect",
  QUALITY_TESTING: "/quality-test",
  PROCESSING: "/process",
  TRACE_HERB: "/trace",
  HERB_DETAILS: "/herb/:herbId",
  ADMIN_PANEL: "/admin",
};

// Menu Items for Different User Types
export const MENU_ITEMS = {
  [USER_TYPES.FARMER]: [
    { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "BarChart3" },
    { path: ROUTES.HERB_COLLECTION, label: "Collect Herbs", icon: "Leaf" },
    { path: ROUTES.TRACE_HERB, label: "Trace Herbs", icon: "Search" },
  ],
  [USER_TYPES.LAB]: [
    { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "BarChart3" },
    {
      path: ROUTES.QUALITY_TESTING,
      label: "Quality Testing",
      icon: "TestTube",
    },
    { path: ROUTES.TRACE_HERB, label: "Trace Herbs", icon: "Search" },
  ],
  [USER_TYPES.PROCESSOR]: [
    { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "BarChart3" },
    { path: ROUTES.PROCESSING, label: "Processing", icon: "Settings" },
    { path: ROUTES.TRACE_HERB, label: "Trace Herbs", icon: "Search" },
  ],
  [USER_TYPES.CONSUMER]: [
    { path: ROUTES.TRACE_HERB, label: "Trace Herbs", icon: "Search" },
  ],
  [USER_TYPES.ADMIN]: [
    { path: ROUTES.DASHBOARD, label: "Dashboard", icon: "BarChart3" },
    { path: ROUTES.ADMIN_PANEL, label: "Admin Panel", icon: "Settings" },
    { path: ROUTES.TRACE_HERB, label: "Trace Herbs", icon: "Search" },
  ],
};

// QR Code Configuration
export const QR_CONFIG = {
  SIZE: 256,
  ERROR_CORRECTION_LEVEL: "M",
  TYPE: "image/png",
  QUALITY: 0.92,
  MARGIN: 1,
  COLOR: {
    DARK: "#115e59",
    LIGHT: "#ffffff",
  },
};

// Blockchain Configuration
export const BLOCKCHAIN_CONFIG = {
  NETWORK_NAME: "HerbTrace Network",
  CHANNEL_NAME: "herbtrace-channel",
  CHAINCODE_NAME: "herbtrace-chaincode",
  ORGANIZATION: "HerbTraceOrg",
  PEER: "peer0.herbtrace.com",
  ORDERER: "orderer.herbtrace.com",
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_QR_SCANNER: true,
  ENABLE_GEOLOCATION: true,
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_DARK_MODE: false,
  ENABLE_MULTI_LANGUAGE: false,
  ENABLE_ADVANCED_ANALYTICS: true,
  ENABLE_EXPORT_FEATURES: true,
  ENABLE_BATCH_OPERATIONS: true,
};

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  USER_DATA_TTL: 30 * 60 * 1000, // 30 minutes
  HERB_DATA_TTL: 10 * 60 * 1000, // 10 minutes
  STATIC_DATA_TTL: 24 * 60 * 60 * 1000, // 24 hours
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
};

// Animation and UI Configuration
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  LOADING_DELAY: 200,
  TOAST_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 200,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
};

// Export grouped constants
export const Constants = {
  API_CONFIG,
  APP_INFO,
  USER_TYPES,
  USER_TYPE_LABELS,
  USER_TYPE_DESCRIPTIONS,
  HERB_STATUS,
  HERB_STATUS_LABELS,
  HERB_STATUS_COLORS,
  EVENT_TYPES,
  EVENT_TYPE_LABELS,
  PROCESSING_STEPS,
  PROCESSING_STEP_LABELS,
  TEST_TYPES,
  TEST_TYPE_LABELS,
  QUALITY_GRADES,
  COMMON_HERBS,
  INDIAN_STATES,
  STORAGE_KEYS,
  THEME_CONFIG,
  FILE_CONFIG,
  DATE_CONFIG,
  PAGINATION_CONFIG,
  SEARCH_CONFIG,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  MENU_ITEMS,
  QR_CONFIG,
  BLOCKCHAIN_CONFIG,
  FEATURE_FLAGS,
  CACHE_CONFIG,
  UI_CONFIG,
};

// Helper functions for constants
export const getStatusColor = (status) => {
  return HERB_STATUS_COLORS[status] || "gray";
};

export const getStatusLabel = (status) => {
  return HERB_STATUS_LABELS[status] || status;
};

export const getUserTypeLabel = (userType) => {
  return USER_TYPE_LABELS[userType] || userType;
};

export const getEventTypeLabel = (eventType) => {
  return EVENT_TYPE_LABELS[eventType] || eventType;
};

export const getProcessingStepLabel = (step) => {
  return PROCESSING_STEP_LABELS[step] || step;
};

export const getTestTypeLabel = (testType) => {
  return TEST_TYPE_LABELS[testType] || testType;
};

export const getQualityGrade = (rating) => {
  if (typeof rating !== "number") return null;

  return (
    Object.values(QUALITY_GRADES).find(
      (grade) => rating >= grade.min && rating <= grade.max
    ) || null
  );
};

export const isFeatureEnabled = (feature) => {
  return FEATURE_FLAGS[feature] || false;
};

export const getMenuItemsForUserType = (userType) => {
  return MENU_ITEMS[userType] || MENU_ITEMS[USER_TYPES.CONSUMER];
};

export const getCacheKey = (type, id) => {
  return `${type}_${id}`;
};

export const formatHerbIdPattern = (herbId) => {
  if (!herbId) return "";

  // Remove any existing formatting
  const cleanId = herbId.replace(/[-\s]/g, "");

  // Apply formatting: ABC1234567890 -> ABC-1234-5678-90
  if (cleanId.length >= 13) {
    return `${cleanId.slice(0, 3)}-${cleanId.slice(3, 7)}-${cleanId.slice(
      7,
      11
    )}-${cleanId.slice(11)}`;
  }

  return cleanId;
};

// Environment-specific constants
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",

  // API URLs
  API_BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
  BLOCKCHAIN_API_URL:
    process.env.REACT_APP_BLOCKCHAIN_API_URL || "http://localhost:3002/api",

  // External services
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  ANALYTICS_ID: process.env.REACT_APP_ANALYTICS_ID,
  SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN,

  // Feature toggles from environment
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  ENABLE_ERROR_REPORTING:
    process.env.REACT_APP_ENABLE_ERROR_REPORTING === "true",
  ENABLE_DEVELOPMENT_TOOLS: process.env.REACT_APP_ENABLE_DEV_TOOLS === "true",

  // App configuration
  APP_VERSION: process.env.REACT_APP_VERSION || "1.0.0",
  BUILD_DATE: process.env.REACT_APP_BUILD_DATE,
  GIT_COMMIT: process.env.REACT_APP_GIT_COMMIT,
};

// Regular expressions for validation
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_INDIA: /^[+]?91[-.\s]?\d{5}[-.\s]?\d{5}$/,
  PHONE_INTERNATIONAL: /^[+]?[(]?[\d\s\-\(\)]{10,}$/,
  PASSWORD_STRONG:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PASSWORD_MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  HERB_ID: /^[A-Z]{3}\d{10}$/,
  PINCODE_INDIA: /^\d{6}$/,
  COORDINATES: /^-?\d+\.?\d*$/,
  URL: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHABETS_ONLY: /^[a-zA-Z\s]+$/,
  NUMBERS_ONLY: /^\d+$/,
  DECIMAL: /^\d+\.?\d*$/,
  BLOCKCHAIN_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
};

// Time intervals in milliseconds
export const TIME_INTERVALS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
};

// Local storage size limits (approximate)
export const STORAGE_LIMITS = {
  LOCAL_STORAGE_MAX: 5 * 1024 * 1024, // 5MB
  SESSION_STORAGE_MAX: 5 * 1024 * 1024, // 5MB
  CACHE_STORAGE_MAX: 50 * 1024 * 1024, // 50MB
  INDEXED_DB_MAX: 250 * 1024 * 1024, // 250MB
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Default user preferences
export const DEFAULT_USER_PREFERENCES = {
  theme: "light",
  language: "en",
  dateFormat: DATE_CONFIG.DEFAULT_FORMAT,
  timeFormat: DATE_CONFIG.TIME_FORMAT,
  timezone: DATE_CONFIG.TIMEZONE,
  notifications: {
    email: true,
    push: false,
    sms: false,
    inApp: true,
  },
  privacy: {
    shareLocation: false,
    shareAnalytics: true,
    allowCookies: true,
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
  },
};

// Chart and analytics configuration
export const ANALYTICS_CONFIG = {
  CHART_COLORS: [
    "#14b8a6", // mint-500
    "#5a7c5a", // sage-500
    "#0d9488", // mint-600
    "#7a9f7a", // sage-400
    "#2dd4bf", // mint-400
    "#a8c8a8", // sage-300
    "#5eead4", // mint-300
    "#d3e5d3", // sage-200
  ],
  DEFAULT_CHART_OPTIONS: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  },
  REFRESH_INTERVALS: {
    DASHBOARD: 30000, // 30 seconds
    REAL_TIME: 5000, // 5 seconds
    PERIODIC: 300000, // 5 minutes
  },
};

// Notification types and configurations
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  MAX_NOTIFICATIONS: 5,
  POSITIONS: {
    TOP_RIGHT: "top-right",
    TOP_LEFT: "top-left",
    BOTTOM_RIGHT: "bottom-right",
    BOTTOM_LEFT: "bottom-left",
    TOP_CENTER: "top-center",
    BOTTOM_CENTER: "bottom-center",
  },
};

// Geolocation configuration
export const GEO_CONFIG = {
  DEFAULT_ZOOM: 10,
  HIGH_ACCURACY: true,
  TIMEOUT: 10000,
  MAXIMUM_AGE: 600000, // 10 minutes
  INDIA_BOUNDS: {
    north: 37.6,
    south: 6.4,
    east: 97.25,
    west: 68.7,
  },
};

// Export utility functions
export const Utils = {
  getStatusColor,
  getStatusLabel,
  getUserTypeLabel,
  getEventTypeLabel,
  getProcessingStepLabel,
  getTestTypeLabel,
  getQualityGrade,
  isFeatureEnabled,
  getMenuItemsForUserType,
  getCacheKey,
  formatHerbIdPattern,
};

export default Constants;
