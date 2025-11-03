// Mock data for Parent role - Self-contained within parent folder

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  class: string;
  studentId: string;
  profileImage?: string;
  overallGrade: string;
  attendance: number; // percentage
  status: 'excellent' | 'good' | 'average' | 'needs-attention';
}

export interface AcademicReport {
  id: string;
  childId: string;
  childName: string;
  subject: string;
  grade: string;
  percentage: number;
  teacher: string;
  term: string;
  date: string;
  comment?: string;
}

export interface AttendanceRecord {
  id: string;
  childId: string;
  childName: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
}

export interface Communication {
  id: string;
  type: 'message' | 'notification' | 'alert' | 'announcement';
  from: string;
  fromRole: 'teacher' | 'director' | 'admin';
  subject: string;
  message: string;
  date: string;
  read: boolean;
  childId?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'exam' | 'meeting' | 'event' | 'deadline';
  childId?: string; // if specific to a child
  childName?: string;
}

export interface RecentActivity {
  id: string;
  childId: string;
  childName: string;
  type: 'assignment' | 'test' | 'attendance' | 'behavior' | 'achievement';
  title: string;
  description: string;
  date: string;
  icon: string;
  color: string;
}

// Mock Children Data
export const mockChildren: Child[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    grade: 'Grade 10',
    class: '10A',
    studentId: 'STU001',
    overallGrade: 'A',
    attendance: 95,
    status: 'excellent',
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Johnson',
    grade: 'Grade 7',
    class: '7B',
    studentId: 'STU002',
    overallGrade: 'B+',
    attendance: 88,
    status: 'good',
  },
  {
    id: '3',
    firstName: 'Emma',
    lastName: 'Johnson',
    grade: 'Grade 5',
    class: '5C',
    studentId: 'STU003',
    overallGrade: 'A-',
    attendance: 92,
    status: 'excellent',
  },
];

// Mock Academic Reports
export const mockAcademicReports: AcademicReport[] = [
  {
    id: '1',
    childId: '1',
    childName: 'Sarah Johnson',
    subject: 'Mathematics',
    grade: 'A',
    percentage: 92,
    teacher: 'Mr. Davis',
    term: 'Term 1',
    date: '2025-10-15',
    comment: 'Excellent performance. Shows strong problem-solving skills.',
  },
  {
    id: '2',
    childId: '1',
    childName: 'Sarah Johnson',
    subject: 'English Literature',
    grade: 'A',
    percentage: 90,
    teacher: 'Mrs. Anderson',
    term: 'Term 1',
    date: '2025-10-15',
    comment: 'Outstanding analytical writing skills.',
  },
  {
    id: '3',
    childId: '2',
    childName: 'Michael Johnson',
    subject: 'Science',
    grade: 'B+',
    percentage: 85,
    teacher: 'Dr. Smith',
    term: 'Term 1',
    date: '2025-10-15',
    comment: 'Good understanding. Could improve lab work participation.',
  },
  {
    id: '4',
    childId: '2',
    childName: 'Michael Johnson',
    subject: 'Mathematics',
    grade: 'B',
    percentage: 82,
    teacher: 'Ms. Johnson',
    term: 'Term 1',
    date: '2025-10-15',
  },
  {
    id: '5',
    childId: '3',
    childName: 'Emma Johnson',
    subject: 'Reading',
    grade: 'A-',
    percentage: 88,
    teacher: 'Mrs. Brown',
    term: 'Term 1',
    date: '2025-10-15',
    comment: 'Wonderful progress this term!',
  },
];

// Mock Attendance Records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    childId: '1',
    childName: 'Sarah Johnson',
    date: '2025-10-24',
    status: 'present',
  },
  {
    id: '2',
    childId: '2',
    childName: 'Michael Johnson',
    date: '2025-10-24',
    status: 'present',
  },
  {
    id: '3',
    childId: '3',
    childName: 'Emma Johnson',
    date: '2025-10-24',
    status: 'present',
  },
  {
    id: '4',
    childId: '2',
    childName: 'Michael Johnson',
    date: '2025-10-21',
    status: 'late',
    reason: 'Medical appointment',
  },
  {
    id: '5',
    childId: '3',
    childName: 'Emma Johnson',
    date: '2025-10-18',
    status: 'absent',
    reason: 'Sick',
  },
];

