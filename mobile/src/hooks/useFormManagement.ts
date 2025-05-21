import { useState, useCallback, useEffect } from 'react';
import { FormValidator, FormStateManager, RateLimiter } from '../utils/formUtils';
import type { FieldValidation, FormErrors, FormTouched } from '../utils/formUtils';
import { appConfig } from '../config/appConfig';

interface FormConfig {
  initialValues: { [key: string]: any };
  validations: FieldValidation;
  onSubmit: (values: { [key: string]: any }) => Promise<void>;
  formId?: string;
}

interface FormState {
  values: { [key: string]: any };
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
  submitCount: number;
  submitStatus: 'idle' | 'success' | 'error' | null;
  isValid: boolean;
}

export const useFormManagement = ({
  initialValues,
  validations,
  onSubmit,
  formId = 'default',
}: FormConfig) => {
  // Form state
  const [formState, setFormState] = useState<FormState>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    submitCount: 0,
    submitStatus: null,
    isValid: true,
  });

  // Reset timer for success/error messages
  const [messageTimer, setMessageTimer] = useState<NodeJS.Timeout | null>(null);

  // Validate form when values change
  useEffect(() => {
    const errors = FormValidator.validateForm(formState.values, validations);
    setFormState(prev => ({
      ...prev,
      errors,
      isValid: Object.keys(errors).length === 0,
    }));
  }, [formState.values]);

  // Clear status messages after delay
  useEffect(() => {
    if (formState.submitStatus && formState.submitStatus !== 'idle') {
      const timer = setTimeout(() => {
        setFormState(prev => ({ ...prev, submitStatus: 'idle' }));
      }, 5000);
      setMessageTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [formState.submitStatus]);

  // Handle field change
  const handleChange = useCallback((field: string, value: any) => {
    setFormState(prev => {
      const newState = FormStateManager.handleChange(
        field,
        value,
        prev,
        validations
      );
      return {
        ...prev,
        ...newState,
        submitStatus: 'idle',
      };
    });
  }, [validations]);

  // Handle field blur
  const handleBlur = useCallback((field: string) => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [field]: true },
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    // Check rate limiting
    if (!RateLimiter.canSubmit(formId)) {
      const remainingTime = RateLimiter.getRemainingTime(formId);
      setFormState(prev => ({
        ...prev,
        submitStatus: 'error',
        errors: {
          ...prev.errors,
          form: [`Please wait ${Math.ceil(remainingTime / 1000)} seconds before trying again`],
        },
      }));
      return;
    }

    // Validate all fields
    const errors = FormValidator.validateForm(formState.values, validations);
    setFormState(prev => ({
      ...prev,
      errors,
      touched: Object.keys(prev.values).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
      isValid: Object.keys(errors).length === 0,
    }));

    // Don't submit if there are errors
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({
        ...prev,
        submitStatus: 'error',
        errors: {
          ...errors,
          form: ['Please fix the errors before submitting'],
        },
      }));
      return;
    }

    // Submit the form
    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      submitCount: prev.submitCount + 1,
    }));

    try {
      await onSubmit(formState.values);
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitStatus: 'success',
        values: initialValues, // Reset form on success
        touched: {},
      }));
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitStatus: 'error',
        errors: {
          ...prev.errors,
          form: [(error as Error).message || 'An error occurred while submitting the form'],
        },
      }));
    }
  }, [formState.values, validations, initialValues, onSubmit, formId]);

  // Reset form
  const resetForm = useCallback(() => {
    if (messageTimer) {
      clearTimeout(messageTimer);
    }
    setFormState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      submitCount: 0,
      submitStatus: null,
      isValid: true,
    });
  }, [initialValues, messageTimer]);

  // Get field props
  const getFieldProps = useCallback((field: string) => ({
    value: formState.values[field],
    onChange: (value: any) => handleChange(field, value),
    onBlur: () => handleBlur(field),
    error: formState.touched[field] ? formState.errors[field] : undefined,
  }), [formState, handleChange, handleBlur]);

  return {
    ...formState,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldProps,
  };
};

export default useFormManagement;
