export interface DirectorProfileData {
  basicInfo: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
    profileImage?: string;
    schoolId: string;
    schoolName: string;
    employeeId: string;
    department: string;
    position: string;
    qualification: string;
    experience: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  academicInfo: {
    currentAcademicYear: string;
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalSubjects: number;
    schoolType: 'Primary' | 'Secondary' | 'Mixed';
    curriculum: string[];
    accreditation: string[];
    gradeStructure: {
      grade: string;
      classes: number;
      students: number;
    }[];
    academicCalendar: {
      termStart: string;
      termEnd: string;
      holidays: { name: string; date: string; type: 'Holiday' | 'Break' }[];
    };
  };
  resultsAnalytics: {
    overallPerformance: {
      averageGrade: number;
      passRate: number;
      improvementRate: number;
      topPerformingSubjects: string[];
      areasOfConcern: string[];
    };
    gradeWisePerformance: {
      grade: string;
      totalStudents: number;
      averageScore: number;
      passRate: number;
      topSubject: string;
    }[];
    teacherPerformance: {
      totalTeachers: number;
      avgStudentRating: number;
      topPerformers: string[];
      needsSupport: string[];
    };
    monthlyTrends: {
      month: string;
      attendance: number;
      performance: number;
      assignments: number;
    }[];
  };
  subscription: {
    plan: {
      name: 'Basic' | 'Professional' | 'Enterprise';
      tier: string;
      price: number;
      currency: string;
      billingCycle: 'Monthly' | 'Quarterly' | 'Yearly';
      startDate: string;
      endDate: string;
      status: 'Active' | 'Suspended' | 'Expired';
    };
    limits: {
      maxStudents: number;
      maxTeachers: number;
      maxFileSize: number; // in MB
      maxFilesPerUser: number;
      tokensPerStudent: number;
      tokensPerTeacher: number;
      storageLimit: number; // in GB
      aiChatSessions: number;
    };
    usage: {
      currentStudents: number;
      currentTeachers: number;
      storageUsed: number; // in GB
      tokensUsedThisMonth: number;
      filesUploaded: number;
    };
    paymentHistory: {
      id: string;
      date: string;
      amount: number;
      currency: string;
      status: 'Paid' | 'Failed' | 'Pending';
      method: string;
      invoice: string;
      plan: string;
    }[];
    features: {
      name: string;
      included: boolean;
      description: string;
    }[];
  };
  systemSettings: {
    tokenLimits: {
      studentDailyTokens: number;
      teacherDailyTokens: number;
      resetTime: string;
      warningThreshold: number;
    };
    uploadSettings: {
      maxFileSize: number;
      allowedFileTypes: string[];
      maxFilesPerStudent: number;
      maxFilesPerTeacher: number;
      autoDeleteAfter: number; // days
    };
    schoolPolicies: {
      attendanceThreshold: number;
      gradePassingMark: number;
      lateSubmissionPenalty: number;
      disciplinaryActions: string[];
    };
    integrations: {
      name: string;
      status: 'Active' | 'Inactive';
      lastSync: string;
      description: string;
    }[];
  };
}

