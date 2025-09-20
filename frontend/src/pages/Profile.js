import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  User,
  Mail,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Shield,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";
import { UserTypeBadge } from "../components/StatusBadge";
import LoadingSpinner, { ButtonSpinner } from "../components/LoadingSpinner";
import Modal, { ConfirmModal } from "../components/Modal";
import api from "../services/api";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    location: {
      state: "",
      district: "",
      village: "",
    },
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});

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
    if (user) {
      setProfileData({
        name: user.name || "",
        location: user.location || {
          state: "",
          district: "",
          village: "",
        },
      });
    }
  }, [user]);

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (profileData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!profileData.location.state) {
      newErrors.state = "State is required";
    }

    if (!profileData.location.district.trim()) {
      newErrors.district = "District is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) return;

    setIsLoading(true);
    try {
      const response = await api.put("/users/profile", profileData);
      updateUser(response.data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return;

    setIsLoading(true);
    try {
      await api.put("/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setProfileData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field] || errors[field.split(".")[1]]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
        [field.split(".")[1]]: null,
      }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCancel = () => {
    setProfileData({
      name: user.name || "",
      location: user.location || {
        state: "",
        district: "",
        village: "",
      },
    });
    setIsEditing(false);
    setErrors({});
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-soft border border-sage-100 mb-8">
          <div className="px-6 py-4 border-b border-sage-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-mint-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-mint-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-sage-800">
                    {user.name}
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <UserTypeBadge userType={user.userType} />
                    <span className="text-sm text-sage-500">
                      • Member since {new Date(user.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="px-6 py-4 border-b border-sage-100">
                <h2 className="text-lg font-semibold text-sage-800">
                  Profile Information
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-sage-50 rounded-lg">
                    <Mail className="w-5 h-5 text-sage-400" />
                    <span className="text-sage-800">{user.email}</span>
                    <span className="text-xs text-sage-500 bg-sage-200 px-2 py-1 rounded">
                      Read-only
                    </span>
                  </div>
                </div>

                {/* User ID (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    User ID
                  </label>
                  <div className="flex items-center space-x-3 p-3 bg-sage-50 rounded-lg">
                    <Shield className="w-5 h-5 text-sage-400" />
                    <span className="text-sage-800 font-mono text-sm">
                      {user.userId}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                        errors.name
                          ? "border-red-300 bg-red-50"
                          : "border-sage-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-sage-50 rounded-lg">
                      <User className="w-5 h-5 text-sage-400" />
                      <span className="text-sage-800">{user.name}</span>
                    </div>
                  )}
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-3">
                    Location
                  </label>
                  <div className="space-y-4">
                    {/* State */}
                    <div>
                      <label className="block text-xs font-medium text-sage-600 mb-1">
                        State
                      </label>
                      {isEditing ? (
                        <select
                          value={profileData.location.state}
                          onChange={(e) =>
                            handleInputChange("location.state", e.target.value)
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
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
                      ) : (
                        <div className="flex items-center space-x-2 text-sage-800">
                          <MapPin className="w-4 h-4 text-sage-400" />
                          <span>{user.location?.state || "Not specified"}</span>
                        </div>
                      )}
                      {errors.state && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-medium text-sage-600 mb-1">
                        District
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location.district}
                          onChange={(e) =>
                            handleInputChange(
                              "location.district",
                              e.target.value
                            )
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                            errors.district
                              ? "border-red-300 bg-red-50"
                              : "border-sage-300"
                          }`}
                          placeholder="Enter district"
                        />
                      ) : (
                        <span className="text-sage-800 ml-6">
                          {user.location?.district || "Not specified"}
                        </span>
                      )}
                      {errors.district && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.district}
                        </p>
                      )}
                    </div>

                    {/* Village/Area */}
                    <div>
                      <label className="block text-xs font-medium text-sage-600 mb-1">
                        Village/Area
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location.village}
                          onChange={(e) =>
                            handleInputChange(
                              "location.village",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-sage-300 rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors"
                          placeholder="Enter village or area (optional)"
                        />
                      ) : (
                        <span className="text-sage-800 ml-6">
                          {user.location?.village || "Not specified"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons for editing */}
                {isEditing && (
                  <div className="flex space-x-4 pt-4 border-t border-sage-100">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading && <ButtonSpinner />}
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-4 py-2 border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Actions & Info */}
          <div className="space-y-6">
            {/* Account Security */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="px-6 py-4 border-b border-sage-100">
                <h3 className="text-lg font-semibold text-sage-800">
                  Account Security
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center space-x-3 p-3 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Key className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sage-800">Change Password</p>
                    <p className="text-sm text-sage-600">
                      Update your password
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="px-6 py-4 border-b border-sage-100">
                <h3 className="text-lg font-semibold text-sage-800">
                  Account Information
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sage-600">User Type</span>
                  <UserTypeBadge userType={user.userType} size="sm" />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sage-600">Account Status</span>
                  <span className="text-green-600 text-sm font-medium">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sage-600">Member Since</span>
                  <span className="text-sage-800 text-sm">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sage-600">Last Updated</span>
                  <span className="text-sage-800 text-sm">
                    {new Date(user.updatedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Password"
          size="md"
        >
          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange("currentPassword", e.target.value)
                  }
                  className={`w-full pr-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                    errors.currentPassword
                      ? "border-red-300 bg-red-50"
                      : "border-sage-300"
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                  className={`w-full pr-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                    errors.newPassword
                      ? "border-red-300 bg-red-50"
                      : "border-sage-300"
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                  className={`w-full pr-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-mint-500 focus:border-mint-500 transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-sage-300"
                  }`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sage-400 hover:text-sage-600"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading && <ButtonSpinner />}
                Update Password
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;
