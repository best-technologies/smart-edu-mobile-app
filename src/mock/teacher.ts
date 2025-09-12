export type QuickAction = {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress?: () => void;
  isAnimated?: boolean;
};

export type QuickStat = {
  id: string;
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
};

export type ClassSchedule = {
  id: string;
  subject: string;
  classCode: string;
  startTime: string;
  endTime: string;
  room: string;
  color: string;
};

export type DayClasses = {
  day: string;
  icon: string;
  color: string;
  classes: ClassSchedule[];
};

export type TeacherDashboardData = {
  quickActions: QuickAction[];
  quickStats: QuickStat[];
  upcomingClasses: DayClasses[];
};

export const teacherDashboardData: TeacherDashboardData = {
  quickActions: [
    {
      id: "attendance",
      title: "Mark Attendance",
      icon: "checkmark-circle-outline",
      color: "#3B82F6"
    },
    {
      id: "assignment",
      title: "Create Assignment",
      icon: "document-text-outline",
      color: "#10B981"
    },
    {
      id: "message",
      title: "Message Class",
      icon: "chatbubble-outline",
      color: "#F59E0B"
    },
    {
      id: "grades",
      title: "Enter Grades",
      icon: "bar-chart-outline",
      color: "#8B5CF6"
    }
  ],
  quickStats: [
    {
      id: "students",
      title: "Students",
      value: "124",
      icon: "people-outline",
      color: "#8B5CF6",
      trend: "up"
    },
    {
      id: "attendance",
      title: "Attendance",
      value: "91%",
      icon: "calendar-outline",
      color: "#3B82F6",
      trend: "up"
    },
    {
      id: "performance",
      title: "Performance",
      value: "83%",
      icon: "bar-chart-outline",
      color: "#F59E0B",
      trend: "neutral"
    },
    {
      id: "pending-grades",
      title: "Pending Grades",
      value: "12",
      icon: "book-outline",
      color: "#10B981",
      trend: "down"
    }
  ],
  upcomingClasses: [
    {
      day: "Today's Classes",
      icon: "time-outline",
      color: "#10B981",
      classes: [
        {
          id: "1",
          subject: "Mathematics",
          classCode: "JSS 3C",
          startTime: "09:00",
          endTime: "10:00",
          room: "Room 303",
          color: "#EF4444"
        },
        {
          id: "2",
          subject: "Physics",
          classCode: "SS 1A",
          startTime: "10:00",
          endTime: "11:00",
          room: "Lab 101",
          color: "#3B82F6"
        },
        {
          id: "3",
          subject: "History",
          classCode: "SS 2B",
          startTime: "11:00",
          endTime: "12:00",
          room: "Room 202",
          color: "#10B981"
        }
      ]
    },
    {
      day: "Thursday's Classes",
      icon: "time-outline",
      color: "#F59E0B",
      classes: [
        {
          id: "4",
          subject: "Biology",
          classCode: "SS 1A",
          startTime: "09:30",
          endTime: "11:00",
          room: "Lab 301",
          color: "#10B981"
        },
        {
          id: "5",
          subject: "Geography",
          classCode: "SS 2B",
          startTime: "13:00",
          endTime: "14:30",
          room: "Room 405",
          color: "#F59E0B"
        }
      ]
    },
    {
      day: "Friday's Classes",
      icon: "time-outline",
      color: "#EC4899",
      classes: [
        {
          id: "6",
          subject: "Art",
          classCode: "JSS 3C",
          startTime: "08:00",
          endTime: "09:30",
          room: "Art Studio",
          color: "#EC4899"
        },
        {
          id: "7",
          subject: "History",
          classCode: "SS 2B",
          startTime: "11:00",
          endTime: "12:00",
          room: "Room 202",
          color: "#10B981"
        },
        {
          id: "8",
          subject: "Music",
          classCode: "JSS 3C",
          startTime: "15:00",
          endTime: "16:30",
          room: "Music Room",
          color: "#3B82F6"
        }
      ]
    }
  ]
};
