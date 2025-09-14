import { API_ENDPOINTS, ROLES_REQUIRING_OTP } from '../config/apiConfig';
import { HttpClient } from './httpClient';
import { TokenManager } from './tokenManager';
import { 
  ApiResponse, 
  LoginCredentials, 
  LoginResponse, 
  OTPVerificationRequest,
  OTPVerificationResponse,
  ForgotPasswordRequest, 
  ResetPasswordRequest,
  EmailVerificationRequest,
  RequestEmailVerificationOTPRequest,
  VerifyOTPAndResetPasswordRequest,
  User
} from '../types/apiTypes';

export class AuthService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  // Sign in user
  async signIn(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse | OTPVerificationResponse>> {
    // console.log('📤 Request payload:', { email: credentials.email, password: '***' });
    
    const response = await this.httpClient.makeRequest<LoginResponse | OTPVerificationResponse>(
      API_ENDPOINTS.AUTH.SIGN_IN,
      'POST',
      credentials,
      false
    );

    // console.log('📥 Sign-in response:', response);

    if (response.success && response.data) {
      // Check if response contains tokens (direct login) or user data (OTP required)
      if ('access_token' in response.data) {
        // Direct login successful - store tokens and user data
        const loginData = response.data as LoginResponse;
        await TokenManager.storeTokens(loginData.access_token, loginData.refresh_token);
        await TokenManager.storeUserData(loginData.user);
      } else {
        // OTP verification required - store pending user data
        const otpData = response.data as OTPVerificationResponse;
        await TokenManager.storePendingUser(otpData);
      }
    }

    return response;
  }

  // Verify OTP
  async verifyOTP(request: OTPVerificationRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.httpClient.makeRequest<LoginResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      'POST',
      request,
      false
    );

    if (response.success && response.data) {
      // Store tokens and user data after successful OTP verification
      await TokenManager.storeTokens(response.data.access_token, response.data.refresh_token);
      await TokenManager.storeUserData(response.data.user);
      
      // Clear pending user data
      await TokenManager.clearPendingUser();
    }

    return response;
  }

  // Check if user requires OTP verification
  async requiresOTP(): Promise<boolean> {
    const pendingUser = await TokenManager.getPendingUser();
    return pendingUser !== null;
  }

  // Get pending user data
  async getPendingUser(): Promise<User | null> {
    return TokenManager.getPendingUser();
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      console.log('🔄 Logging out user...');
      
      // Call logout endpoint with authentication
      const response = await this.httpClient.makeRequest(API_ENDPOINTS.AUTH.LOGOUT, 'POST', undefined, true);

      console.log('🔄 Logout success response:', response.success);
      
      if (response.success) {
        console.log('✅ Logout successful:', response.message);
      } else {
        console.log('⚠️ Logout response indicates failure:', response.message);
      }
    } catch (error) {
      console.error('❌ Logout API error:', error);
    } finally {
      // Clear local storage regardless of API response
      console.log('🧹 Clearing local tokens and data...');
      await TokenManager.clearTokens();
      console.log('✅ Logout process completed');
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

  // Verify OTP and reset password
  async verifyOTPAndResetPassword(request: VerifyOTPAndResetPasswordRequest): Promise<ApiResponse> {
    return this.httpClient.makeRequest(API_ENDPOINTS.AUTH.VERIFY_OTP_AND_RESET_PASSWORD, 'POST', request, false);
  }

  // Request email verification OTP
  async requestEmailVerificationOTP(request: RequestEmailVerificationOTPRequest): Promise<ApiResponse> {
    return this.httpClient.makeRequest(API_ENDPOINTS.AUTH.REQUEST_EMAIL_VERIFICATION_OTP, 'POST', request, false);
  }

  // Verify email address
  async verifyEmail(request: EmailVerificationRequest): Promise<ApiResponse> {
    return this.httpClient.makeRequest(API_ENDPOINTS.AUTH.VERIFY_OTP, 'POST', request, false);
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
  async getUserData(): Promise<User | null> {
    return TokenManager.getUserData();
  }

  // Check if role requires OTP
  static doesRoleRequireOTP(role: string): boolean {
    return ROLES_REQUIRING_OTP.includes(role as any);
  }
}
