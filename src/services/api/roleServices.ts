import { API_ENDPOINTS } from '../config/apiConfig';
import { HttpClient } from './httpClient';
import { ApiResponse, UserProfile } from '../types/apiTypes';

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
