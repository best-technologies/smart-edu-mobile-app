import { HttpClient } from './httpClient';
import { ApiResponse } from '../types/apiTypes';

export interface DirectorDashboardData {
  basic_details: {
    email: string;
    school_id: string;
  };
  teachers: {
    totalTeachers: number;
    activeClasses: number;
    totalSubjects: number;
  };
  students: {
    totalStudents: number;
    activeStudents: number;
    suspendedStudents: number;
  };
  finance: {
    totalRevenue: number;
    outstandingFees: number;
    totalExpenses: number;
    netBalance: number;
  };
  ongoingClasses: Array<{
    className: string;
    subject: string;
    teacher: string;
    startTime: string;
    endTime: string;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    comingUpOn: string;
    createdAt: string;
  }>;
}

export interface TeachersData {
  basic_details: {
    totalTeachers: number;
    activeTeachers: number;
    maleTeachers: number;
    femaleTeachers: number;
  };
  teachers: Array<{
    id: string;
    name: string;
    display_picture: string | null;
    contact: {
      phone: string;
      email: string;
    };
    totalSubjects: number;
    classTeacher: string;
    nextClass: {
      className: string;
      subject: string;
      startTime: string;
      endTime: string;
    } | null;
    status: 'active' | 'suspended';
  }>;
}

export interface SubjectTeacher {
  id: string;
  name: string;
  email: string;
}

export interface SubjectClass {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  class: SubjectClass | null;
  teachers: SubjectTeacher[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SubjectFilters {
  search: string | null;
  classId: string | null;
}

export interface SubjectsData {
  pagination: Pagination;
  filters: SubjectFilters;
  subjects: Subject[];
}

export interface SubjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
}

export type DirectorDashboardResponse = ApiResponse<DirectorDashboardData>;
export type TeachersResponse = ApiResponse<TeachersData>;
export type SubjectsResponse = ApiResponse<SubjectsData>;

class DirectorService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Fetch director dashboard data
   * This endpoint returns comprehensive dashboard statistics and data
   */
  async fetchDashboardData(): Promise<DirectorDashboardResponse> {
    try {
      const response = await this.httpClient.makeRequest<DirectorDashboardData>('/director/dashboard/fetch-dashboard-data');
      return response;
    } catch (error) {
      console.error('Error fetching director dashboard data:', error);
      throw error;
    }
  }

  /**
   * Fetch teachers data for the teachers screen
   */
  async fetchTeachersData(): Promise<TeachersResponse> {
    try {
      const response = await this.httpClient.makeRequest<TeachersData>('/director/teachers/dashboard');
      return response;
    } catch (error) {
      console.error('Error fetching teachers data:', error);
      throw error;
    }
  }

  /**
   * Fetch students data for the students screen
   */
  async fetchStudentsData(): Promise<any> {
    try {
      const response = await this.httpClient.makeRequest('/director/students/fetch-students-data');
      return response;
    } catch (error) {
      console.error('Error fetching students data:', error);
      throw error;
    }
  }

  /**
   * Fetch subjects data for the subjects screen with pagination and search
   */
  async fetchSubjectsData(params?: SubjectsQueryParams): Promise<SubjectsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.classId) queryParams.append('classId', params.classId);

      const url = `/director/subjects/fetch-all-subjects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('🌐 Making API request to:', url);
      
      const response = await this.httpClient.makeRequest<SubjectsData>(url);
      
      return response;
    } catch (error) {
      console.error('❌ Error in fetchSubjectsData:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        params
      });
      throw error;
    }
  }

  /**
   * Fetch schedules data for the schedules screen
   */
  async fetchSchedulesData(): Promise<any> {
    try {
      const response = await this.httpClient.makeRequest('/director/schedules/fetch-schedules-data');
      return response;
    } catch (error) {
      console.error('Error fetching schedules data:', error);
      throw error;
    }
  }
}

export const directorService = new DirectorService();
