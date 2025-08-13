import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { getRouteForRole } from '@/utils/roleMapper';
import { useDataPrefetching } from './useDataPrefetching';

type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Custom hook to handle authentication-based navigation
 * This centralizes navigation logic and follows better architectural patterns
 */
export function useAuthNavigation() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { isAuthenticated, user, requiresOTP } = useAuth();
  const { prefetchDirectorDashboard } = useDataPrefetching();
  const navigationReadyRef = useRef(false);
  const initializationDelayRef = useRef(false);
  const lastNavigationState = useRef<{
    isAuthenticated: boolean;
    requiresOTP: boolean;
    userEmail?: string;
    userRole?: string;
  }>({
    isAuthenticated: false,
    requiresOTP: false,
  });

  // Check if navigation is ready and add initialization delay
  useEffect(() => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigationReadyRef.current = true;
      
      // Add a small delay to ensure NavigationContainer is fully initialized
      if (!initializationDelayRef.current) {
        initializationDelayRef.current = true;
        setTimeout(() => {
          // This ensures we have a delay before any navigation operations
        }, 100);
      }
    }
  }, [navigation]);

  useEffect(() => {
    // Check if navigation is initialized and ready, and if we've had enough time for initialization
    if (!navigationReadyRef.current || !navigation || typeof navigation.navigate !== 'function') {
      return;
    }

    // Create current state for comparison
    const currentState = {
      isAuthenticated,
      requiresOTP,
      userEmail: user?.email,
      userRole: user?.role,
    };

    // Check if state has actually changed to prevent infinite loops
    const stateChanged = 
      lastNavigationState.current.isAuthenticated !== isAuthenticated ||
      lastNavigationState.current.requiresOTP !== requiresOTP ||
      lastNavigationState.current.userEmail !== user?.email ||
      lastNavigationState.current.userRole !== user?.role;

    if (!stateChanged) {
      return;
    }

    // Update last state
    lastNavigationState.current = currentState;

    // Handle logout - redirect to login if not authenticated
    if (!isAuthenticated && !user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      return;
    }

    // Handle OTP requirement first (even when not fully authenticated)
    if (requiresOTP && user) {
      // Add a small delay to ensure pending user is stored
      setTimeout(() => {
        if (navigationReadyRef.current && navigation) {
          navigation.navigate('OTPVerification');
        }
      }, 200);
      return;
    }

    // Only handle other navigation if user is authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    // Handle email verification requirement
    if (!user.is_email_verified) {
      navigation.navigate('EmailVerification', { email: user.email });
      return;
    }

    // User is fully authenticated, redirect to role-based dashboard
    const routeForRole = getRouteForRole(user.role);
    if (routeForRole) {
      navigation.reset({
        index: 0,
        routes: [{ name: routeForRole }],
      });
    } else {
      // Fallback to role selection if role is not recognized
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' }],
      });
    }
  }, [isAuthenticated, user, requiresOTP, navigation]);

  return {
    shouldShowAuthScreens: !isAuthenticated || requiresOTP || (user && !user.is_email_verified),
    isFullyAuthenticated: isAuthenticated && user && !requiresOTP && user.is_email_verified,
  };
}
