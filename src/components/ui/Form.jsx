// filepath: c:\Users\Kethan\Documents\projects\Main-Projects\MediScan\src\components\ui\Form.jsx
import React, { useState, useCallback } from 'react';
import { useProTheme } from '../../utils/useProTheme';
import FormField from './FormField';
import Button from './Button';
import Card from './Card';
import { cn } from '../../utils/cn';

/**
 * Form Container Component
 * 
 * A wrapper for form elements with standardized styling and behavior.
 * 
 * Props:
 * @param {Function} onSubmit - Form submission handler
 * @param {ReactNode} children - Form fields and controls
 * @param {string} className - Additional CSS classes
 * @param {boolean} loading - Whether the form is in a loading state
 * @param {string} submitLabel - Submit button text
 * @param {string} resetLabel - Reset button text
 * @param {boolean} showReset - Whether to show a reset button
 * @param {boolean} useCard - Whether to wrap the form in a Card component
 */
export const Form = ({
  onSubmit,
  children,
  className = '',
  loading = false,
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  showReset = false,
  useCard = false,
  ...props
}) => {
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit && onSubmit(e);
  }, [onSubmit]);

  const formContent = (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)} {...props}>
      {children}
    </form>
  );

  if (useCard) {
    return <Card>{formContent}</Card>;
  }

  return formContent;
};

/**
 * Form Group Component
 * 
 * A container for grouping related form fields with consistent spacing.
 */
export const FormGroup = ({ children, className = '', ...props }) => (
  <div className={cn("space-y-4", className)} {...props}>
    {children}
  </div>
);

/**
 * Form Actions Component
 * 
 * A container for form action buttons with consistent layout and styling.
 */
export const FormActions = ({ 
  children, 
  className = '', 
  align = 'right',
  ...props 
}) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div 
      className={cn(
        "flex mt-6 space-x-3", 
        alignmentClasses[align] || 'justify-end',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Form Submit Button Component
 * 
 * A standardized submit button for forms.
 */
export const FormSubmit = ({ 
  className = '', 
  children = 'Submit', 
  isLoading = false,
  ...props 
}) => {
  const { isPro } = useProTheme();
  
  return (
    <Button 
      type="submit"
      variant="theme"
      isLoading={isLoading}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

/**
 * Form Reset Button Component
 * 
 * A standardized reset button for forms.
 */
export const FormReset = ({ 
  className = '', 
  children = 'Reset', 
  onClick,
  ...props 
}) => {
  return (
    <Button 
      type="button"
      variant="outline"
      onClick={onClick}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

/**
 * Form Builder - a helper for creating forms with validation
 * 
 * The useForm hook allows for easy creation and management of form state,
 * including validation, error handling, and submission.
 * 
 * Usage:
 * const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
 *   initialValues: { email: '', password: '' },
 *   validate: (values) => {
 *     const errors = {};
 *     if (!values.email) errors.email = 'Required';
 *     return errors;
 *   },
 *   onSubmit: async (values) => {
 *     await submitToApi(values);
 *   },
 * });
 */
export const useForm = ({
  initialValues = {},
  validate,
  onSubmit,
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Run validation and return any errors
  const validateForm = useCallback(() => {
    if (!validate) return {};
    
    const validationErrors = validate(values);
    setErrors(validationErrors || {});
    return validationErrors || {};
  }, [values, validate]);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  }, []);

  // Handle field blur for validation
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate on blur for better UX
    validateForm();
  }, [validateForm]);

  // Form submission handler
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    // Mark all fields as touched for validation
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    // Validate before submission
    const validationErrors = validateForm();
    
    // Only submit if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        // You could add custom error handling here
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  // Reset the form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set a specific field value programmatically
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isSubmitting,
    setFieldValue,
    setValues,
  };
};

// Export Form components as a unified object
export default {
  Form,
  FormGroup,
  FormActions,
  FormSubmit,
  FormReset,
  FormField,
  useForm,
};
