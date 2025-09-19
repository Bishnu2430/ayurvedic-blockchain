import React, { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = "",
}) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative bg-white rounded-lg shadow-xl transform transition-all
            w-full ${sizes[size]} ${className}
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-sage-100">
              {title && (
                <h3 className="text-lg font-semibold text-sage-800">{title}</h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-sage-400 hover:text-sage-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Confirmation modal
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonClass = "bg-red-500 hover:bg-red-600 text-white",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-sage-700">{message}</p>

        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sage-600 border border-sage-300 rounded-lg hover:bg-sage-50 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center
              ${confirmButtonClass}
            `}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Success modal
export const SuccessModal = ({
  isOpen,
  onClose,
  title = "Success!",
  message,
  buttonText = "Continue",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <p className="text-sage-700">{message}</p>

        <button
          onClick={onClose}
          className="w-full bg-mint-500 text-white py-2 px-4 rounded-lg hover:bg-mint-600 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};

// Error modal
export const ErrorModal = ({
  isOpen,
  onClose,
  title = "Error",
  message,
  buttonText = "Try Again",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <X className="w-8 h-8 text-red-500" />
        </div>

        <p className="text-sage-700">{message}</p>

        <button
          onClick={onClose}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </Modal>
  );
};

// Loading modal
export const LoadingModal = ({ isOpen, message = "Loading..." }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Prevent closing
      showCloseButton={false}
      closeOnOverlayClick={false}
      size="sm"
    >
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-mint-200 border-t-mint-500 rounded-full animate-spin mx-auto" />
        <p className="text-sage-700">{message}</p>
      </div>
    </Modal>
  );
};

export default Modal;
