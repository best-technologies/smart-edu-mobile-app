import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePrefetchDirectorDashboard } from './useDirectorDashboard';

/**
 * Hook for prefetching data based on user role
 * This improves user experience by loading data before navigation
 */
export function useDataPrefetching() {
  const { user } = useAuth();
  const prefetchDirectorDashboard = usePrefetchDirectorDashboard();

  useEffect(() => {
    if (!user?.role) return;

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
        // TODO: Add teacher data prefetching
        break;
      case 'student':
        // TODO: Add student data prefetching
        break;
      default:
        break;
    }
  }, [user?.role, prefetchDirectorDashboard]);

  return {
    prefetchDirectorDashboard,
    // Add other prefetch functions as needed
  };
}
