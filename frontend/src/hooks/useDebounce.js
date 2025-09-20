import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom hook that debounces a value
 * Updates the debounced value only after the specified delay has passed
 *
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook that debounces a callback function
 * Returns a debounced version of the callback
 *
 * @param {function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @param {array} deps - Dependencies array (like useCallback)
 * @returns {function} - Debounced callback function
 */
export const useDebouncedCallback = (callback, delay, deps = []) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook for debouncing search functionality
 * Combines debounced value with loading state
 *
 * @param {string} searchTerm - The search term to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {object} - { debouncedSearchTerm, isSearching }
 */
export const useDebouncedSearch = (searchTerm, delay = 300) => {
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearchTerm]);

  return {
    debouncedSearchTerm,
    isSearching,
  };
};

/**
 * Hook for debouncing API calls
 * Automatically handles loading states and cancellation
 *
 * @param {function} apiCall - Async function to call
 * @param {any} trigger - Value that triggers the API call when changed
 * @param {number} delay - Delay in milliseconds
 * @param {object} options - Additional options
 * @returns {object} - { data, loading, error, call }
 */
export const useDebouncedAPI = (
  apiCall,
  trigger,
  delay = 300,
  options = {}
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { immediate = false, skipEmpty = true, onSuccess, onError } = options;

  const debouncedTrigger = useDebounce(trigger, delay);
  const abortControllerRef = useRef(null);

  const call = useCallback(
    async (value = debouncedTrigger) => {
      // Skip if trigger is empty and skipEmpty is true
      if (
        skipEmpty &&
        (!value || (typeof value === "string" && value.trim() === ""))
      ) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(value, {
          signal: abortControllerRef.current.signal,
        });

        if (!abortControllerRef.current.signal.aborted) {
          setData(result);
          if (onSuccess) onSuccess(result);
        }
      } catch (err) {
        if (!abortControllerRef.current.signal.aborted) {
          setError(err);
          if (onError) onError(err);
        }
      } finally {
        if (!abortControllerRef.current.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [apiCall, debouncedTrigger, skipEmpty, onSuccess, onError]
  );

  useEffect(() => {
    if (immediate || debouncedTrigger !== trigger) {
      call();
    }
  }, [debouncedTrigger, call, immediate, trigger]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { data, loading, error, call };
};

/**
 * Hook for debouncing form input validation
 * Provides immediate feedback for empty fields, debounced for content
 *
 * @param {any} value - Value to validate
 * @param {function} validator - Validation function
 * @param {number} delay - Delay in milliseconds
 * @returns {object} - { error, isValidating }
 */
export const useDebouncedValidation = (value, validator, delay = 300) => {
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    // Immediate validation for empty values
    if (!value || (typeof value === "string" && value.trim() === "")) {
      setError(null);
      setIsValidating(false);
      return;
    }

    // Set validating state when value changes but before debounce
    if (value !== debouncedValue) {
      setIsValidating(true);
      return;
    }

    // Run validation on debounced value
    setIsValidating(false);
    try {
      const validationError = validator(debouncedValue);
      setError(validationError || null);
    } catch (err) {
      setError("Validation error occurred");
    }
  }, [value, debouncedValue, validator]);

  return { error, isValidating };
};

/**
 * Hook for throttling instead of debouncing
 * Ensures function is called at most once per interval
 *
 * @param {function} callback - Function to throttle
 * @param {number} interval - Throttle interval in milliseconds
 * @param {array} deps - Dependencies array
 * @returns {function} - Throttled callback
 */
export const useThrottledCallback = (callback, interval, deps = []) => {
  const lastCallRef = useRef(0);
  const timeoutRef = useRef(null);

  const throttledCallback = useCallback(
    (...args) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= interval) {
        // Call immediately
        lastCallRef.current = now;
        callback(...args);
      } else {
        // Schedule call
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, interval - timeSinceLastCall);
      }
    },
    [callback, interval, ...deps]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

export default useDebounce;
