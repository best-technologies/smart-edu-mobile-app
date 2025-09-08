// CBT (Computer-Based Test) Types based on API Integration Guide

export type QuestionType = 
  | 'MULTIPLE_CHOICE_SINGLE'
  | 'MULTIPLE_CHOICE_MULTIPLE'
  | 'SHORT_ANSWER'
  | 'LONG_ANSWER'
  | 'TRUE_FALSE'
  | 'FILL_IN_BLANK'
  | 'MATCHING'
  | 'ORDERING'
  | 'FILE_UPLOAD'
  | 'NUMERIC'
  | 'DATE'
  | 'RATING_SCALE';

export type GradingType = 'AUTOMATIC' | 'MANUAL' | 'MIXED';

export type QuizStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

// Core CBT Models
export interface CBTQuiz {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  subject_id: string;
  school_id: string;
  academic_session_id: string;
  created_by: string;
  duration?: number; // minutes
  max_attempts: number;
  passing_score: number; // percentage
  total_points: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_correct_answers: boolean;
  show_feedback: boolean;
  allow_review: boolean;
  start_date?: string; // ISO 8601
  end_date?: string; // ISO 8601
  time_limit?: number; // minutes
  grading_type: GradingType;
  auto_submit: boolean;
  status: QuizStatus;
  is_published: boolean;
  published_at?: string; // ISO 8601
  tags: string[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  subject?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  questions?: CBTQuestion[];
  _count?: {
    questions: number;
    attempts: number;
  };
}

export interface CBTQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  order: number;
  points: number;
  is_required: boolean;
  time_limit?: number; // seconds
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  allow_multiple_attempts: boolean;
  show_hint: boolean;
  hint_text?: string;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  explanation?: string;
  difficulty_level: DifficultyLevel;
  createdAt: string;
  updatedAt: string;
  options?: CBTOption[];
  correct_answers?: CBTCorrectAnswer[];
  _count?: {
    responses: number;
  };
}

export interface CBTOption {
  id: string;
  question_id: string;
  option_text: string;
  order: number;
  is_correct: boolean;
  image_url?: string;
  audio_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CBTCorrectAnswer {
  id: string;
  question_id: string;
  answer_text?: string;
  answer_number?: number;
  answer_date?: string; // ISO 8601
  option_ids?: string[];
  answer_json?: any; // For complex answers
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface CreateQuizRequest {
  title: string;
  description?: string;
  instructions?: string;
  subject_id: string;
  duration?: number;
  max_attempts?: number;
  passing_score?: number;
  total_points?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  show_correct_answers?: boolean;
  show_feedback?: boolean;
  allow_review?: boolean;
  start_date?: string; // ISO 8601
  end_date?: string; // ISO 8601
  time_limit?: number;
  grading_type?: GradingType;
  auto_submit?: boolean;
  tags?: string[];
}

export interface CreateQuestionRequest {
  question_text: string;
  question_type: QuestionType;
  order: number;
  points?: number;
  is_required?: boolean;
  time_limit?: number;
  image_url?: string;
  audio_url?: string;
  video_url?: string;
  allow_multiple_attempts?: boolean;
  show_hint?: boolean;
  hint_text?: string;
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
  explanation?: string;
  difficulty_level?: DifficultyLevel;
  options?: CreateOptionRequest[];
  correct_answers?: CreateCorrectAnswerRequest[];
}

export interface CreateOptionRequest {
  option_text: string;
  order: number;
  is_correct: boolean;
  image_url?: string;
  audio_url?: string;
}

export interface CreateCorrectAnswerRequest {
  answer_text?: string;
  answer_number?: number;
  answer_date?: string;
  option_ids?: string[];
  answer_json?: any;
}

// API Response Types
export interface CBTQuizResponse {
  success: boolean;
  message: string;
  data?: CBTQuiz;
  statusCode: number;
}

export interface CBTQuizzesResponse {
  success: boolean;
  message: string;
  data?: CBTQuiz[];
  statusCode: number;
}

export interface CBTQuestionResponse {
  success: boolean;
  message: string;
  data?: CBTQuestion;
  statusCode: number;
}

export interface CBTQuestionsResponse {
  success: boolean;
  message: string;
  data?: CBTQuestion[];
  statusCode: number;
}

// Error Types
export interface CBTError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Topic Selection for CBT Creation
export interface Topic {
  id: string;
  title: string;
  description?: string;
  subject: {
    id: string;
    name: string;
  };
  order: number;
  is_active: boolean;
}

export interface TopicsResponse {
  success: boolean;
  message: string;
  data: Topic[];
}
