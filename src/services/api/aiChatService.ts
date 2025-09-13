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
  progressEndpoint: string;
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
      const response = await this.httpClient.makeRequest(
        API_ENDPOINTS.AI_CHAT.INITIATE,
        'POST',
        { userRole },
        true
      );
      return response as ApiResponse<InitiateAIChatResponse>;
    } catch (error) {
      console.error('AI Chat initiation failed:', error);
      throw error;
    }
  }

  async uploadDocument(file: any, title?: string, description?: string): Promise<ApiResponse<UploadedDocumentResponse>> {
    try {
      console.log('🔧 AIChatService.uploadDocument called with file:', {
        name: file?.name,
        type: file?.type,
        size: file?.size,
        uri: file?.uri
      });
      
      // Log file size for debugging
      console.log('📊 File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      const formData = new FormData();
      
      // For React Native, append file with proper format
      formData.append('document', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name,
      } as any);
      
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

      console.log('📤 FormData prepared, making request...');

      const response = await this.httpClient.makeRequest(
        API_ENDPOINTS.AI_CHAT.UPLOAD_DOCUMENT,
        'POST',
        formData,
        true
      );
      
      return response as ApiResponse<UploadedDocumentResponse>;
    } catch (error) {
      console.error('Document upload failed:', error);
      throw error;
    }
  }

  async startUpload(file: any, title?: string, description?: string): Promise<ApiResponse<UploadSessionResponse>> {
    try {
      const formData = new FormData();
      formData.append('document', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name,
      } as any);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

      const response = await this.httpClient.makeRequest(
        API_ENDPOINTS.AI_CHAT.START_UPLOAD,
        'POST',
        formData,
        true
      );
      
      return response as ApiResponse<UploadSessionResponse>;
    } catch (error) {
      console.error('Upload session failed:', error);
      throw error;
    }
  }

  async trackUploadProgress(sessionId: string): Promise<{ onmessage: (callback: (event: { data: string }) => void) => void; onerror: (callback: (error: any) => void) => void; close: () => void }> {
    try {
      const token = await this.httpClient.getAccessToken();
      const url = `${API_ENDPOINTS.AI_CHAT.UPLOAD_PROGRESS}/${sessionId}`;
      
      // Use polling instead of EventSource for React Native
      let intervalId: NodeJS.Timeout;
      let isClosed = false;
      
      const pollProgress = async () => {
        if (isClosed) return;
        
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.text();
            if (data && data !== '') {
              // Parse the data to check if upload is completed
              try {
                const progressData = JSON.parse(data);
                
                // Stop polling if upload is completed or failed
                if (progressData.status === 'completed' || progressData.status === 'failed') {
                  isClosed = true;
                  if (intervalId) {
                    clearInterval(intervalId);
                  }
                }
              } catch (parseError) {
                console.error('Progress data parse error:', parseError);
              }
              
              // Simulate EventSource message event
              if (onMessageCallback) {
                onMessageCallback({ data });
              }
            }
          } else {
            if (onErrorCallback) {
              onErrorCallback(new Error(`HTTP ${response.status}: ${response.statusText}`));
            }
          }
        } catch (error) {
          if (onErrorCallback) {
            onErrorCallback(error);
          }
        }
      };
      
      let onMessageCallback: ((event: { data: string }) => void) | null = null;
      let onErrorCallback: ((error: any) => void) | null = null;
      
      // Start polling every 1 second
      intervalId = setInterval(pollProgress, 1000);
      
      return {
        onmessage: (callback: (event: { data: string }) => void) => {
          onMessageCallback = callback;
        },
        onerror: (callback: (error: any) => void) => {
          onErrorCallback = callback;
        },
        close: () => {
          isClosed = true;
          if (intervalId) {
            clearInterval(intervalId);
          }
        }
      };
    } catch (error) {
      console.error('Progress tracking setup failed:', error);
      throw error;
    }
  }
}

export const aiChatService = new AIChatService();
