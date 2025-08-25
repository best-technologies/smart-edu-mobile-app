// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:1000/api/v1',
  TIMEOUT: 10000, // 10 seconds
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    VERIFY_OTP: '/auth/director-verify-login-otp',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    REQUEST_EMAIL_VERIFICATION_OTP: '/auth/request-email-verification',
  },
  // User Management
  USER: {
    PROFILE: '/director/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
  },
  // Role-specific endpoints
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    SUBJECTS: '/teacher/subjects',
    STUDENTS: '/teacher/students',
    SCHEDULES: '/teacher/schedules',
  },
  DIRECTOR: {
    DASHBOARD: '/director/dashboard',
    TEACHERS: '/director/teachers',
    STUDENTS: '/director/students',
    SUBJECTS: '/director/subjects',
    SCHEDULES: '/director/schedules',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    SUBJECTS: '/student/subjects',
    SCHEDULES: '/student/schedules',
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  TOKEN_EXPIRY: 'token_expiry',
  PENDING_USER: 'pending_user', // For OTP verification
} as const;

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Roles that require OTP verification
export const ROLES_REQUIRING_OTP = ['admin', 'school_director', 'teacher'] as const;
