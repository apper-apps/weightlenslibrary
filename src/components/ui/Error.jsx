import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null,
  type = "general" 
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Please check your internet connection and try again."
        };
      case "camera":
        return {
          icon: "CameraOff",
          title: "Camera Access Error",
          description: "Unable to access camera. Please check permissions."
        };
      case "data":
        return {
          icon: "Database",
          title: "Data Error",
          description: "Failed to load your data. Please try again."
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Error",
          description: message
        };
    }
  };

  const config = getErrorConfig();

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 text-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name={config.icon} size={32} className="text-error" />
      </motion.div>

      <div className="space-y-2 max-w-sm">
        <h3 className="font-display font-semibold text-lg text-primary">
          {config.title}
        </h3>
        <p className="text-secondary text-sm leading-relaxed">
          {config.description}
        </p>
      </div>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-2"
        >
          <Button 
            onClick={onRetry}
            variant="primary"
            size="sm"
            className="min-w-24"
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-1" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Error;