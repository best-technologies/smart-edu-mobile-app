export interface DirectorTopic {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  videos?: DirectorTopicVideo[];
  materials?: DirectorTopicMaterial[];
  assignments?: DirectorTopicAssignment[];
  quizzes?: DirectorTopicQuiz[];
  liveClasses?: DirectorTopicLiveClass[];
  libraryResources?: DirectorTopicLibraryResource[];
}

export interface DirectorTopicVideo {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  size?: string;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DirectorTopicMaterial {
  id: string;
  title: string;
  description?: string;
  url: string;
  fileType?: string;
  fileSize?: string;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DirectorTopicAssignment {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  maxScore: number;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DirectorTopicQuiz {
  id: string;
  title: string;
  description?: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DirectorTopicLiveClass {
  id: string;
  title: string;
  description?: string;
  scheduledAt?: string;
  duration: number;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DirectorTopicLibraryResource {
  id: string;
  title: string;
  description?: string;
  resourceType: string;
  order?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
