import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  type = "general",
  onAction = null,
  actionLabel = "Get Started"
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case "weight":
        return {
          icon: "Scale",
          title: "No Weight Data Yet",
          description: "Start tracking your weight to see your progress over time.",
          illustration: "Add your first weight entry to begin your journey."
        };
      case "meals":
        return {
          icon: "Camera",
          title: "No Meals Captured",
          description: "Use the camera to capture your meals and estimate portions.",
          illustration: "Tap the camera button to take your first meal photo."
        };
      case "goals":
        return {
          icon: "Target",
          title: "Set Your Goal",
          description: "Define your target weight to track progress and get personalized tips.",
          illustration: "Setting a goal helps you stay motivated and focused."
        };
      default:
        return {
          icon: "FileText",
          title: "No Data Available",
          description: "Get started by adding some information.",
          illustration: "Your data will appear here once you begin tracking."
        };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 150 }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center relative">
          <ApperIcon name={config.icon} size={40} className="text-accent" />
          <motion.div
            className="absolute inset-0 border-2 border-accent/30 rounded-full"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      <div className="space-y-3 max-w-sm">
        <motion.h3
          className="font-display font-semibold text-xl text-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {config.title}
        </motion.h3>
        
        <motion.p
          className="text-secondary text-sm leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {config.description}
        </motion.p>
        
        <motion.p
          className="text-secondary/80 text-xs italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {config.illustration}
        </motion.p>
      </div>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={onAction}
            variant="primary"
            size="md"
            className="shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;