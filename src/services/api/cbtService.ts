import { HttpClient } from './httpClient';
import { 
  CBTQuiz, 
  CBTQuestion, 
  CreateQuizRequest, 
  CreateQuestionRequest
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
      `${this.baseURL}/quizzes`,
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
      `${this.baseURL}/quizzes/${quizId}`,
      'GET'
    );
    if (!response.data) {
      throw new Error('No quiz data received from server');
    }
    return response.data;
  }

  async updateQuiz(quizId: string, quizData: Partial<CreateQuizRequest>): Promise<CBTQuiz> {
    const response = await this.httpClient.makeRequest<CBTQuiz>(
      `${this.baseURL}/quizzes/${quizId}`,
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
      `${this.baseURL}/quizzes/${quizId}`,
      'DELETE'
    );
  }

  async publishQuiz(quizId: string): Promise<CBTQuiz> {
    const response = await this.httpClient.makeRequest<CBTQuiz>(
      `${this.baseURL}/quizzes/${quizId}/publish`,
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
      `${this.baseURL}/quizzes/subject/${subjectId}`,
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
      `${this.baseURL}/quizzes/${quizId}/questions`,
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
      `${this.baseURL}/quizzes/${quizId}/questions`,
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
      `${this.baseURL}/quizzes/${quizId}/questions/${questionId}`,
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
      `${this.baseURL}/quizzes/${quizId}/questions/${questionId}`,
      'DELETE'
    );
  }

  // Get all quizzes for a teacher
  async getTeacherQuizzes(): Promise<CBTQuiz[]> {
    const response = await this.httpClient.makeRequest<CBTQuiz[]>(
      `${this.baseURL}/quizzes`,
      'GET'
    );
    if (!response.data) {
      throw new Error('No quizzes data received from server');
    }
    return response.data;
  }
}

// Create and export service instance
export const cbtService = new CBTService();
