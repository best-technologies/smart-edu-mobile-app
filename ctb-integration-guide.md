# 📱 Mobile App API Specification

## 📋 Overview

This document provides complete API specifications for mobile app integration with the CBT (Computer-Based Test) system. It includes all endpoints, request/response formats, and implementation details.

---

## 🔌 Base Configuration

### API Base URL
```
Production: https://your-api.com/teachers/assessments/cbt
Development: https://dev-api.com/teachers/assessments/cbt
```

### Authentication
All requests require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Content Type
```
Content-Type: application/json
```

---

## 📊 Data Models

### CBTQuiz
```typescript
interface CBTQuiz {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  topic_id: string;
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
  grading_type: 'AUTOMATIC' | 'MANUAL' | 'MIXED';
  auto_submit: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  is_published: boolean;
  published_at?: string; // ISO 8601
  tags: string[];
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  topic?: {
    id: string;
    title: string;
    subject: {
      id: string;
      name: string;
    };
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
```

### CBTQuestion
```typescript
interface CBTQuestion {
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
  difficulty_level: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  createdAt: string;
  updatedAt: string;
  options?: CBTOption[];
  correct_answers?: CBTCorrectAnswer[];
  _count?: {
    responses: number;
  };
}
```

### QuestionType
```typescript
type QuestionType = 
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
```

### CBTOption
```typescript
interface CBTOption {
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
```

### CBTCorrectAnswer
```typescript
interface CBTCorrectAnswer {
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
```

---

## 🚀 API Endpoints

### 1. Create Quiz

**Endpoint:** `POST /quizzes`

**Request Body:**
```typescript
interface CreateQuizRequest {
  title: string;
  description?: string;
  instructions?: string;
  topic_id: string;
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
  grading_type?: 'AUTOMATIC' | 'MANUAL' | 'MIXED';
  auto_submit?: boolean;
  tags?: string[];
}
```

**Example Request:**
```json
{
  "title": "Mathematics Quiz - Chapter 1",
  "description": "Test your understanding of basic algebra",
  "instructions": "Answer all questions carefully. You have 30 minutes.",
  "topic_id": "topic_123",
  "duration": 30,
  "max_attempts": 2,
  "passing_score": 60,
  "total_points": 100,
  "shuffle_questions": true,
  "shuffle_options": false,
  "show_correct_answers": true,
  "show_feedback": true,
  "allow_review": true,
  "grading_type": "AUTOMATIC",
  "auto_submit": true,
  "tags": ["algebra", "mathematics", "chapter1"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "id": "quiz_123",
    "title": "Mathematics Quiz - Chapter 1",
    "description": "Test your understanding of basic algebra",
    "status": "DRAFT",
    "is_published": false,
    "topic": {
      "id": "topic_123",
      "title": "Introduction to Algebra",
      "subject": {
        "id": "subject_456",
        "name": "Mathematics"
      }
    },
    "createdBy": {
      "id": "teacher_789",
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}

// 403 Forbidden
{
  "success": false,
  "message": "You do not have permission to create quizzes for this subject"
}

// 404 Not Found
{
  "success": false,
  "message": "Topic not found"
}
```

---

### 2. Get Quiz by ID

**Endpoint:** `GET /quizzes/:id`

**Response:**
```json
{
  "success": true,
  "message": "Quiz retrieved successfully",
  "data": {
    "id": "quiz_123",
    "title": "Mathematics Quiz - Chapter 1",
    "description": "Test your understanding of basic algebra",
    "instructions": "Answer all questions carefully. You have 30 minutes.",
    "duration": 30,
    "max_attempts": 2,
    "passing_score": 60,
    "total_points": 100,
    "status": "DRAFT",
    "is_published": false,
    "questions": [
      {
        "id": "question_1",
        "question_text": "What is the capital of France?",
        "question_type": "MULTIPLE_CHOICE_SINGLE",
        "order": 1,
        "points": 2.0,
        "is_required": true,
        "options": [
          {
            "id": "option_1",
            "option_text": "Paris",
            "order": 1,
            "is_correct": true
          },
          {
            "id": "option_2",
            "option_text": "London",
            "order": 2,
            "is_correct": false
          }
        ],
        "correct_answers": [
          {
            "id": "answer_1",
            "option_ids": ["option_1"]
          }
        ]
      }
    ],
    "_count": {
      "attempts": 0
    }
  }
}
```

---

### 3. Update Quiz

**Endpoint:** `PATCH /quizzes/:id`

**Request Body:** (Same as CreateQuizRequest, all fields optional)

**Response:** (Same as Get Quiz by ID)

---

### 4. Delete Quiz

**Endpoint:** `DELETE /quizzes/:id`

**Response:**
```json
{
  "success": true,
  "message": "Quiz deleted successfully"
}
```

**Error Response:**
```json
// 400 Bad Request
{
  "success": false,
  "message": "Cannot delete quiz that has student attempts. Consider archiving instead."
}
```

---

### 5. Publish Quiz

**Endpoint:** `POST /quizzes/:id/publish`

