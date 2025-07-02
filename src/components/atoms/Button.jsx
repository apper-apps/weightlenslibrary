import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  loading = false,
  className = "",
  onClick,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-accent hover:bg-accent/90 text-white focus:ring-accent shadow-md hover:shadow-lg",
    secondary: "bg-surface hover:bg-gray-200 text-primary focus:ring-gray-300 border border-gray-200",
    ghost: "bg-transparent hover:bg-surface text-primary focus:ring-gray-300",
    danger: "bg-error hover:bg-error/90 text-white focus:ring-error shadow-md hover:shadow-lg"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    xl: "px-8 py-4 text-lg h-14"
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading ? (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : null}
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;