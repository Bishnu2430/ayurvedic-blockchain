import { useState, useEffect } from "react";

/**
 * Custom hook to manage localStorage with React state
 * Handles JSON serialization/deserialization automatically
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - initial value if key doesn't exist
 * @returns {[any, function, function]} - [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove value from localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(
            `Error parsing localStorage value for key "${key}":`,
            error
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook to manage a boolean flag in localStorage
 * Useful for preferences, feature flags, etc.
 *
 * @param {string} key - localStorage key
 * @param {boolean} initialValue - initial boolean value
 * @returns {[boolean, function, function]} - [value, toggle, setValue]
 */
export const useLocalStorageBoolean = (key, initialValue = false) => {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);

  const toggle = () => setValue(!value);

  return [Boolean(value), toggle, setValue];
};

/**
 * Hook to manage an array in localStorage
 * Provides common array operations
 *
 * @param {string} key - localStorage key
 * @param {array} initialValue - initial array value
 * @returns {object} - { array, push, remove, clear, update }
 */
export const useLocalStorageArray = (key, initialValue = []) => {
  const [array, setArray, removeValue] = useLocalStorage(key, initialValue);

  const push = (item) => {
    setArray((prev) => [...(prev || []), item]);
  };

  const remove = (index) => {
    setArray((prev) => (prev || []).filter((_, i) => i !== index));
  };

  const removeById = (id, idField = "id") => {
    setArray((prev) => (prev || []).filter((item) => item[idField] !== id));
  };

  const update = (index, item) => {
    setArray((prev) => {
      const newArray = [...(prev || [])];
      newArray[index] = item;
      return newArray;
    });
  };

  const updateById = (id, updates, idField = "id") => {
    setArray((prev) =>
      (prev || []).map((item) =>
        item[idField] === id ? { ...item, ...updates } : item
      )
    );
  };

  const clear = () => {
    setArray([]);
  };

  return {
    array: array || [],
    push,
    remove,
    removeById,
    update,
    updateById,
    clear,
    setArray,
    removeValue,
  };
};

/**
 * Hook to manage user preferences in localStorage
 * Common patterns for app settings
 *
 * @param {object} defaultPreferences - default preference values
 * @returns {[object, function, function]} - [preferences, updatePreference, resetPreferences]
 */
export const useUserPreferences = (defaultPreferences = {}) => {
  const [preferences, setPreferences, removePreferences] = useLocalStorage(
    "userPreferences",
    defaultPreferences
  );

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return [preferences, updatePreference, resetPreferences];
};

/**
 * Hook to manage recently viewed items
 * Automatically manages a list of recent items with size limit
 *
 * @param {string} key - localStorage key
 * @param {number} maxItems - maximum number of items to keep
 * @returns {object} - { recentItems, addRecentItem, clearRecentItems }
 */
export const useRecentItems = (key, maxItems = 10) => {
  const [items, setItems] = useLocalStorage(key, []);

  const addRecentItem = (item, idField = "id") => {
    setItems((prev) => {
      const filtered = (prev || []).filter(
        (existing) => existing[idField] !== item[idField]
      );

      const newItems = [item, ...filtered];
      return newItems.slice(0, maxItems);
    });
  };

  const removeRecentItem = (id, idField = "id") => {
    setItems((prev) => (prev || []).filter((item) => item[idField] !== id));
  };

  const clearRecentItems = () => {
    setItems([]);
  };

  return {
    recentItems: items || [],
    addRecentItem,
    removeRecentItem,
    clearRecentItems,
  };
};

export default useLocalStorage;
