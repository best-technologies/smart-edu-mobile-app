export interface StudentDashboardData {
  success: boolean;
  message: string;
  data: {
    general_info: {
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
        display_picture: any;
      };
      student: {
        id: string;
        name: string;
        email: string;
        display_picture: any;
      };
      current_date: string;
      current_time: string;
    };
    stats: {
      total_subjects: number;
      pending_assessments: number;
    };
    subjects_enrolled: Array<{
      id: string;
      name: string;
      code: string;
      color: string;
      teacher: {
        id: string;
        name: string;
        display_picture: any;
      };
    }>;
    class_schedule: {
      today: {
        day: string;
        schedule: Array<{
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
        }>;
      };
      tomorrow: {
        day: string;
        schedule: Array<{
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
        }>;
      };
      day_after_tomorrow: {
        day: string;
        schedule: Array<{
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
        }>;
      };
    };
    notifications: Array<{
      id: string;
      title: string;
      description: string;
      type: string;
      comingUpOn: string;
      createdAt: string;
    }>;
  };
}

export const mockStudentDashboardData: StudentDashboardData = {
  success: true,
  message: "Student dashboard fetched successfully",
  data: {
    general_info: {
      current_session: {
        academic_year: "2024/2025",
        term: "first",
        start_date: "2024-09-01T00:00:00.000Z",
        end_date: "2024-12-20T00:00:00.000Z"
      },
      student_class: {
        id: "class_001",
        name: "Primary 5A"
      },
      class_teacher: {
        id: "teacher_001",
        name: "Mrs. Sarah Johnson",
        display_picture: null
      },
      student: {
        id: "student_001",
        name: "Jane Smith",
        email: "jane.smith@school.edu",
        display_picture: null
      },
      current_date: "2024-01-15",
      current_time: "14:30"
    },
    stats: {
      total_subjects: 6,
      pending_assessments: 3
    },
    subjects_enrolled: [
      {
        id: "subj_001",
        name: "Mathematics",
        code: "MATH101",
        color: "#3B82F6",
        teacher: {
          id: "teacher_001",
          name: "Mrs. Sarah Johnson",
          display_picture: null
        }
      },
      {
        id: "subj_002",
        name: "English Language",
        code: "ENG101",
        color: "#10B981",
        teacher: {
          id: "teacher_002",
          name: "Mr. David Wilson",
          display_picture: null
        }
      },
      {
        id: "subj_003",
        name: "Science",
        code: "SCI101",
        color: "#F59E0B",
        teacher: {
          id: "teacher_003",
          name: "Dr. Emily Brown",
          display_picture: null
        }
      },
      {
        id: "subj_004",
        name: "Social Studies",
        code: "SOC101",
        color: "#EF4444",
        teacher: {
          id: "teacher_004",
          name: "Ms. Lisa Davis",
          display_picture: null
        }
      },
      {
        id: "subj_005",
        name: "Physical Education",
        code: "PE101",
        color: "#8B5CF6",
        teacher: {
          id: "teacher_005",
          name: "Coach Mike Taylor",
          display_picture: null
        }
      },
      {
        id: "subj_006",
        name: "Art & Craft",
        code: "ART101",
        color: "#EC4899",
        teacher: {
          id: "teacher_006",
          name: "Mrs. Anna Martinez",
          display_picture: null
        }
      }
    ],
    class_schedule: {
      today: {
        day: "MONDAY",
        schedule: [
          {
            subject: {
              id: "subj_001",
              name: "Mathematics",
              code: "MATH101",
              color: "#3B82F6"
            },
            teacher: {
              id: "teacher_001",
              name: "Mrs. Sarah Johnson"
            },
            time: {
              from: "08:00",
              to: "09:00",
              label: "Period 1"
            },
            room: "Room 101"
          },
          {
            subject: {
              id: "subj_002",
              name: "English Language",
              code: "ENG101",
              color: "#10B981"
            },
            teacher: {
              id: "teacher_002",
              name: "Mr. David Wilson"
            },
            time: {
              from: "09:15",
              to: "10:15",
              label: "Period 2"
            },
            room: "Room 102"
          },
          {
            subject: {
              id: "subj_003",
              name: "Science",
              code: "SCI101",
              color: "#F59E0B"
            },
            teacher: {
              id: "teacher_003",
              name: "Dr. Emily Brown"
            },
            time: {
              from: "10:30",
              to: "11:30",
              label: "Period 3"
            },
            room: "Lab 1"
          }
        ]
      },
      tomorrow: {
        day: "TUESDAY",
        schedule: [
          {
            subject: {
              id: "subj_004",
              name: "Social Studies",
              code: "SOC101",
              color: "#EF4444"
            },
            teacher: {
              id: "teacher_004",
              name: "Ms. Lisa Davis"
            },
            time: {
              from: "08:00",
              to: "09:00",
              label: "Period 1"
            },
            room: "Room 103"
          },
          {
            subject: {
              id: "subj_001",
              name: "Mathematics",
              code: "MATH101",
              color: "#3B82F6"
            },
            teacher: {
              id: "teacher_001",
              name: "Mrs. Sarah Johnson"
            },
            time: {
              from: "09:15",
              to: "10:15",
              label: "Period 2"
            },
            room: "Room 101"
          },
          {
            subject: {
              id: "subj_005",
              name: "Physical Education",
              code: "PE101",
              color: "#8B5CF6"
            },
            teacher: {
              id: "teacher_005",
              name: "Coach Mike Taylor"
            },
            time: {
              from: "10:30",
              to: "11:30",
              label: "Period 3"
            },
            room: "Sports Hall"
          }
        ]
      },
      day_after_tomorrow: {
        day: "WEDNESDAY",
        schedule: [
          {
            subject: {
              id: "subj_002",
              name: "English Language",
              code: "ENG101",
              color: "#10B981"
            },
            teacher: {
              id: "teacher_002",
              name: "Mr. David Wilson"
            },
            time: {
              from: "08:00",
              to: "09:00",
              label: "Period 1"
            },
            room: "Room 102"
          },
          {
            subject: {
              id: "subj_006",
              name: "Art & Craft",
              code: "ART101",
              color: "#EC4899"
            },
            teacher: {
              id: "teacher_006",
              name: "Mrs. Anna Martinez"
            },
            time: {
              from: "09:15",
              to: "10:15",
              label: "Period 2"
            },
            room: "Art Studio"
          },
          {
            subject: {
              id: "subj_003",
              name: "Science",
              code: "SCI101",
              color: "#F59E0B"
            },
            teacher: {
              id: "teacher_003",
              name: "Dr. Emily Brown"
            },
            time: {
              from: "10:30",
              to: "11:30",
              label: "Period 3"
            },
            room: "Lab 1"
          }
        ]
      }
    },
    notifications: [
      {
        id: "notif_001",
        title: "Mathematics Exam Notice",
        description: "Mathematics exam scheduled for next week Monday. Please prepare thoroughly.",
        type: "students",
        comingUpOn: "2024-01-20T09:00:00.000Z",
        createdAt: "2024-01-15T10:00:00.000Z"
      },
      {
        id: "notif_002",
        title: "Science Project Submission",
        description: "Science project submission deadline is this Friday. Don't forget to submit your work.",
        type: "students",
        comingUpOn: "2024-01-19T15:00:00.000Z",
        createdAt: "2024-01-14T14:30:00.000Z"
      },
      {
        id: "notif_003",
        title: "Parent-Teacher Meeting",
        description: "Parent-teacher meeting scheduled for next month. Parents will receive invitations soon.",
        type: "students",
        comingUpOn: "2024-02-15T10:00:00.000Z",
        createdAt: "2024-01-13T09:00:00.000Z"
      },
      {
        id: "notif_004",
        title: "Sports Day Preparation",
        description: "Annual sports day is coming up. Practice sessions will begin next week.",
        type: "students",
        comingUpOn: "2024-02-01T08:00:00.000Z",
        createdAt: "2024-01-12T16:00:00.000Z"
      }
    ]
  }
};
