export type DashboardPayload = {
  success: boolean;
  message: string;
  data?: {
    basic_details?: { email?: string; school_id?: string };
    teachers?: { totalTeachers?: number; activeClasses?: number; totalSubjects?: number };
    students?: { totalStudents?: number; activeStudents?: number; suspendedStudents?: number };
    finance?: { totalRevenue?: number; outstandingFees?: number; totalExpenses?: number; netBalance?: number };
    ongoingClasses?: Array<{ className?: string; subject?: string; teacher?: string; startTime?: string; endTime?: string }>;
    notifications?: Array<{ id: string; title?: string; description?: string; type?: string; comingUpOn?: string | null; createdAt?: string }>;
  };
  statusCode?: number;
};

// Placeholder sample data for now (would come from backend)
export const directorDashboardData: DashboardPayload = {
  success: true,
  message: 'Director dashboard data fetched successfully',
  data: {
    basic_details: { email: 'director@school.edu', school_id: 'sch_1234567890' },
    teachers: { totalTeachers: 24, activeClasses: 12, totalSubjects: 18 },
    students: { totalStudents: 520, activeStudents: 500, suspendedStudents: 20 },
    finance: { totalRevenue: 1250000, outstandingFees: 150000, totalExpenses: 300000, netBalance: 950000 },
    ongoingClasses: [
      { className: 'JSS1', subject: 'Mathematics', teacher: 'Mayowa', startTime: '10:00', endTime: '11:00' },
      { className: 'JSS2', subject: 'Physics', teacher: 'Olayemi', startTime: '11:30', endTime: '12:30' },
      { className: 'SS1', subject: 'Chemistry', teacher: 'Esther', startTime: '14:00', endTime: '15:00' },
    ],
    notifications: [
      { id: 'notif_abc123', title: 'Staff Meeting', description: 'Monthly staff meeting in the hall', type: 'school_director', comingUpOn: 'Tomorrow, 9:00 AM', createdAt: '2 hours ago' },
      { id: 'notif_def456', title: 'Fee Collection Update', description: '85% of monthly fees collected. 15% pending from 23 students.', type: 'all', comingUpOn: null, createdAt: '1 day ago' },
      { id: 'notif_ghi789', title: 'New Teacher Onboarding', description: 'Vanilla completed onboarding and will start teaching SS2 English next week.', type: 'school_director', comingUpOn: null, createdAt: '3 days ago' },
      { id: 'notif_jkl012', title: 'Parent-Teacher Conference', description: 'Scheduled for next Friday. Ensure all grade reports ready by Thursday evening.', type: 'all', comingUpOn: 'Next Friday, 2:00 PM', createdAt: '1 week ago' },
    ],
  },
  statusCode: 200,
};
