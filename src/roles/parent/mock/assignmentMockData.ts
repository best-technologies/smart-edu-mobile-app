// Mock data for assignments, classwork, tests, and exams

export type AssignmentType = 'assignment' | 'classwork' | 'ca_test' | 'exam';
export type AssignmentStatus = 'graded' | 'pending_submission' | 'pending_grading' | 'submitted';

export interface Assignment {
  id: string;
  childId: string;
  childName: string;
  type: AssignmentType;
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  submittedDate?: string;
  status: AssignmentStatus;
  score?: number;
  maxScore?: number;
  grade?: string;
  feedback?: string;
  teacher: string;
}

// Mock Assignments Data
export const mockAssignments: Assignment[] = [
  // Sarah's Assignments
  {
    id: 'a1',
    childId: '1',
    childName: 'Sarah Johnson',
    type: 'assignment',
    title: 'Algebra Problem Set',
    subject: 'Mathematics',
    description: 'Complete exercises 1-20 from chapter 5',
    dueDate: '2025-10-30',
    submittedDate: '2025-10-28',
    status: 'graded',
    score: 18,
    maxScore: 20,
    grade: 'A',
    feedback: 'Excellent work! Very thorough solutions.',
    teacher: 'Mr. Davis',
  },
  {
    id: 'a2',
    childId: '1',
    childName: 'Sarah Johnson',
    type: 'assignment',
    title: 'Essay on Shakespeare',
    subject: 'English Literature',
    description: 'Write a 500-word essay on Hamlet',
    dueDate: '2025-11-05',
    submittedDate: '2025-10-25',
    status: 'pending_grading',
    teacher: 'Mrs. Anderson',
  },
  {
    id: 'a3',
    childId: '1',
    childName: 'Sarah Johnson',
    type: 'assignment',
    title: 'Physics Lab Report',
    subject: 'Physics',
    description: 'Document findings from pendulum experiment',
    dueDate: '2025-11-01',
    status: 'pending_submission',
    teacher: 'Dr. Wilson',
  },
  {
    id: 'a4',
    childId: '1',
    childName: 'Sarah Johnson',
    type: 'classwork',
    title: 'Cell Structure Diagram',
    subject: 'Biology',
    description: 'Draw and label a plant cell',
    dueDate: '2025-10-24',
    submittedDate: '2025-10-24',
    status: 'graded',
    score: 10,
    maxScore: 10,
    grade: 'A+',
    feedback: 'Perfect labeling!',
    teacher: 'Ms. Brown',
  },
  {
    id: 'a5',
    childId: '1',
    childName: 'Sarah Johnson',
    type: 'ca_test',
    title: 'Mid-term Math Test',
    subject: 'Mathematics',
    description: 'Continuous Assessment Test',
    dueDate: '2025-10-20',
    submittedDate: '2025-10-20',
    status: 'graded',
    score: 45,
    maxScore: 50,
    grade: 'A',
    feedback: 'Great performance!',
    teacher: 'Mr. Davis',
  },
  {
    id: 'a6',
    childId: '1',
    childName: 'Sarah Johnson',
    type: 'exam',
    title: 'First Term Final Exam',
    subject: 'Mathematics',
    description: 'Comprehensive exam covering all topics',
    dueDate: '2025-11-15',
    status: 'pending_submission',
    teacher: 'Mr. Davis',
  },

  // Michael's Assignments
  {
    id: 'a7',
    childId: '2',
    childName: 'Michael Johnson',
    type: 'assignment',
    title: 'Science Project',
    subject: 'Science',
    description: 'Build a volcano model',
    dueDate: '2025-10-30',
    submittedDate: '2025-10-29',
    status: 'graded',
    score: 16,
    maxScore: 20,
    grade: 'B+',
    feedback: 'Good effort! Creative presentation.',
    teacher: 'Dr. Smith',
  },
  {
    id: 'a8',
    childId: '2',
    childName: 'Michael Johnson',
    type: 'assignment',
    title: 'History Essay',
    subject: 'History',
    description: 'Write about World War II',
    dueDate: '2025-11-02',
    status: 'pending_submission',
    teacher: 'Mr. Thompson',
  },
  {
    id: 'a9',
    childId: '2',
    childName: 'Michael Johnson',
    type: 'classwork',
    title: 'Math Worksheet',
    subject: 'Mathematics',
    description: 'Complete fractions worksheet',
    dueDate: '2025-10-25',
    submittedDate: '2025-10-25',
    status: 'graded',
    score: 8,
    maxScore: 10,
    grade: 'B',
    teacher: 'Ms. Johnson',
  },
  {
    id: 'a10',
    childId: '2',
    childName: 'Michael Johnson',
    type: 'ca_test',
    title: 'Science Quiz',
    subject: 'Science',
    description: 'Chapter 5 quiz',
    dueDate: '2025-10-22',
    submittedDate: '2025-10-22',
    status: 'graded',
    score: 17,
    maxScore: 20,
    grade: 'B+',
    teacher: 'Dr. Smith',
  },

  // Emma's Assignments
  {
    id: 'a11',
    childId: '3',
    childName: 'Emma Johnson',
    type: 'assignment',
    title: 'Reading Comprehension',
    subject: 'Reading',
    description: 'Read chapter 3 and answer questions',
    dueDate: '2025-10-28',
    submittedDate: '2025-10-27',
    status: 'graded',
    score: 9,
    maxScore: 10,
    grade: 'A-',
    feedback: 'Great comprehension skills!',
    teacher: 'Mrs. Brown',
  },
  {
    id: 'a12',
    childId: '3',
    childName: 'Emma Johnson',
    type: 'assignment',
    title: 'Math Problems',
    subject: 'Mathematics',
    description: 'Addition and subtraction practice',
    dueDate: '2025-10-31',
    submittedDate: '2025-10-30',
    status: 'pending_grading',
    teacher: 'Ms. Lee',
  },
  {
    id: 'a13',
    childId: '3',
    childName: 'Emma Johnson',
    type: 'classwork',
    title: 'Spelling Practice',
    subject: 'English',
    description: 'Practice spelling words',
    dueDate: '2025-10-24',
    submittedDate: '2025-10-24',
    status: 'graded',
    score: 10,
    maxScore: 10,
    grade: 'A+',
    teacher: 'Mrs. Brown',
  },
];

