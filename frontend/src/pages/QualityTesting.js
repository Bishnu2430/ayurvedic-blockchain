import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  TestTube,
  Search,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  FileText,
  Microscope,
} from "lucide-react";
import { ButtonSpinner } from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import HerbCard, { HerbCardCompact } from "../components/HerbCard";
import Modal, { SuccessModal } from "../components/Modal";
import api from "../services/api";

const QualityTesting = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedHerb, setSelectedHerb] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const [testData, setTestData] = useState({
    testType: "",
    results: {},
    passed: null,
    notes: "",
    documents: [],
  });

  const [errors, setErrors] = useState({});

  const testTypes = [
    {
      id: "purity",
      name: "Purity Test",
      description: "Check for contamination and adulterants",
      parameters: [
        {
          key: "moistureContent",
          label: "Moisture Content (%)",
          type: "number",
          unit: "%",
          max: 100,
        },
        {
          key: "ashValue",
          label: "Total Ash Value (%)",
          type: "number",
          unit: "%",
          max: 100,
        },
        {
          key: "acidInsoluble",
          label: "Acid Insoluble Ash (%)",
          type: "number",
          unit: "%",
          max: 100,
        },
        {
          key: "heavyMetals",
          label: "Heavy Metals (ppm)",
          type: "number",
          unit: "ppm",
          max: 1000,
        },
        {
          key: "microbialLoad",
          label: "Microbial Load (CFU/g)",
          type: "number",
          unit: "CFU/g",
        },
      ],
    },
    {
      id: "potency",
      name: "Potency Test",
      description: "Measure active compound concentration",
      parameters: [
        {
          key: "activeCompound",
          label: "Active Compound (%)",
          type: "number",
          unit: "%",
          max: 100,
        },
        {
          key: "alkaloids",
          label: "Total Alkaloids (%)",
          type: "number",
          unit: "%",
          max: 100,
        },
        {
          key: "flavonoids",
          label: "Total Flavonoids (%)",
          type: "number",
          unit: "%",
          max: 100,
        },
        {
          key: "phenolics",
          label: "Total Phenolics (%)",
          type: "number",
          unit: "%",
          max: 100,
        },
        {
          key: "volatileOil",
          label: "Volatile Oil Content (%)",
          type: "number",
          unit: "%",
          max: 100,
        },
      ],
    },
    {
      id: "safety",
      name: "Safety Test",
      description: "Test for harmful substances and pathogens",
      parameters: [
        {
          key: "pesticides",
          label: "Pesticide Residues (ppm)",
          type: "number",
          unit: "ppm",
          max: 1000,
        },
        {
          key: "aflatoxins",
          label: "Aflatoxins (ppb)",
          type: "number",
          unit: "ppb",
          max: 1000,
        },
        { key: "salmonella", label: "Salmonella", type: "boolean" },
        {
          key: "ecoli",
          label: "E. coli (CFU/g)",
          type: "number",
          unit: "CFU/g",
        },
        {
          key: "yeastMold",
          label: "Yeast & Mold (CFU/g)",
          type: "number",
          unit: "CFU/g",
        },
      ],
    },
    {
      id: "identity",
      name: "Identity Test",
      description: "Confirm botanical identity and authenticity",
      parameters: [
        { key: "macroscopy", label: "Macroscopic Examination", type: "text" },
        { key: "microscopy", label: "Microscopic Examination", type: "text" },
        { key: "tlc", label: "TLC Profile", type: "text" },
        { key: "hptlc", label: "HPTLC Fingerprint", type: "text" },
        { key: "dnaBarcode", label: "DNA Barcoding", type: "text" },
      ],
    },
  ];

  useEffect(() => {
    // Redirect if not a lab
    if (user && user.userType !== "LAB") {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await api.get(
        `/herbs/search?q=${encodeURIComponent(query)}`
      );
      setSearchResults(response.data.herbs || []);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search herbs");
    } finally {
      setIsSearching(false);
    }
  };

  const handleHerbSelect = (herb) => {
    setSelectedHerb(herb);
    setSearchResults([]);
  };

  const handleTestTypeChange = (testTypeId) => {
    const testType = testTypes.find((t) => t.id === testTypeId);
    setTestData({
      testType: testTypeId,
      results: {},
      passed: null,
      notes: "",
      documents: [],
    });

    // Initialize results object with default values
    if (testType) {
      const initialResults = {};
      testType.parameters.forEach((param) => {
        initialResults[param.key] = param.type === "boolean" ? false : "";
      });
      setTestData((prev) => ({ ...prev, results: initialResults }));
    }
    setErrors({});
  };

  const handleResultChange = (paramKey, value) => {
    setTestData((prev) => ({
      ...prev,
      results: {
        ...prev.results,
        [paramKey]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[paramKey]) {
      setErrors((prev) => ({ ...prev, [paramKey]: null }));
    }
  };

  const calculateOverallResult = () => {
    if (!testData.testType || Object.keys(testData.results).length === 0) {
      return null;
    }

    const testType = testTypes.find((t) => t.id === testData.testType);
    if (!testType) return null;

    // Simple pass/fail logic based on test type
    switch (testData.testType) {
      case "purity":
        const moistureContent = parseFloat(
          testData.results.moistureContent || 0
        );
        const heavyMetals = parseFloat(testData.results.heavyMetals || 0);
        const microbialLoad = parseFloat(testData.results.microbialLoad || 0);
        return (
          moistureContent <= 12 && heavyMetals <= 10 && microbialLoad <= 10000
        );

      case "safety":
        const pesticides = parseFloat(testData.results.pesticides || 0);
        const aflatoxins = parseFloat(testData.results.aflatoxins || 0);
        const salmonella = testData.results.salmonella === false;
        const ecoli = parseFloat(testData.results.ecoli || 0);
        return (
          pesticides <= 0.1 && aflatoxins <= 10 && salmonella && ecoli <= 10
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const calculatedResult = calculateOverallResult();
    if (calculatedResult !== null && testData.passed !== calculatedResult) {
      setTestData((prev) => ({ ...prev, passed: calculatedResult }));
    }
  }, [testData.results]);

  const validateForm = () => {
    const newErrors = {};

    if (!selectedHerb) {
      newErrors.herb = "Please select a herb to test";
    }

    if (!testData.testType) {
      newErrors.testType = "Please select a test type";
    }

    if (testData.passed === null) {
      newErrors.passed = "Please specify if the test passed or failed";
    }

    // Validate required parameters
    const testType = testTypes.find((t) => t.id === testData.testType);
    if (testType) {
      testType.parameters.forEach((param) => {
        const value = testData.results[param.key];
        if (param.type === "number" && (value === "" || value === undefined)) {
          newErrors[param.key] = `${param.label} is required`;
        }
        if (param.type === "text" && !value?.trim()) {
          newErrors[param.key] = `${param.label} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        herbId: selectedHerb.herbId,
        testType: testData.testType,
        results: testData.results,
        passed: testData.passed,
        notes: testData.notes,
      };

      const response = await api.post("/fabric/quality-test", submitData);

      setTestResult({
        ...response.data,
        herbId: selectedHerb.herbId,
        species: selectedHerb.species,
        testType: testData.testType,
        passed: testData.passed,
      });

      setShowSuccessModal(true);

      // Reset form
      setSelectedHerb(null);
      setTestData({
        testType: "",
        results: {},
        passed: null,
        notes: "",
        documents: [],
      });
    } catch (error) {
      console.error("Quality test error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit quality test"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && user.userType !== "LAB") {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-sage-800 mb-2">
            Access Restricted
          </h2>
          <p className="text-sage-600 mb-4">
            This page is only accessible to laboratory personnel. Please contact
            your administrator if you believe this is an error.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-mint-500 text-white px-4 py-2 rounded-lg hover:bg-mint-600 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <TestTube className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-2">
            Quality Testing
          </h1>
          <p className="text-sage-600">
            Perform quality tests on herb batches and record results on
            blockchain
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Herb Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-4 border-b border-sage-100">
                <h2 className="text-lg font-semibold text-sage-800">
                  Select Herb
                </h2>
              </div>

              <div className="p-4 space-y-4">
                <SearchBar
                  placeholder="Search by Herb ID or species..."
                  onSearch={handleSearch}
                  autoFocus
                />

                {isSearching && (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-sage-600 mt-2">Searching...</p>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-sage-700">
                      Search Results
                    </h3>
                    {searchResults.map((herb) => (
                      <HerbCardCompact
                        key={herb.herbId}
                        herb={herb}
                        onClick={() => handleHerbSelect(herb)}
                      />
                    ))}
                  </div>
                )}

                {selectedHerb && (
                  <div className="border-t border-sage-100 pt-4">
                    <h3 className="text-sm font-medium text-sage-700 mb-2">
                      Selected Herb
                    </h3>
                    <div className="bg-mint-50 border border-mint-200 rounded-lg p-3">
                      <p className="font-medium text-mint-800">
                        {selectedHerb.species}
                      </p>
                      <p className="text-sm text-mint-600 font-mono">
                        {selectedHerb.herbId}
                      </p>
                      <p className="text-xs text-mint-600 mt-1">
                        Status: {selectedHerb.status} • Collected:{" "}
                        {new Date(selectedHerb.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Test Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-6 border-b border-sage-100">
                <h2 className="text-lg font-semibold text-sage-800">
                  Test Configuration
                </h2>
                <p className="text-sm text-sage-600 mt-1">
                  {selectedHerb
                    ? `Testing ${selectedHerb.species}`
                    : "Select a herb to begin testing"}
                </p>
              </div>

              {selectedHerb ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Test Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-3">
                      Test Type *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {testTypes.map((type) => (
                        <label
                          key={type.id}
                          className={`relative flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-sage-25 transition-colors ${
                            testData.testType === type.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-sage-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="testType"
                            value={type.id}
                            checked={testData.testType === type.id}
                            onChange={(e) =>
                              handleTestTypeChange(e.target.value)
                            }
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-2 mb-1">
                            <Microscope className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-sage-800">
                              {type.name}
                            </span>
                          </div>
                          <p className="text-xs text-sage-600">
                            {type.description}
                          </p>
                          {testData.testType === type.id && (
                            <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-blue-600" />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.testType && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.testType}
                      </p>
                    )}
                  </div>

                  {/* Test Parameters */}
                  {testData.testType && (
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-3">
                        Test Parameters *
                      </label>
                      <div className="space-y-4">
                        {testTypes
                          .find((t) => t.id === testData.testType)
                          ?.parameters.map((param) => (
                            <div
                              key={param.key}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                            >
                              <label className="text-sm font-medium text-sage-700">
                                {param.label}
                              </label>
                              <div className="md:col-span-2">
                                {param.type === "boolean" ? (
                                  <div className="flex space-x-4">
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        name={param.key}
                                        checked={
                                          testData.results[param.key] === false
                                        }
                                        onChange={() =>
                                          handleResultChange(param.key, false)
                                        }
                                        className="mr-2 text-green-600 focus:ring-green-500"
                                      />
                                      <span className="text-sm text-green-700">
                                        Absent
                                      </span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        name={param.key}
                                        checked={
                                          testData.results[param.key] === true
                                        }
                                        onChange={() =>
                                          handleResultChange(param.key, true)
                                        }
                                        className="mr-2 text-red-600 focus:ring-red-500"
                                      />
                                      <span className="text-sm text-red-700">
                                        Present
                                      </span>
                                    </label>
                                  </div>
                                ) : param.type === "number" ? (
                                  <div className="flex space-x-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={testData.results[param.key] || ""}
                                      onChange={(e) =>
                                        handleResultChange(
                                          param.key,
                                          e.target.value
                                        )
                                      }
                                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                                        errors[param.key]
                                          ? "border-red-300 bg-red-50"
                                          : "border-sage-300"
                                      }`}
                                      placeholder="Enter value"
                                    />
                                    {param.unit && (
                                      <span className="px-3 py-2 bg-sage-100 border border-sage-300 rounded-lg text-sm text-sage-700">
                                        {param.unit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <textarea
                                    value={testData.results[param.key] || ""}
                                    onChange={(e) =>
                                      handleResultChange(
                                        param.key,
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm ${
                                      errors[param.key]
                                        ? "border-red-300 bg-red-50"
                                        : "border-sage-300"
                                    }`}
                                    placeholder="Enter observations"
                                  />
                                )}
                                {errors[param.key] && (
                                  <p className="mt-1 text-xs text-red-600">
                                    {errors[param.key]}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Overall Result */}
                  {testData.testType &&
                    Object.keys(testData.results).length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">
                          Overall Test Result *
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2 px-4 py-3 border border-green-300 rounded-lg hover:bg-green-50 cursor-pointer">
                            <input
                              type="radio"
                              name="passed"
                              checked={testData.passed === true}
                              onChange={() =>
                                setTestData((prev) => ({
                                  ...prev,
                                  passed: true,
                                }))
                              }
                              className="text-green-600 focus:ring-green-500"
                            />
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-medium">
                              PASSED
                            </span>
                          </label>
                          <label className="flex items-center space-x-2 px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50 cursor-pointer">
                            <input
                              type="radio"
                              name="passed"
                              checked={testData.passed === false}
                              onChange={() =>
                                setTestData((prev) => ({
                                  ...prev,
                                  passed: false,
                                }))
                              }
                              className="text-red-600 focus:ring-red-500"
                            />
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-700 font-medium">
                              FAILED
                            </span>
                          </label>
                        </div>
                        {errors.passed && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.passed}
                          </p>
                        )}
                      </div>
                    )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={testData.notes}
                      onChange={(e) =>
                        setTestData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Add any additional observations or comments..."
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-sage-100 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isSubmitting && <ButtonSpinner />}
                      <Save className="w-5 h-5" />
                      <span>Submit Test Results</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-12 text-center">
                  <TestTube className="w-16 h-16 text-sage-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-sage-600 mb-2">
                    Select a Herb to Test
                  </h3>
                  <p className="text-sage-500">
                    Search for a herb batch using the search box to begin
                    quality testing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Quality Test Completed!"
          size="lg"
        >
          {testResult && (
            <div className="space-y-6">
              <div className="text-center">
                {testResult.passed ? (
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                <h3 className="text-xl font-semibold text-sage-800 mb-2">
                  Test {testResult.passed ? "Passed" : "Failed"}
                </h3>
                <p className="text-sage-600">
                  Quality test results have been recorded on the blockchain.
                </p>
              </div>

              {/* Test Summary */}
              <div className="bg-sage-50 rounded-lg p-4">
                <h4 className="font-medium text-sage-800 mb-3">Test Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-sage-600">Herb ID:</span>
                    <p className="font-mono text-sage-800">
                      {testResult.herbId}
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Species:</span>
                    <p className="text-sage-800">{testResult.species}</p>
                  </div>
                  <div>
                    <span className="text-sage-600">Test Type:</span>
                    <p className="text-sage-800 capitalize">
                      {
                        testTypes.find((t) => t.id === testResult.testType)
                          ?.name
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Lab ID:</span>
                    <p className="font-mono text-sage-800 text-xs">
                      {user.userId}
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Test Date:</span>
                    <p className="text-sage-800">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Result:</span>
                    <div className="flex items-center space-x-1">
                      {testResult.passed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          testResult.passed ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {testResult.passed ? "PASSED" : "FAILED"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/herbs/${testResult.herbId}`)}
                  className="flex-1 bg-mint-500 text-white py-2 px-4 rounded-lg hover:bg-mint-600 transition-colors"
                >
                  View Herb Details
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 border border-sage-300 text-sage-700 py-2 px-4 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  Test Another Herb
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default QualityTesting;
