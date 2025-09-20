/**
 * Date formatting utilities
 */
export const formatDate = (date, options = {}) => {
  if (!date) return "N/A";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  const defaultOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  };

  return dateObj.toLocaleDateString("en-IN", defaultOptions);
};

export const formatDateTime = (date, options = {}) => {
  if (!date) return "N/A";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  const defaultOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  };

  return dateObj.toLocaleString("en-IN", defaultOptions);
};

export const formatTime = (date) => {
  if (!date) return "N/A";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Time";

  return dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return "N/A";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid Date";

  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60)
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${
      Math.floor(diffDays / 7) > 1 ? "s" : ""
    } ago`;
  if (diffDays < 365)
    return `${Math.floor(diffDays / 30)} month${
      Math.floor(diffDays / 30) > 1 ? "s" : ""
    } ago`;

  return `${Math.floor(diffDays / 365)} year${
    Math.floor(diffDays / 365) > 1 ? "s" : ""
  } ago`;
};

/**
 * Number formatting utilities
 */
export const formatNumber = (num, options = {}) => {
  if (num === null || num === undefined) return "N/A";
  if (typeof num !== "number") return String(num);

  const defaultOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  };

  return num.toLocaleString("en-IN", defaultOptions);
};

export const formatPercentage = (num, decimals = 1) => {
  if (num === null || num === undefined) return "N/A";
  if (typeof num !== "number") return "0%";

  return `${(num * 100).toFixed(decimals)}%`;
};

export const formatCurrency = (amount, currency = "INR") => {
  if (amount === null || amount === undefined) return "N/A";
  if (typeof amount !== "number") return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * String formatting utilities
 */
export const formatName = (firstName, lastName, fallback = "Unknown User") => {
  if (!firstName && !lastName) return fallback;
  return [firstName, lastName].filter(Boolean).join(" ").trim();
};

export const formatFullName = (user) => {
  if (!user) return "Unknown User";
  return formatName(user.firstName || user.name, user.lastName);
};

export const formatInitials = (name) => {
  if (!name) return "UN";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatHerbId = (herbId) => {
  if (!herbId) return "N/A";

  // Format: ASH1234567890 -> ASH-1234-5678-90
  if (herbId.length >= 10) {
    const prefix = herbId.slice(0, 3);
    const rest = herbId.slice(3);
    return `${prefix}-${rest.slice(0, 4)}-${rest.slice(4, 8)}-${rest.slice(8)}`;
  }

  return herbId;
};

export const formatTransactionId = (txId) => {
  if (!txId) return "N/A";

  // Show first 8 and last 6 characters
  if (txId.length > 20) {
    return `${txId.slice(0, 8)}...${txId.slice(-6)}`;
  }

  return txId;
};

export const formatAddress = (address) => {
  if (!address) return "N/A";

  const parts = [];
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.district) parts.push(address.district);
  if (address.state) parts.push(address.state);
  if (address.pincode) parts.push(address.pincode);

  return parts.join(", ");
};

export const formatLocation = (location) => {
  if (!location) return "Unknown Location";

  const parts = [];
  if (location.village) parts.push(location.village);
  if (location.district) parts.push(location.district);
  if (location.state) parts.push(location.state);

  return parts.join(", ") || "Unknown Location";
};

/**
 * Status formatting utilities
 */
export const formatStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatUserType = (userType) => {
  const typeMap = {
    FARMER: "Farmer",
    LAB: "Laboratory",
    PROCESSOR: "Processor",
    CONSUMER: "Consumer",
    ADMIN: "Administrator",
  };

  return typeMap[userType] || formatStatus(userType);
};

export const formatEventType = (eventType) => {
  const typeMap = {
    COLLECTION: "Herb Collection",
    QUALITY_TEST: "Quality Testing",
    PROCESSING: "Processing Step",
    DISTRIBUTION: "Distribution",
  };

  return typeMap[eventType] || formatStatus(eventType);
};

/**
 * Quality and rating formatters
 */
export const formatQualityRating = (rating) => {
  if (rating === null || rating === undefined) return "Not Rated";
  if (typeof rating !== "number") return "Invalid Rating";

  return `${rating.toFixed(1)}/5.0`;
};

export const formatQualityGrade = (rating) => {
  if (rating === null || rating === undefined) return "N/A";
  if (typeof rating !== "number") return "Invalid";

  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 2.5) return "Fair";
  return "Poor";
};

/**
 * Phone number formatter
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "N/A";

  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");

  // Indian phone number format
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }

  return phone;
};

/**
 * Text truncation and formatting
 */
export const truncateText = (text, maxLength = 100, suffix = "...") => {
  if (!text || text.length <= maxLength) return text || "";
  return text.slice(0, maxLength - suffix.length) + suffix;
};

export const formatNotes = (notes, maxLength = 200) => {
  if (!notes) return "No notes available";
  return truncateText(notes, maxLength);
};

/**
 * URL and email formatters
 */
export const formatUrl = (url) => {
  if (!url) return "";

  // Add protocol if missing
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }

  return url;
};

export const formatEmail = (email) => {
  if (!email) return "N/A";
  return email.toLowerCase().trim();
};

/**
 * Temperature and measurement formatters
 */
export const formatTemperature = (temp, unit = "C") => {
  if (temp === null || temp === undefined) return "N/A";
  if (typeof temp !== "number") return "Invalid";

  const symbol = unit === "F" ? "°F" : "°C";
  return `${temp.toFixed(1)}${symbol}`;
};

export const formatWeight = (weight, unit = "kg") => {
  if (weight === null || weight === undefined) return "N/A";
  if (typeof weight !== "number") return "Invalid";

  if (weight < 1 && unit === "kg") {
    return `${(weight * 1000).toFixed(0)}g`;
  }

  return `${weight.toFixed(2)} ${unit}`;
};

export const formatDistance = (distance, unit = "km") => {
  if (distance === null || distance === undefined) return "N/A";
  if (typeof distance !== "number") return "Invalid";

  if (distance < 1 && unit === "km") {
    return `${(distance * 1000).toFixed(0)}m`;
  }

  return `${distance.toFixed(2)} ${unit}`;
};

/**
 * Batch and quantity formatters
 */
export const formatBatchSize = (quantity, unit = "kg") => {
  if (!quantity) return "N/A";

  if (typeof quantity === "object") {
    const { value, unit: qUnit } = quantity;
    return formatWeight(value, qUnit || unit);
  }

  return formatWeight(quantity, unit);
};

export const formatQuantity = (quantity, unit = "pieces") => {
  if (quantity === null || quantity === undefined) return "N/A";
  if (typeof quantity !== "number") return "Invalid";

  return `${formatNumber(quantity)} ${unit}`;
};

/**
 * Coordinate and geographic formatters
 */
export const formatCoordinates = (latitude, longitude, precision = 4) => {
  if (!latitude || !longitude) return "N/A";

  const lat = parseFloat(latitude).toFixed(precision);
  const lng = parseFloat(longitude).toFixed(precision);

  return `${lat}, ${lng}`;
};

export const formatLatitude = (latitude, precision = 4) => {
  if (!latitude) return "N/A";

  const lat = parseFloat(latitude).toFixed(precision);
  const direction = latitude >= 0 ? "N" : "S";

  return `${Math.abs(lat)}° ${direction}`;
};

export const formatLongitude = (longitude, precision = 4) => {
  if (!longitude) return "N/A";

  const lng = parseFloat(longitude).toFixed(precision);
  const direction = longitude >= 0 ? "E" : "W";

  return `${Math.abs(lng)}° ${direction}`;
};

/**
 * Test result formatters
 */
export const formatTestResult = (result) => {
  if (!result) return "N/A";

  if (typeof result === "boolean") {
    return result ? "Passed" : "Failed";
  }

  if (typeof result === "object") {
    const { status, value, unit } = result;
    if (status) return formatStatus(status);
    if (value !== undefined) {
      return `${value}${unit ? ` ${unit}` : ""}`;
    }
  }

  return String(result);
};

export const formatTestResults = (results) => {
  if (!results || typeof results !== "object") return {};

  const formatted = {};

  Object.entries(results).forEach(([key, value]) => {
    const formattedKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    formatted[formattedKey] = formatTestResult(value);
  });

  return formatted;
};

/**
 * Processing condition formatters
 */
export const formatProcessingConditions = (conditions) => {
  if (!conditions || typeof conditions !== "object") return {};

  const formatted = {};

  Object.entries(conditions).forEach(([key, value]) => {
    const formattedKey = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();

    let formattedValue = value;

    // Special formatting for common condition types
    if (key.includes("temp") || key.includes("Temperature")) {
      formattedValue = formatTemperature(value);
    } else if (key.includes("humidity") || key.includes("Humidity")) {
      formattedValue = formatPercentage(value / 100);
    } else if (key.includes("pressure") || key.includes("Pressure")) {
      formattedValue = `${value} Pa`;
    } else if (key.includes("duration") || key.includes("time")) {
      formattedValue = formatDuration(value);
    } else if (typeof value === "number") {
      formattedValue = formatNumber(value);
    }

    formatted[formattedKey] = formattedValue;
  });

  return formatted;
};

/**
 * Duration formatter
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) return "0 seconds";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
  if (remainingSeconds > 0 && hours === 0) {
    parts.push(`${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`);
  }

  return parts.join(", ");
};

/**
 * Error message formatter
 */
export const formatErrorMessage = (error) => {
  if (!error) return "Unknown error occurred";

  if (typeof error === "string") return error;

  if (error.message) return error.message;

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  return "An unexpected error occurred";
};

/**
 * Validation error formatter
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return [];

  if (Array.isArray(errors)) {
    return errors.map((error) => {
      if (typeof error === "string") return error;
      return error.message || error.msg || String(error);
    });
  }

  if (typeof errors === "object") {
    return Object.entries(errors).map(([field, message]) => {
      const fieldName = field.replace(/([A-Z])/g, " $1").toLowerCase();
      return `${fieldName}: ${message}`;
    });
  }

  return [String(errors)];
};

/**
 * Utility functions for common formatting tasks
 */
export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const formatCamelCase = (str) => {
  if (!str) return "";
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

export const formatSlug = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * Export utility object with all formatters
 */
export const Formatters = {
  // Date formatters
  date: formatDate,
  dateTime: formatDateTime,
  time: formatTime,
  relativeTime: formatRelativeTime,
  duration: formatDuration,

  // Number formatters
  number: formatNumber,
  percentage: formatPercentage,
  currency: formatCurrency,
  fileSize: formatFileSize,

  // String formatters
  name: formatName,
  fullName: formatFullName,
  initials: formatInitials,
  herbId: formatHerbId,
  transactionId: formatTransactionId,
  address: formatAddress,
  location: formatLocation,
  phone: formatPhoneNumber,
  email: formatEmail,
  url: formatUrl,

  // Status formatters
  status: formatStatus,
  userType: formatUserType,
  eventType: formatEventType,

  // Quality formatters
  qualityRating: formatQualityRating,
  qualityGrade: formatQualityGrade,

  // Measurement formatters
  temperature: formatTemperature,
  weight: formatWeight,
  distance: formatDistance,
  quantity: formatQuantity,
  batchSize: formatBatchSize,

  // Geographic formatters
  coordinates: formatCoordinates,
  latitude: formatLatitude,
  longitude: formatLongitude,

  // Test and processing formatters
  testResult: formatTestResult,
  testResults: formatTestResults,
  processingConditions: formatProcessingConditions,

  // Text utilities
  truncate: truncateText,
  notes: formatNotes,
  capitalizeFirst,
  capitalizeWords,
  camelCase: formatCamelCase,
  slug: formatSlug,

  // Error formatters
  error: formatErrorMessage,
  validationErrors: formatValidationErrors,
};

export default Formatters;
