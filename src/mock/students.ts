export type StudentClass = {
  id: string;
  name: string;
  schoolId: string;
  classTeacherId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudentPerformance = {
  cgpa: number;
  term_average: number;
  improvement_rate: number;
  attendance_rate: number;
  position: number;
};

export type Student = {
  id: string;
  school_id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  display_picture: string | null;
  gender: 'male' | 'female' | 'other';
  otp: string;
  otp_expires_at: string | null;
  is_email_verified: boolean;
  is_otp_verified: boolean;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
  classesEnrolled: StudentClass[];
  student_id: string;
  current_class: string;
  next_class: string;
  next_class_time: string | null;
  next_class_teacher: string | null;
  performance: StudentPerformance;
};

export type StudentsBasicDetails = {
  totalStudents: number;
  activeStudents: number;
  totalClasses: number;
};

export type StudentsPagination = {
  total_pages: number;
  current_page: number;
  total_results: number;
  results_per_page: number;
};

export type StudentsPayload = {
  success: boolean;
  message: string;
  data?: {
    basic_details: StudentsBasicDetails;
    pagination: StudentsPagination;
    students: Student[];
  };
  statusCode?: number;
};

export const studentsDashboardData: StudentsPayload = {
  success: true,
  message: "Students dashboard data fetched successfully",
  data: {
    basic_details: {
      totalStudents: 5,
      activeStudents: 5,
      totalClasses: 6
    },
    pagination: {
      total_pages: 1,
      current_page: 1,
      total_results: 5,
      results_per_page: 10
    },
    students: [
      {
        id: "cmdog2a5t0008sb5wzxcyorfd",
        school_id: "cmdod9r2o0000sbva41dcg5zk",
        email: "gloriaomofoye16@gmail.com",
        password: "$argon2id$v=19$m=65536,t=3,p=4$VzrooRGM50gf4wuRqEzQ3Q$AxS7uR++B76jkbP7tsUQXsmnPHx91AtXO+XX3/wnHyA",
        first_name: "gloria",
        last_name: "oluwaseun",
        phone_number: "08089876323",
        display_picture: null,
        gender: "other",
        otp: "",
        otp_expires_at: null,
        is_email_verified: false,
        is_otp_verified: false,
        role: "student",
        status: "active",
        createdAt: "2025-07-29T11:19:09.042Z",
        updatedAt: "2025-07-29T11:19:09.042Z",
        classesEnrolled: [
          {
            id: "cmdog29xb0000sb5wutzv0gee",
            name: "jss1",
            schoolId: "cmdod9r2o0000sbva41dcg5zk",
            classTeacherId: "cmdoporyu0003sb54h0lcundw",
            createdAt: "2025-07-29T11:19:08.735Z",
            updatedAt: "2025-07-29T16:20:10.885Z"
          }
        ],
        student_id: "smh/2025/cmdog2a5t0008sb5wzxcyorfd",
        current_class: "jss1",
        next_class: "No classes",
        next_class_time: null,
        next_class_teacher: null,
        performance: {
          cgpa: 0,
          term_average: 0,
          improvement_rate: 0,
          attendance_rate: 0,
          position: 0
        }
      },
      {
        id: "cmdog2a5t0009sb5w0wdol07d",
        school_id: "cmdod9r2o0000sbva41dcg5zk",
        email: "raufrasheed37@gmail.com",
        password: "$argon2id$v=19$m=65536,t=3,p=4$y7Mn4K6BVn/Ts10QxPYL6A$/pwEqMieC+5c08N2RxTSdYskHNsMY9RYiK9ChcXnJko",
        first_name: "oluwaseun",
        last_name: "abdulrasheed",
        phone_number: "08052345678",
        display_picture: null,
        gender: "other",
        otp: "",
        otp_expires_at: null,
        is_email_verified: false,
        is_otp_verified: false,
        role: "student",
        status: "active",
        createdAt: "2025-07-29T11:19:09.042Z",
        updatedAt: "2025-07-29T11:19:09.042Z",
        classesEnrolled: [
          {
            id: "cmdog29xb0000sb5wutzv0gee",
            name: "jss1",
            schoolId: "cmdod9r2o0000sbva41dcg5zk",
            classTeacherId: "cmdoporyu0003sb54h0lcundw",
            createdAt: "2025-07-29T11:19:08.735Z",
            updatedAt: "2025-07-29T16:20:10.885Z"
          }
        ],
        student_id: "smh/2025/cmdog2a5t0009sb5w0wdol07d",
        current_class: "jss1",
        next_class: "No classes",
        next_class_time: null,
        next_class_teacher: null,
        performance: {
          cgpa: 0,
          term_average: 0,
          improvement_rate: 0,
          attendance_rate: 0,
          position: 0
        }
      },
      {
        id: "cmdog2a5t000asb5w2vlhyevh",
        school_id: "cmdod9r2o0000sbva41dcg5zk",
        email: "anuoluwapoakin617@gmail.com",
        password: "$argon2id$v=19$m=65536,t=3,p=4$rLw8XSLDh09pezRzxKcTvA$o0HnlWwPP5D6kjLbZKJDGLklaTZSuqnrVjfYfFoxAlY",
        first_name: "oluwanifemi",
        last_name: "abimbola",
        phone_number: "08053456789",
        display_picture: null,
        gender: "other",
        otp: "",
        otp_expires_at: null,
        is_email_verified: false,
        is_otp_verified: false,
        role: "student",
        status: "active",
        createdAt: "2025-07-29T11:19:09.042Z",
        updatedAt: "2025-07-29T11:19:09.042Z",
        classesEnrolled: [
          {
            id: "cmdog29xb0001sb5wpuffk662",
            name: "jss2",
            schoolId: "cmdod9r2o0000sbva41dcg5zk",
            classTeacherId: "cmdog2a070006sb5wqk2k7tdo",
            createdAt: "2025-07-29T11:19:08.735Z",
            updatedAt: "2025-07-29T16:45:25.691Z"
          }
        ],
        student_id: "smh/2025/cmdog2a5t000asb5w2vlhyevh",
        current_class: "jss2",
        next_class: "No classes",
        next_class_time: null,
        next_class_teacher: null,
        performance: {
          cgpa: 0,
          term_average: 0,
          improvement_rate: 0,
          attendance_rate: 0,
          position: 0
        }
      },
      {
        id: "cmdog2a5t000csb5w9xm8pukq",
        school_id: "cmdod9r2o0000sbva41dcg5zk",
        email: "olayemi@besttechnologiesltd.com",
        password: "$argon2id$v=19$m=65536,t=3,p=4$zbFnmywq5aOzZkf7EJHNJg$R51k8KeHT9zVHRNGpjsRNAQSxI6qS1wg4q9m7kaRsdw",
        first_name: "olayemi",
        last_name: "awofe",
        phone_number: "07063971464",
        display_picture: null,
        gender: "other",
        otp: "",
        otp_expires_at: null,
        is_email_verified: false,
        is_otp_verified: false,
        role: "student",
        status: "active",
        createdAt: "2025-07-29T11:19:09.042Z",
        updatedAt: "2025-07-29T11:19:09.042Z",
        classesEnrolled: [
          {
            id: "cmdog29xb0005sb5ws5wntxhv",
            name: "ss3",
            schoolId: "cmdod9r2o0000sbva41dcg5zk",
            classTeacherId: null,
            createdAt: "2025-07-29T11:19:08.735Z",
            updatedAt: "2025-07-29T11:19:08.735Z"
          }
        ],
        student_id: "smh/2025/cmdog2a5t000csb5w9xm8pukq",
        current_class: "ss3",
        next_class: "No classes",
        next_class_time: null,
        next_class_teacher: null,
        performance: {
          cgpa: 0,
          term_average: 0,
          improvement_rate: 0,
          attendance_rate: 0,
          position: 0
        }
      },
      {
        id: "cmdog2a5u000dsb5wfqentmxv",
        school_id: "cmdod9r2o0000sbva41dcg5zk",
        email: "monyeivalerie@gmil.com",
        password: "$argon2id$v=19$m=65536,t=3,p=4$/t+iqSKwzA1In5VvQ7HegA$8xS5pdZaDgw+ncUAHFHyPOjc9oRvw3Q8KqijaV7eRiQ",
        first_name: "ifeoma",
        last_name: "vanilla",
        phone_number: "'08057612064",
        display_picture: null,
        gender: "other",
        otp: "",
        otp_expires_at: null,
        is_email_verified: false,
        is_otp_verified: false,
        role: "student",
        status: "active",
        createdAt: "2025-07-29T11:19:09.042Z",
        updatedAt: "2025-07-29T11:19:09.042Z",
        classesEnrolled: [
          {
            id: "cmdog29xb0004sb5wka8vdrjp",
            name: "ss2",
            schoolId: "cmdod9r2o0000sbva41dcg5zk",
            classTeacherId: null,
            createdAt: "2025-07-29T11:19:08.735Z",
            updatedAt: "2025-07-29T11:19:08.735Z"
          }
        ],
        student_id: "smh/2025/cmdog2a5u000dsb5wfqentmxv",
        current_class: "ss2",
        next_class: "No classes",
        next_class_time: null,
        next_class_teacher: null,
        performance: {
          cgpa: 0,
          term_average: 0,
          improvement_rate: 0,
          attendance_rate: 0,
          position: 0
        }
      }
    ]
  },
  statusCode: 200
};
