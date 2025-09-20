import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  Cog,
  Search,
  Thermometer,
  Clock,
  Droplets,
  Zap,
  Scale,
  FlaskConical,
  CheckCircle,
  AlertCircle,
  Save,
  Plus,
  Minus,
} from "lucide-react";
import { ButtonSpinner } from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import HerbCard, { HerbCardCompact } from "../components/HerbCard";
import Modal, { SuccessModal } from "../components/Modal";
import api from "../services/api";

const Processing = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [selectedHerb, setSelectedHerb] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [processingResult, setProcessingResult] = useState(null);

  const [processingData, setProcessingData] = useState({
    stepType: "",
    conditions: {},
    duration: "",
    yield: "",
    notes: "",
    equipment: [],
    documents: [],
  });

  const [errors, setErrors] = useState({});

  const processingSteps = [
    {
      id: "cleaning",
      name: "Cleaning & Sorting",
      description: "Remove impurities and sort by quality",
      icon: Scale,
      conditions: [
        {
          key: "method",
          label: "Cleaning Method",
          type: "select",
          options: ["Manual", "Mechanical", "Air Classification", "Sieving"],
        },
        { key: "sortingCriteria", label: "Sorting Criteria", type: "text" },
        {
          key: "rejectionRate",
          label: "Rejection Rate (%)",
          type: "number",
          unit: "%",
        },
        {
          key: "moisture",
          label: "Final Moisture (%)",
          type: "number",
          unit: "%",
        },
      ],
    },
    {
      id: "drying",
      name: "Drying",
      description: "Reduce moisture content for preservation",
      icon: Thermometer,
      conditions: [
        {
          key: "method",
          label: "Drying Method",
          type: "select",
          options: [
            "Sun Drying",
            "Shade Drying",
            "Oven Drying",
            "Freeze Drying",
            "Vacuum Drying",
          ],
        },
        {
          key: "temperature",
          label: "Temperature (°C)",
          type: "number",
          unit: "°C",
        },
        {
          key: "humidity",
          label: "Relative Humidity (%)",
          type: "number",
          unit: "%",
        },
        {
          key: "initialMoisture",
          label: "Initial Moisture (%)",
          type: "number",
          unit: "%",
        },
        {
          key: "finalMoisture",
          label: "Final Moisture (%)",
          type: "number",
          unit: "%",
        },
        {
          key: "duration",
          label: "Duration (hours)",
          type: "number",
          unit: "hrs",
        },
      ],
    },
    {
      id: "grinding",
      name: "Grinding & Milling",
      description: "Reduce particle size for processing",
      icon: Cog,
      conditions: [
        {
          key: "method",
          label: "Grinding Method",
          type: "select",
          options: [
            "Hammer Mill",
            "Ball Mill",
            "Pin Mill",
            "Jet Mill",
            "Cryogenic Grinding",
          ],
        },
        { key: "meshSize", label: "Mesh Size", type: "number", unit: "mesh" },
        {
          key: "temperature",
          label: "Processing Temperature (°C)",
          type: "number",
          unit: "°C",
        },
        {
          key: "particleSize",
          label: "Avg Particle Size (μm)",
          type: "number",
          unit: "μm",
        },
        {
          key: "yield",
          label: "Grinding Yield (%)",
          type: "number",
          unit: "%",
        },
      ],
    },
    {
      id: "extraction",
      name: "Extraction",
      description: "Extract active compounds using solvents",
      icon: FlaskConical,
      conditions: [
        {
          key: "method",
          label: "Extraction Method",
          type: "select",
          options: [
            "Water Extraction",
            "Ethanol Extraction",
            "Steam Distillation",
            "CO2 Extraction",
            "Ultrasonic Extraction",
          ],
        },
        { key: "solvent", label: "Solvent Used", type: "text" },
        { key: "ratio", label: "Herb:Solvent Ratio", type: "text" },
        {
          key: "temperature",
          label: "Temperature (°C)",
          type: "number",
          unit: "°C",
        },
        {
          key: "pressure",
          label: "Pressure (bar)",
          type: "number",
          unit: "bar",
        },
        {
          key: "duration",
          label: "Duration (hours)",
          type: "number",
          unit: "hrs",
        },
        {
          key: "yield",
          label: "Extraction Yield (%)",
          type: "number",
          unit: "%",
        },
      ],
    },
    {
      id: "concentration",
      name: "Concentration",
      description: "Concentrate the extracted compounds",
      icon: Droplets,
      conditions: [
        {
          key: "method",
          label: "Concentration Method",
          type: "select",
          options: [
            "Evaporation",
            "Reverse Osmosis",
            "Ultrafiltration",
            "Spray Drying",
            "Vacuum Concentration",
          ],
        },
        {
          key: "temperature",
          label: "Temperature (°C)",
          type: "number",
          unit: "°C",
        },
        {
          key: "pressure",
          label: "Pressure (mbar)",
          type: "number",
          unit: "mbar",
        },
        {
          key: "initialVolume",
          label: "Initial Volume (L)",
          type: "number",
          unit: "L",
        },
        {
          key: "finalVolume",
          label: "Final Volume (L)",
          type: "number",
          unit: "L",
        },
        { key: "concentration", label: "Final Concentration", type: "text" },
      ],
    },
    {
      id: "formulation",
      name: "Formulation",
      description: "Create final product form",
      icon: Plus,
      conditions: [
        {
          key: "productType",
          label: "Product Type",
          type: "select",
          options: ["Tablet", "Capsule", "Powder", "Liquid", "Tincture", "Oil"],
        },
        { key: "excipients", label: "Excipients Used", type: "text" },
        {
          key: "activeContent",
          label: "Active Content (%)",
          type: "number",
          unit: "%",
        },
        {
          key: "batchSize",
          label: "Batch Size (kg)",
          type: "number",
          unit: "kg",
        },
        {
          key: "yield",
          label: "Formulation Yield (%)",
          type: "number",
          unit: "%",
        },
      ],
    },
  ];

  useEffect(() => {
    // Redirect if not a processor
    if (user && user.userType !== "PROCESSOR") {
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
      // Filter to only show herbs that are tested (ready for processing)
      const testableHerbs =
        response.data.herbs?.filter(
          (herb) => herb.status === "TESTED" || herb.status === "PROCESSED"
        ) || [];
      setSearchResults(testableHerbs);
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

  const handleStepTypeChange = (stepTypeId) => {
    const step = processingSteps.find((s) => s.id === stepTypeId);
    setProcessingData({
      stepType: stepTypeId,
      conditions: {},
      duration: "",
      yield: "",
      notes: "",
      equipment: [],
      documents: [],
    });

    // Initialize conditions with default values
    if (step) {
      const initialConditions = {};
      step.conditions.forEach((condition) => {
        initialConditions[condition.key] = "";
      });
      setProcessingData((prev) => ({ ...prev, conditions: initialConditions }));
    }
    setErrors({});
  };

  const handleConditionChange = (conditionKey, value) => {
    setProcessingData((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [conditionKey]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[conditionKey]) {
      setErrors((prev) => ({ ...prev, [conditionKey]: null }));
    }
  };

  const addEquipment = () => {
    setProcessingData((prev) => ({
      ...prev,
      equipment: [...prev.equipment, ""],
    }));
  };

  const updateEquipment = (index, value) => {
    setProcessingData((prev) => ({
      ...prev,
      equipment: prev.equipment.map((item, i) => (i === index ? value : item)),
    }));
  };

  const removeEquipment = (index) => {
    setProcessingData((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedHerb) {
      newErrors.herb = "Please select a herb to process";
    }

    if (!processingData.stepType) {
      newErrors.stepType = "Please select a processing step";
    }

    // Validate required conditions
    const step = processingSteps.find((s) => s.id === processingData.stepType);
    if (step) {
      step.conditions.forEach((condition) => {
        const value = processingData.conditions[condition.key];
        if (condition.type !== "select" && !value?.toString().trim()) {
          newErrors[condition.key] = `${condition.label} is required`;
        }
        if (condition.type === "select" && !value) {
          newErrors[condition.key] = `${condition.label} is required`;
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
        stepType: processingData.stepType,
        conditions: processingData.conditions,
        notes: processingData.notes,
        equipment: processingData.equipment.filter((item) => item.trim()),
      };

      const response = await api.post("/fabric/process", submitData);

      setProcessingResult({
        ...response.data,
        herbId: selectedHerb.herbId,
        species: selectedHerb.species,
        stepType: processingData.stepType,
      });

      setShowSuccessModal(true);

      // Reset form
      setSelectedHerb(null);
      setProcessingData({
        stepType: "",
        conditions: {},
        duration: "",
        yield: "",
        notes: "",
        equipment: [],
        documents: [],
      });
    } catch (error) {
      console.error("Processing error:", error);
      toast.error(
        error.response?.data?.message || "Failed to record processing step"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user && user.userType !== "PROCESSOR") {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-sage-800 mb-2">
            Access Restricted
          </h2>
          <p className="text-sage-600 mb-4">
            This page is only accessible to processing facilities. Please
            contact your administrator if you believe this is an error.
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Cog className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-2">
            Herb Processing
          </h1>
          <p className="text-sage-600">
            Record processing steps and update herb status on blockchain
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
                <p className="text-xs text-sage-600 mt-1">
                  Only tested herbs can be processed
                </p>
              </div>

              <div className="p-4 space-y-4">
                <SearchBar
                  placeholder="Search by Herb ID or species..."
                  onSearch={handleSearch}
                  autoFocus
                />

                {isSearching && (
                  <div className="text-center py-4">
                    <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm text-sage-600 mt-2">Searching...</p>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-sage-700">
                      Available for Processing
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

                {searchResults.length === 0 && !isSearching && (
                  <div className="text-center py-4">
                    <AlertCircle className="w-8 h-8 text-sage-300 mx-auto mb-2" />
                    <p className="text-sm text-sage-500">
                      No tested herbs found. Only herbs that have passed quality
                      testing can be processed.
                    </p>
                  </div>
                )}

                {selectedHerb && (
                  <div className="border-t border-sage-100 pt-4">
                    <h3 className="text-sm font-medium text-sage-700 mb-2">
                      Selected Herb
                    </h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="font-medium text-purple-800">
                        {selectedHerb.species}
                      </p>
                      <p className="text-sm text-purple-600 font-mono">
                        {selectedHerb.herbId}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        Status: {selectedHerb.status} • Collected:{" "}
                        {new Date(selectedHerb.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Processing Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-6 border-b border-sage-100">
                <h2 className="text-lg font-semibold text-sage-800">
                  Processing Step
                </h2>
                <p className="text-sm text-sage-600 mt-1">
                  {selectedHerb
                    ? `Processing ${selectedHerb.species}`
                    : "Select a herb to begin processing"}
                </p>
              </div>

              {selectedHerb ? (
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Processing Step Selection */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-3">
                      Processing Step *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {processingSteps.map((step) => {
                        const Icon = step.icon;
                        return (
                          <label
                            key={step.id}
                            className={`relative flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-sage-25 transition-colors ${
                              processingData.stepType === step.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-sage-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="stepType"
                              value={step.id}
                              checked={processingData.stepType === step.id}
                              onChange={(e) =>
                                handleStepTypeChange(e.target.value)
                              }
                              className="sr-only"
                            />
                            <div className="flex items-center space-x-2 mb-1">
                              <Icon className="w-4 h-4 text-purple-600" />
                              <span className="font-medium text-sage-800">
                                {step.name}
                              </span>
                            </div>
                            <p className="text-xs text-sage-600">
                              {step.description}
                            </p>
                            {processingData.stepType === step.id && (
                              <CheckCircle className="absolute top-2 right-2 w-4 h-4 text-purple-600" />
                            )}
                          </label>
                        );
                      })}
                    </div>
                    {errors.stepType && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.stepType}
                      </p>
                    )}
                  </div>

                  {/* Processing Conditions */}
                  {processingData.stepType && (
                    <div>
                      <label className="block text-sm font-medium text-sage-700 mb-3">
                        Processing Conditions *
                      </label>
                      <div className="space-y-4">
                        {processingSteps
                          .find((s) => s.id === processingData.stepType)
                          ?.conditions.map((condition) => (
                            <div
                              key={condition.key}
                              className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                            >
                              <label className="text-sm font-medium text-sage-700">
                                {condition.label}
                              </label>
                              <div className="md:col-span-2">
                                {condition.type === "select" ? (
                                  <select
                                    value={
                                      processingData.conditions[
                                        condition.key
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleConditionChange(
                                        condition.key,
                                        e.target.value
                                      )
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm ${
                                      errors[condition.key]
                                        ? "border-red-300 bg-red-50"
                                        : "border-sage-300"
                                    }`}
                                  >
                                    <option value="">
                                      Select {condition.label}
                                    </option>
                                    {condition.options?.map((option) => (
                                      <option key={option} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                ) : condition.type === "number" ? (
                                  <div className="flex space-x-2">
                                    <input
                                      type="number"
                                      step="0.01"
                                      value={
                                        processingData.conditions[
                                          condition.key
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleConditionChange(
                                          condition.key,
                                          e.target.value
                                        )
                                      }
                                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm ${
                                        errors[condition.key]
                                          ? "border-red-300 bg-red-50"
                                          : "border-sage-300"
                                      }`}
                                      placeholder="Enter value"
                                    />
                                    {condition.unit && (
                                      <span className="px-3 py-2 bg-sage-100 border border-sage-300 rounded-lg text-sm text-sage-700">
                                        {condition.unit}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <input
                                    type="text"
                                    value={
                                      processingData.conditions[
                                        condition.key
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleConditionChange(
                                        condition.key,
                                        e.target.value
                                      )
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm ${
                                      errors[condition.key]
                                        ? "border-red-300 bg-red-50"
                                        : "border-sage-300"
                                    }`}
                                    placeholder={`Enter ${condition.label.toLowerCase()}`}
                                  />
                                )}
                                {errors[condition.key] && (
                                  <p className="mt-1 text-xs text-red-600">
                                    {errors[condition.key]}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Equipment Used */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-sage-700">
                        Equipment Used
                      </label>
                      <button
                        type="button"
                        onClick={addEquipment}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Equipment</span>
                      </button>
                    </div>
                    {processingData.equipment.length > 0 && (
                      <div className="space-y-2">
                        {processingData.equipment.map((equipment, index) => (
                          <div key={index} className="flex space-x-2">
                            <input
                              type="text"
                              value={equipment}
                              onChange={(e) =>
                                updateEquipment(index, e.target.value)
                              }
                              placeholder="Enter equipment name/model"
                              className="flex-1 px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeEquipment(index)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {processingData.equipment.length === 0 && (
                      <p className="text-sm text-sage-500 italic">
                        No equipment added yet
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-sage-700 mb-2">
                      Processing Notes
                    </label>
                    <textarea
                      value={processingData.notes}
                      onChange={(e) =>
                        setProcessingData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Add any additional notes about the processing step..."
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="border-t border-sage-100 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {isSubmitting && <ButtonSpinner />}
                      <Save className="w-5 h-5" />
                      <span>Record Processing Step</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-12 text-center">
                  <Cog className="w-16 h-16 text-sage-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-sage-600 mb-2">
                    Select a Herb to Process
                  </h3>
                  <p className="text-sage-500">
                    Search for a tested herb batch to begin processing.
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
          title="Processing Step Recorded!"
          size="lg"
        >
          {processingResult && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-sage-800 mb-2">
                  Processing Complete
                </h3>
                <p className="text-sage-600">
                  Processing step has been successfully recorded on the
                  blockchain.
                </p>
              </div>

              {/* Processing Summary */}
              <div className="bg-sage-50 rounded-lg p-4">
                <h4 className="font-medium text-sage-800 mb-3">
                  Processing Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-sage-600">Herb ID:</span>
                    <p className="font-mono text-sage-800">
                      {processingResult.herbId}
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Species:</span>
                    <p className="text-sage-800">{processingResult.species}</p>
                  </div>
                  <div>
                    <span className="text-sage-600">Processing Step:</span>
                    <p className="text-sage-800 capitalize">
                      {
                        processingSteps.find(
                          (s) => s.id === processingResult.stepType
                        )?.name
                      }
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Processor ID:</span>
                    <p className="font-mono text-sage-800 text-xs">
                      {user.userId}
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Processing Date:</span>
                    <p className="text-sage-800">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Status:</span>
                    <span className="inline-flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-700 font-medium">
                        PROCESSED
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Blockchain Transaction Info */}
              {processingResult.fabricResult && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">
                    Blockchain Transaction
                  </h4>
                  <p className="text-xs text-blue-700 font-mono">
                    TX:{" "}
                    {processingResult.fabricResult.txId ||
                      "Transaction recorded"}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/herbs/${processingResult.herbId}`)}
                  className="flex-1 bg-mint-500 text-white py-2 px-4 rounded-lg hover:bg-mint-600 transition-colors"
                >
                  View Herb Journey
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 border border-sage-300 text-sage-700 py-2 px-4 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  Process Another Herb
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Processing;
