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

// Student Dashboard Types
export interface StudentDashboardGeneralInfo {
  current_session: {
    academic_year: string;
    term: string;
    start_date: string;
    end_date: string;
  };
  student_class: {
    id: string;
    name: string;
  };
  class_teacher: {
    id: string;
    name: string;
    display_picture: {
      secure_url: string;
      public_id: string;
    } | null;
  };
  student: {
    id: string;
    name: string;
    email: string;
    display_picture: {
      secure_url: string;
      public_id: string;
    } | null;
  };
  current_date: string;
  current_time: string;
}

export interface StudentDashboardStats {
  total_subjects: number;
  pending_assessments: number;
}

export interface StudentDashboardSubject {
  id: string;
  name: string;
  code: string;
  color: string;
  teacher: {
    id: string;
    name: string;
    display_picture: {
      secure_url: string;
      public_id: string;
    } | null;
  };
}

export interface StudentDashboardScheduleItem {
  subject: {
    id: string;
    name: string;
    code: string;
    color: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  time: {
    from: string;
    to: string;
    label: string;
  };
  room: string;
}

export interface StudentDashboardDaySchedule {
  day: string;
  schedule: StudentDashboardScheduleItem[];
}

export interface StudentDashboardClassSchedule {
  today: StudentDashboardDaySchedule;
  tomorrow: StudentDashboardDaySchedule;
  day_after_tomorrow: StudentDashboardDaySchedule;
}

export interface StudentDashboardNotification {
  id: string;
  title: string;
  description: string;
  type: string;
  comingUpOn: string;
  createdAt: string;
}

export interface StudentDashboardData {
  general_info: StudentDashboardGeneralInfo;
  stats: StudentDashboardStats;
  subjects_enrolled: StudentDashboardSubject[];
  class_schedule: StudentDashboardClassSchedule;
  notifications: StudentDashboardNotification[];
}

export interface StudentDashboardResponse {
  success: boolean;
  message: string;
  data: StudentDashboardData;
  statusCode: number;
}

// Student Subjects Types
export interface StudentSubjectThumbnail {
  secure_url: string;
  public_id: string;
}

export interface StudentSubjectClass {
  id: string;
  name: string;
  classId: number;
}

export interface StudentSubjectTimetableEntry {
  id: string;
  day_of_week: string;
  startTime: string;
  endTime: string;
  room: string;
  class: StudentSubjectClass;
}

export interface StudentSubjectContentCounts {
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
}

export interface StudentSubject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  thumbnail: StudentSubjectThumbnail | null;
  timetableEntries: StudentSubjectTimetableEntry[];
  classesTakingSubject: StudentSubjectClass[];
  contentCounts: StudentSubjectContentCounts;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubjectsStats {
  totalSubjects: number;
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
}

export interface StudentSubjectsAcademicSession {
  id: string;
  academic_year: string;
  term: string;
}

export interface StudentSubjectsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StudentSubjectsData {
  subjects: StudentSubject[];
  stats: StudentSubjectsStats;
  academicSession: StudentSubjectsAcademicSession;
  pagination: StudentSubjectsPagination;
}

export interface StudentSubjectsResponse {
  success: boolean;
  message: string;
  data: StudentSubjectsData;
  statusCode: number;
}

// Student Subject Details Types (for individual subject with topics)
export interface StudentSubjectDetailsVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubjectDetailsMaterial {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubjectDetailsTopic {
  id: string;
  title: string;
  description: string;
  instructions: string;
  order: number;
  isActive: boolean;
  subjectId: string;
  videos: StudentSubjectDetailsVideo[];
  materials: StudentSubjectDetailsMaterial[];
  videoCount: number;
  materialCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubjectDetailsData {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  thumbnail: {
    secure_url: string;
    public_id: string;
  } | null;
  topics: StudentSubjectDetailsTopic[];
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentSubjectDetailsResponse {
  success: boolean;
  message: string;
  data: StudentSubjectDetailsData;
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
