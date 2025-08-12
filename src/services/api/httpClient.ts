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
        await TokenManager.storeTokens(data.data.accessToken, refreshToken, data.data.expiresIn);
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
    body?: any,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    try {
      // Check if token is needed and valid
      let accessToken: string | null = null;
      if (requiresAuth) {
        const isExpired = await TokenManager.isTokenExpired();
        if (isExpired) {
          accessToken = await this.refreshAccessToken();
        } else {
          accessToken = await TokenManager.getAccessToken();
        }

        if (!accessToken) {
          throw new ApiError(401, 'Authentication required');
        }
      }

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      // Make request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle response
      const responseData: ApiResponse<T> = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          await TokenManager.clearTokens();
          throw new ApiError(401, 'Session expired. Please login again.');
        }

        throw new ApiError(
          response.status,
          responseData.message || responseData.error || 'An error occurred',
          responseData
        );
      }

      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }

      console.error('API request error:', error);
      throw new ApiError(500, 'Network error. Please check your connection.');
    }
  }
}
