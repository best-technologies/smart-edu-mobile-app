// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// School Types
export interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  ownership: string;
  status: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: 'admin' | 'school_director' | 'teacher' | 'student' | 'developer';
  status: string;
  is_email_verified: boolean;
  school_id: string;
  display_picture: string | null;
  gender: string;
  created_at: string;
  updated_at: string;
  school?: School;
}

// Extended User Profile (from /director/user/profile endpoint)
export interface UserProfile extends User {
  school: School;
}

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface OTPVerificationResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: 'admin' | 'school_director' | 'teacher' | 'student' | 'developer';
  status: string;
  is_email_verified: boolean;
  school_id: string;
  display_picture: string | null;
  gender: string;
  created_at: string;
  updated_at: string;
}

export interface OTPVerificationRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface EmailVerificationRequest {
  email: string;
  otp: string;
}

export interface RequestEmailVerificationOTPRequest {
  email: string;
}

// API Error Types
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
