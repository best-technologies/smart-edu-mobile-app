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

export interface ManagedClass {
  id: string;
  name: string;
  classId: number;
}

export interface TeachingSubject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  thumbnail: Thumbnail | null;
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
  totalClasses: number;
}

export interface SubjectPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SubjectsDashboardData {
  pagination: SubjectPagination;
  managedClasses: ManagedClass[];
  teachingSubjects: TeachingSubject[];
  stats: SubjectStats;
  academicSession: AcademicSession;
  subjects: Subject[];
}

export interface SubjectsResponse {
  success: boolean;
  message: string;
  data: SubjectsDashboardData;
  statusCode: number;
}

// Subject Details API Types
export interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
  uploadedAt: string;
  size: string;
  views: number;
  status: 'published' | 'draft' | 'archived';
}

// New API response types for topic content
export interface TopicContentVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: {
    secure_url: string;
    public_id: string;
  };
  duration: string;
  size: string;
  views: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicContentMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
  size: string;
  downloads: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicContentAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  maxScore: number;
  timeLimit: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicContentQuiz {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicContentLiveClass {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicContentLibraryResource {
  id: string;
  title: string;
  description: string;
  resourceType: string;
  url: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TopicContentSummary {
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
  totalQuizzes: number;
  totalLiveClasses: number;
  totalLibraryResources: number;
  totalContent: number;
}

export interface TopicContentResponse {
  topicId: string;
  topicTitle: string;
  topicDescription: string;
  topicOrder: number;
  contentSummary: TopicContentSummary;
  videos: TopicContentVideo[];
  materials: TopicContentMaterial[];
  assignments: TopicContentAssignment[];
  quizzes: TopicContentQuiz[];
  liveClasses: TopicContentLiveClass[];
  libraryResources: TopicContentLibraryResource[];
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image' | 'other';
  size: string;
  url: string;
  uploadedAt: string;
  downloads: number;
  status: 'published' | 'draft' | 'archived';
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
  status: 'active' | 'inactive' | 'draft';
  videos: Video[];
  materials: Material[];
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectDetails {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  code: string;
  color: string;
  status: 'active' | 'inactive';
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  totalStudents: number;
  progress: number;
  classes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubjectDetailsFilters {
  search?: string;
  status?: 'all' | 'active' | 'inactive' | 'draft';
  type?: 'all' | 'videos' | 'materials';
  orderBy?: 'order' | 'title' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface SubjectDetailsStats {
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  totalStudents: number;
  completedTopics: number;
  inProgressTopics: number;
  notStartedTopics: number;
}

export interface SubjectDetailsData {
  subject: SubjectDetails;
  topics: Topic[];
  pagination: SubjectPagination;
  filters: SubjectDetailsFilters;
  stats: SubjectDetailsStats;
}

export interface SubjectDetailsResponse {
  success: boolean;
  message: string;
  data: SubjectDetailsData;
  statusCode: number;
}
