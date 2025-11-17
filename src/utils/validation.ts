import * as Yup from 'yup';

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


const requiredMessage = 'This field is required';
const invalidEmail = 'Please enter a valid email address';
export const validationSchemas = {
 
  loginSchema: Yup.object({
    username: Yup.string()
      .required("Username is required"),

    password: Yup.string()
      .required(requiredMessage)
      // .min(8, "Password must be at least 8 characters")
      .matches(/^\S+$/, "Password cannot contain spaces"),
  }),
  createUserSchema: Yup.object({
    username: Yup.string()
      .email(invalidEmail)
      .required(requiredMessage),
    password: Yup.string()
      .required(requiredMessage)
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required(requiredMessage),
  }),
  // --- ADD THIS NEW SCHEMA (from UserList.tsx) ---
  userManagementCreate: Yup.object().shape({
    firstName: Yup.string()
      .required('First name is required')
      .matches(/^[a-zA-Z0-9]*$/, 'No special characters or spaces allowed'),
    lastName: Yup.string()
      .required('Last name is required')
      .matches(/^[a-zA-Z0-9]*$/, 'No special characters or spaces allowed'),
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address')
      .matches(/@.*\..+/, 'Email must include a valid domain'),
    password: Yup.string()
      .required('Password is required')
      .min(4, 'Password must be at least 4 characters')
      .matches(/^\S*$/, 'Password cannot contain spaces'),
    role: Yup.string()
      .required('Role is required'),
    phone: Yup.string()
  }),
  userManagementUpdate: Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email address')
      .matches(/@.*\..+/, 'Email must include a valid domain'),
    password: Yup.string()
      .min(4, 'Password must be at least 4 characters')
      .matches(/^\S*$/, 'Password cannot contain spaces'),
    role: Yup.string()
      .required('Role is required'),
    firstName: Yup.string(),
    lastName: Yup.string(),
    phone: Yup.string()
  }),

  passwordChange: Yup.object().shape({
    currentPassword: Yup.string() // <-- ADD THIS
      .required('Current password is required'), // <-- ADD THIS
    newPassword: Yup.string()
      .required('A new password is required')
      .min(4, 'Password must be at least 4 characters')
      .matches(/^\S*$/, 'Password cannot contain spaces'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Please confirm your password')
  })

};

export const isValidIP = (ip: string): boolean => {
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password should be at least 8 characters long');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain uppercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain numbers');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password should contain special characters');
  }

  return { score, feedback };
};

// Form validation helpers
export const validateRequired = (value: any): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return 'This field is required';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number): string | null => {
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number): string | null => {
  if (value.length > maxLength) {
    return `Must be no more than ${maxLength} characters long`;
  }
  return null;
};