**Response:**
```json
{
  "success": true,
  "message": "Quiz published successfully",
  "data": {
    "id": "quiz_123",
    "title": "Mathematics Quiz - Chapter 1",
    "status": "PUBLISHED",
    "is_published": true,
    "published_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**
```json
// 400 Bad Request
{
  "success": false,
  "message": "Cannot publish quiz without questions"
}
```

---

### 6. Get Topic Quizzes

**Endpoint:** `GET /quizzes/topic/:topicId`

**Response:**
```json
{
  "success": true,
  "message": "Topic quizzes retrieved successfully",
  "data": [
    {
      "id": "quiz_123",
      "title": "Mathematics Quiz - Chapter 1",
      "description": "Test your understanding of basic algebra",
      "status": "PUBLISHED",
      "is_published": true,
      "published_at": "2024-01-15T10:30:00Z",
      "topic": {
        "id": "topic_123",
        "title": "Introduction to Algebra",
        "subject": {
          "id": "subject_456",
          "name": "Mathematics"
        }
      },
      "createdBy": {
        "id": "teacher_789",
        "first_name": "John",
        "last_name": "Doe"
      },
      "_count": {
        "questions": 5,
        "attempts": 12
      }
    }
  ]
}
```

---

## 📝 Question Management Endpoints

### 7. Add Question

**Endpoint:** `POST /quizzes/:quizId/questions`

**Request Body:**
```typescript
interface CreateQuestionRequest {
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
  difficulty_level?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  options?: CreateOptionRequest[];
  correct_answers?: CreateCorrectAnswerRequest[];
}

interface CreateOptionRequest {
  option_text: string;
  order: number;
  is_correct: boolean;
  image_url?: string;
  audio_url?: string;
}

interface CreateCorrectAnswerRequest {
  answer_text?: string;
  answer_number?: number;
  answer_date?: string;
  option_ids?: string[];
  answer_json?: any;
}
```

**Example Request (Multiple Choice):**
```json
{
  "question_text": "What is the capital of France?",
  "question_type": "MULTIPLE_CHOICE_SINGLE",
  "order": 1,
  "points": 2.0,
  "is_required": true,
  "explanation": "Paris is the capital and largest city of France.",
  "difficulty_level": "EASY",
  "options": [
    {
      "option_text": "Paris",
      "order": 1,
      "is_correct": true
    },
    {
      "option_text": "London",
      "order": 2,
      "is_correct": false
    },
    {
      "option_text": "Berlin",
      "order": 3,
      "is_correct": false
    },
    {
      "option_text": "Madrid",
      "order": 4,
      "is_correct": false
    }
  ],
  "correct_answers": [
    {
      "option_ids": ["option_1"]
    }
  ]
}
```

**Example Request (Short Answer):**
```json
{
  "question_text": "Define photosynthesis in one sentence.",
  "question_type": "SHORT_ANSWER",
  "order": 2,
  "points": 3.0,
  "is_required": true,
  "min_length": 10,
  "max_length": 200,
  "explanation": "Photosynthesis is the process by which plants convert sunlight into energy.",
  "difficulty_level": "MEDIUM",
  "correct_answers": [
    {
      "answer_text": "Photosynthesis is the process by which plants convert sunlight into energy."
    },
    {
      "answer_text": "Photosynthesis is how plants make food using sunlight."
    }
  ]
}
```

**Example Request (Numeric):**
```json
{
  "question_text": "What is 15% of 200?",
  "question_type": "NUMERIC",
  "order": 3,
  "points": 2.0,
  "is_required": true,
  "min_value": 0,
  "max_value": 100,
  "explanation": "15% of 200 = 0.15 × 200 = 30",
  "difficulty_level": "EASY",
  "correct_answers": [
    {
      "answer_number": 30
    }
  ]
}
```

**Example Request (File Upload):**
```json
{
  "question_text": "Upload a diagram showing the water cycle with proper labels.",
  "question_type": "FILE_UPLOAD",
  "order": 4,
  "points": 5.0,
  "is_required": true,
  "explanation": "This question will be graded manually by the teacher.",
  "difficulty_level": "MEDIUM"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Question added successfully",
  "data": {
    "id": "question_123",
    "question_text": "What is the capital of France?",
    "question_type": "MULTIPLE_CHOICE_SINGLE",
    "order": 1,
    "points": 2.0,
    "is_required": true,
    "options": [
      {
        "id": "option_1",
        "option_text": "Paris",
        "order": 1,
        "is_correct": true
      }
    ],
    "correct_answers": [
      {
        "id": "answer_1",
        "option_ids": ["option_1"]
      }
    ]
  }
}
```

---

### 8. Get Quiz Questions

**Endpoint:** `GET /quizzes/:quizId/questions`

**Response:**
```json
{
  "success": true,
  "message": "Quiz questions retrieved successfully",
  "data": [
    {
      "id": "question_1",
      "question_text": "What is the capital of France?",
      "question_type": "MULTIPLE_CHOICE_SINGLE",
      "order": 1,
      "points": 2.0,
      "is_required": true,
      "options": [
        {
          "id": "option_1",
          "option_text": "Paris",
          "order": 1,
          "is_correct": true
        }
      ],
      "correct_answers": [
        {
          "id": "answer_1",
          "option_ids": ["option_1"]
        }
      ],
      "_count": {
        "responses": 0
      }
    }
  ]
}
```

---

### 9. Update Question

**Endpoint:** `PATCH /quizzes/:quizId/questions/:questionId`

**Request Body:** (Same as CreateQuestionRequest, all fields optional)

**Response:** (Same as Add Question)

---

### 10. Delete Question

**Endpoint:** `DELETE /quizzes/:quizId/questions/:questionId`

**Response:**
```json
{
  "success": true,
  "message": "Question deleted successfully"
}
```

---

## 🔍 Additional Endpoints

### 11. Get Topics (for dropdown)

**Endpoint:** `GET /topics` (from topics module)

**Response:**
```json
{
  "success": true,
  "message": "Topics retrieved successfully",
  "data": [
    {
      "id": "topic_123",
      "title": "Introduction to Algebra",
      "description": "Basic algebraic concepts",
      "subject": {
        "id": "subject_456",
        "name": "Mathematics"
      },
      "order": 1,
      "is_active": true
    }
  ]
}
```

---

## 📱 Mobile App Implementation

### Service Class
```typescript
class CBTService {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  async createQuiz(quizData: CreateQuizRequest): Promise<CBTQuiz> {
    const response = await this.request<ApiResponse<CBTQuiz>>('/quizzes', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
    return response.data;
  }

