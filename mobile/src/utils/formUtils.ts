import { appConfig } from '../config/appConfig';

// Types for form validation
export interface ValidationRule {
  validate: (value: any) => boolean;
  message: string;
}

export interface FieldValidation {
  [key: string]: ValidationRule[];
}

export interface FormErrors {
  [key: string]: string[];
}

export interface FormTouched {
  [key: string]: boolean;
}

// Common validation rules
export const ValidationRules = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    validate: (value: any) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return value !== null && value !== undefined;
    },
    message,
  }),

  email: (message: string = 'Please enter a valid email address'): ValidationRule => ({
    validate: (value: string) => {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(value);
    },
    message,
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length >= length,
    message: message || `Must be at least ${length} characters`,
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    validate: (value: string) => value.length <= length,
    message: message || `Must be no more than ${length} characters`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value: string) => regex.test(value),
    message,
  }),
};

// Form validation utility
export const FormValidator = {
  // Validate a single field
  validateField: (value: any, rules: ValidationRule[]): string[] => {
    const errors: string[] = [];
    rules.forEach(rule => {
      if (!rule.validate(value)) {
        errors.push(rule.message);
      }
    });
    return errors;
  },

  // Validate entire form
  validateForm: (values: { [key: string]: any }, validations: FieldValidation): FormErrors => {
    const errors: FormErrors = {};
    Object.keys(validations).forEach(key => {
      const fieldErrors = FormValidator.validateField(values[key], validations[key]);
      if (fieldErrors.length > 0) {
        errors[key] = fieldErrors;
      }
    });
    return errors;
  },

  // Check if form has errors
  hasErrors: (errors: FormErrors): boolean => {
    return Object.keys(errors).length > 0;
  },
};

// Form state management utilities
export const FormStateManager = {
  // Initialize form state
  initializeState: (fields: string[]) => ({
    values: fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}),
    errors: {},
    touched: fields.reduce((acc, field) => ({ ...acc, [field]: false }), {}),
  }),

  // Handle field change
  handleChange: (
    field: string,
    value: any,
    currentState: any,
    validations: FieldValidation
  ) => {
    const newValues = { ...currentState.values, [field]: value };
    const fieldErrors = FormValidator.validateField(value, validations[field] || []);
    const newErrors = { ...currentState.errors, [field]: fieldErrors };
    
    return {
      values: newValues,
      errors: newErrors,
      touched: { ...currentState.touched, [field]: true },
    };
  },
};

// Rate limiting for form submissions
export const RateLimiter = {
  attempts: new Map<string, number>(),
  timestamps: new Map<string, number>(),

  canSubmit: (formId: string): boolean => {
    const now = Date.now();
    const lastAttempt = RateLimiter.timestamps.get(formId) || 0;
    const attempts = RateLimiter.attempts.get(formId) || 0;
    const { maxAttempts, timeWindow } = appConfig.contactConfig.rateLimit;

    // Reset attempts if time window has passed
    if (now - lastAttempt > timeWindow) {
      RateLimiter.attempts.set(formId, 0);
      RateLimiter.timestamps.set(formId, now);
      return true;
    }

    // Check if max attempts reached
    if (attempts >= maxAttempts) {
      return false;
    }

    // Increment attempts
    RateLimiter.attempts.set(formId, attempts + 1);
    RateLimiter.timestamps.set(formId, now);
    return true;
  },

  getRemainingTime: (formId: string): number => {
    const lastAttempt = RateLimiter.timestamps.get(formId) || 0;
    const { timeWindow } = appConfig.contactConfig.rateLimit;
    const now = Date.now();
    return Math.max(0, timeWindow - (now - lastAttempt));
  },
};

// Common form validations
export const CommonValidations = {
  name: [
    ValidationRules.required(),
    ValidationRules.minLength(appConfig.contactConfig.validation.nameMinLength),
    ValidationRules.maxLength(appConfig.contactConfig.validation.nameMaxLength),
  ],
  email: [
    ValidationRules.required(),
    ValidationRules.email(),
  ],
  message: [
    ValidationRules.required(),
    ValidationRules.minLength(appConfig.contactConfig.validation.messageMinLength),
    ValidationRules.maxLength(appConfig.contactConfig.validation.messageMaxLength),
  ],
};

export default {
  Rules: ValidationRules,
  Validator: FormValidator,
  StateManager: FormStateManager,
  RateLimiter,
  CommonValidations,
};
