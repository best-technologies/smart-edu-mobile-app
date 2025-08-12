import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { ApiService, LoginCredentials, ForgotPasswordRequest, ResetPasswordRequest } from '@/services';

// Authentication State Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'director' | 'teacher' | 'student' | 'developer';
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// Authentication Actions
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: AuthUser } }
  | { type: 'AUTH_FAILURE'; payload: { error: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_INITIALIZED' };

// Authentication Context Type
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (request: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (request: ResetPasswordRequest) => Promise<void>;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Initial State
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
  isInitialized: false,
};

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload.error,
      };
    
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };
    
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    case 'AUTH_INITIALIZED':
      return {
        ...state,
        isInitialized: true,
      };
    
    default:
      return state;
  }
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

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const isAuthenticated = await ApiService.isAuthenticated();
      
      if (isAuthenticated) {
        const userData = await ApiService.getUserData();
        if (userData) {
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user: userData } 
          });
        } else {
          dispatch({ 
            type: 'AUTH_FAILURE', 
            payload: { error: 'User data not found' } 
          });
        }
      } else {
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: { error: 'Not authenticated' } 
        });
      }
    } catch (error) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: { error: 'Failed to check authentication status' } 
      });
    } finally {
      dispatch({ type: 'AUTH_INITIALIZED' });
    }
  };

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await ApiService.auth.login(credentials);
      
      if (response.success && response.data) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: response.data.user } 
        });
      } else {
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: { error: response.message || 'Login failed' } 
        });
      }
    } catch (error: any) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: { error: error.message || 'Login failed' } 
      });
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await ApiService.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Forgot password function
  const forgotPassword = async (request: ForgotPasswordRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await ApiService.auth.forgotPassword(request);
      
      if (!response.success) {
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: { error: response.message || 'Failed to send reset email' } 
        });
      } else {
        dispatch({ type: 'AUTH_CLEAR_ERROR' });
      }
    } catch (error: any) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: { error: error.message || 'Failed to send reset email' } 
      });
    }
  };

  // Reset password function
  const resetPassword = async (request: ResetPasswordRequest) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await ApiService.auth.resetPassword(request);
      
      if (!response.success) {
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: { error: response.message || 'Failed to reset password' } 
        });
      } else {
        dispatch({ type: 'AUTH_CLEAR_ERROR' });
      }
    } catch (error: any) {
      dispatch({ 
        type: 'AUTH_FAILURE', 
        payload: { error: error.message || 'Failed to reset password' } 
      });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  };

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export types for use in other files
export type { AuthUser, AuthState };
