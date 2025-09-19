import React, { useState, useEffect, useRef } from "react";
import { Search, X, Filter, ScanLine } from "lucide-react";

const SearchBar = ({
  placeholder = "Search herbs by ID or species...",
  onSearch,
  onFilter,
  onScan,
  showFilters = false,
  showScan = false,
  filters = {},
  autoFocus = false,
  className = "",
  size = "md",
}) => {
  const [query, setQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const inputRef = useRef(null);
  const filterRef = useRef(null);

  const sizes = {
    sm: "h-10 px-3 text-sm",
    md: "h-12 px-4 text-base",
    lg: "h-14 px-5 text-lg",
  };

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        {/* Main search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-sage-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              w-full ${sizes[size]} pl-10 pr-10 
              border border-sage-200 rounded-lg 
              focus:ring-2 focus:ring-mint-500 focus:border-mint-500 
              bg-white placeholder-sage-400 text-sage-800
              transition-colors duration-200
            `}
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter button */}
        {showFilters && (
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`
                ${sizes[size]} px-3 border border-sage-200 rounded-lg
                bg-white hover:bg-sage-50 text-sage-600 
                transition-colors duration-200 flex items-center space-x-1
                ${
                  Object.keys(filters).length > 0
                    ? "ring-2 ring-mint-200 border-mint-300"
                    : ""
                }
              `}
            >
              <Filter className="w-4 h-4" />
              {Object.keys(filters).length > 0 && (
                <span className="bg-mint-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>

            {/* Filter dropdown */}
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-sage-200 z-10">
                <div className="p-4 space-y-4">
                  <h3 className="font-medium text-sage-800">Filter Options</h3>

                  {/* Status filter */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status || ""}
                      onChange={(e) =>
                        onFilter({
                          ...filters,
                          status: e.target.value || undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-sage-200 rounded-md focus:ring-mint-500 focus:border-mint-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="COLLECTED">Collected</option>
                      <option value="TESTED">Tested</option>
                      <option value="PROCESSED">Processed</option>
                      <option value="DISTRIBUTED">Distributed</option>
                    </select>
                  </div>

                  {/* Species filter */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-1">
                      Species
                    </label>
                    <input
                      type="text"
                      value={filters.species || ""}
                      onChange={(e) =>
                        onFilter({
                          ...filters,
                          species: e.target.value || undefined,
                        })
                      }
                      placeholder="Enter species name"
                      className="w-full px-3 py-2 border border-sage-200 rounded-md focus:ring-mint-500 focus:border-mint-500"
                    />
                  </div>

                  {/* Date range filter */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-1">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={filters.dateFrom || ""}
                        onChange={(e) =>
                          onFilter({
                            ...filters,
                            dateFrom: e.target.value || undefined,
                          })
                        }
                        className="px-3 py-2 border border-sage-200 rounded-md focus:ring-mint-500 focus:border-mint-500 text-sm"
                      />
                      <input
                        type="date"
                        value={filters.dateTo || ""}
                        onChange={(e) =>
                          onFilter({
                            ...filters,
                            dateTo: e.target.value || undefined,
                          })
                        }
                        className="px-3 py-2 border border-sage-200 rounded-md focus:ring-mint-500 focus:border-mint-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onFilter({});
                        setIsFilterOpen(false);
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-sage-300 rounded-md hover:bg-sage-50 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="flex-1 px-3 py-2 text-sm bg-mint-500 text-white rounded-md hover:bg-mint-600 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scan button */}
        {showScan && onScan && (
          <button
            type="button"
            onClick={onScan}
            className={`
              ${sizes[size]} px-3 border border-mint-200 rounded-lg
              bg-mint-50 hover:bg-mint-100 text-mint-700 
              transition-colors duration-200 flex items-center space-x-1
            `}
            title="Scan QR Code"
          >
            <ScanLine className="w-4 h-4" />
            <span className="hidden sm:inline">Scan</span>
          </button>
        )}
      </form>

      {/* Search suggestions or recent searches could go here */}
    </div>
  );
};

// Simplified search input
export const SimpleSearch = ({
  placeholder = "Search...",
  onSearch,
  debounceMs = 300,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-sage-400" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-4 border border-sage-200 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 bg-white placeholder-sage-400 text-sage-800"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

// Search with autocomplete
export const AutocompleteSearch = ({
  placeholder = "Search...",
  onSearch,
  suggestions = [],
  onSuggestionSelect,
  className = "",
}) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestion >= 0) {
        handleSuggestionClick(filteredSuggestions[activeSuggestion]);
      } else {
        onSearch(query);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setActiveSuggestion(-1);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      onSearch(suggestion);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-sage-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setActiveSuggestion(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-9 border border-sage-200 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 bg-white placeholder-sage-400 text-sage-800"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShowSuggestions(false);
              onSearch("");
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-sage-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full px-4 py-2 text-left hover:bg-sage-50 transition-colors ${
                index === activeSuggestion
                  ? "bg-mint-50 text-mint-700"
                  : "text-sage-800"
              } ${index === 0 ? "rounded-t-lg" : ""} ${
                index === filteredSuggestions.length - 1 ? "rounded-b-lg" : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <Search className="w-3 h-3 text-sage-400" />
                <span className="truncate">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
