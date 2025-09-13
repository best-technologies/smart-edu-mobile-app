import { HttpClient } from './httpClient';
import { API_ENDPOINTS } from '../config/apiConfig';
import { ApiResponse } from '../types/apiTypes';

export interface SupportedDocumentType {
  type: string;
  extension: string;
  mimeType: string;
  maxSize: string;
  description: string;
}

export interface UploadedDocument {
  id: string;
  title: string;
  description: string;
  fileType: string;
  originalName: string;
  size: string;
  status: string;
  createdAt: string;
  isProcessed: boolean;
}

export interface InitiateAIChatResponse {
  userRole: string;
  documentCount: number;
  supportedDocumentTypes: SupportedDocumentType[];
  uploadedDocuments: UploadedDocument[];
}

export interface UploadSessionResponse {
  uploadId: string;
  uploadUrl: string;
  expiresAt: string;
}

export interface UploadProgressData {
  sessionId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  message: string;
}

export interface UploadedDocumentResponse {
  id: string;
  title: string;
  status: string;
  uploadedAt: string;
}

export class AIChatService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async initiateAIChat(userRole: string): Promise<ApiResponse<InitiateAIChatResponse>> {
    try {
      console.log('🔧 AIChatService: initiateAIChat called with userRole:', userRole);
      console.log('🔧 AIChatService: endpoint:', API_ENDPOINTS.AI_CHAT.INITIATE);
      
      const response = await this.httpClient.makeRequest(
        API_ENDPOINTS.AI_CHAT.INITIATE,
        'POST',
        { userRole },
        true
      );
      
      console.log('🔧 AIChatService: raw response:', response);
      return response as ApiResponse<InitiateAIChatResponse>;
    } catch (error) {
      console.error('🔧 AIChatService: Error initiating AI chat:', error);
      throw error;
    }
  }

  async startUpload(file: any, title?: string, description?: string): Promise<ApiResponse<UploadSessionResponse>> {
    try {
      console.log('🔧 AIChatService: Starting document upload...');
      
      const formData = new FormData();
      formData.append('file', file);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

      const response = await this.httpClient.makeRequest(
        API_ENDPOINTS.AI_CHAT.START_UPLOAD,
        'POST',
        formData,
        true
      );
      
      console.log('🔧 AIChatService: Upload session started:', response);
      return response as ApiResponse<UploadSessionResponse>;
    } catch (error) {
      console.error('🔧 AIChatService: Error starting upload:', error);
      throw error;
    }
  }

  async trackUploadProgress(sessionId: string): Promise<EventSource> {
    try {
      console.log('🔧 AIChatService: Starting progress tracking for session:', sessionId);
      
      const token = await this.httpClient.getAccessToken();
      const url = `${API_ENDPOINTS.AI_CHAT.UPLOAD_PROGRESS}/${sessionId}?token=${token}`;
      
      const eventSource = new EventSource(url);
      return eventSource;
    } catch (error) {
      console.error('🔧 AIChatService: Error setting up progress tracking:', error);
      throw error;
    }
  }
}

export const aiChatService = new AIChatService();
