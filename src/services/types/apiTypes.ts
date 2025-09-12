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
  thumbnail: {
    public_id: string;
    secure_url: string;
  };
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

// Student Schedules Types
export interface StudentClass {
  id: string;
  name: string;
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

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  order: number;
  label: string;
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

export interface TimetableData {
  timeSlots: TimeSlot[];
  schedule: {
    MONDAY: ScheduleItem[];
    TUESDAY: ScheduleItem[];
    WEDNESDAY: ScheduleItem[];
    THURSDAY: ScheduleItem[];
    FRIDAY: ScheduleItem[];
    SATURDAY: ScheduleItem[];
    SUNDAY: ScheduleItem[];
  };
}

export interface StudentSchedulesData {
  studentClass: StudentClass;
  subjects: ScheduleSubject[];
  timetable_data: TimetableData;
}

export interface StudentSchedulesResponse {
  success: boolean;
  message: string;
  data: StudentSchedulesData;
}

// Student Assessments Types
export interface AssessmentSubject {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface AssessmentTeacher {
  id: string;
  name: string;
}

export interface AssessmentAttempt {
  id: string;
  attempt_number: number;
  status: 'PENDING' | 'GRADED' | 'SUBMITTED';
  total_score: number;
  percentage: number;
  passed: boolean;
  submitted_at: string;
}

export interface StudentAttempts {
  total_attempts: number;
  remaining_attempts: number;
  has_reached_max: boolean;
  latest_attempt: AssessmentAttempt | null;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  assessment_type: 'ASSIGNMENT' | 'QUIZ' | 'PRACTICE' | 'CBT' | 'EXAM' | 'OTHER';
  status: 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'ARCHIVED';
  duration: number;
  total_points: number;
  max_attempts: number;
  passing_score: number;
  questions_count: number;
  subject: AssessmentSubject;
  teacher: AssessmentTeacher;
  due_date: string;
  created_at: string;
  is_published: boolean;
  student_attempts: StudentAttempts;
  performance_summary: {
    highest_score: number;
    highest_percentage: number;
    overall_achievable_mark: number;
    best_attempt: AssessmentAttempt | null;
  };
  _count: {
    questions: number;
  };
}

export interface GroupedAssessment {
  assessment_type: string;
  status: string;
  count: number;
  assessments: Assessment[];
}

export interface AssessmentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface AssessmentFilters {
  search?: string;
  assessment_type?: string;
  status?: string;
}

export interface StudentAssessmentsGeneralInfo {
  current_session: {
    academic_year: string;
    term: string;
  };
}

export interface StudentAssessmentsData {
  general_info: StudentAssessmentsGeneralInfo;
  assessments: Assessment[];
  grouped_assessments: GroupedAssessment[];
  pagination: AssessmentPagination;
  filters: AssessmentFilters;
}

export interface StudentAssessmentsResponse {
  success: boolean;
  message: string;
  data: StudentAssessmentsData;
  statusCode: number;
}

// Assessment Questions Types
export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
  order: number;
}

export interface CorrectAnswer {
  id: string;
  option_ids: string[];
}

export interface AssessmentQuestion {
  id: string;
  question_text: string;
  question_image?: string;
  question_type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK' | 'ESSAY';
  points: number;
  order: number;
  explanation?: string;
  options: QuestionOption[];
  correct_answers: CorrectAnswer[];
}

export interface AssessmentDetails {
  id: string;
  title: string;
  description: string;
  assessment_type: 'ASSIGNMENT' | 'QUIZ' | 'PRACTICE' | 'CBT' | 'EXAM' | 'OTHER';
  status: 'ACTIVE' | 'DRAFT' | 'CLOSED' | 'ARCHIVED';
  duration: number;
  total_points: number;
  max_attempts: number;
  passing_score: number;
  instructions: string;
  subject: AssessmentSubject;
  teacher: AssessmentTeacher;
  start_date: string;
  end_date: string;
  student_attempts: number;
  remaining_attempts: number;
}

export interface AssessmentQuestionsData {
  assessment: AssessmentDetails;
  questions: AssessmentQuestion[];
  total_questions: number;
  total_points: number;
  estimated_duration: number;
}

export interface AssessmentQuestionsResponse {
  success: boolean;
  message: string;
  data: AssessmentQuestionsData;
  statusCode: number;
}

// Assessment Submission Types
export interface AssessmentSubmissionAnswer {
  question_id: string;
  is_correct: boolean;
  points_earned: number;
  max_points: number;
}

export interface AssessmentSubmissionData {
  attempt_id: string;
  assessment_id: string;
  student_id: string;
  total_score: number;
  total_points: number;
  percentage_score: number;
  passed: boolean;
  grade: string;
  answers: AssessmentSubmissionAnswer[];
  submitted_at: string;
  time_spent: number;
}

export interface AssessmentSubmissionResponse {
  success: boolean;
  message: string;
  data: AssessmentSubmissionData;
}

// Assessment Answers Types
export interface AssessmentAnswerOption {
  id: string;
  text: string;
  is_correct: boolean;
  order: number;
  is_selected: boolean;
}

export interface UserAnswer {
  text_answer: string | null;
  numeric_answer: number | null;
  selected_options: {
    id: string;
    text: string;
    is_correct: boolean;
  }[];
  is_correct: boolean;
  points_earned: number;
  answered_at: string;
}

export interface AssessmentAnswerQuestion {
  id: string;
  question_text: string;
  question_image: string | null;
  question_type: 'MULTIPLE_CHOICE_SINGLE' | 'MULTIPLE_CHOICE_MULTIPLE' | 'TRUE_FALSE' | 'FILL_IN_BLANK' | 'ESSAY';
  points: number;
  order: number;
  explanation: string | null;
  options: AssessmentAnswerOption[];
  user_answer: UserAnswer | null;
  correct_answers: any[];
}

export interface AssessmentSubmission {
  submission_id: string;
  attempt_number: number;
  status: 'PENDING' | 'GRADED' | 'SUBMITTED';
  total_score: number;
  percentage: number;
  passed: boolean;
  grade_letter: string | null;
  time_spent: number;
  started_at: string;
  submitted_at: string;
  graded_at: string;
  is_graded: boolean;
  overall_feedback: string | null;
  questions: AssessmentAnswerQuestion[];
  total_questions: number;
  questions_answered: number;
  questions_correct: number;
}

export interface SubmissionSummary {
  total_submissions: number;
  latest_submission: AssessmentSubmission;
  best_score: number;
  best_percentage: number;
  passed_attempts: number;
}

export interface AssessmentAnswersData {
  assessment: {
    id: string;
    title: string;
    description: string;
    assessment_type: string;
    status: string;
    duration: number;
    total_points: number;
    max_attempts: number;
    passing_score: number;
    instructions: string;
    subject: AssessmentSubject;
    teacher: AssessmentTeacher;
    start_date: string;
    end_date: string;
    created_at: string;
    is_published: boolean;
    total_attempts: number;
    remaining_attempts: number;
  };
  submissions: AssessmentSubmission[];
  total_questions: number;
  total_points: number;
  estimated_duration: number;
  submission_summary: SubmissionSummary;
}

export interface AssessmentAnswersResponse {
  success: boolean;
  message: string;
  data: AssessmentAnswersData;
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

// Student Profile Types
export interface StudentProfileData {
  general_info: {
    student: {
      id: string;
      name: string;
      email: string;
      phone: string;
      date_of_birth: string | null;
      display_picture: string;
      student_id: string;
      emergency_contact_name: string | null;
      emergency_contact_phone: string | null;
      address: {
        street: string | null;
        city: string | null;
        state: string | null;
        country: string | null;
        postal_code: string | null;
      };
    };
    student_class: {
      id: string;
      name: string;
      level: string;
      section: string;
    };
    current_session: {
      id: string;
      academic_year: string;
      term: string;
      start_date: string;
      end_date: string;
    };
  };
  academic_info: {
    subjects_enrolled: Array<{
      id: string;
      name: string;
      code: string;
      teacher_name: string;
      status: string;
      credits: number;
    }>;
    performance_summary: {
      average_score: number;
      total_assessments: number;
      passed_assessments: number;
      failed_assessments: number;
      current_rank: number;
      total_students: number;
      grade_point_average: number;
      attendance_percentage: number;
    };
    recent_achievements: Array<{
      id: string;
      title: string;
      description: string;
      date_earned: string;
      type: string;
    }>;
  };
  settings: {
    notifications: {
      push_notifications: boolean;
      email_notifications: boolean;
      assessment_reminders: boolean;
      grade_notifications: boolean;
      announcement_notifications: boolean;
    };
    app_preferences: {
      dark_mode: boolean;
      sound_effects: boolean;
      haptic_feedback: boolean;
      auto_save: boolean;
      offline_mode: boolean;
    };
    privacy: {
      profile_visibility: string;
      show_contact_info: boolean;
      show_academic_progress: boolean;
      data_sharing: boolean;
    };
  };
  support_info: {
    help_center: {
      faq_count: number;
      last_updated: string;
      categories: string[];
    };
    contact_options: {
      email_support: string;
      phone_support: string;
      live_chat_available: boolean;
      response_time: string;
    };
    app_info: {
      version: string;
      build_number: string;
      last_updated: string;
      minimum_ios_version: string;
      minimum_android_version: string;
    };
  };
}
