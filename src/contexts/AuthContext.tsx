import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { navigationRef, navigate } from '@/navigation/RootNavigation';
import { ApiService } from '@/services';
import { User } from '@/services/types/apiTypes';
import { useToast } from './ToastContext';
import { ErrorHandler } from '@/utils/errorHandler';
import { getRouteForRole } from '@/utils/roleMapper';
import { pushNotificationService } from '@/services/pushNotificationService';

// Auth State Interface
interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  requiresOTP: boolean;
}

// Auth Action Types
type AuthAction =
  | { type: 'INITIALIZE'; payload: { isAuthenticated: boolean; user: User | null } }
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; requiresOTP: boolean } }
  | { type: 'OTP_VERIFICATION_SUCCESS'; payload: { user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  user: null,
  error: null,
  requiresOTP: false,
};

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        isInitialized: true,
      };
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        isAuthenticated: !action.payload.requiresOTP, // Only authenticated if no OTP required
        requiresOTP: action.payload.requiresOTP,
        error: null,
      };
    case 'OTP_VERIFICATION_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        isAuthenticated: true,
        requiresOTP: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        requiresOTP: false,
      };
    case 'LOGOUT':
      console.log('🔄 LOGOUT reducer: Setting user as not authenticated');
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        requiresOTP: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (credentials: { email: string; password: string }) => Promise<void>;
  verifyOTP: (request: { email: string; otp: string }) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  requestEmailVerificationOTP: (email: string) => Promise<void>;
  verifyEmail: (request: { email: string; otp: string }) => Promise<void>;
  verifyOTPAndResetPassword: (request: { email: string; otp: string; new_password: string }) => Promise<void>;
  clearError: () => void;
  getPendingUser: () => Promise<User | null>;
  refreshUserProfile: () => Promise<void>;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  // Navigate to dashboard only when authenticated and navigation is ready
  useEffect(() => {
    if (state.isAuthenticated && navigationRef.isReady()) {
      console.log('🚀 NavigationContainer is ready, navigating to dashboard...');
      navigate('Dashboard');
    } else if (state.isAuthenticated) {
      console.log('⏳ NavigationContainer not ready, skipping navigation');
    }
  }, [state.isAuthenticated, navigationRef.isReady()]);

  // Initialize auth state on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const isAuthenticated = await ApiService.isAuthenticated();
      const user = await ApiService.getUserData();
      
      dispatch({
        type: 'INITIALIZE',
        payload: { isAuthenticated, user },
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      dispatch({
        type: 'INITIALIZE',
        payload: { isAuthenticated: false, user: null },
      });
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const response = await ApiService.auth.signIn(credentials);

      if (response.success && response.data) {
        // Check if response contains tokens (direct login) or user data (OTP required)
        // OTPVerificationResponse is just a User object, while LoginResponse has access_token
        if ('access_token' in response.data && response.data.access_token) {
          // Direct login successful
          console.log('✅ Direct login successful');
          const loginData = response.data as any;
          
          // Check if email verification is required
          if (!loginData.user.is_email_verified) {
            console.log('📧 Email verification required');
            
            // Show info toast for email verification requirement
            showInfo(
              'Email Verification Required',
              'Please verify your email address to continue',
              4000
            );
            
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: loginData.user, requiresOTP: false },
            });
            
            // Navigate to email verification screen
            // This will be handled by the navigation logic
            return;
          }
          
          // Show success toast with backend message
          showSuccess(
            'Login Successful',
            response.message || 'Welcome back!',
            3000
          );
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: loginData.user, requiresOTP: false },
          });

          // Register device for push notifications after successful login
          try {
            await pushNotificationService.registerForPushNotifications();
          } catch (e) {
            console.log('Push registration failed (non-blocking):', e);
          }
        } else {
          // OTP verification required - response.data is the user object directly
          const otpData = response.data as any;
          
          // Show info toast for OTP requirement
          showInfo(
            'OTP Required',
            'Please check your email for the verification code',
            4000
          );
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user: otpData, requiresOTP: true },
          });
        }
      } else {
        console.log('❌ Login failed:', response.message);
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.log('💥 Login error:', error);
      
      // Get user-friendly error message
      const friendlyError = ErrorHandler.getAuthError(error, 'login');
      
      // Show appropriate toast based on error type
      if (friendlyError.type === 'warning') {
        showWarning(friendlyError.title, friendlyError.message, 5000);
      } else {
        showError(friendlyError.title, friendlyError.message, 5000);
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: friendlyError.message });
      throw error;
    }
  };

  const verifyOTP = async (request: { email: string; otp: string }) => {
    try {
      console.log('🔐 OTP verification attempt for:', request.email);
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await ApiService.auth.verifyOTP(request);
      // console.log('📡 OTP verification response:', response);

      if (response.success && response.data) {
        console.log('✅ OTP verification successful');
        const loginData = response.data as any;
        console.log('📧 User data after OTP:', loginData.user);
        console.log('📧 Email verified status:', loginData.user.is_email_verified);
        
        // Check if email verification is required
        if (!loginData.user.is_email_verified) {
          console.log('📧 Email verification required after OTP');
          
          // Show info toast for email verification requirement
          showInfo(
            'Email Verification Required',
            'Please verify your email address to continue',
            4000
          );
          
          dispatch({
            type: 'OTP_VERIFICATION_SUCCESS',
            payload: { user: loginData.user },
          });
          
          // Navigate to email verification screen
          // This will be handled by the navigation logic
          return;
        }
        
        console.log('✅ Email already verified, proceeding to dashboard');
        
        // Show success toast with backend message
        showSuccess(
          'Verification Successful',
          response.message || 'Welcome to Smart Edu Hub!',
          3000
        );
        
        dispatch({
          type: 'OTP_VERIFICATION_SUCCESS',
          payload: { user: loginData.user },
        });
        // Register device for push notifications after OTP success
        try {
          await pushNotificationService.registerForPushNotifications();
        } catch (e) {
          console.log('Push registration failed (non-blocking):', e);
        }
        // Navigation will be handled by the component using useAuthNavigation
      } else {
        console.log('❌ OTP verification failed:', response.message);
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      console.log('💥 OTP verification error:', error);
      
      // Get user-friendly error message
      const friendlyError = ErrorHandler.getAuthError(error, 'otp');
      
      // Show appropriate toast based on error type
      if (friendlyError.type === 'warning') {
        showWarning(friendlyError.title, friendlyError.message, 5000);
      } else {
        showError(friendlyError.title, friendlyError.message, 5000);
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: friendlyError.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      // Attempt to unregister device token server-side before logging out
      try {
        const token = pushNotificationService.getPushToken();
        if (token) {
          await fetch('/api/v1/push-notifications/unregister-device', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await (await import('@/services/api/tokenManager')).TokenManager.getAccessToken()}`,
            },
            body: JSON.stringify({ token }),
          });
        }
      } catch (e) {
        console.log('Unregister device failed (non-blocking):', e);
      }

      await ApiService.auth.logout();
      
      // Show success toast
      showSuccess(
        'Logged Out',
        'You have been successfully logged out',
        3000
      );
    } catch (error) {
      console.error('Logout error:', error);
      
      // Get user-friendly error message
      const friendlyError = ErrorHandler.getAuthError(error, 'logout');
      
      // Show appropriate toast based on error type
      if (friendlyError.type === 'warning') {
        showWarning(friendlyError.title, friendlyError.message, 4000);
      } else {
        showError(friendlyError.title, friendlyError.message, 4000);
      }
    } finally {
      console.log('🔄 Dispatching LOGOUT action');
      dispatch({ type: 'LOGOUT' });
      console.log('✅ LOGOUT action dispatched');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await ApiService.auth.forgotPassword({ email });
      
      // Show success toast with backend message
      showSuccess(
        'Reset Email Sent',
        response.message || 'Check your email for password reset instructions',
        4000
      );
    } catch (error) {
      console.log('💥 Forgot password error:', error);
      
      // Get user-friendly error message
      const friendlyError = ErrorHandler.getAuthError(error, 'forgot-password');
      
      // Show appropriate toast based on error type
      if (friendlyError.type === 'warning') {
        showWarning(friendlyError.title, friendlyError.message, 5000);
      } else {
        showError(friendlyError.title, friendlyError.message, 5000);
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: friendlyError.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const requestEmailVerificationOTP = async (email: string) => {
    try {
      const response = await ApiService.auth.requestEmailVerificationOTP({ email });
      
      // Show success toast with backend message
      showSuccess(
        'Verification Code Sent',
        response.message || 'Check your email for verification code',
        4000
      );
    } catch (error) {
      console.log('💥 Request email verification OTP error:', error);
      
      // Get user-friendly error message
      const friendlyError = ErrorHandler.getFriendlyError(error);
      
      // Show appropriate toast based on error type
      if (friendlyError.type === 'warning') {
        showWarning(friendlyError.title, friendlyError.message, 5000);
      } else {
        showError(friendlyError.title, friendlyError.message, 5000);
      }
      
      throw error;
    }
  };

  const verifyEmail = async (request: { email: string; otp: string }) => {
    try {
      console.log('🔐 Email verification attempt for:', request.email);
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await ApiService.auth.verifyEmail(request);
      console.log('📡 Email verification response:', response);

      if (response.success) {
        console.log('✅ Email verification successful');
        
        // Show success toast with backend message
        showSuccess(
          'Email Verified',
          response.message || 'Your email has been successfully verified',
          3000
        );
        
        // Update user data to reflect email verification
        const currentUser = await ApiService.getUserData();
        if (currentUser) {
          dispatch({
            type: 'OTP_VERIFICATION_SUCCESS',
            payload: { user: { ...currentUser, is_email_verified: true } },
          });
        }
      } else {
        console.log('❌ Email verification failed:', response.message);
        throw new Error(response.message || 'Email verification failed');
      }
    } catch (error) {
      console.log('💥 Email verification error:', error);
      
      // Get user-friendly error message
      const friendlyError = ErrorHandler.getFriendlyError(error);
      
      // Show appropriate toast based on error type
      if (friendlyError.type === 'warning') {
        showWarning(friendlyError.title, friendlyError.message, 5000);
      } else {
        showError(friendlyError.title, friendlyError.message, 5000);
      }
      
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const verifyOTPAndResetPassword = async (request: { email: string; otp: string; new_password: string }) => {
    try {
      console.log('🔐 Password reset OTP verification attempt for:', request.email);
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await ApiService.auth.verifyOTPAndResetPassword(request);
      console.log('📡 Password reset OTP verification response:', response);

      if (response.success) {
        console.log('✅ Password reset successful');
        
        // Show success toast with backend message
        showSuccess(
          'Password Reset Successful',
          response.message || 'Your password has been successfully reset',
          4000
        );
      } else {
        console.log('❌ Password reset failed:', response.message);
        throw new Error(response.message || 'Password reset failed');
      }
    } catch (error) {
      console.log('💥 Password reset error:', error);
      
      // Get user-friendly error message
      const friendlyError = ErrorHandler.getFriendlyError(error);
      
      // Show appropriate toast based on error type
      if (friendlyError.type === 'warning') {
        showWarning(friendlyError.title, friendlyError.message, 5000);
      } else {
        showError(friendlyError.title, friendlyError.message, 5000);
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: friendlyError.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const getPendingUser = async (): Promise<User | null> => {
    return ApiService.auth.getPendingUser();
  };

  const refreshUserProfile = async (): Promise<void> => {
    try {
      // This will trigger the useUserProfile hook to refresh the profile
      // The actual implementation is in the useUserProfile hook
      console.log('🔄 Auth context: User profile refresh requested');
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    verifyOTP,
    logout,
    forgotPassword,
    requestEmailVerificationOTP,
    verifyEmail,
    verifyOTPAndResetPassword,
    clearError,
    getPendingUser,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
