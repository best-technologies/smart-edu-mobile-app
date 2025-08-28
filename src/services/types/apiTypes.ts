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
  current_academic_session_id?: string;
  current_academic_session?: string;
  current_term?: string;
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

export interface VerifyOTPAndResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

// Teacher Student Tab Types
export interface StudentTabStudent {
  id: string;
  student_id: string;
  name: string;
  email: string;
  display_picture: {
    secure_url: string;
    public_id: string;
  } | null;
  status: 'active' | 'inactive' | 'suspended';
  gender: 'male' | 'female' | 'other';
  class: {
    id: string;
    name: string;
  };
  user_id: string;
}

export interface StudentTabClass {
  id: string;
  name: string;
  student_count: number;
  subject_count: number;
}

export interface StudentTabSubject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  assigned_class: {
    id: string;
    name: string;
  };
}

export interface StudentTabSummary {
  total_students: number;
  total_classes: number;
  total_subjects: number;
}

export interface StudentTabPagination {
  current_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  results_per_page: number;
}

export interface StudentTabData {
  students: {
    data: StudentTabStudent[];
    pagination: StudentTabPagination;
  };
  classes: StudentTabClass[];
  subjects: StudentTabSubject[];
  summary: StudentTabSummary;
}

export interface StudentTabResponse {
  success: boolean;
  message: string;
  data: StudentTabData;
  statusCode: number;
}

// Teacher Schedule Types
export interface ScheduleTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  order: number;
}

export interface ScheduleSubject {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface ScheduleTeacher {
  id: string;
  name: string;
}

export interface ScheduleItem {
  timeSlotId: string;
  startTime: string;
  endTime: string;
  label: string;
  subject: ScheduleSubject | null;
  teacher: ScheduleTeacher | null;
  room: string | null;
}

export interface ScheduleClass {
  id: string;
  name: string;
}

export interface TeacherScheduleData {
  subjects: ScheduleSubject[];
  classes: ScheduleClass[];
  timetable_data: {
    timeSlots: ScheduleTimeSlot[];
    schedule: {
      MONDAY: ScheduleItem[];
      TUESDAY: ScheduleItem[];
      WEDNESDAY: ScheduleItem[];
      THURSDAY: ScheduleItem[];
      FRIDAY: ScheduleItem[];
    };
  };
}

export interface TeacherScheduleResponse {
  success: boolean;
  message: string;
  data: TeacherScheduleData;
  statusCode: number;
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
