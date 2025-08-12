// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.smarteduhub.com/v1', // Replace with your actual API URL
  TIMEOUT: 10000, // 10 seconds
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  // User Management
  USER: {
    PROFILE: '/user/profile',
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
} as const;

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
