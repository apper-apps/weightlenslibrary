import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = "",
  hover = false,
  padding = "default",
  ...props 
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    default: "p-6",
    lg: "p-8"
  };

  const baseClasses = `
    bg-white rounded-lg shadow-card border border-gray-100
    ${paddingClasses[padding]}
    ${hover ? 'hover:shadow-deep transition-shadow duration-200' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;