import { Assessment, StudentAssessmentsResponse, AssessmentQuestionsResponse, AssessmentAnswersResponse, AssessmentQuestion, AssessmentSubmission } from '@/services/types/apiTypes';

// Mock Assessment Data
export const mockAssessments: Assessment[] = [
  {
    id: 'mock-assessment-1',
    title: 'Mathematics Quiz - Algebra Basics',
    description: 'Test your understanding of basic algebraic concepts including equations, inequalities, and graphing.',
    assessment_type: 'QUIZ',
    status: 'ACTIVE',
    duration: 30,
    total_points: 50,
    max_attempts: 3,
    passing_score: 30,
    questions_count: 10,
    subject: {
      id: 'math-101',
      name: 'Mathematics',
      code: 'MATH101',
      color: '#3B82F6'
    },
    teacher: {
      id: 'teacher-1',
      name: 'Dr. Sarah Johnson'
    },
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    is_published: true,
    student_attempts: {
      total_attempts: 0,
      remaining_attempts: 3,
      has_reached_max: false,
      latest_attempt: null
    },
    performance_summary: {
      highest_score: 0,
      highest_percentage: 0,
      overall_achievable_mark: 50,
      best_attempt: null
    },
    _count: {
      questions: 10
    }
  },
  {
    id: 'mock-assessment-2',
    title: 'Physics Exam - Mechanics',
    description: 'Comprehensive exam covering Newton\'s laws, kinematics, and dynamics.',
    assessment_type: 'EXAM',
    status: 'ACTIVE',
    duration: 120,
    total_points: 100,
    max_attempts: 2,
    passing_score: 60,
    questions_count: 25,
    subject: {
      id: 'physics-201',
      name: 'Physics',
      code: 'PHYS201',
      color: '#10B981'
    },
    teacher: {
      id: 'teacher-2',
      name: 'Prof. Michael Chen'
    },
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    is_published: true,
    student_attempts: {
      total_attempts: 1,
      remaining_attempts: 1,
      has_reached_max: false,
      latest_attempt: {
        id: 'attempt-1',
        attempt_number: 1,
        status: 'GRADED',
        total_score: 75,
        percentage: 75,
        passed: true,
        submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    performance_summary: {
      highest_score: 75,
      highest_percentage: 75,
      overall_achievable_mark: 100,
      best_attempt: {
        id: 'attempt-1',
        attempt_number: 1,
        status: 'GRADED',
        total_score: 75,
        percentage: 75,
        passed: true,
        submitted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    _count: {
      questions: 25
    }
  },
  {
    id: 'mock-assessment-3',
    title: 'Chemistry Assignment - Organic Compounds',
    description: 'Identify and classify various organic compounds and their properties.',
    assessment_type: 'ASSIGNMENT',
    status: 'ACTIVE',
    duration: 45,
    total_points: 40,
    max_attempts: 5,
    passing_score: 24,
    questions_count: 15,
    subject: {
      id: 'chem-301',
      name: 'Chemistry',
      code: 'CHEM301',
      color: '#F59E0B'
    },
    teacher: {
      id: 'teacher-3',
      name: 'Dr. Emily Rodriguez'
    },
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (overdue)
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    is_published: true,
    student_attempts: {
      total_attempts: 0,
      remaining_attempts: 5,
      has_reached_max: false,
      latest_attempt: null
    },
    performance_summary: {
      highest_score: 0,
      highest_percentage: 0,
      overall_achievable_mark: 40,
      best_attempt: null
    },
    _count: {
      questions: 15
    }
  },
  {
    id: 'mock-assessment-4',
    title: 'Biology Practice Test - Cell Biology',
    description: 'Practice questions on cell structure, organelles, and cellular processes.',
    assessment_type: 'PRACTICE',
    status: 'ACTIVE',
    duration: 60,
    total_points: 80,
    max_attempts: 10,
    passing_score: 48,
    questions_count: 20,
    subject: {
      id: 'bio-101',
      name: 'Biology',
      code: 'BIO101',
      color: '#8B5CF6'
    },
    teacher: {
      id: 'teacher-4',
      name: 'Dr. James Wilson'
    },
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    is_published: true,
    student_attempts: {
      total_attempts: 2,
      remaining_attempts: 8,
      has_reached_max: false,
      latest_attempt: {
        id: 'attempt-2',
        attempt_number: 2,
        status: 'GRADED',
        total_score: 65,
        percentage: 81.25,
        passed: true,
        submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      }
    },
    performance_summary: {
      highest_score: 65,
      highest_percentage: 81.25,
      overall_achievable_mark: 80,
      best_attempt: {
        id: 'attempt-2',
        attempt_number: 2,
        status: 'GRADED',
        total_score: 65,
        percentage: 81.25,
        passed: true,
        submitted_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    },
    _count: {
      questions: 20
    }
  },
  {
    id: 'mock-assessment-5',
    title: 'Computer Science CBT - Data Structures',
    description: 'Computer-based test on arrays, linked lists, stacks, and queues.',
    assessment_type: 'CBT',
    status: 'ACTIVE',
    duration: 90,
    total_points: 70,
    max_attempts: 1,
    passing_score: 42,
    questions_count: 18,
    subject: {
      id: 'cs-201',
      name: 'Computer Science',
      code: 'CS201',
      color: '#EF4444'
    },
    teacher: {
      id: 'teacher-5',
      name: 'Prof. Lisa Anderson'
    },
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    is_published: true,
    student_attempts: {
      total_attempts: 1,
      remaining_attempts: 0,
      has_reached_max: true,
      latest_attempt: {
        id: 'attempt-3',
        attempt_number: 1,
        status: 'GRADED',
        total_score: 55,
        percentage: 78.57,
        passed: true,
        submitted_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      }
    },
    performance_summary: {
      highest_score: 55,
      highest_percentage: 78.57,
      overall_achievable_mark: 70,
      best_attempt: {
        id: 'attempt-3',
        attempt_number: 1,
        status: 'GRADED',
        total_score: 55,
        percentage: 78.57,
        passed: true,
        submitted_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    },
    _count: {
      questions: 18
    }
  },
  {
    id: 'mock-assessment-6',
    title: 'History Essay - World War II',
    description: 'Write a comprehensive essay analyzing the causes and consequences of World War II.',
    assessment_type: 'OTHER',
    status: 'DRAFT',
    duration: 180,
    total_points: 100,
    max_attempts: 2,
    passing_score: 60,
    questions_count: 1,
    subject: {
      id: 'hist-101',
      name: 'History',
      code: 'HIST101',
      color: '#F97316'
    },
    teacher: {
      id: 'teacher-6',
      name: 'Dr. Robert Thompson'
    },
    due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    is_published: false,
    student_attempts: {
      total_attempts: 0,
      remaining_attempts: 2,
      has_reached_max: false,
      latest_attempt: null
    },
    performance_summary: {
      highest_score: 0,
      highest_percentage: 0,
      overall_achievable_mark: 100,
      best_attempt: null
    },
    _count: {
      questions: 1
    }
  }
];

// Mock Assessment Questions
export const mockAssessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q1',
    question_text: 'What is the value of x in the equation 2x + 5 = 13?',
    question_type: 'MULTIPLE_CHOICE',
    points: 5,
    order: 1,
    explanation: 'To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
    options: [
      { id: 'opt1', text: 'x = 3', is_correct: false, order: 1 },
      { id: 'opt2', text: 'x = 4', is_correct: true, order: 2 },
      { id: 'opt3', text: 'x = 5', is_correct: false, order: 3 },
      { id: 'opt4', text: 'x = 6', is_correct: false, order: 4 }
    ],
    correct_answers: [
      { id: 'ca1', option_ids: ['opt2'] }
    ]
  },
  {
    id: 'q2',
    question_text: 'Which of the following is a quadratic equation?',
    question_type: 'MULTIPLE_CHOICE',
    points: 5,
    order: 2,
    explanation: 'A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0',
    options: [
      { id: 'opt5', text: '2x + 3 = 0', is_correct: false, order: 1 },
      { id: 'opt6', text: 'x² + 2x + 1 = 0', is_correct: true, order: 2 },
      { id: 'opt7', text: '3x³ + 2x = 0', is_correct: false, order: 3 },
      { id: 'opt8', text: 'x + y = 5', is_correct: false, order: 4 }
    ],
    correct_answers: [
      { id: 'ca2', option_ids: ['opt6'] }
    ]
  },
  {
    id: 'q3',
    question_text: 'True or False: The graph of y = x² is a straight line.',
    question_type: 'TRUE_FALSE',
    points: 3,
    order: 3,
    explanation: 'The graph of y = x² is a parabola, not a straight line. Straight lines have the form y = mx + b.',
    options: [
      { id: 'opt9', text: 'True', is_correct: false, order: 1 },
      { id: 'opt10', text: 'False', is_correct: true, order: 2 }
    ],
    correct_answers: [
      { id: 'ca3', option_ids: ['opt10'] }
    ]
  },
  {
    id: 'q4',
    question_text: 'Solve for x: 3x - 7 = 2x + 1',
    question_type: 'FILL_IN_BLANK',
    points: 4,
    order: 4,
    explanation: '3x - 7 = 2x + 1 → 3x - 2x = 1 + 7 → x = 8',
    options: [],
    correct_answers: [
      { id: 'ca4', option_ids: [] }
    ]
  },
  {
    id: 'q5',
    question_text: 'Explain the difference between linear and quadratic functions.',
    question_type: 'ESSAY',
    points: 10,
    order: 5,
    explanation: 'Linear functions have degree 1 and form straight lines, while quadratic functions have degree 2 and form parabolas.',
    options: [],
    correct_answers: [
      { id: 'ca5', option_ids: [] }
    ]
  }
];

// Mock Assessment Submission
export const mockAssessmentSubmission: AssessmentSubmission = {
  submission_id: 'sub-123',
  attempt_number: 1,
  status: 'GRADED',
  total_score: 22,
  percentage: 81.48,
  passed: true,
  grade_letter: 'B+',
  time_spent: 25,
  started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  submitted_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  graded_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  is_graded: true,
  overall_feedback: 'Good work! You demonstrated a solid understanding of algebraic concepts. Pay attention to the quadratic equation identification.',
  questions: [
    {
      id: 'q1',
      question_text: 'What is the value of x in the equation 2x + 5 = 13?',
      question_image: null,
      question_type: 'MULTIPLE_CHOICE_SINGLE',
      points: 5,
      order: 1,
      explanation: 'To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
      options: [
        { id: 'opt1', text: 'x = 3', is_correct: false, order: 1, is_selected: false },
        { id: 'opt2', text: 'x = 4', is_correct: true, order: 2, is_selected: true },
        { id: 'opt3', text: 'x = 5', is_correct: false, order: 3, is_selected: false },
        { id: 'opt4', text: 'x = 6', is_correct: false, order: 4, is_selected: false }
      ],
      user_answer: {
        text_answer: null,
        numeric_answer: null,
        selected_options: [
          { id: 'opt2', text: 'x = 4', is_correct: true }
        ],
        is_correct: true,
        points_earned: 5,
        answered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      correct_answers: []
    },
    {
      id: 'q2',
      question_text: 'Which of the following is a quadratic equation?',
      question_image: null,
      question_type: 'MULTIPLE_CHOICE_SINGLE',
      points: 5,
      order: 2,
      explanation: 'A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0',
      options: [
        { id: 'opt5', text: '2x + 3 = 0', is_correct: false, order: 1, is_selected: false },
        { id: 'opt6', text: 'x² + 2x + 1 = 0', is_correct: true, order: 2, is_selected: true },
        { id: 'opt7', text: '3x³ + 2x = 0', is_correct: false, order: 3, is_selected: false },
        { id: 'opt8', text: 'x + y = 5', is_correct: false, order: 4, is_selected: false }
      ],
      user_answer: {
        text_answer: null,
        numeric_answer: null,
        selected_options: [
          { id: 'opt6', text: 'x² + 2x + 1 = 0', is_correct: true }
        ],
        is_correct: true,
        points_earned: 5,
        answered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      correct_answers: []
    },
    {
      id: 'q3',
      question_text: 'True or False: The graph of y = x² is a straight line.',
      question_image: null,
      question_type: 'TRUE_FALSE',
      points: 3,
      order: 3,
      explanation: 'The graph of y = x² is a parabola, not a straight line. Straight lines have the form y = mx + b.',
      options: [
        { id: 'opt9', text: 'True', is_correct: false, order: 1, is_selected: false },
        { id: 'opt10', text: 'False', is_correct: true, order: 2, is_selected: true }
      ],
      user_answer: {
        text_answer: null,
        numeric_answer: null,
        selected_options: [
          { id: 'opt10', text: 'False', is_correct: true }
        ],
        is_correct: true,
        points_earned: 3,
        answered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      correct_answers: []
    },
    {
      id: 'q4',
      question_text: 'Solve for x: 3x - 7 = 2x + 1',
      question_image: null,
      question_type: 'FILL_IN_BLANK',
      points: 4,
      order: 4,
      explanation: '3x - 7 = 2x + 1 → 3x - 2x = 1 + 7 → x = 8',
      options: [],
      user_answer: {
        text_answer: '8',
        numeric_answer: 8,
        selected_options: [],
        is_correct: true,
        points_earned: 4,
        answered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      correct_answers: []
    },
    {
      id: 'q5',
      question_text: 'Explain the difference between linear and quadratic functions.',
      question_image: null,
      question_type: 'ESSAY',
      points: 10,
      order: 5,
      explanation: 'Linear functions have degree 1 and form straight lines, while quadratic functions have degree 2 and form parabolas.',
      options: [],
      user_answer: {
        text_answer: 'Linear functions have a degree of 1 and create straight lines when graphed, while quadratic functions have a degree of 2 and create parabolic curves. Linear functions follow the form y = mx + b, while quadratic functions follow the form y = ax² + bx + c.',
        numeric_answer: null,
        selected_options: [],
        is_correct: true,
        points_earned: 9,
        answered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      correct_answers: []
    }
  ],
  total_questions: 5,
  questions_answered: 5,
  questions_correct: 5
};

// Mock API Responses
export const mockStudentAssessmentsResponse: StudentAssessmentsResponse = {
  success: true,
  message: 'Assessments retrieved successfully',
  data: {
    general_info: {
      current_session: {
        academic_year: '2024/2025',
        term: 'First Term'
      }
    },
    assessments: mockAssessments,
    grouped_assessments: [
      {
        assessment_type: 'QUIZ',
        status: 'ACTIVE',
        count: 1,
        assessments: mockAssessments.filter(a => a.assessment_type === 'QUIZ')
      },
      {
        assessment_type: 'EXAM',
        status: 'ACTIVE',
        count: 1,
        assessments: mockAssessments.filter(a => a.assessment_type === 'EXAM')
      },
      {
        assessment_type: 'ASSIGNMENT',
        status: 'ACTIVE',
        count: 1,
        assessments: mockAssessments.filter(a => a.assessment_type === 'ASSIGNMENT')
      },
      {
        assessment_type: 'PRACTICE',
        status: 'ACTIVE',
        count: 1,
        assessments: mockAssessments.filter(a => a.assessment_type === 'PRACTICE')
      },
      {
        assessment_type: 'CBT',
        status: 'ACTIVE',
        count: 1,
        assessments: mockAssessments.filter(a => a.assessment_type === 'CBT')
      },
      {
        assessment_type: 'OTHER',
        status: 'DRAFT',
        count: 1,
        assessments: mockAssessments.filter(a => a.assessment_type === 'OTHER')
      }
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: mockAssessments.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    },
    filters: {
      search: '',
      assessment_type: '',
      status: ''
    }
  },
  statusCode: 200
};

export const mockAssessmentQuestionsResponse: AssessmentQuestionsResponse = {
  success: true,
  message: 'Assessment questions retrieved successfully',
  data: {
    assessment: {
      id: 'mock-assessment-1',
      title: 'Mathematics Quiz - Algebra Basics',
      description: 'Test your understanding of basic algebraic concepts including equations, inequalities, and graphing.',
      assessment_type: 'QUIZ',
      status: 'ACTIVE',
      duration: 30,
      total_points: 50,
      max_attempts: 3,
      passing_score: 30,
      instructions: 'Read each question carefully and select the best answer. You have 30 minutes to complete this quiz. Good luck!',
      subject: {
        id: 'math-101',
        name: 'Mathematics',
        code: 'MATH101',
        color: '#3B82F6'
      },
      teacher: {
        id: 'teacher-1',
        name: 'Dr. Sarah Johnson'
      },
      start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      student_attempts: 0,
      remaining_attempts: 3
    },
    questions: mockAssessmentQuestions,
    total_questions: mockAssessmentQuestions.length,
    total_points: mockAssessmentQuestions.reduce((sum, q) => sum + q.points, 0),
    estimated_duration: 30
  },
  statusCode: 200
};

export const mockAssessmentAnswersResponse: AssessmentAnswersResponse = {
  success: true,
  message: 'Assessment answers retrieved successfully',
  data: {
    assessment: {
      id: 'mock-assessment-1',
      title: 'Mathematics Quiz - Algebra Basics',
      description: 'Test your understanding of basic algebraic concepts including equations, inequalities, and graphing.',
      assessment_type: 'QUIZ',
      status: 'ACTIVE',
      duration: 30,
      total_points: 50,
      max_attempts: 3,
      passing_score: 30,
      instructions: 'Read each question carefully and select the best answer. You have 30 minutes to complete this quiz. Good luck!',
      subject: {
        id: 'math-101',
        name: 'Mathematics',
        code: 'MATH101',
        color: '#3B82F6'
      },
      teacher: {
        id: 'teacher-1',
        name: 'Dr. Sarah Johnson'
      },
      start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      is_published: true,
      total_attempts: 1,
      remaining_attempts: 2
    },
    submissions: [mockAssessmentSubmission],
    total_questions: 5,
    total_points: 50,
    estimated_duration: 30,
    submission_summary: {
      total_submissions: 1,
      latest_submission: mockAssessmentSubmission,
      best_score: 22,
      best_percentage: 81.48,
      passed_attempts: 1
    }
  }
};
