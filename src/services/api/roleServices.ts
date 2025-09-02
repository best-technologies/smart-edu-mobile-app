import { API_ENDPOINTS } from '../config/apiConfig';
import { HttpClient } from './httpClient';
import { ApiResponse, UserProfile, StudentTabResponse, TeacherScheduleResponse } from '../types/apiTypes';

export class TeacherService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getDashboard(): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.TEACHER.DASHBOARD);
  }

  async getSubjects(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.TEACHER.SUBJECTS);
  }

  async getStudents(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.TEACHER.STUDENTS);
  }

  async getSchedules(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.TEACHER.SCHEDULES);
  }

  async getStudentTab(page?: number): Promise<ApiResponse<StudentTabResponse['data']>> {
    const url = page ? `${API_ENDPOINTS.TEACHER.STUDENT_TAB}?page=${page}` : API_ENDPOINTS.TEACHER.STUDENT_TAB;
    return this.httpClient.makeRequest<StudentTabResponse['data']>(url);
  }

  async getScheduleTab(): Promise<ApiResponse<TeacherScheduleResponse['data']>> {
    return this.httpClient.makeRequest<TeacherScheduleResponse['data']>(API_ENDPOINTS.TEACHER.SCHEDULES_TAB);
  }

  async getSubjectDetails(
    subjectId: string, 
    page: number = 1, 
    limit: number = 10, 
    search?: string,
    filters?: {
      status?: 'all' | 'active' | 'inactive' | 'draft';
      type?: 'all' | 'videos' | 'materials';
      orderBy?: 'order' | 'title' | 'createdAt';
      orderDirection?: 'asc' | 'desc';
    }
  ): Promise<ApiResponse<any>> {
    let url = `${API_ENDPOINTS.TEACHER.SUBJECT_DETAILS}/${subjectId}/comprehensive?page=${page}&limit=${limit}`;
    
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    if (filters?.status && filters.status !== 'all') {
      url += `&status=${filters.status}`;
    }
    
    if (filters?.type && filters.type !== 'all') {
      url += `&type=${filters.type}`;
    }
    
    if (filters?.orderBy) {
      url += `&orderBy=${filters.orderBy}`;
    }
    
    if (filters?.orderDirection) {
      url += `&orderDirection=${filters.orderDirection}`;
    }
    
    return this.httpClient.makeRequest(url);
  }

  async createTopic(topicData: {
    title: string;
    description: string;
    instructions?: string;
    subject_id: string;
    is_active?: boolean;
  }): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(
      API_ENDPOINTS.TEACHER.CREATE_TOPIC,
      'POST',
      topicData
    );
  }

  async reorderTopic(
    subjectId: string,
    topicId: string,
    newPosition: number
  ): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(
      `${API_ENDPOINTS.TEACHER.REORDER_TOPIC}/${subjectId}/${topicId}`,
      'PATCH',
      { newPosition }
    );
  }
}

export class DirectorService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getDashboard(): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.DIRECTOR.DASHBOARD);
  }

  async getTeachers(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.DIRECTOR.TEACHERS);
  }

  async getStudents(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.DIRECTOR.STUDENTS);
  }

  async getSubjects(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.DIRECTOR.SUBJECTS);
  }

  async getSchedules(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.DIRECTOR.SCHEDULES);
  }
}

export class StudentService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getDashboard(): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.STUDENT.DASHBOARD);
  }

  async getSubjects(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.STUDENT.SUBJECTS);
  }

  async getSchedules(): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.STUDENT.SCHEDULES);
  }
}

export class UserService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  /**
   * Get current user profile with school details
   * This endpoint works for all roles (director, teacher, student)
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.httpClient.makeRequest<UserProfile>(API_ENDPOINTS.USER.PROFILE);
  }

  async updateProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.USER.UPDATE_PROFILE, 'PUT', profileData);
  }
}
