import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { getRouteForRole } from '@/utils/roleMapper';

type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Custom hook to handle authentication-based navigation
 * This centralizes navigation logic and follows better architectural patterns
 */
export function useAuthNavigation() {
  const navigation = useNavigation<AuthNavigationProp>();
  const { isAuthenticated, user, requiresOTP } = useAuth();

  useEffect(() => {
    // Handle OTP requirement first (even when not fully authenticated)
    if (requiresOTP && user) {
      // Add a small delay to ensure pending user is stored
      setTimeout(() => {
        navigation.navigate('OTPVerification');
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
