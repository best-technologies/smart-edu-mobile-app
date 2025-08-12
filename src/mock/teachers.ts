export type TeacherContact = {
  phone: string;
  email: string;
};

export type NextClass = {
  className: string;
  subject: string;
  startTime: string;
  endTime: string;
};

export type Teacher = {
  id: string;
  name: string;
  display_picture: string | null;
  contact: TeacherContact;
  totalSubjects: number;
  classTeacher: string;
  nextClass: NextClass | null;
  status: 'active' | 'inactive' | 'suspended';
};

export type TeachersBasicDetails = {
  totalTeachers: number;
  activeTeachers: number;
  maleTeachers: number;
  femaleTeachers: number;
};

export type TeachersDashboardPayload = {
  success: boolean;
  message: string;
  data?: {
    basic_details: TeachersBasicDetails;
    teachers: Teacher[];
  };
  statusCode?: number;
};

export const teachersDashboardData: TeachersDashboardPayload = {
  success: true,
  message: "Teachers dashboard data fetched successfully",
  data: {
    basic_details: {
      totalTeachers: 24,
      activeTeachers: 22,
      maleTeachers: 12,
      femaleTeachers: 12
    },
    teachers: [
      {
        id: "tchr_01HXYZABC123",
        name: "Ada Lovelace",
        display_picture: "https://cdn.example.com/avatars/ada.png",
        contact: {
          phone: "+1-202-555-0114",
          email: "ada@school.edu"
        },
        totalSubjects: 3,
        classTeacher: "grade10a",
        nextClass: {
          className: "grade10a",
          subject: "mathematics",
          startTime: "11:00",
          endTime: "12:00"
        },
        status: "active"
      },
      {
        id: "tchr_01HXYZDEF456",
        name: "Alan Turing",
        display_picture: null,
        contact: {
          phone: "+1-202-555-0172",
          email: "alan@school.edu"
        },
        totalSubjects: 2,
        classTeacher: "None",
        nextClass: null,
        status: "active"
      },
      {
        id: "tchr_01HXYZGHI789",
        name: "Grace Hopper",
        display_picture: "https://cdn.example.com/avatars/grace.jpg",
        contact: {
          phone: "+1-202-555-0136",
          email: "grace@school.edu"
        },
        totalSubjects: 4,
        classTeacher: "grade9b",
        nextClass: {
          className: "grade9b",
          subject: "computer_science",
          startTime: "13:00",
          endTime: "14:00"
        },
        status: "active"
      },
      {
        id: "tchr_01HXYZJKL012",
        name: "Marie Curie",
        display_picture: null,
        contact: {
          phone: "+1-202-555-0198",
          email: "marie@school.edu"
        },
        totalSubjects: 2,
        classTeacher: "grade11a",
        nextClass: {
          className: "grade11a",
          subject: "physics",
          startTime: "14:30",
          endTime: "15:30"
        },
        status: "active"
      },
      {
        id: "tchr_01HXYZMNO345",
        name: "Nikola Tesla",
        display_picture: "https://cdn.example.com/avatars/tesla.jpg",
        contact: {
          phone: "+1-202-555-0164",
          email: "tesla@school.edu"
        },
        totalSubjects: 3,
        classTeacher: "grade12b",
        nextClass: null,
        status: "active"
      }
    ]
  },
  statusCode: 200,
};
