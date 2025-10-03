// src/lib/utils/textbox-validation.ts

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: true }; // Empty is valid unless required
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  
  return {
    isValid,
    error: isValid ? undefined : 'Please enter a valid email address'
  };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: true };
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  const isValid = digitsOnly.length >= 10 && digitsOnly.length <= 15;
  
  return {
    isValid,
    error: isValid ? undefined : 'Please enter a valid phone number'
  };
};

export const validateNumber = (value: string, min?: number, max?: number): ValidationResult => {
  if (!value.trim()) {
    return { isValid: true };
  }
  
  const num = parseFloat(value);
  
  if (isNaN(num)) {
    return {
      isValid: false,
      error: 'Please enter a valid number'
    };
  }
  
  if (min !== undefined && num < min) {
    return {
      isValid: false,
      error: `Number must be at least ${min}`
    };
  }
  
  if (max !== undefined && num > max) {
    return {
      isValid: false,
      error: `Number must be no more than ${max}`
    };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string = 'This field'): ValidationResult => {
  const isValid = value.trim().length > 0;
  
  return {
    isValid,
    error: isValid ? undefined : `${fieldName} is required`
  };
};

export const validateUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return { isValid: true };
  }
  
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid URL'
    };
  }
};

export const validatePassword = (password: string, minLength: number = 8): ValidationResult => {
  if (!password.trim()) {
    return { isValid: true };
  }
  
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters`
    };
  }
  
  return { isValid: true };
};