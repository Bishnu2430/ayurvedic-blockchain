import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Scan, AlertCircle } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

const QRScanner = ({ onScanResult, onClose, isOpen = false }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Check for camera availability
  useEffect(() => {
    checkCameraAvailability();
  }, []);

  // Handle modal open/close
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen]);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setHasCamera(videoDevices.length > 0);
    } catch (error) {
      console.error("Error checking camera availability:", error);
      setHasCamera(false);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      setError(
        "Unable to access camera. Please check permissions or try uploading an image."
      );
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imageData = e.target.result;
        await processQRCode(imageData);
      } catch (error) {
        toast.error("Failed to process image");
      }
    };
    reader.readAsDataURL(file);
  };

  const processQRCode = async (imageData) => {
    try {
      // This is a simplified QR code processing
      // In a real implementation, you'd use a QR code library like jsqr

      // For demo purposes, we'll simulate QR code detection
      // You would typically use: import jsQR from "jsqr";

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock QR code data - replace with actual QR detection
      const mockQRData = {
        herbId: "ASH1234567890",
        type: "herb_traceability",
        url: `${window.location.origin}/trace/ASH1234567890`,
      };

      onScanResult(JSON.stringify(mockQRData));
      toast.success("QR code scanned successfully!");
    } catch (error) {
      console.error("QR processing error:", error);
      toast.error("Failed to read QR code from image");
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg");

      await processQRCode(imageData);
    } catch (error) {
      toast.error("Failed to capture image");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sage-100">
          <h2 className="text-lg font-semibold text-sage-800">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="text-sage-400 hover:text-sage-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Camera View */}
          {hasCamera && !error && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-black rounded-lg object-cover"
              />

              {/* Scanning overlay */}
              <div className="absolute inset-4 border-2 border-mint-400 rounded-lg">
                <div className="absolute inset-0 border border-dashed border-mint-300 rounded-lg animate-pulse">
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-mint-400"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-mint-400"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-mint-400"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-mint-400"></div>
                </div>
              </div>

              {/* Capture button */}
              {isScanning && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={captureFrame}
                    className="bg-mint-500 text-white p-3 rounded-full hover:bg-mint-600 transition-colors shadow-lg"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* File upload option */}
          <div className="border-t border-sage-100 pt-4">
            <p className="text-sm text-sage-600 mb-3 text-center">
              Or upload an image containing a QR code
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center space-x-2 bg-sage-100 text-sage-700 py-3 px-4 rounded-lg hover:bg-sage-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 text-sm mb-2">
              How to scan:
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Point your camera at the QR code</li>
              <li>• Make sure the QR code is clearly visible</li>
              <li>• Tap the camera button to capture</li>
              <li>• Or upload an image with the QR code</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple QR scanner button
export const QRScannerButton = ({ onScanResult, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleScanResult = (result) => {
    setIsOpen(false);
    onScanResult(result);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 px-4 py-2 bg-mint-500 text-white rounded-lg hover:bg-mint-600 transition-colors ${className}`}
      >
        <Scan className="w-4 h-4" />
        <span>Scan QR</span>
      </button>

      <QRScanner
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onScanResult={handleScanResult}
      />
    </>
  );
};

// Inline scanner component
export const InlineQRScanner = ({ onScanResult, height = "h-64" }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startScanning = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      setError("Camera access denied");
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => stopScanning();
  }, []);

  if (error) {
    return (
      <div
        className={`${height} bg-red-50 rounded-lg flex items-center justify-center border border-red-200`}
      >
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!isScanning) {
    return (
      <div
        className={`${height} bg-sage-50 rounded-lg flex items-center justify-center border border-sage-200`}
      >
        <button
          onClick={startScanning}
          className="flex flex-col items-center space-y-2 text-sage-600 hover:text-mint-600 transition-colors"
        >
          <Camera className="w-12 h-12" />
          <span className="text-sm font-medium">Start Camera</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`${height} relative rounded-lg overflow-hidden bg-black`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-4 border-2 border-mint-400 rounded-lg">
        <div className="absolute inset-0 border border-dashed border-mint-300 rounded-lg animate-pulse"></div>
      </div>

      <button
        onClick={stopScanning}
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QRScanner;
