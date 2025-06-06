interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <svg
        className="text-blue-600 dark:text-blue-400"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading content">
      <div className="bg-gray-300 dark:bg-gray-700 rounded-lg aspect-square mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4 animate-pulse bg-white dark:bg-gray-800"
      role="status"
      aria-label="Loading product"
    >
      <div className="aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export const ProductDetailSkeleton = () => {
  return (
    <div
      className="animate-pulse"
      role="status"
      aria-label="Loading product details"
    >
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Image skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-300 dark:bg-gray-700 rounded-lg"
              ></div>
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          </div>

          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
