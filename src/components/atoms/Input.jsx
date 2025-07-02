import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const Input = forwardRef(({ 
  label,
  error,
  type = "text",
  className = "",
  required = false,
  ...props 
}, ref) => {
  const inputClasses = `
    w-full px-4 py-3 border rounded-lg 
    font-body text-primary placeholder-secondary/60
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
    ${error ? 'border-error ring-1 ring-error/20' : 'border-gray-300 hover:border-gray-400'}
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <motion.input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.15 }}
      />
      
      {error && (
        <motion.p
          className="text-sm text-error"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;