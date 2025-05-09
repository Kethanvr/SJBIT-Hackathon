import { useState, useEffect, useCallback } from 'react';
import { validateField } from '../utils/validation/formValidation';

/**
 * Custom hook for managing form state and validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for each field
 * @param {Function} onSubmit - Form submission handler
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationRules = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate all fields and update form validity
  const validateForm = useCallback(() => {
    const newErrors = {};
    let formIsValid = true;
    
    // Validate each field with rules
    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(
        fieldName,
        values[fieldName],
        validationRules[fieldName]
      );
      
      if (error) {
        newErrors[fieldName] = error;
        formIsValid = false;
      }
    });
    
    setErrors(newErrors);
    setIsValid(formIsValid);
    return formIsValid;
  }, [values, validationRules]);
  
  // Validate form whenever values change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [values, validateForm, touched]);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
  }, []);
  
  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
  }, []);
  
  // Set a specific field value
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
  }, []);
  
  // Set a specific field error
  const setFieldError = useCallback((name, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  }, []);
  
  // Reset the form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce(
      (acc, field) => ({ ...acc, [field]: true }),
      {}
    );
    setTouched(allTouched);
    
    const formIsValid = validateForm();
    if (!formIsValid) return;
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationRules, validateForm, onSubmit]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm
  };
};