export const mockDirectorProfile: DirectorProfileData = {
  basicInfo: {
    id: 'DIR001',
    name: 'Dr. Dada Ngozi',
    email: 'dada.ngozi1@bestacademy.edu.ng',
    phone: '+234 816 011 3403',
    address: '126, Obafemi Awolowo way, Oke Ado, Ibadan, Oyo State',
    joinDate: '2019-08-15',
    profileImage: 'https://randomuser.me/api/portraits/women/47.jpg',
    schoolId: 'BES001',
    schoolName: 'Best Academy',
    employeeId: 'EMP2019001',
    department: 'Administration',
    position: 'School Director',
    qualification: 'PhD in Educational Leadership, M.Ed in School Administration',
    experience: '15 years in education, 8 years in leadership roles',
    emergencyContact: {
      name: 'Micheal Ngozi',
      relationship: 'Father',
      phone: '+234 816 011 3403',
    },
  },
  academicInfo: {
    currentAcademicYear: '2024-2025',
    totalStudents: 90,
    totalTeachers: 12,
    totalClasses: 12,
    totalSubjects: 28,
    schoolType: 'Mixed',
    curriculum: ['Common Core Standards', 'STEM Enhanced', 'Arts Integration'],
    accreditation: ['State Board Accredited', 'NECO Certified'],
    gradeStructure: [
      { grade: 'Nursery', classes: 3, students: 9 },
      { grade: 'Grade 1', classes: 4, students: 15 },
      { grade: 'Grade 2', classes: 4, students: 15 },
      { grade: 'Grade 4', classes: 4, students: 15 },
      { grade: 'Grade 5', classes: 4, students: 104 },
      { grade: 'Grade 6', classes: 4, students: 15 },
      { grade: 'Grade 7', classes: 3, students: 15 },
        { grade: 'Grade 7', classes: 3, students: 15 },
      { grade: 'Grade 8', classes: 3, students: 15 },
      { grade: 'Grade 9', classes: 3, students: 15 },
      { grade: 'Grade 10', classes: 3, students: 15 },
      { grade: 'Grade 11', classes: 2, students: 15 },
      { grade: 'Grade 12', classes: 2, students: 15 },
    ],
    academicCalendar: {
      termStart: '2024-08-26',
      termEnd: '2025-06-12',
      holidays: [
        { name: 'Christmas Break', date: '2024-09-02', type: 'Holiday' },
        { name: 'Eid ul-Adha', date: '2024-11-28', type: 'Break' },
        { name: 'Christmas Break', date: '2024-12-23', type: 'Break' },
        { name: 'Eid ul-Fitr', date: '2025-03-24', type: 'Break' },
        { name: 'Independence Day', date: '2025-05-26', type: 'Holiday' },
      ],
    },
  },
  resultsAnalytics: {
    overallPerformance: {
      averageGrade: 4.4,
      passRate: 94.2,
      improvementRate: 8.7,
      topPerformingSubjects: ['Mathematics', 'Science', 'English'],
      areasOfConcern: ['Physical Education', 'Social Studies'],
    },
    gradeWisePerformance: [
      { grade: 'Grade 9', totalStudents: 15, averageScore: 87.3, passRate: 95.9, topSubject: 'Biology' },
      { grade: 'Grade 10', totalStudents: 15, averageScore: 84.7, passRate: 93.7, topSubject: 'Chemistry' },
      { grade: 'Grade 11', totalStudents: 15, averageScore: 82.1, passRate: 91.2, topSubject: 'Physics' },
      { grade: 'Grade 12', totalStudents: 15, averageScore: 85.9, passRate: 95.5, topSubject: 'Mathematics' },
    ],
    teacherPerformance: {
      totalTeachers: 12,
      avgStudentRating: 4.3,
      topPerformers: ['Dr. Sarah Smith', 'Prof. Michael Rodriguez', 'Ms. Emily Awopeju'],
      needsSupport: ['Mr. John Smith', 'Ms. Lisa Brown'],
    },
    monthlyTrends: [
      { month: 'Jan', attendance: 96.2, performance: 87.1, assignments: 92.3 },
      { month: 'Feb', attendance: 94.8, performance: 88.4, assignments: 89.7 },
      { month: 'Mar', attendance: 95.7, performance: 86.9, assignments: 91.2 },
      { month: 'Apr', attendance: 97.1, performance: 89.2, assignments: 94.5 },
      { month: 'May', attendance: 93.4, performance: 85.7, assignments: 87.8 },
      { month: 'Jun', attendance: 92.8, performance: 84.3, assignments: 86.1 },
    ],
  },
  subscription: {
    plan: {
      name: 'Professional',
      tier: 'Pro',
      price: 2499000,
      currency: 'NGN',
      billingCycle: 'Yearly',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      status: 'Active',
    },
    limits: {
      maxStudents: 90,
      maxTeachers: 12,
      maxFileSize: 50, // MB
      maxFilesPerUser: 100,
      tokensPerStudent: 100,
      tokensPerTeacher: 50000,
      storageLimit: 100, // GB
      aiChatSessions: 1000,
    },
    usage: {
      currentStudents: 90,
      currentTeachers: 12,
      storageUsed: 287.4,
      tokensUsedThisMonth: 156789,
      filesUploaded: 4892,
    },
    paymentHistory: [
      {
        id: 'PAY-2025-001',
        date: '2025-01-01',
        amount: 2499000,
        currency: 'NGN',
        status: 'Paid',
        method: 'Credit Card',
        invoice: 'INV-2025-001',
        plan: 'Professional Annual',
      },
      {
        id: 'PAY-2025-002',
        date: '2025-01-01',
        amount: 2299000,
        currency: 'NGN',
        status: 'Paid',
        method: 'Bank Transfer',
        invoice: 'INV-2025-002',
        plan: 'Professional Annual',
      },
      {
        id: 'PAY-2025-003',
        date: '2025-01-01',
        amount: 1999000,
        currency: 'NGN',
        status: 'Paid',
        method: 'Credit Card',
        invoice: 'INV-2025-003',
        plan: 'Professional Annual',
      },
    ],
    features: [
      { name: 'AI Chat Assistant', included: true, description: 'Unlimited AI-powered educational assistance' },
      { name: 'Advanced Analytics', included: true, description: 'Detailed performance tracking and insights' },
      { name: 'Custom Assessments', included: true, description: 'Create and manage custom tests and quizzes' },
      { name: 'Bulk File Upload', included: true, description: 'Upload multiple files simultaneously' },
      { name: 'Priority Support', included: true, description: '24/7 dedicated customer support' },
      { name: 'API Access', included: false, description: 'Integration with third-party systems' },
      { name: 'White Label', included: false, description: 'Custom branding options' },
    ],
  },
  systemSettings: {
    tokenLimits: {
      studentDailyTokens: 30000,
      teacherDailyTokens: 50000,
      resetTime: '00:00',
      warningThreshold: 80,
    },
    uploadSettings: {
      maxFileSize: 100,
      allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'jpg', 'png'],
      maxFilesPerStudent: 100,
      maxFilesPerTeacher: 100,
      autoDeleteAfter: 365,
    },
    schoolPolicies: {
      attendanceThreshold: 90,
      gradePassingMark: 60,
      lateSubmissionPenalty: 10,
      disciplinaryActions: ['Warning', 'Detention', 'Suspension', 'Parent Conference'],
    },
    integrations: [
      { name: 'Best Academy', status: 'Active', lastSync: '2024-01-15T10:30:00Z', description: 'Sync assignments and grades' },
      { name: 'Best Academy', status: 'Active', lastSync: '2024-01-15T09:15:00Z', description: 'Video conferencing integration' },
      { name: 'Best Academy', status: 'Inactive', lastSync: '2024-01-10T14:20:00Z', description: 'Alternative video platform' },
      { name: 'Best Academy', status: 'Active', lastSync: '2024-01-15T08:45:00Z', description: 'Student information system' },
    ],
  },
};
