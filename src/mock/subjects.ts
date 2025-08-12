export type SubjectTeacher = {
  id: string;
  name: string;
  email: string;
};

export type SubjectClass = {
  id: string;
  name: string;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  class: SubjectClass;
  teachers: SubjectTeacher[];
};

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type SubjectFilters = {
  search: string | null;
  classId: string | null;
};

export type SubjectsPayload = {
  success: boolean;
  message: string;
  data?: {
    subjects: Subject[];
    pagination: Pagination;
    filters: SubjectFilters;
  };
  statusCode?: number;
};

export const subjectsDashboardData: SubjectsPayload = {
  success: true,
  message: "Found 5 subjects",
  data: {
    subjects: [
      {
        id: "subj_01HXYZABC123",
        name: "mathematics",
        code: "MATH101",
        color: "#3B82F6",
        description: "Advanced mathematics for grade 10",
        class: {
          id: "cls_01HXYZABC456",
          name: "grade10a"
        },
        teachers: [
          {
            id: "tchr_01HXYZABC789",
            name: "Ada Lovelace",
            email: "ada@school.edu"
          }
        ]
      },
      {
        id: "subj_01HXYZDEF456",
        name: "physics",
        code: "PHY101",
        color: "#EF4444",
        description: "Basic physics concepts",
        class: {
          id: "cls_01HXYZDEF789",
          name: "grade10b"
        },
        teachers: [
          {
            id: "tchr_01HXYZDEF012",
            name: "Isaac Newton",
            email: "isaac@school.edu"
          }
        ]
      },
      {
        id: "subj_01HXYZGHI789",
        name: "computer_science",
        code: "CS101",
        color: "#10B981",
        description: "Introduction to programming and algorithms",
        class: {
          id: "cls_01HXYZGHI012",
          name: "grade11a"
        },
        teachers: [
          {
            id: "tchr_01HXYZGHI345",
            name: "Grace Hopper",
            email: "grace@school.edu"
          },
          {
            id: "tchr_01HXYZGHI678",
            name: "Alan Turing",
            email: "alan@school.edu"
          }
        ]
      },
      {
        id: "subj_01HXYZJKL012",
        name: "chemistry",
        code: "CHEM101",
        color: "#F59E0B",
        description: "Fundamental chemistry principles",
        class: {
          id: "cls_01HXYZJKL345",
          name: "grade10c"
        },
        teachers: [
          {
            id: "tchr_01HXYZJKL678",
            name: "Marie Curie",
            email: "marie@school.edu"
          }
        ]
      },
      {
        id: "subj_01HXYZMNO345",
        name: "biology",
        code: "BIO101",
        color: "#8B5CF6",
        description: "Life sciences and cellular biology",
        class: {
          id: "cls_01HXYZMNO678",
          name: "grade11b"
        },
        teachers: [
          {
            id: "tchr_01HXYZMNO901",
            name: "Charles Darwin",
            email: "charles@school.edu"
          }
        ]
      }
    ],
    pagination: {
      total: 15,
      page: 1,
      limit: 10,
      totalPages: 2,
      hasNext: true,
      hasPrev: false
    },
    filters: {
      search: null,
      classId: null
    }
  }
};
