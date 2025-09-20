import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import {
  Search,
  QrCode,
  Shield,
  MapPin,
  Calendar,
  User,
  TestTube,
  Cog,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Eye,
  Download,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";
import { QRScannerButton } from "../components/QRScanner";
import Timeline from "../components/Timeline";
import StatusBadge, { QualityBadge } from "../components/StatusBadge";
import api from "../services/api";

const TraceHerb = () => {
  const navigate = useNavigate();
  const { herbId: paramHerbId } = useParams();
  const toast = useToast();

  const [herbId, setHerbId] = useState(paramHerbId || "");
  const [isLoading, setIsLoading] = useState(false);
  const [herbData, setHerbData] = useState(null);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (paramHerbId) {
      handleTrace(paramHerbId);
    }
  }, [paramHerbId]);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/trace/${query.trim()}`);
    }
  };

  const handleQRScan = (qrData) => {
    try {
      const parsed = JSON.parse(qrData);
      if (parsed.herbId) {
        navigate(`/trace/${parsed.herbId}`);
      } else if (parsed.type === "herb_traceability") {
        // Extract herb ID from URL if present
        const urlMatch = parsed.url?.match(/\/trace\/([^\/]+)/);
        if (urlMatch) {
          navigate(`/trace/${urlMatch[1]}`);
        } else {
          toast.error("Invalid QR code format");
        }
      } else {
        toast.error("QR code does not contain herb information");
      }
    } catch (error) {
      // Try to use the raw data as herb ID
      const cleanData = qrData.trim();
      if (cleanData.length > 5) {
        navigate(`/trace/${cleanData}`);
      } else {
        toast.error("Invalid QR code format");
      }
    }
  };

  const handleTrace = async (searchHerbId) => {
    if (!searchHerbId?.trim()) {
      toast.error("Please enter a Herb ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHerbData(null);
    setTimelineEvents([]);

    try {
      // Get herb details
      const herbResponse = await api.get(`/fabric/herb/${searchHerbId}`);
      const herbInfo = herbResponse.data;

      if (!herbInfo.herbBatch) {
        setError("Herb not found. Please check the Herb ID and try again.");
        return;
      }

      setHerbData(herbInfo);

      // Process timeline events from blockchain journey
      if (herbInfo.blockchainJourney && herbInfo.blockchainJourney.length > 0) {
        setTimelineEvents(herbInfo.blockchainJourney);
      } else if (herbInfo.transactions && herbInfo.transactions.length > 0) {
        setTimelineEvents(herbInfo.transactions);
      }
    } catch (error) {
      console.error("Trace error:", error);
      if (error.response?.status === 404) {
        setError("Herb not found. Please check the Herb ID and try again.");
      } else {
        setError("Failed to trace herb. Please try again later.");
      }
      toast.error(error.response?.data?.message || "Failed to trace herb");
    } finally {
      setIsLoading(false);
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

  const getVerificationStatus = () => {
    if (!herbData) return null;

    const { herbBatch, blockchainJourney } = herbData;
    const hasBlockchainData = blockchainJourney && blockchainJourney.length > 0;
    const hasQRCodes = herbData.qrCodes && herbData.qrCodes.length > 0;

    if (hasBlockchainData && hasQRCodes) {
      return {
        status: "verified",
        title: "Verified Authentic",
        description:
          "This herb has been verified through our blockchain network",
        icon: Shield,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    } else if (hasBlockchainData) {
      return {
        status: "partial",
        title: "Partially Verified",
        description: "Limited verification data available",
        icon: AlertCircle,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
      };
    } else {
      return {
        status: "unverified",
        title: "Cannot Verify",
        description: "No blockchain verification data found",
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
      };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="min-h-screen bg-cream-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-mint-100 rounded-full mb-4">
            <Search className="w-8 h-8 text-mint-600" />
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-2">
            Trace Your Herb
          </h1>
          <p className="text-sage-600">
            Verify the authenticity and journey of your medicinal herbs
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-soft border border-sage-100 mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Enter Herb ID (e.g., ASH1234567890)"
                  onSearch={handleSearch}
                  value={herbId}
                  onChange={setHerbId}
                  autoFocus={!paramHerbId}
                />
              </div>
              <QRScannerButton
                onScanResult={handleQRScan}
                className="w-full sm:w-auto justify-center"
              />
            </div>

            <div className="mt-4 flex items-center space-x-4 text-sm text-sage-600">
              <div className="flex items-center space-x-1">
                <QrCode className="w-4 h-4" />
                <span>Scan QR code on package</span>
              </div>
              <div className="flex items-center space-x-1">
                <Search className="w-4 h-4" />
                <span>Or enter Herb ID manually</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-12 text-center">
            <LoadingSpinner size="lg" text="Tracing herb on blockchain..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-sage-800 mb-2">
              Herb Not Found
            </h2>
            <p className="text-sage-600 mb-4">{error}</p>
            <div className="text-sm text-sage-500">
              <p className="mb-2">Make sure you:</p>
              <ul className="text-left inline-block space-y-1">
                <li>• Entered the correct Herb ID</li>
                <li>• Scanned the QR code properly</li>
                <li>• Check if the herb is registered in our system</li>
              </ul>
            </div>
          </div>
        )}

        {/* Herb Information */}
        {herbData && herbData.herbBatch && (
          <div className="space-y-8">
            {/* Verification Status */}
            {verificationStatus &&
              verificationStatus.status !== "unverified" && (
                <div
                  className={`rounded-lg border p-6 ${verificationStatus.bgColor} ${verificationStatus.borderColor}`}
                >
                  <div className="flex items-center space-x-3">
                    <verificationStatus.icon
                      className={`w-8 h-8 ${verificationStatus.color}`}
                    />
                    <div>
                      <h3
                        className={`text-lg font-semibold ${verificationStatus.color}`}
                      >
                        {verificationStatus.title}
                      </h3>
                      <p
                        className={`text-sm ${verificationStatus.color} opacity-80`}
                      >
                        {verificationStatus.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Herb Details */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100">
              <div className="p-6 border-b border-sage-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-sage-800">
                    Herb Information
                  </h2>
                  <button
                    onClick={() =>
                      navigate(`/herbs/${herbData.herbBatch.herbId}`)
                    }
                    className="flex items-center space-x-1 text-mint-600 hover:text-mint-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Details</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-sage-600 mb-1">
                        Herb Species
                      </h3>
                      <p className="text-lg font-semibold text-sage-800">
                        {herbData.herbBatch.species}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-sage-600 mb-1">
                        Herb ID
                      </h3>
                      <p className="font-mono text-sage-800 bg-sage-50 px-2 py-1 rounded">
                        {herbData.herbBatch.herbId}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-sage-600 mb-1">
                        Current Status
                      </h3>
                      <StatusBadge status={herbData.herbBatch.status} />
                    </div>

                    {herbData.herbBatch.metadata?.quality && (
                      <div>
                        <h3 className="text-sm font-medium text-sage-600 mb-1">
                          Quality Rating
                        </h3>
                        <QualityBadge
                          quality={herbData.herbBatch.metadata.quality}
                        />
                      </div>
                    )}
                  </div>

                  {/* Collection Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-sage-600 mb-1">
                        Collection Date
                      </h3>
                      <div className="flex items-center space-x-2 text-sage-800">
                        <Calendar className="w-4 h-4 text-sage-500" />
                        <span>
                          {new Date(
                            herbData.herbBatch.createdAt
                          ).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-sage-600 mb-1">
                        Collector
                      </h3>
                      <div className="flex items-center space-x-2 text-sage-800">
                        <User className="w-4 h-4 text-sage-500" />
                        <span>
                          {herbData.herbBatch.User?.name ||
                            herbData.herbBatch.collectorId}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-sage-600 mb-1">
                        Location
                      </h3>
                      <div className="flex items-start space-x-2 text-sage-800">
                        <MapPin className="w-4 h-4 text-sage-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>
                            {formatLocation(
                              herbData.herbBatch.metadata?.location
                            )}
                          </p>
                          {herbData.herbBatch.metadata?.location?.latitude && (
                            <p className="text-xs text-sage-500 mt-1">
                              {herbData.herbBatch.metadata.location.latitude},{" "}
                              {herbData.herbBatch.metadata.location.longitude}
                              {herbData.herbBatch.metadata.location.altitude &&
                                ` (${herbData.herbBatch.metadata.location.altitude}m)`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-4">
                    {herbData.herbBatch.metadata?.notes && (
                      <div>
                        <h3 className="text-sm font-medium text-sage-600 mb-1">
                          Collection Notes
                        </h3>
                        <p className="text-sage-800 text-sm bg-sage-50 p-3 rounded">
                          {herbData.herbBatch.metadata.notes}
                        </p>
                      </div>
                    )}

                    {herbData.qrCodes && herbData.qrCodes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-sage-600 mb-1">
                          QR Codes
                        </h3>
                        <div className="flex items-center space-x-2 text-sage-800">
                          <QrCode className="w-4 h-4 text-sage-500" />
                          <span className="text-sm">
                            {herbData.qrCodes.length} QR code(s) available
                          </span>
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-medium text-sage-600 mb-1">
                        Blockchain Events
                      </h3>
                      <div className="flex items-center space-x-2 text-sage-800">
                        <Shield className="w-4 h-4 text-sage-500" />
                        <span className="text-sm">
                          {timelineEvents.length} blockchain event(s) recorded
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Timeline */}
            {timelineEvents.length > 0 && (
              <Timeline events={timelineEvents} title="Herb Journey Timeline" />
            )}

            {/* No Journey Data */}
            {timelineEvents.length === 0 && (
              <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8 text-center">
                <AlertCircle className="w-12 h-12 text-sage-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-sage-600 mb-2">
                  Limited Journey Information
                </h3>
                <p className="text-sage-500">
                  No detailed blockchain journey data is available for this herb
                  batch. This may indicate the herb was collected before
                  blockchain integration or there may be an issue with data
                  synchronization.
                </p>
              </div>
            )}

            {/* Trust & Safety Information */}
            <div className="bg-gradient-to-r from-mint-50 to-sage-50 rounded-lg border border-mint-200 p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">
                Trust & Safety
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sage-700 mb-2">
                    Blockchain Security
                  </h4>
                  <ul className="text-sm text-sage-600 space-y-1">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Immutable record on blockchain</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Cryptographically secured</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Tamper-proof verification</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-sage-700 mb-2">
                    Quality Assurance
                  </h4>
                  <ul className="text-sm text-sage-600 space-y-1">
                    <li className="flex items-start space-x-2">
                      <TestTube className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>Laboratory tested for quality</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Cog className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>Processed under controlled conditions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 text-mint-500 mt-0.5 flex-shrink-0" />
                      <span>Authenticated supply chain</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-6">
              <h3 className="text-lg font-semibold text-sage-800 mb-4">
                What you can do
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() =>
                    navigate(`/herbs/${herbData.herbBatch.herbId}`)
                  }
                  className="flex items-center space-x-3 p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors text-left"
                >
                  <div className="p-2 bg-mint-100 rounded-lg">
                    <Eye className="w-4 h-4 text-mint-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sage-800">
                      View Full Details
                    </p>
                    <p className="text-sm text-sage-600">
                      Complete herb information
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-3 p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors text-left"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Download className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sage-800">
                      Print Certificate
                    </p>
                    <p className="text-sm text-sage-600">
                      Verification certificate
                    </p>
                  </div>
                </button>

                <a
                  href={`mailto:support@herbtrace.com?subject=Query about ${herbData.herbBatch.herbId}`}
                  className="flex items-center space-x-3 p-4 border border-sage-200 rounded-lg hover:bg-sage-50 transition-colors text-left"
                >
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sage-800">Contact Support</p>
                    <p className="text-sm text-sage-600">Have questions?</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* How it Works */}
        {!herbData && !isLoading && !error && (
          <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8">
            <h2 className="text-xl font-semibold text-sage-800 mb-6 text-center">
              How Herb Tracing Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  <QrCode className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-sage-800 mb-2">
                  1. Scan or Enter ID
                </h3>
                <p className="text-sage-600 text-sm">
                  Use your camera to scan the QR code or manually enter the Herb
                  ID found on the package
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-sage-800 mb-2">
                  2. Blockchain Verification
                </h3>
                <p className="text-sage-600 text-sm">
                  Our system verifies the herb's authenticity using tamper-proof
                  blockchain records
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-mint-100 rounded-full mb-4">
                  <CheckCircle className="w-6 h-6 text-mint-600" />
                </div>
                <h3 className="font-semibold text-sage-800 mb-2">
                  3. View Complete Journey
                </h3>
                <p className="text-sage-600 text-sm">
                  See the complete journey from farm to your hands, including
                  quality tests and processing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraceHerb;
