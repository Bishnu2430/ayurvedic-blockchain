import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  User,
  Eye,
  QrCode,
  MoreHorizontal,
} from "lucide-react";
import StatusBadge, { QualityBadge } from "./StatusBadge";

const HerbCard = ({ herb, showActions = false, onViewDetails, onViewQR }) => {
  const {
    herbId,
    species,
    status,
    metadata = {},
    User: collector,
    QRCodes = [],
    createdAt,
  } = herb;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage-100 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-sage-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-sage-800 mb-1">
              {species}
            </h3>
            <p className="text-sm text-sage-500 font-mono">{herbId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <StatusBadge status={status} size="sm" />
            {showActions && (
              <button className="p-1 text-sage-400 hover:text-sage-600 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Quality */}
        {metadata.quality && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-sage-600">Quality Rating:</span>
            <QualityBadge quality={metadata.quality} size="sm" />
          </div>
        )}

        {/* Collection Info */}
        <div className="space-y-2">
          {collector && (
            <div className="flex items-center space-x-2 text-sm text-sage-600">
              <User className="w-4 h-4 text-sage-400" />
              <span>{collector.name}</span>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-sage-600">
            <Calendar className="w-4 h-4 text-sage-400" />
            <span>{formatDate(createdAt)}</span>
          </div>

          {metadata.location && (
            <div className="flex items-center space-x-2 text-sm text-sage-600">
              <MapPin className="w-4 h-4 text-sage-400" />
              <span>
                {metadata.location.state || "Location"}{" "}
                {metadata.location.district &&
                  `, ${metadata.location.district}`}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        {metadata.notes && (
          <div className="pt-2 border-t border-sage-50">
            <p className="text-sm text-sage-600 line-clamp-2">
              {metadata.notes}
            </p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-4 py-3 bg-sage-25 border-t border-sage-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {QRCodes.length > 0 && (
              <button
                onClick={() => onViewQR && onViewQR(herb)}
                className="flex items-center space-x-1 text-xs text-sage-500 hover:text-mint-600 transition-colors"
              >
                <QrCode className="w-3 h-3" />
                <span>QR Code</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/herbs/${herbId}`}
              className="flex items-center space-x-1 px-3 py-1 bg-mint-50 text-mint-700 rounded text-xs hover:bg-mint-100 transition-colors"
            >
              <Eye className="w-3 h-3" />
              <span>View Details</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for lists
export const HerbCardCompact = ({ herb, onClick }) => {
  const { herbId, species, status, metadata = {}, createdAt } = herb;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-sage-100 rounded-lg p-3 hover:bg-sage-25 hover:border-mint-200 cursor-pointer transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-sage-800 truncate">
              {species}
            </h4>
            <StatusBadge status={status} size="sm" showIcon={false} />
          </div>
          <p className="text-xs text-sage-500 font-mono mb-1">{herbId}</p>
          <p className="text-xs text-sage-400">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        {metadata.quality && (
          <QualityBadge quality={metadata.quality} size="sm" />
        )}
      </div>
    </div>
  );
};

// Loading skeleton
export const HerbCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage-100 overflow-hidden animate-pulse">
      <div className="p-4 border-b border-sage-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-5 bg-sage-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-sage-100 rounded w-24"></div>
          </div>
          <div className="h-6 bg-sage-200 rounded-full w-16"></div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-4 bg-sage-100 rounded w-20"></div>
          <div className="h-6 bg-sage-200 rounded-full w-12"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-sage-100 rounded w-full"></div>
          <div className="h-4 bg-sage-100 rounded w-3/4"></div>
          <div className="h-4 bg-sage-100 rounded w-5/6"></div>
        </div>
      </div>

      <div className="px-4 py-3 bg-sage-25 border-t border-sage-50">
        <div className="flex justify-between">
          <div className="h-4 bg-sage-200 rounded w-16"></div>
          <div className="h-6 bg-sage-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
};

export default HerbCard;
