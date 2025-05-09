// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\ui\FormField.jsx
import React, { forwardRef } from 'react';
import { useProTheme } from '../../utils/useProTheme';
import { cn } from '../../utils/cn';

/**
 * FormField Component
 * 
 * A reusable form field component that handles input styling, labels, 
 * error messages, and other common form field features.
 * 
 * Props:
 * @param {string} id - Unique identifier for the input
 * @param {string} name - Input name attribute
 * @param {string} label - Field label
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} placeholder - Input placeholder
 * @param {string} helperText - Additional guidance text below the input
 * @param {string} error - Error message to display
 * @param {boolean} required - Whether the field is required
 * @param {boolean} disabled - Whether the field is disabled
 * @param {Function} onChange - Change handler function
 * @param {Function} onBlur - Blur handler function
 * @param {string} className - Additional CSS classes for the input
 */
const FormField = forwardRef(({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false,
  onChange,
  onBlur,
  className = '',
  value,
  ...props
}, ref) => {
  const { isPro, theme } = useProTheme();
  const fieldId = id || name;
  const hasError = !!error;
  // Generate appropriate input classes based on state
  const inputClasses = cn(
    "w-full px-3 py-2 border rounded-lg text-base focus:outline-none transition-colors",
    {
      // Default state
      "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200": 
        !hasError,
      
      // Error state
      "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-200": 
        hasError,
      
      // Disabled state
      "bg-gray-100 text-gray-500 cursor-not-allowed": 
        disabled,
    },
    className
  );

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={fieldId}
          className={cn(
            "block text-sm font-medium mb-1",
            hasError ? "text-red-600" : "text-gray-700"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {type === 'textarea' ? (
        <textarea
          id={fieldId}
          name={name}
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          value={value}
          {...props}
        />
      ) : type === 'select' ? (
        <select
          id={fieldId}
          name={name}
          ref={ref}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          value={value}
          {...props}
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClasses}
          value={value}
          {...props}
        />
      )}
      
      {/* Helper text or error message */}
      {(helperText || error) && (
        <div className="mt-1 text-sm">
          {hasError ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <p className="text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;

/**
 * Form Input Component
 * A specialized FormField for standard text inputs
 */
export const FormInput = forwardRef((props, ref) => (
  <FormField ref={ref} type="text" {...props} />
));
FormInput.displayName = 'FormInput';

/**
 * Form Textarea Component
 * A specialized FormField for multiline text input
 */
export const FormTextarea = forwardRef((props, ref) => (
  <FormField ref={ref} type="textarea" {...props} />
));
FormTextarea.displayName = 'FormTextarea';

/**
 * Form Select Component
 * A specialized FormField for dropdown selection
 */
export const FormSelect = forwardRef(({ children, ...props }, ref) => (
  <FormField ref={ref} type="select" {...props}>
    {children}
  </FormField>
));
FormSelect.displayName = 'FormSelect';

/**
 * Form Checkbox Component
 * A specialized component for checkbox inputs
 */
export const FormCheckbox = forwardRef(({
  id,
  name,
  label,
  helperText,
  error,
  disabled = false,
  onChange,
  onBlur,
  checked,
  className = '',
  ...props
}, ref) => {
  const { isPro } = useProTheme();
  const fieldId = id || name;
  const hasError = !!error;

  return (
    <div className="mb-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={fieldId}
            name={name}
            type="checkbox"
            ref={ref}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            checked={checked}            className={cn(
              "h-4 w-4 rounded border-gray-300 focus:ring-2 focus:outline-none",
              {
                "text-blue-600 focus:ring-blue-200": !hasError,
                "text-red-600 focus:ring-red-200 border-red-300": hasError,
                "bg-gray-100 text-gray-500 cursor-not-allowed": disabled,
              },
              className
            )}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          {label && (
            <label 
              htmlFor={fieldId}
              className={cn(
                "font-medium",
                hasError ? "text-red-600" : "text-gray-700" 
              )}
            >
              {label}
            </label>
          )}
          {helperText && (
            <p className="text-gray-500">{helperText}</p>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});
FormCheckbox.displayName = 'FormCheckbox';

/**
 * Form Radio Group Component
 * A group of radio buttons with shared name
 */
export const FormRadioGroup = forwardRef(({
  id,
  name,
  label,
  options = [],
  helperText,
  error,
  disabled = false,
  onChange,
  onBlur,
  value,
  className = '',
  ...props
}, ref) => {
  const { isPro } = useProTheme();
  const groupId = id || name;
  const hasError = !!error;

  return (
    <div className="mb-4">
      {label && (
        <label 
          className={cn(
            "block text-sm font-medium mb-2",
            hasError ? "text-red-600" : "text-gray-700"
          )}
        >
          {label}
        </label>
      )}
      
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${groupId}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              disabled={disabled || option.disabled}
              onChange={onChange}
              onBlur={onBlur}              className={cn(
                "h-4 w-4 border-gray-300 focus:ring-2 focus:outline-none",
                {
                  "text-blue-600 focus:ring-blue-200": !hasError,
                  "text-red-600 focus:ring-red-200 border-red-300": hasError,
                  "bg-gray-100 text-gray-500 cursor-not-allowed": disabled || option.disabled,
                }
              )}
              ref={ref}
              {...props}
            />
            <label
              htmlFor={`${groupId}-${option.value}`}
              className={cn(
                "ml-2 block text-sm",
                (disabled || option.disabled) ? "text-gray-500" : "text-gray-700"
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      
      {/* Helper text or error message */}
      {(helperText || error) && (
        <div className="mt-1 text-sm">
          {hasError ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <p className="text-gray-500">{helperText}</p>
          )}
        </div>
      )}
    </div>
  );
});
FormRadioGroup.displayName = 'FormRadioGroup';
