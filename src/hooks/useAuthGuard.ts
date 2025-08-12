import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Hook for protecting routes that require authentication
export function useAuthGuard() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      // Navigate to login if not authenticated
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' as never }],
      });
    }
  }, [isAuthenticated, isLoading, isInitialized, navigation]);

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
  };
}

// Hook for protecting routes that should only be accessible when NOT authenticated
export function useGuestGuard() {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated) {
      // Navigate to role selection if already authenticated
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' as never }],
      });
    }
  }, [isAuthenticated, isLoading, isInitialized, navigation]);

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
  };
}

// Hook for OTP verification screen - only redirects after successful OTP verification
export function useOTPGuard() {
  const { isAuthenticated, isLoading, isInitialized, requiresOTP } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isInitialized && !isLoading && isAuthenticated && !requiresOTP) {
      // Only navigate to role selection if authenticated and OTP is not required
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' as never }],
      });
    }
  }, [isAuthenticated, isLoading, isInitialized, requiresOTP, navigation]);

  return {
    isAuthenticated,
    isLoading,
    isInitialized,
    requiresOTP,
  };
}

// Hook for role-based access control
export function useRoleGuard(allowedRoles: string[]) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      if (!allowedRoles.includes(user.role)) {
        // Navigate to role selection if user doesn't have required role
        navigation.reset({
          index: 0,
          routes: [{ name: 'RoleSelect' as never }],
        });
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, navigation]);

  return {
    hasAccess: isAuthenticated && user ? allowedRoles.includes(user.role) : false,
    user,
    isLoading,
  };
}
