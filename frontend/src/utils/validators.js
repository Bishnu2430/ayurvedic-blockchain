/**
 * Validation utility functions for form inputs and data
 */

// Regular expressions for common validations
const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[(]?[\d\s\-\(\)]{10,}$/,
  indianPhone: /^[+]?91[-.\s]?\d{5}[-.\s]?\d{5}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  herbId: /^[A-Z]{3}\d{10}$/,
  pincode: /^\d{6}$/,
  coordinates: /^-?\d+\.?\d*$/,
  url: /^https?:\/\/[^\s/$.?#].[^\s]*$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphabets: /^[a-zA-Z\s]+$/,
  numbers: /^\d+$/,
  decimal: /^\d+\.?\d*$/,
};

/**
 * Basic validation functions
 */
export const isRequired = (value, fieldName = "Field") => {
  if (value === null || value === undefined || value === "") {
    return `${fieldName} is required`;
  }
  if (typeof value === "string" && value.trim() === "") {
    return `${fieldName} cannot be empty`;
  }
  return null;
};

export const isValidEmail = (email) => {
  if (!email) return "Email is required";
  if (typeof email !== "string") return "Email must be a string";
  if (!REGEX.email.test(email.trim())) {
    return "Please enter a valid email address";
  }
  return null;
};

export const isValidPhone = (phone, countryCode = "IN") => {
  if (!phone) return "Phone number is required";

  const cleanPhone = phone.replace(/\s/g, "");

  if (countryCode === "IN") {
    if (!REGEX.indianPhone.test(cleanPhone)) {
      return "Please enter a valid Indian phone number (10 digits)";
    }
  } else {
    if (!REGEX.phone.test(cleanPhone)) {
      return "Please enter a valid phone number";
    }
  }

  return null;
};

export const isValidPassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = false,
  } = options;

  if (!password) return "Password is required";

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters long`;
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (requireNumbers && !/\d/.test(password)) {
    return "Password must contain at least one number";
  }

  if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
    return "Password must contain at least one special character (@$!%*?&)";
  }

  return null;
};

export const isValidConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return null;
};

/**
 * Length validators
 */
export const hasMinLength = (value, minLength, fieldName = "Field") => {
  if (!value) return `${fieldName} is required`;
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters long`;
  }
  return null;
};

