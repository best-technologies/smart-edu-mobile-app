import { ApiError } from '@/services/types/apiTypes';

export interface UserFriendlyError {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

export class ErrorHandler {
  /**
   * Convert technical API errors to user-friendly messages
   */
  static getFriendlyError(error: any): UserFriendlyError {
    console.log('🔍 Processing error for user-friendly message:', error);

    // Handle ApiError instances
    if (error instanceof ApiError) {
      return this.handleApiError(error);
    }

    // Handle network/connection errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection and try again.',
        type: 'error'
      };
    }

    // Handle timeout errors
    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      return {
        title: 'Request Timeout',
        message: 'The request took too long to complete. Please try again.',
        type: 'error'
      };
    }

    // Handle generic errors
    if (error.message) {
      // Check for common error patterns
      const message = error.message.toLowerCase();
      
      if (message.includes('unauthorized') || message.includes('401')) {
        return {
          title: 'Authentication Error',
          message: 'Your session has expired. Please log in again.',
          type: 'error'
        };
      }

      if (message.includes('forbidden') || message.includes('403')) {
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
          type: 'error'
        };
      }

      if (message.includes('not found') || message.includes('404')) {
        return {
          title: 'Service Unavailable',
          message: 'The requested service is currently unavailable. Please try again later.',
          type: 'error'
        };
      }

      if (message.includes('server error') || message.includes('500')) {
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again in a few moments.',
          type: 'error'
        };
      }

      if (message.includes('network') || message.includes('connection')) {
        return {
          title: 'Network Error',
          message: 'Please check your internet connection and try again.',
          type: 'error'
        };
      }
    }

    // Default fallback
    return {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. Please try again.',
      type: 'error'
    };
  }

  /**
   * Handle specific API errors with status codes
   */
  private static handleApiError(error: ApiError): UserFriendlyError {
    const status = error.statusCode;
    const message = error.message?.toLowerCase() || '';

    switch (status) {
      case 400:
        if (message.includes('invalid') || message.includes('validation')) {
          return {
            title: 'Invalid Information',
            message: 'Please check your information and try again.',
            type: 'error'
          };
        }
        return {
          title: 'Invalid Request',
          message: 'The information you provided is not valid. Please check and try again.',
          type: 'error'
        };

      case 401:
        if (message.includes('otp') || message.includes('verification')) {
          return {
            title: 'Verification Failed',
            message: 'The verification code is incorrect. Please try again.',
            type: 'error'
          };
        }
        return {
          title: 'Authentication Failed',
          message: 'Your email or password is incorrect. Please try again.',
          type: 'error'
        };

      case 403:
        return {
          title: 'Access Denied',
          message: 'You don\'t have permission to perform this action.',
          type: 'error'
        };

      case 404:
        if (message.includes('user') || message.includes('account')) {
          return {
            title: 'Account Not Found',
            message: 'No account found with the provided information.',
            type: 'error'
          };
        }
        return {
          title: 'Service Unavailable',
          message: 'The requested service is currently unavailable.',
          type: 'error'
        };

      case 409:
        if (message.includes('already exists') || message.includes('duplicate')) {
          return {
            title: 'Account Exists',
            message: 'An account with this information already exists.',
            type: 'warning'
          };
        }
        return {
          title: 'Conflict',
          message: 'This action conflicts with existing data. Please try a different approach.',
          type: 'error'
        };

      case 422:
        return {
          title: 'Invalid Data',
          message: 'The information provided is not valid. Please check and try again.',
          type: 'error'
        };

      case 429:
        return {
          title: 'Too Many Requests',
          message: 'You\'ve made too many requests. Please wait a moment and try again.',
          type: 'warning'
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          title: 'Server Error',
          message: 'Our servers are experiencing issues. Please try again in a few moments.',
          type: 'error'
        };

      default:
        if (status >= 500) {
          return {
            title: 'Server Error',
            message: 'Something went wrong on our end. Please try again later.',
            type: 'error'
          };
        }
        
        if (status >= 400) {
          return {
            title: 'Request Error',
            message: 'There was an issue with your request. Please try again.',
            type: 'error'
          };
        }

        return {
          title: 'Unexpected Error',
          message: 'An unexpected error occurred. Please try again.',
          type: 'error'
        };
    }
  }

  /**
   * Get specific error messages for authentication flows
   */
  static getAuthError(error: any, action: 'login' | 'otp' | 'logout' | 'forgot-password'): UserFriendlyError {
    const friendlyError = this.getFriendlyError(error);

    // Override with action-specific messages
    switch (action) {
      case 'login':
        if (friendlyError.title === 'Authentication Failed') {
          return {
            title: 'Login Failed',
            message: 'Your email or password is incorrect. Please check your credentials and try again.',
            type: 'error'
          };
        }
        break;

      case 'otp':
        if (friendlyError.title === 'Authentication Failed') {
          return {
            title: 'Verification Failed',
            message: 'The verification code is incorrect or has expired. Please try again.',
            type: 'error'
          };
        }
        break;

      case 'forgot-password':
        if (friendlyError.title === 'Account Not Found') {
          return {
            title: 'Email Not Found',
            message: 'No account found with this email address. Please check the email and try again.',
            type: 'error'
          };
        }
        break;
    }

    return friendlyError;
  }
}
