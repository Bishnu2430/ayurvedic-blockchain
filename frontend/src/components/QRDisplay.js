import React, { useState } from "react";
import { Download, Copy, Share2, QrCode, ExternalLink } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

const QRDisplay = ({ qrCode, herbId, onClose }) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    if (!qrCode.image) return;

    try {
      const link = document.createElement("a");
      link.download = `herbtrace-qr-${herbId}.png`;
      link.href = qrCode.image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR code downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download QR code");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HerbTrace - ${herbId}`,
          text: `View herb traceability information for ${herbId}`,
          url: window.location.origin + `/trace/${herbId}`,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      const url = window.location.origin + `/trace/${herbId}`;
      await handleCopy(url);
    }
  };

  const qrData = qrCode.data ? JSON.parse(qrCode.data) : {};

  return (
    <div className="space-y-6">
      {/* QR Code Display */}
      <div className="text-center">
        <div className="inline-block p-4 bg-white rounded-lg border-2 border-sage-200 shadow-lg">
          {qrCode.image ? (
            <img
              src={qrCode.image}
              alt={`QR Code for ${herbId}`}
              className="w-64 h-64 mx-auto"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-sage-50 rounded-lg">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-sage-300 mx-auto mb-2" />
                <p className="text-sage-500">QR Code not available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Herb Information */}
      <div className="bg-sage-50 rounded-lg p-4">
        <h3 className="font-medium text-sage-800 mb-3">Herb Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-sage-600">Herb ID:</span>
            <span className="font-mono text-sage-800">{herbId}</span>
          </div>
          {qrData.type && (
            <div className="flex justify-between">
              <span className="text-sage-600">Type:</span>
              <span className="text-sage-800 capitalize">
                {qrData.type.replace(/_/g, " ")}
              </span>
            </div>
          )}
          {qrData.url && (
            <div className="flex justify-between items-center">
              <span className="text-sage-600">Trace URL:</span>
              <a
                href={qrData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-mint-600 hover:text-mint-700 flex items-center space-x-1"
              >
                <span>View</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* QR Data Display */}
      {qrCode.data && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sage-800">QR Code Data</h3>
            <button
              onClick={() => handleCopy(qrCode.data)}
              className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                copied
                  ? "bg-green-100 text-green-700"
                  : "bg-sage-100 text-sage-700 hover:bg-sage-200"
              }`}
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <pre className="text-xs text-sage-600 bg-white p-3 rounded border overflow-x-auto">
            {JSON.stringify(JSON.parse(qrCode.data), null, 2)}
          </pre>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleDownload}
          disabled={!qrCode.image}
          className="flex-1 flex items-center justify-center space-x-2 bg-mint-500 text-white py-2 px-4 rounded-lg hover:bg-mint-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center space-x-2 bg-sage-500 text-white py-2 px-4 rounded-lg hover:bg-sage-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">
          How to use this QR Code:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Print this QR code and attach it to the herb package</li>
          <li>
            • Consumers can scan it to view the complete traceability
            information
          </li>
          <li>• The QR code links to a secure blockchain-verified journey</li>
          <li>• Each scan is logged for tracking and analytics</li>
        </ul>
      </div>
    </div>
  );
};

// Mini QR display for inline use
export const QRMini = ({ qrCode, herbId, size = "sm" }) => {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  if (!qrCode?.image) {
    return (
      <div
        className={`${sizes[size]} bg-sage-100 rounded-lg flex items-center justify-center`}
      >
        <QrCode className="w-6 h-6 text-sage-400" />
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} border-2 border-sage-200 rounded-lg overflow-hidden`}
    >
      <img
        src={qrCode.image}
        alt={`QR Code for ${herbId}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

// QR code with download button
export const QRWithDownload = ({ qrCode, herbId }) => {
  const toast = useToast();

  const handleDownload = () => {
    if (!qrCode.image) return;

    try {
      const link = document.createElement("a");
      link.download = `herbtrace-qr-${herbId}.png`;
      link.href = qrCode.image;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR code downloaded!");
    } catch (error) {
      toast.error("Failed to download QR code");
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <QRMini qrCode={qrCode} herbId={herbId} size="md" />
      <div className="flex-1">
        <h4 className="text-sm font-medium text-sage-800 mb-1">QR Code</h4>
        <p className="text-xs text-sage-600 mb-2">
          Scan to view herb traceability
        </p>
        <button
          onClick={handleDownload}
          disabled={!qrCode.image}
          className="flex items-center space-x-1 text-xs bg-mint-100 text-mint-700 px-2 py-1 rounded hover:bg-mint-200 disabled:opacity-50 transition-colors"
        >
          <Download className="w-3 h-3" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default QRDisplay;
