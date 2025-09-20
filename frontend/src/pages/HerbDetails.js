import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Package,
  TestTube,
  Cog,
  QrCode,
  Shield,
  ExternalLink,
  Download,
  Edit,
  Eye,
  Share2,
  Star,
  AlertCircle,
} from "lucide-react";
import LoadingSpinner, { FullScreenLoader } from "../components/LoadingSpinner";
import Timeline from "../components/Timeline";
import StatusBadge, {
  QualityBadge,
  UserTypeBadge,
} from "../components/StatusBadge";
import QRDisplay, { QRWithDownload } from "../components/QRDisplay";
import Modal from "../components/Modal";
import api from "../services/api";

const HerbDetails = () => {
  const { herbId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [herb, setHerb] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (herbId) {
      loadHerbDetails();
    }
  }, [herbId]);

  const loadHerbDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/fabric/herb/${herbId}`);
      const herbData = response.data;

      if (!herbData.herbBatch) {
        setError("Herb not found");
        return;
      }

      setHerb(herbData);

      // Process timeline events
      if (herbData.blockchainJourney && herbData.blockchainJourney.length > 0) {
        setTimelineEvents(herbData.blockchainJourney);
      } else if (herbData.transactions && herbData.transactions.length > 0) {
        setTimelineEvents(herbData.transactions);
      }
    } catch (error) {
      console.error("Error loading herb details:", error);
      if (error.response?.status === 404) {
        setError("Herb not found");
      } else {
        setError("Failed to load herb details");
      }
      toast.error("Failed to load herb details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${herb.herbBatch.species} - HerbTrace`,
      text: `View the complete journey of this ${herb.herbBatch.species} herb`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const formatLocation = (location) => {
    if (!location) return "Unknown location";

    const parts = [];
    if (location.village) parts.push(location.village);
    if (location.district) parts.push(location.district);
    if (location.state) parts.push(location.state);

    return parts.join(", ") || "Unknown location";
  };

  const getStatusColor = (status) => {
    const colors = {
      COLLECTED: "bg-blue-50 border-blue-200",
      TESTED: "bg-yellow-50 border-yellow-200",
      PROCESSED: "bg-purple-50 border-purple-200",
      DISTRIBUTED: "bg-green-50 border-green-200",
    };
    return colors[status] || "bg-gray-50 border-gray-200";
  };

  const canEdit = () => {
    return (
      user &&
      (user.userType === "ADMIN" ||
        user.userId === herb?.herbBatch?.collectorId)
    );
  };

  if (isLoading) {
    return <FullScreenLoader text="Loading herb details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-sage-800 mb-2">{error}</h2>
          <p className="text-sage-600 mb-4">
            The herb you're looking for could not be found or there was an error
            loading the details.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 bg-sage-500 text-white px-4 py-2 rounded-lg hover:bg-sage-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/trace")}
              className="flex-1 border border-sage-300 text-sage-700 px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors"
            >
              Trace Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!herb || !herb.herbBatch) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-sage-300 mx-auto mb-4" />
          <p className="text-sage-600">No herb data available</p>
        </div>
      </div>
    );
  }

  const { herbBatch, qrCodes = [], transactions = [] } = herb;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-sage-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-sage-600 hover:text-sage-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-6 w-px bg-sage-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-sage-800">
                  {herbBatch.species}
                </h1>
                <p className="text-sm text-sage-500 font-mono">
                  {herbBatch.herbId}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 px-3 py-1 text-sage-600 hover:text-mint-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {qrCodes.length > 0 && (
                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex items-center space-x-1 px-3 py-1 text-sage-600 hover:text-mint-600 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">QR Code</span>
                </button>
              )}

              {canEdit() && (
                <Link
                  to={`/herbs/${herbId}/edit`}
                  className="flex items-center space-x-1 px-3 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Herb Overview */}
            <div
              className={`rounded-lg border-2 p-6 ${getStatusColor(
                herbBatch.status
              )}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <Package className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-sage-800">
                      {herbBatch.species}
                    </h2>
                    <p className="text-sage-600">Medicinal Herb Batch</p>
                  </div>
                </div>
                <StatusBadge status={herbBatch.status} size="lg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sage-700">
                    <Calendar className="w-4 h-4 text-sage-500" />
                    <span className="text-sm font-medium">Collected:</span>
                    <span>
                      {new Date(herbBatch.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sage-700">
                    <User className="w-4 h-4 text-sage-500" />
                    <span className="text-sm font-medium">Collector:</span>
                    <span>{herbBatch.User?.name || herbBatch.collectorId}</span>
                  </div>

                  {herbBatch.metadata?.quality && (
                    <div className="flex items-center space-x-2 text-sage-700">
                      <Star className="w-4 h-4 text-sage-500" />
                      <span className="text-sm font-medium">Quality:</span>
                      <QualityBadge
                        quality={herbBatch.metadata.quality}
                        size="sm"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2 text-sage-700">
                    <MapPin className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-sm font-medium">Location:</span>
                      <p className="mt-1">
                        {formatLocation(herbBatch.metadata?.location)}
                      </p>
                      {herbBatch.metadata?.location?.latitude && (
                        <p className="text-xs text-sage-500 mt-1">
                          {herbBatch.metadata.location.latitude},{" "}
                          {herbBatch.metadata.location.longitude}
                          {herbBatch.metadata.location.altitude &&
                            ` • ${herbBatch.metadata.location.altitude}m altitude`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {herbBatch.metadata?.notes && (
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <h4 className="text-sm font-medium text-sage-700 mb-1">
                    Collection Notes
                  </h4>
                  <p className="text-sage-600 text-sm">
                    {herbBatch.metadata.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Journey Timeline */}
            {timelineEvents.length > 0 ? (
              <Timeline events={timelineEvents} title="Complete Journey" />
            ) : (
              <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8 text-center">
                <Shield className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-sage-600 mb-2">
                  No Journey Data Available
                </h3>
                <p className="text-sage-500">
                  This herb batch doesn't have detailed journey information
                  recorded on the blockchain.
                </p>
              </div>
            )}

            {/* Blockchain Information */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-6 border-b border-sage-100">
                <h3 className="text-lg font-semibold text-sage-800">
                  Blockchain Verification
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-sage-700 mb-3">
                      Transaction Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-sage-600">
                          Total Transactions:
                        </span>
                        <span className="font-mono text-sage-800">
                          {transactions.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sage-600">Successful:</span>
                        <span className="font-mono text-green-600">
                          {
                            transactions.filter((t) => t.status === "SUCCESS")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sage-600">Failed:</span>
                        <span className="font-mono text-red-600">
                          {
                            transactions.filter((t) => t.status === "FAILED")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sage-600">Last Updated:</span>
                        <span className="font-mono text-sage-800">
                          {herbBatch.updatedAt
                            ? new Date(herbBatch.updatedAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sage-700 mb-3">
                      Security Features
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-sage-600">
                          Immutable blockchain records
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-sage-600">
                          Cryptographically secured
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-sage-600">
                          Tamper-proof verification
                        </span>
                      </div>
                      {qrCodes.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <QrCode className="w-4 h-4 text-mint-500" />
                          <span className="text-sm text-sage-600">
                            QR code authentication
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {timelineEvents.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        Verified Authentic
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      This herb has been verified through our blockchain network
                      with {timelineEvents.length} recorded events.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-4 border-b border-sage-100">
                <h3 className="text-lg font-semibold text-sage-800">
                  Quick Actions
                </h3>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  to={`/trace/${herbId}`}
                  className="flex items-center space-x-3 w-full p-3 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <div className="p-2 bg-mint-100 rounded-lg">
                    <Eye className="w-4 h-4 text-mint-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sage-800">
                      Public Trace View
                    </p>
                    <p className="text-sm text-sage-600">
                      Consumer-friendly view
                    </p>
                  </div>
                </Link>

                {qrCodes.length > 0 && (
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center space-x-3 w-full p-3 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <QrCode className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sage-800">View QR Code</p>
                      <p className="text-sm text-sage-600">Download or print</p>
                    </div>
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-3 w-full p-3 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Download className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sage-800">Print Details</p>
                    <p className="text-sm text-sage-600">Physical copy</p>
                  </div>
                </button>

                <a
                  href={`mailto:support@herbtrace.com?subject=Query about ${herbId}`}
                  className="flex items-center space-x-3 w-full p-3 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors"
                >
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sage-800">Contact Support</p>
                    <p className="text-sm text-sage-600">Get help</p>
                  </div>
                </a>
              </div>
            </div>

            {/* QR Code Preview */}
            {qrCodes.length > 0 && (
              <div className="bg-white rounded-lg shadow-soft border border-sage-100">
                <div className="p-4 border-b border-sage-100">
                  <h3 className="text-lg font-semibold text-sage-800">
                    QR Code
                  </h3>
                </div>
                <div className="p-4">
                  <QRWithDownload qrCode={qrCodes[0]} herbId={herbId} />
                </div>
              </div>
            )}

            {/* Technical Details */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-4 border-b border-sage-100">
                <h3 className="text-lg font-semibold text-sage-800">
                  Technical Details
                </h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div>
                  <span className="text-sage-600">Herb ID:</span>
                  <p className="font-mono text-sage-800 bg-sage-50 px-2 py-1 rounded mt-1 break-all">
                    {herbBatch.herbId}
                  </p>
                </div>

                <div>
                  <span className="text-sage-600">Collector ID:</span>
                  <p className="font-mono text-sage-800 bg-sage-50 px-2 py-1 rounded mt-1 break-all">
                    {herbBatch.collectorId}
                  </p>
                </div>

                <div>
                  <span className="text-sage-600">Database ID:</span>
                  <p className="font-mono text-sage-800 bg-sage-50 px-2 py-1 rounded mt-1">
                    {herbBatch.id}
                  </p>
                </div>

                <div>
                  <span className="text-sage-600">Created:</span>
                  <p className="text-sage-800 mt-1">
                    {new Date(herbBatch.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <span className="text-sage-600">Last Updated:</span>
                  <p className="text-sage-800 mt-1">
                    {new Date(herbBatch.updatedAt).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Collector Info */}
            {herbBatch.User && (
              <div className="bg-white rounded-lg shadow-soft border border-sage-100">
                <div className="p-4 border-b border-sage-100">
                  <h3 className="text-lg font-semibold text-sage-800">
                    Collector Information
                  </h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sage-800">
                        {herbBatch.User.name}
                      </p>
                      <UserTypeBadge
                        userType={herbBatch.User.userType}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-sage-600">Email:</span>
                      <p className="text-sage-800">{herbBatch.User.email}</p>
                    </div>

                    {herbBatch.User.location && (
                      <div>
                        <span className="text-sage-600">Base Location:</span>
                        <p className="text-sage-800">
                          {formatLocation(herbBatch.User.location)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Related Links */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-4 border-b border-sage-100">
                <h3 className="text-lg font-semibold text-sage-800">Related</h3>
              </div>
              <div className="p-4 space-y-2">
                <Link
                  to="/trace"
                  className="flex items-center space-x-2 text-mint-600 hover:text-mint-700 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>Trace another herb</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-mint-600 hover:text-mint-700 text-sm"
                >
                  <Package className="w-4 h-4" />
                  <span>View dashboard</span>
                </Link>

                {user && user.userType === "FARMER" && (
                  <Link
                    to="/collect"
                    className="flex items-center space-x-2 text-mint-600 hover:text-mint-700 text-sm"
                  >
                    <Package className="w-4 h-4" />
                    <span>Collect new herbs</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {qrCodes.length > 0 && (
        <Modal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          title="QR Code"
          size="lg"
        >
          <QRDisplay
            qrCode={qrCodes[0]}
            herbId={herbId}
            onClose={() => setShowQRModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default HerbDetails;
