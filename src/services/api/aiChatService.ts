import { HttpClient } from './httpClient';
import { API_CONFIG, API_ENDPOINTS } from '../config/apiConfig';
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

export interface Conversation {
  id: string;
  title: string;
  status: string;
  materialId: string;
  totalMessages: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
  conversationId: string;
  materialId: string;
  tokensUsed: number | null;
  responseTimeMs: number | null;
  createdAt: string;
}

export interface ContextChunk {
  id: string;
  content: string;
  similarity: number;
  chunkType: string;
}

export interface SendMessageRequest {
  message: string;
  materialId: string | null;
  conversationId: string;
}

export interface SendMessageResponse {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
  conversationId: string;
  materialId: string;
  contextChunks: ContextChunk[];
  tokensUsed: number;
  responseTimeMs: number;
  createdAt: string;
  chatTitle?: string; // Include generated title
}

export interface UsageLimits {
  filesUploadedThisMonth: number;
  totalFilesUploadedAllTime: number;
  totalStorageUsedMB: number;
  maxFilesPerMonth: number;
  maxFileSizeMB: number;
  maxStorageMB: number;
  tokensUsedThisWeek: number;
  tokensUsedThisDay: number;
  tokensUsedAllTime: number;
  maxTokensPerWeek: number;
  maxTokensPerDay: number;
  lastFileResetDate: string;
  lastTokenResetDate: string;
}

export interface InitiateAIChatResponse {
  userRole: string;
  usageLimits: UsageLimits;
  documentCount: number;
  supportedDocumentTypes: SupportedDocumentType[];
  uploadedDocuments: UploadedDocument[];
  conversations: Conversation[];
}

export interface ConversationMessagesResponse {
  conversationHistory: ChatMessage[];
  usageLimits: UsageLimits;
}

export interface UploadSessionResponse {
  sessionId: string;
  uploadUrl?: string;
  expiresAt?: string;
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
  description: string;
  url: string;
  fileType: string;
  size: string;
  originalName: string;
  subject_id: string;
  topic_id: string;
  processing_status: string;
  status: string;
  createdAt: string;
  updatedAt: string;
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

  async getConversationMessages(
    conversationId: string, 
    limit: number = 25, 
    offset: number = 0
  ): Promise<ApiResponse<ConversationMessagesResponse>> {
    try {
      // Ensure parameters are integers
      const limitParam = Math.floor(limit);
      const offsetParam = Math.floor(offset);
      
      const response = await this.httpClient.makeRequest(
        `${API_ENDPOINTS.AI_CHAT.CONVERSATION_MESSAGES}/${conversationId}/messages?limit=${limitParam}&offset=${offsetParam}`,
        'GET',
        null,
        true
      );
      return response as ApiResponse<ConversationMessagesResponse>;
    } catch (error) {
      console.error('Failed to fetch conversation messages:', error);
      throw error;
    }
  }

  async sendMessage(
    message: string,
    materialId: string | null,
    conversationId: string
  ): Promise<ApiResponse<SendMessageResponse>> {
    try {
      const requestData: SendMessageRequest = {
        message,
        materialId,
        conversationId
      };
      
      console.log('🔗 API Request Details:', {
        endpoint: API_ENDPOINTS.AI_CHAT.SEND_MESSAGE,
        method: 'POST',
        requestData: requestData
      });
      
      const response = await this.httpClient.makeRequest(
        API_ENDPOINTS.AI_CHAT.SEND_MESSAGE,
        'POST',
        requestData,
        true
      );
      return response as ApiResponse<SendMessageResponse>;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async uploadDocument(file: any, title?: string, description?: string): Promise<ApiResponse<UploadedDocumentResponse>> {
    try {
      
      const formData = new FormData();
      
      // For React Native, append file with proper format
      formData.append('document', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name,
      } as any);
      
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

    //   console.log('📤 FormData prepared, making request...');

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

  async trackUploadProgress(sessionIdOrEndpoint: string): Promise<{ onmessage: (callback: (event: { data: string }) => void) => void; onerror: (callback: (error: any) => void) => void; close: () => void }> {
    try {
      const token = await this.httpClient.getAccessToken();
      // Accept either a full progress endpoint path or a raw sessionId
      let url = sessionIdOrEndpoint;
      if (sessionIdOrEndpoint.startsWith('/')) {
        // If endpoint already includes /api/... then use the host origin only
        const baseHost = API_CONFIG.BASE_URL.replace(/\/api\/.*$/, '');
        url = `${baseHost}${sessionIdOrEndpoint}`;
      } else if (!sessionIdOrEndpoint.startsWith('http')) {
        url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AI_CHAT.UPLOAD_PROGRESS}/${sessionIdOrEndpoint}`;
      }

      // Convert SSE progress endpoint to JSON status endpoint for polling
      let pollingUrl = url.replace('/upload-progress/', '/upload-status/');
      
      // Use polling instead of EventSource for React Native
      let intervalId: NodeJS.Timeout;
      let isClosed = false;
      let consecutiveErrors = 0;
      let errorNotified = false;
      
      const pollProgress = async () => {
        if (isClosed) return;
        
        try {
          console.log('🌐 GET', pollingUrl);
          const response = await fetch(pollingUrl, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              // Request JSON status; avoid SSE streaming here
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            let rawBody: any = null;
            let payload: any = null;
            try {
              rawBody = await response.json();
            } catch (_e) {
              rawBody = await response.text();
            }
            console.log('⬅️ Progress raw response:', rawBody);

            // Normalize payload to the inner progress object
            if (rawBody) {
              if (typeof rawBody === 'string') {
                try { payload = JSON.parse(rawBody); } catch { payload = null; }
              } else if (rawBody && typeof rawBody === 'object') {
                payload = rawBody.data ?? rawBody; // unwrap { success, data }
              }
            }

            if (payload) {
              console.log('📈 Progress payload:', payload);
              // Stop polling if completed/failed
              const stage = (payload.stage || '').toString();
              const progressNum = typeof payload.progress === 'number' ? payload.progress : parseFloat(payload.progress);
              if (stage === 'completed' || stage === 'failed' || progressNum === 100) {
                  isClosed = true;
                  if (intervalId) {
                    clearInterval(intervalId);
                  }
                }
              // Simulate EventSource message event with normalized JSON string
              if (onMessageCallback) {
                onMessageCallback({ data: JSON.stringify(payload) });
              }
              // reset error counter on success
              consecutiveErrors = 0;
              errorNotified = false;
            }
          } else {
            consecutiveErrors += 1;
            if (consecutiveErrors >= 3 && !errorNotified) {
              errorNotified = true;
              isClosed = true;
              if (intervalId) clearInterval(intervalId);
              if (onErrorCallback) {
                onErrorCallback(new Error(`HTTP ${response.status}: ${response.statusText}`));
              }
            }
          }
        } catch (error) {
          consecutiveErrors += 1;
          if (consecutiveErrors >= 3 && !errorNotified) {
            errorNotified = true;
            isClosed = true;
            if (intervalId) clearInterval(intervalId);
            if (onErrorCallback) {
              onErrorCallback(error);
            }
          }
        }
      };
      
      let onMessageCallback: ((event: { data: string }) => void) | null = null;
      let onErrorCallback: ((error: any) => void) | null = null;
      
      // Initial hit then poll every 1 second
      pollProgress();
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
