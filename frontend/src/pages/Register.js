import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  Eye,
  EyeOff,
  Leaf,
  Mail,
  Lock,
  User,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { ButtonSpinner } from "../components/LoadingSpinner";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    userType: "",
    location: {
      state: "",
      district: "",
      village: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  const { register, user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const userTypes = [
    {
      value: "FARMER",
      label: "Farmer",
      description: "Collect and harvest medicinal herbs",
      icon: "🌱",
    },
    {
      value: "LAB",
      label: "Laboratory",
      description: "Test herbs for quality and authenticity",
      icon: "🧪",
    },
    {
      value: "PROCESSOR",
      label: "Processor",
      description: "Process herbs into medicines",
      icon: "⚗️",
    },
    {
      value: "CONSUMER",
      label: "Consumer",
      description: "Purchase and verify herb authenticity",
      icon: "👥",
    },
  ];

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

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.userType) {
      newErrors.userType = "Please select a user type";
    }

    if (!formData.location.state) {
      newErrors.state = "State is required";
    }

    if (!formData.location.district) {
      newErrors.district = "District is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);
    try {
      await register(formData);
      toast.success("Account created successfully! Welcome to HerbTrace!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-2xl font-bold text-sage-800 hover:text-mint-600 transition-colors"
          >
            <div className="p-2 bg-mint-100 rounded-lg">
              <Leaf className="w-8 h-8 text-mint-600" />
            </div>
            <span>HerbTrace</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-sage-800">
            Join the HerbTrace Network
          </h2>
          <p className="mt-2 text-sm text-sage-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-mint-600 hover:text-mint-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-4">
          <div
            className={`flex items-center ${
              step >= 1 ? "text-mint-600" : "text-sage-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? "bg-mint-100" : "bg-sage-100"
              }`}
            >
              {step > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">
              Account
            </span>
          </div>
          <div
            className={`w-8 h-1 rounded ${
              step >= 2 ? "bg-mint-600" : "bg-sage-200"
            }`}
          ></div>
          <div
            className={`flex items-center ${
              step >= 2 ? "text-mint-600" : "text-sage-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? "bg-mint-100" : "bg-sage-100"
              }`}
            >
              2
            </div>
            <span className="ml-2 text-sm font-medium hidden sm:inline">
              Details
            </span>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8">
          {step === 1 ? (
            // Step 1: Basic Information
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNext();
              }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-sage-800">
                  Basic Information
                </h3>
                <p className="text-sm text-sage-600">
                  Let's start with your account details
                </p>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-sage-700 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="w-5 h-5 text-sage-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                      errors.name
                        ? "border-red-300 bg-red-50"
                        : "border-sage-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-sage-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="w-5 h-5 text-sage-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-sage-300"
                    }`}
                    placeholder="Enter your email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-sage-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-sage-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-sage-300"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-sage-700 mb-1"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="w-5 h-5 text-sage-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                      errors.confirmPassword
                        ? "border-red-300 bg-red-50"
                        : "border-sage-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Next button */}
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-mint-600 hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 transition-colors"
              >
                Next Step
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </form>
          ) : (
            // Step 2: User Type & Location
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-sage-800">
                  Complete Your Profile
                </h3>
                <p className="text-sm text-sage-600">
                  Tell us about yourself and your location
                </p>
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-3">
                  I am a...
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {userTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-sage-25 transition-colors ${
                        formData.userType === type.value
                          ? "border-mint-500 bg-mint-50"
                          : "border-sage-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="userType"
                        value={type.value}
                        checked={formData.userType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-sage-800">
                            {type.label}
                          </div>
                          <div className="text-xs text-sage-600">
                            {type.description}
                          </div>
                        </div>
                      </div>
                      {formData.userType === type.value && (
                        <CheckCircle className="absolute top-4 right-4 w-5 h-5 text-mint-600" />
                      )}
                    </label>
                  ))}
                </div>
                {errors.userType && (
                  <p className="mt-1 text-sm text-red-600">{errors.userType}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-sage-700 mb-3">
                  Location Information
                </label>
                <div className="space-y-4">
                  {/* State */}
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-xs font-medium text-sage-600 mb-1"
                    >
                      State
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="w-4 h-4 text-sage-400" />
                      </div>
                      <select
                        id="state"
                        value={formData.location.state}
                        onChange={(e) =>
                          handleLocationChange("state", e.target.value)
                        }
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm ${
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
                    </div>
                    {errors.state && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  {/* District */}
                  <div>
                    <label
                      htmlFor="district"
                      className="block text-xs font-medium text-sage-600 mb-1"
                    >
                      District
                    </label>
                    <input
                      id="district"
                      type="text"
                      value={formData.location.district}
                      onChange={(e) =>
                        handleLocationChange("district", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm ${
                        errors.district
                          ? "border-red-300 bg-red-50"
                          : "border-sage-300"
                      }`}
                      placeholder="Enter district"
                    />
                    {errors.district && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.district}
                      </p>
                    )}
                  </div>

                  {/* Village/Area (Optional) */}
                  <div>
                    <label
                      htmlFor="village"
                      className="block text-xs font-medium text-sage-600 mb-1"
                    >
                      Village/Area (Optional)
                    </label>
                    <input
                      id="village"
                      type="text"
                      value={formData.location.village}
                      onChange={(e) =>
                        handleLocationChange("village", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors text-sm"
                      placeholder="Enter village or area"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-mint-600 hover:bg-mint-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mint-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading && <ButtonSpinner />}
                  Create Account
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-mint-50 rounded-lg border border-mint-200 p-6">
          <h3 className="text-sm font-medium text-mint-800 mb-3">
            Why join HerbTrace?
          </h3>
          <ul className="text-sm text-mint-700 space-y-2">
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-mint-600 mt-0.5 flex-shrink-0" />
              <span>Complete traceability from farm to consumer</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-mint-600 mt-0.5 flex-shrink-0" />
              <span>Blockchain-secured authenticity verification</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-mint-600 mt-0.5 flex-shrink-0" />
              <span>Quality assurance and compliance tracking</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-mint-600 mt-0.5 flex-shrink-0" />
              <span>Connect with trusted network participants</span>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-sage-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-mint-600 hover:text-mint-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-mint-600 hover:text-mint-500">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
