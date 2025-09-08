import { HttpClient } from './httpClient';
import { 
  CBTQuiz, 
  CBTQuestion, 
  CreateQuizRequest, 
  CreateQuestionRequest,
  AssessmentsResponse
} from '../types/cbtTypes';
import { ApiResponse } from '../types/apiTypes';

export class CBTService {
  private httpClient: HttpClient;
  private baseURL: string;

  constructor() {
    this.httpClient = new HttpClient();
    // CBT endpoints are under teachers/assessments/cbt
    this.baseURL = '/teachers/assessments/cbt';
  }

  // Quiz Management
  async createQuiz(quizData: CreateQuizRequest): Promise<CBTQuiz> {
    const response = await this.httpClient.makeRequest<CBTQuiz>(
      `${this.baseURL}`,
      'POST',
      quizData
    );
    if (!response.data) {
      throw new Error('No quiz data received from server');
    }
    return response.data;
  }

  async getQuiz(quizId: string): Promise<CBTQuiz> {
    const response = await this.httpClient.makeRequest<CBTQuiz>(
      `${this.baseURL}/${quizId}`,
      'GET'
    );
    if (!response.data) {
      throw new Error('No quiz data received from server');
    }
    return response.data;
  }

  async updateQuiz(quizId: string, quizData: Partial<CreateQuizRequest>): Promise<CBTQuiz> {
    const response = await this.httpClient.makeRequest<CBTQuiz>(
      `${this.baseURL}/${quizId}`,
      'PATCH',
      quizData
    );
    if (!response.data) {
      throw new Error('No quiz data received from server');
    }
    return response.data;
  }

  async deleteQuiz(quizId: string): Promise<void> {
    await this.httpClient.makeRequest(
      `${this.baseURL}/${quizId}`,
      'DELETE'
    );
  }

  async publishQuiz(quizId: string): Promise<CBTQuiz> {
    const response = await this.httpClient.makeRequest<CBTQuiz>(
      `${this.baseURL}/${quizId}/publish`,
      'POST',
      {}
    );
    if (!response.data) {
      throw new Error('No quiz data received from server');
    }
    return response.data;
  }

  async getSubjectQuizzes(subjectId: string): Promise<CBTQuiz[]> {
    const response = await this.httpClient.makeRequest<CBTQuiz[]>(
      `${this.baseURL}/subject/${subjectId}`,
      'GET'
    );
    if (!response.data) {
      throw new Error('No quizzes data received from server');
    }
    return response.data;
  }

  // Question Management
  async addQuestion(quizId: string, questionData: CreateQuestionRequest): Promise<CBTQuestion> {
    const response = await this.httpClient.makeRequest<CBTQuestion>(
      `${this.baseURL}/${quizId}/questions`,
      'POST',
      questionData
    );
    if (!response.data) {
      throw new Error('No question data received from server');
    }
    return response.data;
  }

  async getQuizQuestions(quizId: string): Promise<CBTQuestion[]> {
    const response = await this.httpClient.makeRequest<CBTQuestion[]>(
      `${this.baseURL}/${quizId}/questions`,
      'GET'
    );
    if (!response.data) {
      throw new Error('No questions data received from server');
    }
    return response.data;
  }

  async updateQuestion(
    quizId: string, 
    questionId: string, 
    questionData: Partial<CreateQuestionRequest>
  ): Promise<CBTQuestion> {
    const response = await this.httpClient.makeRequest<CBTQuestion>(
      `${this.baseURL}/${quizId}/questions/${questionId}`,
      'PATCH',
      questionData
    );
    if (!response.data) {
      throw new Error('No question data received from server');
    }
    return response.data;
  }

  async deleteQuestion(quizId: string, questionId: string): Promise<void> {
    await this.httpClient.makeRequest(
      `${this.baseURL}/${quizId}/questions/${questionId}`,
      'DELETE'
    );
  }

  // Get all quizzes for a teacher
  async getTeacherQuizzes(): Promise<CBTQuiz[]> {
    const response = await this.httpClient.makeRequest<CBTQuiz[]>(
      `/teachers/assessments/cbt/`,
      'GET'
    );
    if (!response.data) {
      throw new Error('No quizzes data received from server');
    }
    return response.data;
  }

  // Get all quizzes with pagination
  async getAllQuizzes(page: number = 1, limit: number = 10): Promise<{
    quizzes: CBTQuiz[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await this.httpClient.makeRequest<{
      quizzes: CBTQuiz[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(
      `/teachers/assessments/cbt/?page=${page}&limit=${limit}`,
      'GET'
    );
    if (!response.data) {
      throw new Error('No quizzes data received from server');
    }
    return response.data;
  }

  // Get assessments with new response format (includes counts)
  async getAssessments(subjectId: string, page: number = 1, limit: number = 10): Promise<AssessmentsResponse> {
    try {
      const response = await this.httpClient.makeRequest<AssessmentsResponse>(
        `/teachers/assessments?subject_id=${subjectId}&page=${page}&limit=${limit}`,
        'GET'
      );
      
        console.log('🔍 Full response:', JSON.stringify(response, null, 2));
        console.log('🔍 response.data:', response.data);
        
        if (!response.data) {
          console.log('❌ Missing data - response.data:', !!response.data);
          throw new Error('No assessments data received from server');
        }
        return response.data;
    } catch (error) {
      console.error('Error fetching assessments:', error);
      throw new Error('Failed to load assessments. Please try again.');
    }
  }

  // Alias for getAssessments in case of naming issues
  async getAssessment(subjectId: string, page: number = 1, limit: number = 10): Promise<AssessmentsResponse> {
    return this.getAssessments(subjectId, page, limit);
  }
}

// Create and export service instance
export const cbtService = new CBTService();