  async getQuiz(quizId: string): Promise<CBTQuiz> {
    const response = await this.request<ApiResponse<CBTQuiz>>(`/quizzes/${quizId}`);
    return response.data;
  }

  async updateQuiz(quizId: string, quizData: Partial<CreateQuizRequest>): Promise<CBTQuiz> {
    const response = await this.request<ApiResponse<CBTQuiz>>(`/quizzes/${quizId}`, {
      method: 'PATCH',
      body: JSON.stringify(quizData),
    });
    return response.data;
  }

  async deleteQuiz(quizId: string): Promise<void> {
    await this.request(`/quizzes/${quizId}`, {
      method: 'DELETE',
    });
  }

  async publishQuiz(quizId: string): Promise<CBTQuiz> {
    const response = await this.request<ApiResponse<CBTQuiz>>(`/quizzes/${quizId}/publish`, {
      method: 'POST',
    });
    return response.data;
  }

  async getTopicQuizzes(topicId: string): Promise<CBTQuiz[]> {
    const response = await this.request<ApiResponse<CBTQuiz[]>>(`/quizzes/topic/${topicId}`);
    return response.data;
  }

  async addQuestion(quizId: string, questionData: CreateQuestionRequest): Promise<CBTQuestion> {
    const response = await this.request<ApiResponse<CBTQuestion>>(`/quizzes/${quizId}/questions`, {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
    return response.data;
  }

  async getQuizQuestions(quizId: string): Promise<CBTQuestion[]> {
    const response = await this.request<ApiResponse<CBTQuestion[]>>(`/quizzes/${quizId}/questions`);
    return response.data;
  }

  async updateQuestion(quizId: string, questionId: string, questionData: Partial<CreateQuestionRequest>): Promise<CBTQuestion> {
    const response = await this.request<ApiResponse<CBTQuestion>>(`/quizzes/${quizId}/questions/${questionId}`, {
      method: 'PATCH',
      body: JSON.stringify(questionData),
    });
    return response.data;
  }

  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    await this.request(`/quizzes/${quizId}/questions/${questionId}`, {
      method: 'DELETE',
    });
  }
}
```

### Error Handling
```typescript
interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

class CBTError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'CBTError';
  }
}

// Usage in service
try {
  const quiz = await cbtService.createQuiz(quizData);
} catch (error) {
  if (error instanceof CBTError) {
    // Handle specific CBT errors
    console.error('CBT Error:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`${err.field}: ${err.message}`);
      });
    }
  } else {
    // Handle network or other errors
    console.error('Network Error:', error.message);
  }
}
```

---

## 🔒 Security Considerations

### Authentication
- All requests require valid JWT token
- Token should be refreshed before expiration
- Implement proper token storage (secure storage)

### Authorization
- Teachers can only access quizzes they created
- Teachers can only create quizzes for subjects they teach
- Proper validation on all endpoints

### Data Validation
- All input data is validated on the server
- File uploads have size and type restrictions
- SQL injection protection through Prisma ORM

---

## 📊 Performance Considerations

### Caching
- Cache quiz data for offline access
- Implement proper cache invalidation
- Use React Query or similar for data fetching

### Pagination
- Implement pagination for large quiz lists
- Use infinite scroll for better UX
- Limit question count per request

### File Uploads
- Use multipart/form-data for file uploads
- Implement progress indicators
- Compress images before upload

---

This API specification provides everything needed to build a professional mobile app that integrates with your CBT system. The endpoints are designed to be RESTful, secure, and scalable.
