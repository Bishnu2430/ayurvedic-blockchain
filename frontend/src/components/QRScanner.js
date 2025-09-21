import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Scan, AlertCircle } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import jsQR from "jsqr";

const QRScanner = ({ onScanResult, onClose, isOpen = false }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  // Check camera availability
  useEffect(() => {
    checkCameraAvailability();
  }, []);

  useEffect(() => {
    if (isOpen) startCamera();
    else stopCamera();

    return () => stopCamera();
  }, [isOpen]);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setHasCamera(videoDevices.length > 0);
    } catch (err) {
      console.error(err);
      setHasCamera(false);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1280, height: 720 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      requestAnimationFrame(scanFrame); // Start real-time scanning
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        "Unable to access camera. Check permissions or try uploading an image."
      );
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    setIsScanning(false);
  };

  const scanFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        try {
          const qrData = JSON.parse(code.data);
          onScanResult(JSON.stringify(qrData));
          toast.success("QR code scanned successfully!");
          stopCamera(); // Stop after successful scan
          return;
        } catch (err) {
          console.error("QR parse error:", err);
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        await processQRCode(e.target.result);
      } catch {
        toast.error("Failed to process image");
      }
    };
    reader.readAsDataURL(file);
  };

  const processQRCode = async (imageData) => {
    try {
      const img = new Image();
      img.src = imageData;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageDataObj = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(
        imageDataObj.data,
        imageDataObj.width,
        imageDataObj.height
      );

      if (!code) {
        toast.error("No QR code detected in image");
        return;
      }

      const qrData = JSON.parse(code.data);
      onScanResult(JSON.stringify(qrData));
      toast.success("QR code scanned successfully!");
    } catch (err) {
      console.error("QR processing error:", err);
      toast.error("Failed to read QR code");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-sage-100">
          <h2 className="text-lg font-semibold text-sage-800">Scan QR Code</h2>
          <button
            onClick={onClose}
            className="text-sage-400 hover:text-sage-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {hasCamera && !error && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 bg-black rounded-lg object-cover"
              />
              <div className="absolute inset-4 border-2 border-mint-400 rounded-lg">
                <div className="absolute inset-0 border border-dashed border-mint-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

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
        </div>
      </div>
    </div>
  );
};

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

export default QRScanner;
