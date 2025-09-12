import { API_ENDPOINTS } from '../config/apiConfig';
import { HttpClient } from './httpClient';
import { ApiResponse, UserProfile, StudentTabResponse, TeacherScheduleResponse, StudentDashboardResponse, StudentSubjectsResponse, StudentSubjectDetailsResponse, StudentSchedulesResponse, StudentAssessmentsResponse, AssessmentQuestionsResponse, AssessmentSubmissionResponse, AssessmentAnswersResponse, StudentProfileData } from '../types/apiTypes';

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

  async getTopicContent(topicId: string): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(
      `${API_ENDPOINTS.TEACHER.TOPIC_CONTENT}/${topicId}/content`
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

  async getDashboard(): Promise<StudentDashboardResponse> {
    return this.httpClient.makeRequest<StudentDashboardResponse['data']>(API_ENDPOINTS.STUDENT.DASHBOARD) as Promise<StudentDashboardResponse>;
  }

  async getSubjects(): Promise<StudentSubjectsResponse> {
    return this.httpClient.makeRequest<StudentSubjectsResponse['data']>(API_ENDPOINTS.STUDENT.SUBJECTS) as Promise<StudentSubjectsResponse>;
  }

  async getSubjectDetails(subjectId: string): Promise<StudentSubjectDetailsResponse> {
    return this.httpClient.makeRequest<StudentSubjectDetailsResponse['data']>(`${API_ENDPOINTS.STUDENT.SUBJECT_DETAILS}/${subjectId}`) as Promise<StudentSubjectDetailsResponse>;
  }

  async getTopics(subjectId: string): Promise<ApiResponse<any[]>> {
    return this.httpClient.makeRequest(`${API_ENDPOINTS.STUDENT.TOPICS}?subjectId=${subjectId}`);
  }

  async getTopicContent(topicId: string): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(`${API_ENDPOINTS.STUDENT.TOPIC_CONTENT}/${topicId}/content`);
  }

  async getSchedules(): Promise<StudentSchedulesResponse> {
    return this.httpClient.makeRequest<StudentSchedulesResponse['data']>(API_ENDPOINTS.STUDENT.SCHEDULES) as Promise<StudentSchedulesResponse>;
  }

  async getAssessments(params?: {
    page?: number;
    limit?: number;
    search?: string;
    assessment_type?: string;
    status?: string;
  }): Promise<StudentAssessmentsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.assessment_type) queryParams.append('assessment_type', params.assessment_type);
    if (params?.status) queryParams.append('status', params.status);

    const url = `${API_ENDPOINTS.STUDENT.ASSESSMENTS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    return this.httpClient.makeRequest<StudentAssessmentsResponse['data']>(url) as Promise<StudentAssessmentsResponse>;
  }

  async getAssessmentQuestions(assessmentId: string): Promise<AssessmentQuestionsResponse> {
    const url = `${API_ENDPOINTS.STUDENT.ASSESSMENT_QUESTIONS}/${assessmentId}/questions`;
    return this.httpClient.makeRequest<AssessmentQuestionsResponse['data']>(url) as Promise<AssessmentQuestionsResponse>;
  }

  async submitAssessment(assessmentId: string, submissionData: {
    answers: Record<string, string[]>;
    timeSpent: number;
  }): Promise<AssessmentSubmissionResponse> {
    
    const url = `${API_ENDPOINTS.STUDENT.ASSESSMENT_SUBMIT}/${assessmentId}/submit`;
    
    // Transform answers to the format expected by backend
    const transformedAnswers = Object.entries(submissionData.answers).map(([questionId, selectedOptions]) => ({
      question_id: questionId,
      selected_options: selectedOptions,
      text_answer: selectedOptions.length > 0 && typeof selectedOptions[0] === 'string' && !selectedOptions[0].startsWith('opt_') 
        ? selectedOptions[0] 
        : null
    }));

    const payload = {
      answers: transformedAnswers,
      time_spent: submissionData.timeSpent,
      submission_time: new Date().toISOString()
    };
    return this.httpClient.makeRequest<AssessmentSubmissionResponse['data']>(url, 'POST', payload) as Promise<AssessmentSubmissionResponse>;
  }

  async getAssessmentAnswers(assessmentId: string): Promise<AssessmentAnswersResponse> {
    const url = `${API_ENDPOINTS.STUDENT.ASSESSMENT_ANSWERS}/${assessmentId}/answers`;
    return this.httpClient.makeRequest<AssessmentAnswersResponse['data']>(url) as Promise<AssessmentAnswersResponse>;
  }

  async getProfile(): Promise<ApiResponse<StudentProfileData>> {
    const url = API_ENDPOINTS.USER.PROFILE;
    return this.httpClient.makeRequest<StudentProfileData>(url);
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
