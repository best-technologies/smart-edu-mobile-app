import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import type { DirectorDashboardData, DirectorDashboardResponse } from '@/services/api/directorService';

// Query keys for React Query
export const directorQueryKeys = {
  dashboard: ['director', 'dashboard'] as const,
  teachers: ['director', 'teachers'] as const,
  students: ['director', 'students'] as const,
  subjects: ['director', 'subjects'] as const,
  schedules: ['director', 'schedules'] as const,
} as const;

/**
 * Custom hook for fetching director dashboard data
 * Uses React Query for caching, background updates, and error handling
 */
export function useDirectorDashboard() {
  return useQuery({
    queryKey: directorQueryKeys.dashboard,
    queryFn: async (): Promise<DirectorDashboardData> => {
      const response = await ApiService.directorDashboard.fetchDashboardData();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
      return response.data as DirectorDashboardData;
    },
    // Keep data fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache data for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests
    retry: 3,
    // Show loading state for at least 500ms to prevent flickering
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Custom hook for refreshing director dashboard data
 */
export function useRefreshDirectorDashboard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<DirectorDashboardData> => {
      const response = await ApiService.directorDashboard.fetchDashboardData();
      if (!response.success) {
        throw new Error(response.message || 'Failed to refresh dashboard data');
      }
      return response.data as DirectorDashboardData;
    },
    onSuccess: (data) => {
      // Update the cache with fresh data
      queryClient.setQueryData(directorQueryKeys.dashboard, data);
    },
    onError: (error) => {
      console.error('Error refreshing dashboard data:', error);
    },
  });
}

/**
 * Custom hook for prefetching director dashboard data
 * Useful for prefetching data before navigation
 */
export function usePrefetchDirectorDashboard() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: directorQueryKeys.dashboard,
      queryFn: async (): Promise<DirectorDashboardData> => {
        const response = await ApiService.directorDashboard.fetchDashboardData();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch dashboard data');
        }
        return response.data as DirectorDashboardData;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Custom hook for invalidating director dashboard cache
 * Useful when data needs to be refetched (e.g., after mutations)
 */
export function useInvalidateDirectorDashboard() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: directorQueryKeys.dashboard });
  };
}

/**
 * Custom hook for getting director dashboard data from cache
 * Returns cached data without making a network request
 */
export function useDirectorDashboardCache() {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<DirectorDashboardData>(directorQueryKeys.dashboard);
}
