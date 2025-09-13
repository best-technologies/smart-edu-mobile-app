// API Configuration
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extra: any = (Constants as any)?.expoConfig?.extra ?? {};
const EXTRA_API_BASE_URL: string | undefined = extra?.apiBaseUrl;

function resolveBaseUrl(): string {
  // Development: use local emulator/simulator hosts
  if (__DEV__) {
    const iosSim = 'https://b34414718974.ngrok-free.app/api/v1';
    // const iosSim = 'http://localhost:1000/api/v1';
    const androidEmu = 'http://10.0.2.2:1000/api/v1';
    return Platform.OS === 'android' ? androidEmu : iosSim;
  }

  // Production/preview: prefer value from app.json "extra.apiBaseUrl", else fallback to staging
  return EXTRA_API_BASE_URL || 'https://smart-edu-hub.onrender.com/api/v1';
}

export const API_CONFIG = {
  BASE_URL: resolveBaseUrl(),
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
    FORGOT_PASSWORD: '/auth/request-password-reset-otp',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_OTP_AND_RESET_PASSWORD: '/auth/verify-otp-and-reset-password',
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
    DASHBOARD: '/teachers/dashboard',
    SUBJECTS: '/teacher/subjects',
    SUBJECTS_DASHBOARD: '/teachers/subjects-dashboard',
    SUBJECT_DETAILS: '/teachers/subjects',
    CREATE_TOPIC: '/teachers/topics',
    REORDER_TOPIC: '/teachers/topics/reorder',
    TOPIC_CONTENT: '/teachers/topics',
    STUDENTS: '/teacher/students',
    SCHEDULES: '/teacher/schedules',
    STUDENT_TAB: '/teachers/student-tab',
    SCHEDULES_TAB: '/teachers/schedules-tab',
  },
  DIRECTOR: {
    DASHBOARD: '/director/dashboard',
    TEACHERS: '/director/teachers',
    STUDENTS: '/director/students',
    SUBJECTS: '/director/subjects',
    SCHEDULES: '/director/schedules',
  },
  STUDENT: {
    DASHBOARD: '/students/dashboard',
    SUBJECTS: '/students/subjects',
    SUBJECT_DETAILS: '/students/subjects',
    TOPICS: '/students/topics',
    TOPIC_CONTENT: '/students/topics',
    SCHEDULES: '/students/schedules',
    ASSESSMENTS: '/students/assessments',
    ASSESSMENT_QUESTIONS: '/students/assessments',
    ASSESSMENT_SUBMIT: '/students/assessments',
    ASSESSMENT_ANSWERS: '/students/assessments',
  },
  AI_CHAT: {
    INITIATE: '/ai-chat/initiate-ai-chat',
    START_UPLOAD: '/ai-chat/start-upload',
    UPLOAD_PROGRESS: '/ai-chat/upload-progress',
    UPLOAD_DOCUMENT: '/ai-chat/upload-document',
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
