// API Configuration
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extra: any = (Constants as any)?.expoConfig?.extra ?? {};
const EXTRA_API_BASE_URL: string | undefined = extra?.apiBaseUrl;

function resolveBaseUrl(): string {
  // Use the API URL from environment configuration
  if (EXTRA_API_BASE_URL) {
    return EXTRA_API_BASE_URL;
  }

  // Fallback for development if no environment variable is set
  if (__DEV__) {
    return 'http://localhost:1000/api/v1';
  }

  // Fallback for production
  return 'https://smart-edu-staging.onrender.com/api/v1';
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
    PROFILE: '/user/profile',
    PROFILE_STUDENT: '/user/mobile-student-profile',
    PROFILE_TEACHER: '/user/mobile-teacher-profile',
    PROFILE_DIRECTOR: '/user/mobile-director-profile',
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
    UPLOAD_VIDEO_START: '/teachers/topics/upload-video/start',
    UPLOAD_PROGRESS: '/teachers/topics/upload-progress',
    UPLOAD_PROGRESS_POLL: '/teachers/topics/video-upload-progress',
    ATTENDANCE_SESSION: '/teachers/attendance/getsessiondetailsandclasses',
    ATTENDANCE_CLASS_STUDENTS: '/teachers/attendance/classes',
    ATTENDANCE_GET: '/teachers/attendance/classes',
    ATTENDANCE_SUBMIT: '/teachers/attendance/submit',
    ATTENDANCE_UPDATE: '/teachers/attendance/update',
    ATTENDANCE_HISTORY: '/teachers/attendance/students',
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
    ATTENDANCE: '/students/attendance',
  },
  AI_CHAT: {
    INITIATE: '/ai-chat/initiate-ai-chat',
    START_UPLOAD: '/ai-chat/start-upload',
    UPLOAD_PROGRESS: '/ai-chat/upload-progress',
    UPLOAD_DOCUMENT: '/ai-chat/upload-document',
    CONVERSATION_MESSAGES: '/ai-chat/conversations',
    SEND_MESSAGE: '/ai-chat/send-message',
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
