import { passwordRequirements } from '../constants';

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  passwordRequirements.forEach(requirement => {
    if (!requirement.re.test(password)) {
      errors.push(requirement.label);
    }
  });
  
  return errors;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
