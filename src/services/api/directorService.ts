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

export type DirectorDashboardResponse = ApiResponse<DirectorDashboardData>;
export type TeachersResponse = ApiResponse<TeachersData>;

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
   * Fetch subjects data for the subjects screen
   */
  async fetchSubjectsData(): Promise<any> {
    try {
      const response = await this.httpClient.makeRequest('/director/subjects/fetch-subjects-data');
      return response;
    } catch (error) {
      console.error('Error fetching subjects data:', error);
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
