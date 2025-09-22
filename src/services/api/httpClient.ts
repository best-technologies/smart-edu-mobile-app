import { API_CONFIG, API_ENDPOINTS, HttpMethod } from '../config/apiConfig';
import { ApiResponse, ApiError } from '../types/apiTypes';
import { TokenManager } from './tokenManager';

export class HttpClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_CONFIG.BASE_URL, timeout: number = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await TokenManager.getRefreshToken();
      if (!refreshToken) return null;

      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        await TokenManager.clearTokens();
        return null;
      }

      const data: ApiResponse<{ accessToken: string; expiresIn: number }> = await response.json();
      
      if (data.success && data.data) {
        // Store the new tokens
        await TokenManager.storeTokens(data.data.accessToken, refreshToken);
        return data.data.accessToken;
      }

      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      await TokenManager.clearTokens();
      return null;
    }
  }

  // Make API request with authentication
  async makeRequest<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    data?: any,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      console.log(`🌐 ${method} ${url}`);
      
      // Special logging for attendance endpoints
      if (endpoint.includes('attendance/')) {
        console.log('📊 ATTENDANCE REQUEST DEBUG:');
        console.log('  - Full URL:', url);
        console.log('  - Method:', method);
        console.log('  - Endpoint:', endpoint);
      }
      
      const headers: Record<string, string> = {};

      // Only set Content-Type for JSON data, let React Native set it for FormData
      if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
      }
      // For FormData, React Native will automatically set the correct Content-Type with boundary

      if (requiresAuth) {
        const token = await TokenManager.getAccessToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          if (endpoint.includes('attendance/submit')) {
            console.log('Authorization header set with token');
          }
        } else {
          if (endpoint.includes('attendance/submit')) {
            console.log('WARNING: No auth token available!');
          }
        }
      }
      
      if (endpoint.includes('attendance/submit')) {
        console.log('Request headers:', headers);
        console.log('=== END HTTP CLIENT - ATTENDANCE SUBMIT ===');
      }

      const requestConfig: RequestInit = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        if (data instanceof FormData) {
          requestConfig.body = data;
        } else {
          requestConfig.body = JSON.stringify(data);
        }
      }
      
      // Add timeout - much longer for file uploads; optionally disable for large uploads
      let controller: AbortController | null = new AbortController();
      let timeout = 10000; // Default 10s

      const isUploadEndpoint = endpoint.includes('/upload-document') || endpoint.includes('/start-upload') || endpoint.includes('/upload-progress');

      if (data instanceof FormData) {
        // Give large files ample time (10 minutes)
        timeout = 10 * 60 * 1000;
      }
      if (isUploadEndpoint) {
        // Explicitly extend for upload endpoints
        timeout = Math.max(timeout, 10 * 60 * 1000);
        // Progress endpoints may keep connections open longer (SSE/long-poll)
        if (endpoint.includes('/upload-progress')) {
          timeout = Math.max(timeout, 60 * 1000); // at least 60s per poll
        }
      } else if (endpoint.includes('/ai-chat/')) {
        timeout = Math.max(timeout, 30000); // 30s for other AI chat requests
      }

      let timeoutId: NodeJS.Timeout | null = null;
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          controller?.abort();
        }, timeout);
        requestConfig.signal = controller.signal;
      }
      
      const response = await fetch(url, requestConfig);
      if (timeoutId) clearTimeout(timeoutId);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log('📄 Non-JSON response body:', textResponse);
        throw new ApiError(response.status, 'Invalid response format', { status: response.status, body: textResponse });
      }

      const responseData = await response.json();

      if (!response.ok) {
        throw new ApiError(response.status, responseData.message || 'Request failed', responseData);
      }

      return responseData;
    } catch (error) {
      console.error('🚨 Request error details:', error);
      
      // Handle specific network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError(0, 'Unable to connect to server. Please check if the backend is running.', error);
      }
      
      // Handle AbortError (timeout)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout. The server took too long to respond.', error);
      }
      
      // Handle network errors
      if (error instanceof Error && (error.message.includes('Network request failed') || error.message.includes('fetch'))) {
        throw new ApiError(0, 'Network request failed. Please check your internet connection and try again.', error);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Network error', error);
    }
  }

  // Get access token for external use
  async getAccessToken(): Promise<string | null> {
    return await TokenManager.getAccessToken();
  }
}
