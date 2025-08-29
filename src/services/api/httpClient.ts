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
      const url = `${this.baseURL}${endpoint}`;
      console.log(`🌐 ${method} ${url}`);
      // const url = `${API_CONFIG.BASE_URL}${endpoint}`;
      // console.log(`🌐 ${method} ${url}`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (requiresAuth) {
        const token = await TokenManager.getAccessToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const requestConfig: RequestInit = {
        method,
        headers,
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        requestConfig.body = JSON.stringify(data);
      }

      // console.log('📤 Request config:', {
      //   method,
      //   url,
      //   headers: Object.keys(headers),
      //   hasBody: !!requestConfig.body,
      // });

      const response = await fetch(url, requestConfig);
      // console.log('📥 Response status:', response.status);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('⚠️ Non-JSON response received');
        throw new ApiError(response.status, 'Invalid response format', { status: response.status });
      }

      const responseData = await response.json();
      // console.log('📥 Response data:', responseData);

      if (!response.ok) {
        throw new ApiError(response.status, responseData.message || 'Request failed', responseData);
      }

      return responseData;
    } catch (error) {
      console.log('💥 HTTP request error:', error);
      
      // Handle specific network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.log('🌐 Network error - backend might not be running');
        throw new ApiError(0, 'Unable to connect to server. Please check if the backend is running.', error);
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Network error', error);
    }
  }
}
