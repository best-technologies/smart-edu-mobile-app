import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePrefetchDirectorDashboard, usePrefetchTeacherDashboard } from './useDirectorDashboard';

/**
 * Hook for prefetching data based on user role
 * This improves user experience by loading data before navigation
 */
export function useDataPrefetching() {
  const { user, isAuthenticated, requiresOTP } = useAuth();
  const prefetchDirectorDashboard = usePrefetchDirectorDashboard();
  const prefetchTeacherDashboard = usePrefetchTeacherDashboard();

  useEffect(() => {
    // Only prefetch data when user is fully authenticated (not during OTP verification)
    if (!user?.role || !isAuthenticated || requiresOTP) return;

    const role = user.role.toLowerCase();
    
    // Prefetch data based on user role
    switch (role) {
      case 'school_director':
      case 'director':
      case 'admin':
        // Prefetch director dashboard data
        prefetchDirectorDashboard();
        break;
      case 'teacher':
        // Prefetch teacher dashboard data
        prefetchTeacherDashboard();
        break;
      case 'student':
        // TODO: Add student data prefetching
        break;
      default:
        break;
    }
  }, [user?.role, isAuthenticated, requiresOTP, prefetchDirectorDashboard, prefetchTeacherDashboard]);

  return {
    prefetchDirectorDashboard,
    prefetchTeacherDashboard,
    // Add other prefetch functions as needed
  };
}
