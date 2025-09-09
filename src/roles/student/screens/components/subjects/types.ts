export interface Thumbnail {
  secure_url: string;
  public_id: string;
}

export interface Class {
  id: string;
  name: string;
  classId?: number;
}

export interface TimetableEntry {
  id: string;
  day_of_week: string;
  startTime: string;
  endTime: string;
  room: string;
  class: Class;
}

export interface ContentCounts {
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  thumbnail: Thumbnail | null;
  timetableEntries: TimetableEntry[];
  classesTakingSubject: Class[];
  contentCounts: ContentCounts;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicSession {
  id: string;
  academic_year: string;
  term: string;
}

export interface SubjectStats {
  totalSubjects: number;
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
}

export interface SubjectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface StudentSubjectsData {
  pagination: SubjectPagination;
  stats: SubjectStats;
  academicSession: AcademicSession;
  subjects: Subject[];
}

export interface StudentSubjectsResponse {
  success: boolean;
  message: string;
  data: StudentSubjectsData;
  statusCode: number;
}