// Mock Communications
export const mockCommunications: Communication[] = [
  {
    id: '1',
    type: 'message',
    from: 'Mr. Davis',
    fromRole: 'teacher',
    subject: 'Parent-Teacher Conference',
    message: 'I would like to schedule a meeting to discuss Sarah\'s excellent progress in Mathematics. Please let me know your availability.',
    date: '2025-10-23',
    read: false,
    childId: '1',
    priority: 'medium',
  },
  {
    id: '2',
    type: 'notification',
    from: 'School Administration',
    fromRole: 'admin',
    subject: 'School Fee Reminder',
    message: 'This is a friendly reminder that the second term fees are due by November 1st, 2025.',
    date: '2025-10-22',
    read: true,
    priority: 'high',
  },
  {
    id: '3',
    type: 'alert',
    from: 'Dr. Smith',
    fromRole: 'teacher',
    subject: 'Science Project Deadline',
    message: 'Michael\'s science project is due next week. Please ensure he completes it on time.',
    date: '2025-10-20',
    read: true,
    childId: '2',
    priority: 'high',
  },
  {
    id: '4',
    type: 'announcement',
    from: 'School Director',
    fromRole: 'director',
    subject: 'Annual Sports Day',
    message: 'Our annual sports day will be held on November 15th. All parents are invited to attend.',
    date: '2025-10-19',
    read: true,
    priority: 'low',
  },
  {
    id: '5',
    type: 'message',
    from: 'Mrs. Brown',
    fromRole: 'teacher',
    subject: 'Great Progress!',
    message: 'Emma has shown wonderful improvement in her reading skills. Keep up the great work!',
    date: '2025-10-18',
    read: true,
    childId: '3',
    priority: 'low',
  },
];

// Mock Upcoming Events
export const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: '1',
    title: 'Mathematics Final Exam',
    description: 'End of term examination',
    date: '2025-11-05',
    time: '09:00 AM',
    type: 'exam',
    childId: '1',
    childName: 'Sarah Johnson',
  },
  {
    id: '2',
    title: 'Parent-Teacher Meeting',
    description: 'Discuss academic progress',
    date: '2025-11-08',
    time: '02:00 PM',
    type: 'meeting',
  },
  {
    id: '3',
    title: 'Science Project Submission',
    description: 'Final project deadline',
    date: '2025-10-30',
    time: '03:30 PM',
    type: 'deadline',
    childId: '2',
    childName: 'Michael Johnson',
  },
  {
    id: '4',
    title: 'School Sports Day',
    description: 'Annual sports event',
    date: '2025-11-15',
    time: '08:00 AM',
    type: 'event',
  },
  {
    id: '5',
    title: 'Reading Competition',
    description: 'Inter-class reading competition',
    date: '2025-11-12',
    time: '10:00 AM',
    type: 'event',
    childId: '3',
    childName: 'Emma Johnson',
  },
];

// Mock Recent Activity
export const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    childId: '1',
    childName: 'Sarah',
    type: 'test',
    title: 'Math Quiz - Excellent Score',
    description: 'Scored 95% on Algebra quiz',
    date: '2025-10-23',
    icon: 'trophy',
    color: '#10b981',
  },
  {
    id: '2',
    childId: '2',
    childName: 'Michael',
    type: 'assignment',
    title: 'Science Assignment Submitted',
    description: 'Lab report submitted on time',
    date: '2025-10-22',
    icon: 'checkmark-circle',
    color: '#3b82f6',
  },
  {
    id: '3',
    childId: '3',
    childName: 'Emma',
    type: 'achievement',
    title: 'Star Reader Award',
    description: 'Completed 10 books this month',
    date: '2025-10-21',
    icon: 'star',
    color: '#f59e0b',
  },
  {
    id: '4',
    childId: '2',
    childName: 'Michael',
    type: 'attendance',
    title: 'Late Arrival',
    description: 'Arrived 15 minutes late',
    date: '2025-10-21',
    icon: 'time',
    color: '#ef4444',
  },
  {
    id: '5',
    childId: '1',
    childName: 'Sarah',
    type: 'behavior',
    title: 'Class Monitor Elected',
    description: 'Selected as class monitor for the term',
    date: '2025-10-20',
    icon: 'ribbon',
    color: '#8b5cf6',
  },
];

// Helper functions
export const getChildById = (id: string): Child | undefined => {
  return mockChildren.find(child => child.id === id);
};

export const getReportsByChildId = (childId: string): AcademicReport[] => {
  return mockAcademicReports.filter(report => report.childId === childId);
};

export const getAttendanceByChildId = (childId: string): AttendanceRecord[] => {
  return mockAttendanceRecords.filter(record => record.childId === childId);
};

export const getCommunicationsByChildId = (childId: string): Communication[] => {
  return mockCommunications.filter(comm => comm.childId === childId);
};

export const getUnreadCommunicationsCount = (): number => {
  return mockCommunications.filter(comm => !comm.read).length;
};

export const getUpcomingEventsByChildId = (childId: string): UpcomingEvent[] => {
  return mockUpcomingEvents.filter(event => event.childId === childId);
};

export const getRecentActivityByChildId = (childId: string): RecentActivity[] => {
  return mockRecentActivity.filter(activity => activity.childId === childId);
};

