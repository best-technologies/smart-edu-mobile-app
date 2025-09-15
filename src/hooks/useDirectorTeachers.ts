import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import type { TeachersData, TeachersResponse } from '@/services/api/directorService';
import { directorQueryKeys } from './useDirectorDashboard';

/**
 * Custom hook for fetching teachers data
 * Uses React Query for caching, background updates, and error handling
 */
export function useDirectorTeachers() {
  return useQuery({
    queryKey: directorQueryKeys.teachers,
    queryFn: async (): Promise<TeachersData> => {
      const response = await ApiService.directorDashboard.fetchTeachersData();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch teachers data');
      }
      return response.data!;
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
 * Custom hook for refreshing teachers data
 */
export function useRefreshDirectorTeachers() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<TeachersData> => {
      const response = await ApiService.directorDashboard.fetchTeachersData();
      if (!response.success) {
        throw new Error(response.message || 'Failed to refresh teachers data');
      }
      return response.data!;
    },
    onSuccess: (data) => {
      // Update the cache with fresh data
      queryClient.setQueryData(directorQueryKeys.teachers, data);
    },
    onError: (error) => {
      console.error('Error refreshing teachers data:', error);
    },
  });
}

/**
 * Custom hook for prefetching teachers data
 */
export function usePrefetchDirectorTeachers() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: directorQueryKeys.teachers,
      queryFn: async (): Promise<TeachersData> => {
        const response = await ApiService.directorDashboard.fetchTeachersData();
        if (!response.success) {
          throw new Error(response.message || 'Failed to fetch teachers data');
        }
        return response.data!;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Custom hook for invalidating teachers cache
 */
export function useInvalidateDirectorTeachers() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: directorQueryKeys.teachers });
  };
}

/**
 * Custom hook for getting teachers data from cache
 */
export function useDirectorTeachersCache() {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<TeachersData>(directorQueryKeys.teachers);
}
