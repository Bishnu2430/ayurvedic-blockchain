import React from "react";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

const StatusBadge = ({ status, size = "md", showIcon = true }) => {
  const statusConfig = {
    COLLECTED: {
      label: "Collected",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
    },
    TESTED: {
      label: "Tested",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertCircle,
    },
    PROCESSED: {
      label: "Processed",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: CheckCircle,
    },
    DISTRIBUTED: {
      label: "Distributed",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    FAILED: {
      label: "Failed",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
    },
    PENDING: {
      label: "Pending",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: Clock,
    },
    SUCCESS: {
      label: "Success",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    ACTIVE: {
      label: "Active",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    INACTIVE: {
      label: "Inactive",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: XCircle,
    },
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center space-x-1 rounded-full border font-medium
        ${config.color} ${sizes[size]}
      `}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
};

// User type badge
export const UserTypeBadge = ({ userType, size = "md" }) => {
  const typeConfig = {
    FARMER: {
      label: "Farmer",
      color: "bg-green-100 text-green-800 border-green-200",
    },
    LAB: {
      label: "Laboratory",
      color: "bg-blue-100 text-blue-800 border-blue-200",
    },
    PROCESSOR: {
      label: "Processor",
      color: "bg-purple-100 text-purple-800 border-purple-200",
    },
    CONSUMER: {
      label: "Consumer",
      color: "bg-mint-100 text-mint-800 border-mint-200",
    },
    ADMIN: {
      label: "Administrator",
      color: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const config = typeConfig[userType] || typeConfig.CONSUMER;

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${config.color} ${sizes[size]}
      `}
    >
      {config.label}
    </span>
  );
};

// Quality badge
export const QualityBadge = ({ quality, size = "md" }) => {
  const getQualityColor = (quality) => {
    if (quality >= 4.5) return "bg-green-100 text-green-800 border-green-200";
    if (quality >= 3.5)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (quality >= 2.5)
      return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${getQualityColor(quality)} ${sizes[size]}
      `}
    >
      ★ {quality}/5
    </span>
  );
};

export default StatusBadge;
