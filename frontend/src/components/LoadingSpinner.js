import React from "react";

const LoadingSpinner = ({
  size = "md",
  color = "mint",
  text = null,
  className = "",
}) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colors = {
    mint: "border-mint-200 border-t-mint-500",
    sage: "border-sage-200 border-t-sage-500",
    white: "border-gray-300 border-t-white",
    gray: "border-gray-200 border-t-gray-500",
  };

  const spinnerClasses = `
    ${sizes[size]} 
    ${colors[color]} 
    border-2 
    border-solid 
    rounded-full 
    animate-spin
    ${className}
  `.trim();

  if (text) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className={spinnerClasses}></div>
        <p className="text-sm text-sage-600 animate-pulse">{text}</p>
      </div>
    );
  }

  return <div className={spinnerClasses}></div>;
};

// Fullscreen loading component
export const FullScreenLoader = ({ text = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-cream-50 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="xl" text={text} />
      </div>
    </div>
  );
};

// Inline loading component for buttons
export const ButtonSpinner = ({ className = "" }) => {
  return (
    <LoadingSpinner size="sm" color="white" className={`mr-2 ${className}`} />
  );
};

// Card loading skeleton
export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-sage-200 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-4 bg-sage-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-sage-100 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-sage-200 rounded"></div>
        <div className="h-3 bg-sage-200 rounded w-5/6"></div>
        <div className="h-3 bg-sage-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

// Table loading skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      {/* Header */}
      <div className="bg-sage-50 p-4 border-b border-sage-100">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-sage-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="p-4 border-b border-sage-50 last:border-b-0"
        >
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-sage-100 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
