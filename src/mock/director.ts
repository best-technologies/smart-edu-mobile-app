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
      { className: 'grade10a', subject: 'mathematics', teacher: 'Ada Lovelace', startTime: '10:00', endTime: '11:00' },
    ],
    notifications: [
      { id: 'notif_abc123', title: 'Staff Meeting', description: 'Monthly staff meeting in the hall', type: 'school_director', comingUpOn: 'Aug 16, 2025, 9:00 AM', createdAt: 'Aug 15, 2025, 4:12 PM' },
      { id: 'notif_def456', title: 'Fee Reminder', description: 'Send outstanding fee reminders', type: 'all', comingUpOn: null, createdAt: 'Aug 14, 2025, 8:30 AM' },
    ],
  },
  statusCode: 200,
};