// Helper functions
export const getAssignmentsByChild = (childId: string): Assignment[] => {
  return mockAssignments.filter(assignment => assignment.childId === childId);
};

export const getAssignmentsByChildAndType = (childId: string, type: AssignmentType): Assignment[] => {
  return mockAssignments.filter(
    assignment => assignment.childId === childId && assignment.type === type
  );
};

export const getAssignmentsByChildTypeAndStatus = (
  childId: string,
  type: AssignmentType,
  status?: AssignmentStatus
): Assignment[] => {
  let filtered = mockAssignments.filter(
    assignment => assignment.childId === childId && assignment.type === type
  );
  
  if (status) {
    filtered = filtered.filter(assignment => assignment.status === status);
  }
  
  return filtered;
};

export const getAssignmentTypeLabel = (type: AssignmentType): string => {
  switch (type) {
    case 'assignment':
      return 'Assignments';
    case 'classwork':
      return 'Classwork';
    case 'ca_test':
      return 'CA Tests';
    case 'exam':
      return 'Exams';
    default:
      return type;
  }
};

export const getStatusLabel = (status: AssignmentStatus): string => {
  switch (status) {
    case 'graded':
      return 'Graded';
    case 'pending_submission':
      return 'Pending Submission';
    case 'pending_grading':
      return 'Pending Grading';
    case 'submitted':
      return 'Submitted';
    default:
      return status;
  }
};

