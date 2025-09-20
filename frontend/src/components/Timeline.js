import React from "react";
import {
  Calendar,
  User,
  MapPin,
  TestTube,
  Cog,
  CheckCircle,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

// === Helper functions shared by both components ===
const getEventIcon = (eventType) => {
  const icons = {
    COLLECTION: { icon: CheckCircle, color: "text-green-600" },
    QUALITY_TEST: { icon: TestTube, color: "text-blue-600" },
    PROCESSING: { icon: Cog, color: "text-purple-600" },
    DISTRIBUTION: { icon: CheckCircle, color: "text-mint-600" },
  };
  return icons[eventType] || { icon: CheckCircle, color: "text-gray-600" };
};

const getEventTitle = (event) => {
  const titles = {
    COLLECTION: "Herb Collection",
    QUALITY_TEST: "Quality Testing",
    PROCESSING: "Processing Step",
    DISTRIBUTION: "Distribution",
  };
  return titles[event.eventType] || event.eventType;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// === Main Timeline ===
const Timeline = ({ events = [], title = "Herb Journey" }) => {
  const getEventDescription = (event) => {
    const { data = {} } = event;

    switch (event.eventType) {
      case "COLLECTION":
        return `Collected by ${
          data.collectorId || "Unknown"
        } with quality rating ${data.quality || "N/A"}/5`;
      case "QUALITY_TEST":
        return `${data.testType || "Quality"} test performed. Result: ${
          data.passed ? "Passed" : "Failed"
        }`;
      case "PROCESSING":
        return `${data.stepType || "Processing"} step completed`;
      case "DISTRIBUTION":
        return "Item distributed to next stage";
      default:
        return "Event recorded on blockchain";
    }
  };

  if (!events.length) {
    return (
      <div className="bg-white rounded-lg shadow-soft border border-sage-100 p-8 text-center">
        <TestTube className="w-12 h-12 text-sage-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-sage-600 mb-2">
          No Journey Data
        </h3>
        <p className="text-sage-500">
          No blockchain events found for this herb batch.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage-100">
      {/* Header */}
      <div className="p-6 border-b border-sage-100">
        <h2 className="text-xl font-semibold text-sage-800">{title}</h2>
        <p className="text-sage-600 mt-1">
          Track the complete journey of this herb batch
        </p>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-sage-200"></div>

          {/* Events */}
          <div className="space-y-8">
            {events.map((event, index) => {
              const { icon: IconComponent, color } = getEventIcon(
                event.eventType
              );
              const isLast = index === events.length - 1;

              return (
                <div
                  key={event.id || index}
                  className="relative flex items-start"
                >
                  {/* Timeline dot */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 ${
                      event.status === "SUCCESS"
                        ? "border-green-200"
                        : event.status === "FAILED"
                        ? "border-red-200"
                        : "border-sage-200"
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 ${color}`} />
                  </div>

                  {/* Event content */}
                  <div className="flex-1 ml-6">
                    <div className="bg-sage-50 rounded-lg p-4">
                      {/* Event header */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-medium text-sage-800">
                          {getEventTitle(event)}
                        </h3>
                        <StatusBadge status={event.status} size="sm" />
                      </div>

                      {/* Event details */}
                      <p className="text-sage-600 mb-3">
                        {getEventDescription(event)}
                      </p>

                      {/* Event metadata */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {/* Timestamp */}
                        <div className="flex items-center space-x-2 text-sage-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(event.createdAt || event.timestamp)}
                          </span>
                        </div>

                        {/* Transaction ID */}
                        {event.transactionId && (
                          <div className="flex items-center space-x-2 text-sage-500">
                            <span className="font-mono text-xs">
                              TX: {event.transactionId.slice(0, 8)}...
                            </span>
                          </div>
                        )}

                        {/* Additional data based on event type */}
                        {event.data?.location && (
                          <div className="flex items-center space-x-2 text-sage-500">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {event.data.location.state || "Unknown location"}
                            </span>
                          </div>
                        )}

                        {event.data?.labId && (
                          <div className="flex items-center space-x-2 text-sage-500">
                            <User className="w-4 h-4" />
                            <span>Lab: {event.data.labId}</span>
                          </div>
                        )}

                        {event.data?.processorId && (
                          <div className="flex items-center space-x-2 text-sage-500">
                            <User className="w-4 h-4" />
                            <span>Processor: {event.data.processorId}</span>
                          </div>
                        )}
                      </div>

                      {/* Error message if failed */}
                      {event.status === "FAILED" && event.errorMessage && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-700 text-sm">
                            <strong>Error:</strong> {event.errorMessage}
                          </p>
                        </div>
                      )}

                      {/* Test results for quality tests */}
                      {event.eventType === "QUALITY_TEST" &&
                        event.data?.results && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">
                              Test Results:
                            </h4>
                            <div className="text-sm text-blue-700 space-y-1">
                              {Object.entries(event.data.results).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between"
                                  >
                                    <span className="capitalize">
                                      {key.replace(/([A-Z])/g, " $1")}:
                                    </span>
                                    <span className="font-mono">
                                      {String(value)}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* Processing conditions */}
                      {event.eventType === "PROCESSING" &&
                        event.data?.conditions && (
                          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                            <h4 className="text-sm font-medium text-purple-800 mb-2">
                              Processing Conditions:
                            </h4>
                            <div className="text-sm text-purple-700 space-y-1">
                              {Object.entries(event.data.conditions).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="flex justify-between"
                                  >
                                    <span className="capitalize">
                                      {key.replace(/([A-Z])/g, " $1")}:
                                    </span>
                                    <span className="font-mono">
                                      {String(value)}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// === Compact Timeline ===
export const TimelineCompact = ({ events = [] }) => {
  if (!events.length) {
    return (
      <div className="text-center py-8">
        <TestTube className="w-8 h-8 text-sage-300 mx-auto mb-2" />
        <p className="text-sm text-sage-500">No journey events</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event, index) => {
        const { icon: IconComponent, color } = getEventIcon(event.eventType);

        return (
          <div
            key={event.id || index}
            className="flex items-center space-x-3 p-3 bg-sage-50 rounded-lg"
          >
            <div className="flex-shrink-0">
              <IconComponent className={`w-5 h-5 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sage-800 truncate">
                {getEventTitle(event)}
              </p>
              <p className="text-xs text-sage-500">
                {new Date(
                  event.createdAt || event.timestamp
                ).toLocaleDateString()}
              </p>
            </div>
            <StatusBadge status={event.status} size="sm" showIcon={false} />
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
