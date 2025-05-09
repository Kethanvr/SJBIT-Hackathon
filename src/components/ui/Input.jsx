import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

/**
 * Input component with different variants and states
 */
const Input = forwardRef(({
  className = "",
  type = "text",
  error = "",
  icon,
  rightIcon,
  label,
  helpText,
  id,
  fullWidth = false,
  ...props
}, ref) => {
  // Generate an ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            "block rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none",
            icon ? "pl-10" : "",
            rightIcon ? "pr-10" : "",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
            fullWidth ? "w-full" : "",
            className
          )}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-description` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${inputId}-error`}>
          {error}
        </p>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500" id={`${inputId}-description`}>
          {helpText}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;