import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  Leaf,
  MapPin,
  Camera,
  Star,
  Plus,
  X,
  Upload,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { ButtonSpinner } from "../components/LoadingSpinner";
import Modal, { SuccessModal } from "../components/Modal";
import QRDisplay from "../components/QRDisplay";
import api from "../services/api";

const HerbCollection = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    species: "",
    location: {
      latitude: "",
      longitude: "",
      altitude: "",
      state: "",
      district: "",
      village: "",
    },
    quality: 3,
    notes: "",
    images: [],
    documents: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [collectionResult, setCollectionResult] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const commonHerbs = [
    "Ashwagandha",
    "Turmeric",
    "Brahmi",
    "Neem",
    "Tulsi",
    "Ginger",
    "Amla",
    "Aloe Vera",
    "Fenugreek",
    "Cardamom",
    "Black Pepper",
    "Long Pepper",
    "Cinnamon",
    "Cloves",
    "Nutmeg",
    "Saffron",
  ];

  const qualityDescriptions = {
    1: "Poor quality - Damaged or contaminated",
    2: "Below average - Minor defects present",
    3: "Good quality - Standard specifications met",
    4: "Very good quality - Above standard",
    5: "Excellent quality - Premium grade",
  };

  const indianStates = [
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
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Puducherry",
  ];

  useEffect(() => {
    // Redirect if not a farmer
    if (user && user.userType !== "FARMER") {
      navigate("/dashboard");
      return;
    }

    // Set user location as default
    if (user?.location) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          state: user.location.state || "",
          district: user.location.district || "",
          village: user.location.village || "",
        },
      }));
    }
  }, [user, navigate]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: {
            ...prev.location,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            altitude: altitude ? altitude.toFixed(0) : "",
          },
        }));
        setCurrentLocation({ latitude, longitude });
        toast.success("Location captured successfully!");
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get current location. Please enter manually.");
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.species.trim()) {
      newErrors.species = "Species is required";
    }

    if (!formData.location.state) {
      newErrors.state = "State is required";
    }

    if (!formData.location.district.trim()) {
      newErrors.district = "District is required";
    }

    if (!formData.location.latitude || !formData.location.longitude) {
      newErrors.location = "GPS coordinates are required";
    }

    if (formData.quality < 1 || formData.quality > 5) {
      newErrors.quality = "Quality rating must be between 1 and 5";
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

    setIsLoading(true);
    try {
      const collectionData = {
        species: formData.species,
        location: {
          latitude: parseFloat(formData.location.latitude),
          longitude: parseFloat(formData.location.longitude),
          altitude: formData.location.altitude
            ? parseFloat(formData.location.altitude)
            : undefined,
          state: formData.location.state,
          district: formData.location.district,
          village: formData.location.village,
        },
        quality: parseInt(formData.quality),
        notes: formData.notes,
      };

      const response = await api.post("/fabric/collect", collectionData);

      setCollectionResult(response.data);
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        species: "",
        location: {
          latitude: "",
          longitude: "",
          altitude: "",
          state: user?.location?.state || "",
          district: user?.location?.district || "",
          village: user?.location?.village || "",
        },
        quality: 3,
        notes: "",
        images: [],
        documents: [],
      });
      setCurrentLocation(null);
    } catch (error) {
      console.error("Collection error:", error);
      toast.error(
        error.response?.data?.message || "Failed to record herb collection"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    const errorField = field.includes(".") ? field.split(".")[1] : field;
    if (errors[errorField]) {
      setErrors((prev) => ({ ...prev, [errorField]: null }));
    }
  };

  const handleSpeciesSelect = (species) => {
    setFormData((prev) => ({ ...prev, species }));
    if (errors.species) {
      setErrors((prev) => ({ ...prev, species: null }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    // In a real app, you'd upload these to a file storage service
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (user && user.userType !== "FARMER") {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-sage-800 mb-2">
            Access Restricted
          </h2>
          <p className="text-sage-600 mb-4">
            This page is only accessible to farmers. Please contact your
            administrator if you believe this is an error.
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Leaf className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-2">
            Collect Herbs
          </h1>
          <p className="text-sage-600">
            Record a new herb collection and add it to the blockchain
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-soft border border-sage-100">
          <div className="p-6 border-b border-sage-100">
            <h2 className="text-xl font-semibold text-sage-800">
              Collection Details
            </h2>
            <p className="text-sm text-sage-600 mt-1">
              All fields marked with * are required
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Species Selection */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Herb Species *
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.species}
                  onChange={(e) => handleInputChange("species", e.target.value)}
                  placeholder="Enter herb species name"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                    errors.species
                      ? "border-red-300 bg-red-50"
                      : "border-sage-300"
                  }`}
                />

                {/* Common herbs suggestions */}
                <div>
                  <p className="text-xs text-sage-500 mb-2">Common herbs:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonHerbs.slice(0, 8).map((herb) => (
                      <button
                        key={herb}
                        type="button"
                        onClick={() => handleSpeciesSelect(herb)}
                        className="px-3 py-1 text-xs bg-sage-100 text-sage-700 rounded-full hover:bg-mint-100 hover:text-mint-700 transition-colors"
                      >
                        {herb}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {errors.species && (
                <p className="mt-1 text-sm text-red-600">{errors.species}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-3">
                Collection Location *
              </label>

              {/* GPS Coordinates */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 disabled:opacity-50 transition-colors"
                  >
                    {locationLoading ? (
                      <ButtonSpinner />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                    <span>Get Current Location</span>
                  </button>
                  {currentLocation && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-sage-600 mb-1">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.latitude}
                      onChange={(e) =>
                        handleInputChange("location.latitude", e.target.value)
                      }
                      placeholder="e.g., 11.6854"
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-sage-600 mb-1">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.longitude}
                      onChange={(e) =>
                        handleInputChange("location.longitude", e.target.value)
                      }
                      placeholder="e.g., 76.1320"
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-sage-600 mb-1">
                      Altitude (m)
                    </label>
                    <input
                      type="number"
                      value={formData.location.altitude}
                      onChange={(e) =>
                        handleInputChange("location.altitude", e.target.value)
                      }
                      placeholder="e.g., 850"
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Administrative location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-sage-600 mb-1">
                      State *
                    </label>
                    <select
                      value={formData.location.state}
                      onChange={(e) =>
                        handleInputChange("location.state", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm ${
                        errors.state
                          ? "border-red-300 bg-red-50"
                          : "border-sage-300"
                      }`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-sage-600 mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      value={formData.location.district}
                      onChange={(e) =>
                        handleInputChange("location.district", e.target.value)
                      }
                      placeholder="Enter district"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm ${
                        errors.district
                          ? "border-red-300 bg-red-50"
                          : "border-sage-300"
                      }`}
                    />
                    {errors.district && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.district}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-sage-600 mb-1">
                      Village/Area
                    </label>
                    <input
                      type="text"
                      value={formData.location.village}
                      onChange={(e) =>
                        handleInputChange("location.village", e.target.value)
                      }
                      placeholder="Enter village"
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Quality Rating */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Quality Rating *
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleInputChange("quality", rating)}
                      className={`p-2 rounded-lg transition-colors ${
                        formData.quality >= rating
                          ? "text-yellow-500"
                          : "text-sage-300 hover:text-yellow-400"
                      }`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          formData.quality >= rating ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sage-600">
                    ({formData.quality}/5)
                  </span>
                </div>
                <p className="text-sm text-sage-600">
                  {qualityDescriptions[formData.quality]}
                </p>
              </div>
              {errors.quality && (
                <p className="mt-1 text-sm text-red-600">{errors.quality}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Collection Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
                placeholder="Add any additional notes about the collection (growth conditions, harvesting method, etc.)"
                className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
              />
            </div>

            {/* Images (Optional) */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-2">
                Photos (Optional)
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 px-4 py-2 border border-sage-300 rounded-lg hover:bg-sage-50 cursor-pointer transition-colors">
                    <Camera className="w-4 h-4 text-sage-600" />
                    <span className="text-sage-700">Add Photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-sm text-sage-500">
                    Up to 5 photos ({formData.images.length}/5)
                  </span>
                </div>

                {/* Image previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Collection ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-sage-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-sage-100 pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-mint-600 text-white rounded-lg hover:bg-mint-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading && <ButtonSpinner />}
                <Save className="w-5 h-5" />
                <span>Record Collection</span>
              </button>
            </div>
          </form>
        </div>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          title="Collection Recorded Successfully!"
          size="lg"
        >
          {collectionResult && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-sage-700 mb-4">
                  Your herb collection has been successfully recorded on the
                  blockchain.
                </p>
              </div>

              {/* Collection Info */}
              <div className="bg-sage-50 rounded-lg p-4">
                <h3 className="font-medium text-sage-800 mb-3">
                  Collection Details
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-sage-600">Herb ID:</span>
                    <p className="font-mono text-sage-800">
                      {collectionResult.herbBatch?.herbId}
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Species:</span>
                    <p className="text-sage-800">
                      {collectionResult.herbBatch?.species}
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Quality:</span>
                    <p className="text-sage-800">
                      {collectionResult.herbBatch?.metadata?.quality}/5
                    </p>
                  </div>
                  <div>
                    <span className="text-sage-600">Date:</span>
                    <p className="text-sage-800">
                      {new Date(
                        collectionResult.herbBatch?.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              {collectionResult.qrCode && (
                <div>
                  <h3 className="font-medium text-sage-800 mb-3">QR Code</h3>
                  <QRDisplay
                    qrCode={collectionResult.qrCode}
                    herbId={collectionResult.herbBatch?.herbId}
                  />
                </div>
              )}

              {/* Action buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    navigate(`/herbs/${collectionResult.herbBatch?.herbId}`)
                  }
                  className="flex-1 bg-mint-500 text-white py-2 px-4 rounded-lg hover:bg-mint-600 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 border border-sage-300 text-sage-700 py-2 px-4 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default HerbCollection;