export const hasMaxLength = (value, maxLength, fieldName = "Field") => {
  if (value && value.length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return null;
};

export const hasExactLength = (value, length, fieldName = "Field") => {
  if (!value) return `${fieldName} is required`;
  if (value.length !== length) {
    return `${fieldName} must be exactly ${length} characters long`;
  }
  return null;
};

/**
 * Number validators
 */
export const isValidNumber = (value, fieldName = "Field") => {
  if (value === null || value === undefined || value === "") {
    return `${fieldName} is required`;
  }

  const num = Number(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number`;
  }

  return null;
};

export const isInRange = (value, min, max, fieldName = "Field") => {
  const numberError = isValidNumber(value, fieldName);
  if (numberError) return numberError;

  const num = Number(value);
  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }

  return null;
};

export const isPositive = (value, fieldName = "Field") => {
  const numberError = isValidNumber(value, fieldName);
  if (numberError) return numberError;

  if (Number(value) <= 0) {
    return `${fieldName} must be a positive number`;
  }

  return null;
};

export const isInteger = (value, fieldName = "Field") => {
  const numberError = isValidNumber(value, fieldName);
  if (numberError) return numberError;

  if (!Number.isInteger(Number(value))) {
    return `${fieldName} must be a whole number`;
  }

  return null;
};

/**
 * Pattern validators
 */
export const matchesPattern = (
  value,
  pattern,
  message,
  fieldName = "Field"
) => {
  if (!value) return `${fieldName} is required`;

  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;

  if (!regex.test(value)) {
    return message || `${fieldName} format is invalid`;
  }

  return null;
};

export const isAlphabetsOnly = (value, fieldName = "Field") => {
  return matchesPattern(
    value,
    REGEX.alphabets,
    `${fieldName} should contain only letters and spaces`,
    fieldName
  );
};

export const isAlphanumeric = (value, fieldName = "Field") => {
  return matchesPattern(
    value,
    REGEX.alphanumeric,
    `${fieldName} should contain only letters and numbers`,
    fieldName
  );
};

export const isNumericString = (value, fieldName = "Field") => {
  return matchesPattern(
    value,
    REGEX.numbers,
    `${fieldName} should contain only numbers`,
    fieldName
  );
};

/**
 * Domain-specific validators
 */
export const isValidHerbId = (herbId) => {
  if (!herbId) return "Herb ID is required";

  if (!REGEX.herbId.test(herbId)) {
    return "Herb ID must be in format: ABC1234567890 (3 letters followed by 10 digits)";
  }

  return null;
};

export const isValidPincode = (pincode) => {
  if (!pincode) return "Pincode is required";

  if (!REGEX.pincode.test(pincode)) {
    return "Please enter a valid 6-digit pincode";
  }

  return null;
};

export const isValidCoordinate = (value, type = "coordinate") => {
  if (!value && value !== 0) return `${type} is required`;

  const num = Number(value);
  if (isNaN(num)) {
    return `${type} must be a valid number`;
  }

  if (type.toLowerCase().includes("lat")) {
    if (num < -90 || num > 90) {
      return "Latitude must be between -90 and 90 degrees";
    }
  } else if (type.toLowerCase().includes("lon")) {
    if (num < -180 || num > 180) {
      return "Longitude must be between -180 and 180 degrees";
    }
  }

  return null;
};

export const isValidUrl = (url, fieldName = "URL") => {
  if (!url) return `${fieldName} is required`;

  // Add protocol if missing
  const urlWithProtocol = url.startsWith("http") ? url : `https://${url}`;

  if (!REGEX.url.test(urlWithProtocol)) {
    return `Please enter a valid ${fieldName}`;
  }

  return null;
};

export const isValidQualityRating = (rating) => {
  if (rating === null || rating === undefined) {
    return "Quality rating is required";
  }

  const num = Number(rating);
  if (isNaN(num)) {
    return "Quality rating must be a valid number";
  }

  if (num < 0 || num > 5) {
    return "Quality rating must be between 0 and 5";
  }

  return null;
};

export const isValidWeight = (weight, unit = "kg") => {
  if (!weight && weight !== 0) return "Weight is required";

  const num = Number(weight);
  if (isNaN(num)) {
    return "Weight must be a valid number";
  }

  if (num <= 0) {
    return "Weight must be greater than 0";
  }

  // Reasonable limits based on unit
  if (unit === "kg" && num > 1000) {
    return "Weight seems too large (max 1000kg)";
  }

  if (unit === "g" && num > 1000000) {
    return "Weight seems too large (max 1000000g)";
  }

  return null;
};

export const isValidTemperature = (temperature, unit = "C") => {
  if (temperature === null || temperature === undefined) {
    return "Temperature is required";
  }

  const num = Number(temperature);
  if (isNaN(num)) {
    return "Temperature must be a valid number";
  }

  // Reasonable limits for herb processing
  if (unit === "C") {
    if (num < -50 || num > 200) {
      return "Temperature must be between -50°C and 200°C";
    }
  } else if (unit === "F") {
    if (num < -58 || num > 392) {
      return "Temperature must be between -58°F and 392°F";
    }
  }

  return null;
};

/**
 * Date validators
 */
export const isValidDate = (date, fieldName = "Date") => {
  if (!date) return `${fieldName} is required`;

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }

  return null;
};

export const isNotFutureDate = (date, fieldName = "Date") => {
  const dateError = isValidDate(date, fieldName);
  if (dateError) return dateError;

  const dateObj = new Date(date);
  const now = new Date();

  if (dateObj > now) {
    return `${fieldName} cannot be in the future`;
  }

  return null;
};

export const isNotPastDate = (date, fieldName = "Date") => {
  const dateError = isValidDate(date, fieldName);
  if (dateError) return dateError;

  const dateObj = new Date(date);
  const now = new Date();

  if (dateObj < now) {
    return `${fieldName} cannot be in the past`;
  }

  return null;
};

export const isWithinDateRange = (
  date,
  minDate,
  maxDate,
  fieldName = "Date"
) => {
  const dateError = isValidDate(date, fieldName);
  if (dateError) return dateError;

  const dateObj = new Date(date);
  const min = new Date(minDate);
  const max = new Date(maxDate);

  if (dateObj < min || dateObj > max) {
    return `${fieldName} must be between ${min.toDateString()} and ${max.toDateString()}`;
  }

  return null;
};

/**
 * File validators
 */
export const isValidFileType = (file, allowedTypes = []) => {
  if (!file) return "File is required";

  if (allowedTypes.length === 0) return null;

  const fileType = file.type.toLowerCase();
  const isAllowed = allowedTypes.some((type) =>
    fileType.includes(type.toLowerCase())
  );

  if (!isAllowed) {
    return `File must be one of: ${allowedTypes.join(", ")}`;
  }

  return null;
};

export const isValidFileSize = (file, maxSizeInMB = 5) => {
  if (!file) return "File is required";

  const maxSize = maxSizeInMB * 1024 * 1024; // Convert to bytes

  if (file.size > maxSize) {
    return `File size must be less than ${maxSizeInMB}MB`;
  }

  return null;
};

/**
 * Array validators
 */
export const hasMinItems = (array, minItems, fieldName = "Items") => {
  if (!array || !Array.isArray(array)) {
    return `${fieldName} is required`;
  }

  if (array.length < minItems) {
    return `Please select at least ${minItems} ${fieldName.toLowerCase()}`;
  }

  return null;
};

export const hasMaxItems = (array, maxItems, fieldName = "Items") => {
  if (array && Array.isArray(array) && array.length > maxItems) {
    return `Please select no more than ${maxItems} ${fieldName.toLowerCase()}`;
  }

  return null;
};

/**
 * Composite validators for forms
 */
export const validateUserRegistration = (userData) => {
  const errors = {};

  // Name validation
  const nameError =
    isRequired(userData.name, "Name") ||
    hasMinLength(userData.name, 2, "Name") ||
    isAlphabetsOnly(userData.name, "Name");
  if (nameError) errors.name = nameError;

  // Email validation
  const emailError = isValidEmail(userData.email);
  if (emailError) errors.email = emailError;

  // Phone validation
  const phoneError = isValidPhone(userData.phone);
  if (phoneError) errors.phone = phoneError;

  // Password validation
  const passwordError = isValidPassword(userData.password);
  if (passwordError) errors.password = passwordError;

  // Confirm password validation
  const confirmPasswordError = isValidConfirmPassword(
    userData.password,
    userData.confirmPassword
  );
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  // User type validation
  const userTypeError = isRequired(userData.userType, "User Type");
  if (userTypeError) errors.userType = userTypeError;

  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateHerbCollection = (collectionData) => {
  const errors = {};

  // Species validation
  const speciesError =
    isRequired(collectionData.species, "Species") ||
    hasMinLength(collectionData.species, 2, "Species");
  if (speciesError) errors.species = speciesError;

  // Quality rating validation
  const qualityError = isValidQualityRating(collectionData.quality);
  if (qualityError) errors.quality = qualityError;

  // Weight validation
  const weightError = isValidWeight(collectionData.weight);
  if (weightError) errors.weight = weightError;

  // Collection date validation
  const dateError = isNotFutureDate(
    collectionData.collectionDate,
    "Collection Date"
  );
  if (dateError) errors.collectionDate = dateError;

  // Location validation
  if (collectionData.location) {
    const { latitude, longitude } = collectionData.location;

    const latError = isValidCoordinate(latitude, "Latitude");
    if (latError) errors.latitude = latError;

    const lngError = isValidCoordinate(longitude, "Longitude");
    if (lngError) errors.longitude = lngError;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateQualityTest = (testData) => {
  const errors = {};

  // Herb ID validation
  const herbIdError = isValidHerbId(testData.herbId);
  if (herbIdError) errors.herbId = herbIdError;

  // Test type validation
  const testTypeError = isRequired(testData.testType, "Test Type");
  if (testTypeError) errors.testType = testTypeError;

  // Test date validation
  const dateError = isNotFutureDate(testData.testDate, "Test Date");
  if (dateError) errors.testDate = dateError;

  // Results validation (basic)
  if (testData.results && typeof testData.results === "object") {
    Object.entries(testData.results).forEach(([key, value]) => {
      if (typeof value === "number") {
        const numberError = isValidNumber(value, key);
        if (numberError) errors[`results_${key}`] = numberError;
      }
    });
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Utility functions
 */
export const validateField = (value, validators = []) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

export const validateForm = (formData, validationSchema) => {
  const errors = {};

  Object.entries(validationSchema).forEach(([field, validators]) => {
    const value = formData[field];
    const error = validateField(value, validators);
    if (error) errors[field] = error;
  });

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Export validation utilities object
 */
export const Validators = {
  // Basic validators
  required: isRequired,
  email: isValidEmail,
  phone: isValidPhone,
  password: isValidPassword,
  confirmPassword: isValidConfirmPassword,

  // Length validators
  minLength: hasMinLength,
  maxLength: hasMaxLength,
  exactLength: hasExactLength,

  // Number validators
  number: isValidNumber,
  range: isInRange,
  positive: isPositive,
  integer: isInteger,

  // Pattern validators
  pattern: matchesPattern,
  alphabets: isAlphabetsOnly,
  alphanumeric: isAlphanumeric,
  numeric: isNumericString,

  // Domain validators
  herbId: isValidHerbId,
  pincode: isValidPincode,
  coordinate: isValidCoordinate,
  url: isValidUrl,
  qualityRating: isValidQualityRating,
  weight: isValidWeight,
  temperature: isValidTemperature,

  // Date validators
  date: isValidDate,
  notFuture: isNotFutureDate,
  notPast: isNotPastDate,
  dateRange: isWithinDateRange,

  // File validators
  fileType: isValidFileType,
  fileSize: isValidFileSize,

  // Array validators
  minItems: hasMinItems,
  maxItems: hasMaxItems,

  // Composite validators
  userRegistration: validateUserRegistration,
  herbCollection: validateHerbCollection,
  qualityTest: validateQualityTest,

  // Utility functions
  field: validateField,
  form: validateForm,
};

/**
 * Validation schema builders
 */
export const createValidationSchema = (fields) => {
  const schema = {};

  Object.entries(fields).forEach(([field, rules]) => {
    schema[field] = Array.isArray(rules) ? rules : [rules];
  });

  return schema;
};

export const requiredField = (fieldName) => (value) =>
  isRequired(value, fieldName);

export const emailField = () => isValidEmail;

export const phoneField =
  (countryCode = "IN") =>
  (value) =>
    isValidPhone(value, countryCode);

export const passwordField =
  (options = {}) =>
  (value) =>
    isValidPassword(value, options);

export const numberField = (fieldName, min, max) => {
  const validators = [(value) => isValidNumber(value, fieldName)];

  if (min !== undefined && max !== undefined) {
    validators.push((value) => isInRange(value, min, max, fieldName));
  } else if (min !== undefined) {
    validators.push((value) => {
      const numError = isValidNumber(value, fieldName);
      if (numError) return numError;
      return Number(value) >= min
        ? null
        : `${fieldName} must be at least ${min}`;
    });
  }

  return validators;
};

export const textField = (fieldName, minLength, maxLength) => {
  const validators = [(value) => isRequired(value, fieldName)];

  if (minLength) {
    validators.push((value) => hasMinLength(value, minLength, fieldName));
  }

  if (maxLength) {
    validators.push((value) => hasMaxLength(value, maxLength, fieldName));
  }

  return validators;
};

/**
 * Custom validation rules for specific business logic
 */
export const isUniqueEmail = async (email, checkFunction) => {
  if (!email) return "Email is required";

  const emailError = isValidEmail(email);
  if (emailError) return emailError;

  try {
    const exists = await checkFunction(email);
    if (exists) {
      return "This email is already registered";
    }
  } catch (error) {
    return "Unable to verify email uniqueness";
  }

  return null;
};

export const isValidHerbBatch = (herbData) => {
  const errors = {};

  // Basic herb validation
  const herbValidation = validateHerbCollection(herbData);
  if (herbValidation) {
    Object.assign(errors, herbValidation);
  }

  // Additional batch-specific validations
  if (herbData.batchSize) {
    const batchSizeError = isPositive(herbData.batchSize, "Batch Size");
    if (batchSizeError) errors.batchSize = batchSizeError;
  }

  if (herbData.expectedYield) {
    const yieldError = isPositive(herbData.expectedYield, "Expected Yield");
    if (yieldError) errors.expectedYield = yieldError;
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const isValidProcessingStep = (stepData) => {
  const errors = {};

  // Step type validation
  const stepTypeError = isRequired(stepData.stepType, "Step Type");
  if (stepTypeError) errors.stepType = stepTypeError;

  // Duration validation
  if (stepData.duration) {
    const durationError = isPositive(stepData.duration, "Duration");
    if (durationError) errors.duration = durationError;
  }

  // Temperature validation
  if (stepData.temperature) {
    const tempError = isValidTemperature(stepData.temperature);
    if (tempError) errors.temperature = tempError;
  }

  // Conditions validation
  if (stepData.conditions) {
    Object.entries(stepData.conditions).forEach(([key, value]) => {
      if (typeof value === "number") {
        const conditionError = isValidNumber(value, key);
        if (conditionError) errors[`condition_${key}`] = conditionError;
      }
    });
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

export const isValidLabResult = (resultData) => {
  const errors = {};

  // Herb ID validation
  const herbIdError = isValidHerbId(resultData.herbId);
  if (herbIdError) errors.herbId = herbIdError;

  // Lab ID validation
  const labIdError = isRequired(resultData.labId, "Lab ID");
  if (labIdError) errors.labId = labIdError;

  // Test completion date
  const dateError = isNotFutureDate(resultData.testDate, "Test Date");
  if (dateError) errors.testDate = dateError;

  // Result validation
  if (resultData.passed === null || resultData.passed === undefined) {
    errors.passed = "Test result (pass/fail) is required";
  }

  // Detailed results validation
  if (resultData.detailedResults) {
    const requiredFields = ["purity", "contamination", "moisture"];

    requiredFields.forEach((field) => {
      if (
        resultData.detailedResults[field] === null ||
        resultData.detailedResults[field] === undefined
      ) {
        errors[field] = `${field} measurement is required`;
      } else {
        const value = resultData.detailedResults[field];
        if (field === "purity" || field === "moisture") {
          // Percentage values
          const rangeError = isInRange(value, 0, 100, field);
          if (rangeError) errors[field] = rangeError;
        } else {
          const numberError = isValidNumber(value, field);
          if (numberError) errors[field] = numberError;
        }
      }
    });
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Async validation helpers
 */
export const createAsyncValidator = (asyncValidationFn, errorMessage) => {
  return async (value) => {
    try {
      const isValid = await asyncValidationFn(value);
      return isValid ? null : errorMessage;
    } catch (error) {
      return "Validation failed";
    }
  };
};

export const debounceValidator = (validator, delay = 300) => {
  let timeoutId;

  return (value) => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const result = await validator(value);
        resolve(result);
      }, delay);
    });
  };
};

/**
 * Real-time validation helpers
 */
export const validateOnChange = (value, validators, currentErrors = {}) => {
  const fieldError = validateField(value, validators);

  // Only return error if field is not empty or there was a previous error
  if (fieldError && (value || currentErrors.hasError)) {
    return { error: fieldError, hasError: true };
  }

  return { error: null, hasError: false };
};

export const validateOnBlur = (value, validators) => {
  const fieldError = validateField(value, validators);
  return { error: fieldError, hasError: !!fieldError };
};

/**
 * Form validation state manager
 */
export class FormValidator {
  constructor(schema) {
    this.schema = schema;
    this.errors = {};
    this.touched = {};
  }

  validateField(fieldName, value, onBlur = false) {
    const validators = this.schema[fieldName] || [];

    if (onBlur) {
      const result = validateOnBlur(value, validators);
      this.errors[fieldName] = result.error;
      this.touched[fieldName] = true;
    } else {
      const result = validateOnChange(value, validators, {
        hasError: this.touched[fieldName] && this.errors[fieldName],
      });

      if (this.touched[fieldName] || result.error) {
        this.errors[fieldName] = result.error;
      }
    }

    return this.errors[fieldName];
  }

  validateForm(formData) {
    const errors = {};

    Object.entries(this.schema).forEach(([field, validators]) => {
      const error = validateField(formData[field], validators);
      if (error) errors[field] = error;
    });

    this.errors = errors;

    // Mark all fields as touched
    Object.keys(this.schema).forEach((field) => {
      this.touched[field] = true;
    });

    return Object.keys(errors).length === 0;
  }

  getFieldError(fieldName) {
    return this.touched[fieldName] ? this.errors[fieldName] : null;
  }

  hasErrors() {
    return Object.values(this.errors).some((error) => error !== null);
  }

  reset() {
    this.errors = {};
    this.touched = {};
  }

  clearField(fieldName) {
    this.errors[fieldName] = null;
    this.touched[fieldName] = false;
  }
}

/**
 * Common validation schemas for the application
 */
export const ValidationSchemas = {
  login: {
    email: [isValidEmail],
    password: [(value) => isRequired(value, "Password")],
  },

  register: {
    name: [
      (value) => isRequired(value, "Name"),
      (value) => hasMinLength(value, 2, "Name"),
      (value) => isAlphabetsOnly(value, "Name"),
    ],
    email: [isValidEmail],
    phone: [isValidPhone],
    password: [isValidPassword],
    confirmPassword: [
      (value, formData) => isValidConfirmPassword(formData?.password, value),
    ],
    userType: [(value) => isRequired(value, "User Type")],
  },

  herbCollection: {
    species: [
      (value) => isRequired(value, "Species"),
      (value) => hasMinLength(value, 2, "Species"),
    ],
    quality: [isValidQualityRating],
    weight: [isValidWeight],
    collectionDate: [(value) => isNotFutureDate(value, "Collection Date")],
    latitude: [(value) => isValidCoordinate(value, "Latitude")],
    longitude: [(value) => isValidCoordinate(value, "Longitude")],
  },

  qualityTest: {
    herbId: [isValidHerbId],
    testType: [(value) => isRequired(value, "Test Type")],
    testDate: [(value) => isNotFutureDate(value, "Test Date")],
  },

  processing: {
    herbId: [isValidHerbId],
    stepType: [(value) => isRequired(value, "Step Type")],
    duration: [(value) => isPositive(value, "Duration")],
    temperature: [isValidTemperature],
  },
};

export default Validators;
