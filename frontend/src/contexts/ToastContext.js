import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const ToastComponent = ({ toast, onRemove }) => {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-mint-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
      default:
        return "bg-mint-50 border-mint-200";
    }
  };

  return (
    <div
      className={`max-w-sm w-full ${getBgColor(
        toast.type
      )} border rounded-lg shadow-soft p-4 animate-slide-up`}
    >
      <div className="flex">
        <div className="flex-shrink-0">{getIcon(toast.type)}</div>
        <div className="ml-3 flex-1">
          {toast.title && (
            <p className="text-sm font-medium text-gray-900">{toast.title}</p>
          )}
          <p className="text-sm text-gray-700">{toast.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            onClick={() => onRemove(toast.id)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, newToast.duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, title = null) => {
      return addToast({ type: "success", message, title });
    },
    [addToast]
  );

  const error = useCallback(
    (message, title = null) => {
      return addToast({ type: "error", message, title });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, title = null) => {
      return addToast({ type: "warning", message, title });
    },
    [addToast]
  );

  const info = useCallback(
    (message, title = null) => {
      return addToast({ type: "info", message, title });
    },
    [addToast]
  );

  const value = {
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
