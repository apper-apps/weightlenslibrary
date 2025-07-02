import { motion } from 'framer-motion';

const LoadingSkeleton = ({ className = "" }) => (
  <motion.div
    className={`bg-gradient-to-r from-surface via-gray-200 to-surface rounded animate-pulse ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  />
);

const Loading = ({ type = "dashboard" }) => {
  if (type === "dashboard") {
    return (
      <div className="min-h-screen bg-white p-4 space-y-6">
        {/* Header skeleton */}
        <div className="text-center space-y-2">
          <LoadingSkeleton className="h-8 w-48 mx-auto" />
          <LoadingSkeleton className="h-6 w-32 mx-auto" />
        </div>

        {/* Stats skeleton */}
        <div className="bg-surface rounded-lg p-6 shadow-card space-y-4">
          <LoadingSkeleton className="h-16 w-full" />
          <div className="flex justify-between">
            <LoadingSkeleton className="h-4 w-20" />
            <LoadingSkeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Graph skeleton */}
        <div className="bg-surface rounded-lg p-6 shadow-card space-y-4">
          <LoadingSkeleton className="h-6 w-32" />
          <LoadingSkeleton className="h-48 w-full" />
        </div>

        {/* Camera button skeleton */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <LoadingSkeleton className="w-16 h-16 rounded-full" />
        </div>

        {/* Goal progress skeleton */}
        <div className="bg-surface rounded-lg p-6 shadow-card space-y-3">
          <LoadingSkeleton className="h-5 w-28" />
          <LoadingSkeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "graph") {
    return (
      <div className="space-y-4">
        <LoadingSkeleton className="h-6 w-32" />
        <LoadingSkeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default Loading;