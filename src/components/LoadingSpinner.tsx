import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("animate-spin", sizeClasses[size], className)}>
      <svg viewBox="0 0 50 50" className="text-primary">
        <circle
          className="opacity-30"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
        />
        <circle
          className="opacity-80"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset="75"
        />
      </svg>
    </div>
  );
};

export const LoadingSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="bg-muted rounded-lg aspect-square mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-6 bg-muted rounded w-1/4"></div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-4 space-y-4 animate-pulse">
      <div className="aspect-square bg-muted rounded-lg"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-6 bg-muted rounded w-1/4"></div>
      </div>
    </div>
  );
};
