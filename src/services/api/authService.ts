import { API_ENDPOINTS } from '../config/apiConfig';
import { HttpClient } from './httpClient';
import { TokenManager } from './tokenManager';
import { 
  ApiResponse, 
  LoginCredentials, 
  LoginResponse, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from '../types/apiTypes';

export class AuthService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const response = await this.httpClient.makeRequest<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      'POST',
      credentials,
      false
    );

    if (response.success && response.data) {
      await TokenManager.storeTokens(
        response.data.tokens.accessToken,
        response.data.tokens.refreshToken,
        response.data.tokens.expiresIn
      );
      
      // Store user data
      await TokenManager.storeUserData(response.data.user);
    }

    return response;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint
      await this.httpClient.makeRequest(API_ENDPOINTS.AUTH.LOGOUT, 'POST');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage regardless of API response
      await TokenManager.clearTokens();
    }
  }

  // Forgot password
  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse> {
    return this.httpClient.makeRequest(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, 'POST', request, false);
  }

  // Reset password
  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse> {
    return this.httpClient.makeRequest(API_ENDPOINTS.AUTH.RESET_PASSWORD, 'POST', request, false);
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const accessToken = await TokenManager.getAccessToken();
      if (!accessToken) return false;

      const isExpired = await TokenManager.isTokenExpired();
      if (isExpired) {
        // Try to refresh token
        const newToken = await this.httpClient['refreshAccessToken']();
        return !!newToken;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Get user data
  async getUserData(): Promise<any | null> {
    return TokenManager.getUserData();
  }
}
