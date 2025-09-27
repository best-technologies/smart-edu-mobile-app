import { API_ENDPOINTS, API_CONFIG } from '../config/apiConfig';
import { HttpClient } from './httpClient';
import { ApiResponse, UserProfile, StudentTabResponse, TeacherScheduleResponse, StudentDashboardResponse, StudentSubjectsResponse, StudentSubjectDetailsResponse, StudentSchedulesResponse, StudentAssessmentsResponse, AssessmentQuestionsResponse, AssessmentSubmissionResponse, AssessmentAnswersResponse, StudentProfileData, StudentProfileResponse } from '../types/apiTypes';

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

  async startVideoUpload(payload: FormData): Promise<ApiResponse<{ sessionId: string }>> {
    return this.httpClient.makeRequest<{ sessionId: string }>(
      API_ENDPOINTS.TEACHER.UPLOAD_VIDEO_START,
      'POST',
      payload
    );
  }

  // Polling JSON endpoint (non-SSE)
  async getUploadProgressJSON(sessionId: string): Promise<{ sessionId: string; progress: number; stage: string; message: string; bytesUploaded: number; totalBytes: number; estimatedTimeRemaining?: number; materialId?: string; }> {
    const res = await this.httpClient.makeRequest(
      `${API_ENDPOINTS.TEACHER.UPLOAD_PROGRESS_POLL}/${encodeURIComponent(sessionId)}`,
      'GET'
    );
    const data = (res as any)?.data || res;
    return data as { sessionId: string; progress: number; stage: string; message: string; bytesUploaded: number; totalBytes: number; estimatedTimeRemaining?: number; materialId?: string; };
  }

  async getAttendanceSessionDetails(): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(API_ENDPOINTS.TEACHER.ATTENDANCE_SESSION);
  }

  async getClassStudents(classId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    return this.httpClient.makeRequest(
      `${API_ENDPOINTS.TEACHER.ATTENDANCE_CLASS_STUDENTS}/${classId}/students?${queryParams.toString()}`
    );
  }

  async getAttendanceForDate(classId: string, date: string): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(
      `${API_ENDPOINTS.TEACHER.ATTENDANCE_GET}/${classId}/date/${date}`
    );
  }

  async submitAttendance(attendanceData: {
    class_id: string;
    date: string;
    session_type?: string;
    attendance_records: Array<{
      student_id: string;
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL';
      reason?: string;
      is_excused?: boolean;
      excuse_note?: string;
    }>;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    console.log('=== TEACHER SERVICE - SUBMIT ATTENDANCE ===');
    console.log('API endpoint:', API_ENDPOINTS.TEACHER.ATTENDANCE_SUBMIT);
    console.log('Request method: POST');
    console.log('Request payload (JSON):', JSON.stringify(attendanceData, null, 2));
    console.log('Payload details:');
    console.log('- class_id:', attendanceData.class_id);
    console.log('- date:', attendanceData.date);
    console.log('- session_type:', attendanceData.session_type);
    console.log('- notes:', attendanceData.notes);
    console.log('- attendance_records count:', attendanceData.attendance_records.length);
    console.log('- attendance_records:', attendanceData.attendance_records);
    
    const result = this.httpClient.makeRequest(
      API_ENDPOINTS.TEACHER.ATTENDANCE_SUBMIT,
      'POST',
      attendanceData
    );
    
    console.log('Response received:', result);
    console.log('=== END TEACHER SERVICE - SUBMIT ATTENDANCE ===');
    return result;
  }

  async updateAttendance(attendanceData: {
    class_id: string;
    date: string;
    attendance_records: Array<{
      student_id: string;
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL';
      reason?: string;
      is_excused?: boolean;
      excuse_note?: string;
    }>;
    notes?: string;
  }): Promise<ApiResponse<any>> {
    
    const result = this.httpClient.makeRequest(
      API_ENDPOINTS.TEACHER.ATTENDANCE_UPDATE,
      'PATCH',
      attendanceData
    );
    
    console.log('Response received:', result);
    console.log('=== END TEACHER SERVICE - UPDATE ATTENDANCE ===');
    return result;
  }

  async getStudentAttendanceHistory(
    studentId: string, 
    year?: number, 
    month?: number
  ): Promise<ApiResponse<{
    summary: {
      totalSchoolDaysThisMonth: number;
      totalPresentThisMonth: number;
      totalSchoolDaysThisTerm: number;
      totalPresentThisTerm: number;
      lastAbsentDate: string | null;
    };
    records: Array<{
      date: string;
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL' | 'HOLIDAY' | 'WEEKEND';
      isExcused: boolean;
      reason?: string;
      markedAt?: string;
      markedBy?: string;
    }>;
  }>> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const queryString = params.toString();
    const endpoint = `${API_ENDPOINTS.TEACHER.ATTENDANCE_HISTORY}/${studentId}${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔍 getStudentAttendanceHistory called with:');
    console.log('  - studentId:', studentId);
    console.log('  - year:', year);
    console.log('  - month:', month);
    console.log('  - API_ENDPOINTS.TEACHER.ATTENDANCE_HISTORY:', API_ENDPOINTS.TEACHER.ATTENDANCE_HISTORY);
    console.log('  - queryString:', queryString);
    console.log('  - final endpoint:', endpoint);
    console.log('  - full URL will be:', `${API_CONFIG.BASE_URL}${endpoint}`);
    
    const result = this.httpClient.makeRequest<{
      summary: {
        totalSchoolDaysThisMonth: number;
        totalPresentThisMonth: number;
        totalSchoolDaysThisTerm: number;
        totalPresentThisTerm: number;
        lastAbsentDate: string | null;
      };
      records: Array<{
        date: string;
        status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL' | 'HOLIDAY' | 'WEEKEND';
        isExcused: boolean;
        reason?: string;
        markedAt?: string;
        markedBy?: string;
      }>;
    }>(endpoint, 'GET');
    return result;
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

  async getSubjectDetails(subjectId: string): Promise<ApiResponse<any>> {
    return this.httpClient.makeRequest(`${API_ENDPOINTS.DIRECTOR.SUBJECTS}/${subjectId}/details`);
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

  async getProfile(): Promise<StudentProfileResponse> {
    const url = API_ENDPOINTS.USER.PROFILE_STUDENT;
    return this.httpClient.makeRequest<StudentProfileData>(url) as Promise<StudentProfileResponse>;
  }

  async getAttendanceHistory(year?: number, month?: number): Promise<ApiResponse<{
    academic_sessions: Array<{
      id: string;
      academic_year: string;
      term: string;
      start_date: string;
      end_date: string;
      is_current: boolean;
      status: string;
    }>;
    available_terms: Array<{
      id: string;
      term: string;
      academic_year: string;
    }>;
    summary: {
      totalSchoolDaysThisMonth: number;
      totalPresentThisMonth: number;
      totalSchoolDaysThisTerm: number;
      totalPresentThisTerm: number;
      lastAbsentDate: string | null;
    };
    records: Array<{
      date: string;
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL' | 'HOLIDAY' | 'WEEKEND';
      isExcused: boolean;
      reason?: string;
      markedAt?: string;
      markedBy?: string;
    }>;
  }>> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    const queryString = params.toString();
    const endpoint = `${API_ENDPOINTS.STUDENT.ATTENDANCE}${queryString ? `?${queryString}` : ''}`;
    
    console.log('🔍 StudentService.getAttendanceHistory called with:');
    console.log('  - year:', year);
    console.log('  - month:', month);
    console.log('  - endpoint:', endpoint);
    
    return this.httpClient.makeRequest(endpoint, 'GET');
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
