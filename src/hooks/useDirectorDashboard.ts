import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import type { DirectorDashboardData, DirectorDashboardResponse } from '@/services/api/directorService';
import { useAuthErrorHandler } from '@/utils/errorHandler';

// Query keys for React Query
export const directorQueryKeys = {
  dashboard: ['director', 'dashboard'] as const,
  teachers: ['director', 'teachers'] as const,
  students: ['director', 'students'] as const,
  subjects: ['director', 'subjects'] as const,
  schedules: ['director', 'schedules'] as const,
} as const;

export const teacherQueryKeys = {
  dashboard: ['teacher', 'dashboard'] as const,
} as const;

/**
 * Custom hook for fetching director dashboard data
 * Uses React Query for caching, background updates, and error handling
 */
export function useDirectorDashboard() {
  const handleAuthError = useAuthErrorHandler();
  
  return useQuery({
    queryKey: directorQueryKeys.dashboard,
    queryFn: async (): Promise<DirectorDashboardData> => {
      try {
        const response = await ApiService.directorDashboard.fetchDashboardData();
        if (!response.success) {
          const error = new Error(response.message || 'Failed to fetch dashboard data');
          await handleAuthError(error);
          throw error;
        }
        return response.data as DirectorDashboardData;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
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
  const handleAuthError = useAuthErrorHandler();
  
  return useMutation({
    mutationFn: async (): Promise<DirectorDashboardData> => {
      try {
        const response = await ApiService.directorDashboard.fetchDashboardData();
        if (!response.success) {
          const error = new Error(response.message || 'Failed to refresh dashboard data');
          await handleAuthError(error);
          throw error;
        }
        return response.data as DirectorDashboardData;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
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
  const handleAuthError = useAuthErrorHandler();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: directorQueryKeys.dashboard,
      queryFn: async (): Promise<DirectorDashboardData> => {
        try {
          const response = await ApiService.directorDashboard.fetchDashboardData();
          if (!response.success) {
            const error = new Error(response.message || 'Failed to fetch dashboard data');
            await handleAuthError(error);
            throw error;
          }
          return response.data as DirectorDashboardData;
        } catch (error) {
          await handleAuthError(error);
          throw error;
        }
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

// Teacher Dashboard Hooks

export interface TeacherDashboardData {
  managed_class: {
    id: string;
    name: string;
    students: {
      total: number;
      males: number;
      females: number;
    };
  };
  subjects_teaching: Array<{
    id: string;
    name: string;
    code: string;
    color: string;
    description: string;
  }>;
  recent_notifications: Array<{
    id: string;
    title: string;
    description: string;
    type: string;
    comingUpOn: string;
    createdAt: string;
    updatedAt: string;
  }>;
  class_schedules: {
    today: {
      day: string;
      schedule: Array<{
        subject: {
          id: string;
          name: string;
          code: string;
          color: string;
        };
        class: {
          id: string;
          name: string;
        };
        time: {
          from: string;
          to: string;
          label: string;
        };
        room: string;
      }>;
    };
    tomorrow: {
      day: string;
      schedule: Array<{
        subject: {
          id: string;
          name: string;
          code: string;
          color: string;
        };
        class: {
          id: string;
          name: string;
        };
        time: {
          from: string;
          to: string;
          label: string;
        };
        room: string;
      }>;
    };
    day_after_tomorrow: {
      day: string;
      schedule: Array<{
        subject: {
          id: string;
          name: string;
          code: string;
          color: string;
        };
        class: {
          id: string;
          name: string;
        };
        time: {
          from: string;
          to: string;
          label: string;
        };
        room: string;
      }>;
    };
  };
}

/**
 * Custom hook for fetching teacher dashboard data
 * Uses React Query for caching, background updates, and error handling
 */
export function useTeacherDashboard() {
  const handleAuthError = useAuthErrorHandler();
  
  return useQuery({
    queryKey: teacherQueryKeys.dashboard,
    queryFn: async (): Promise<TeacherDashboardData> => {
      try {
        const response = await ApiService.directorDashboard.fetchTeacherDashboard();
        if (!response.success) {
          const error = new Error(response.message || 'Failed to fetch teacher dashboard data');
          await handleAuthError(error);
          throw error;
        }
        return response.data as TeacherDashboardData;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
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
 * Custom hook for refreshing teacher dashboard data
 */
export function useRefreshTeacherDashboard() {
  const queryClient = useQueryClient();
  const handleAuthError = useAuthErrorHandler();
  
  return useMutation({
    mutationFn: async (): Promise<TeacherDashboardData> => {
      try {
        const response = await ApiService.directorDashboard.fetchTeacherDashboard();
        if (!response.success) {
          const error = new Error(response.message || 'Failed to refresh teacher dashboard data');
          await handleAuthError(error);
          throw error;
        }
        return response.data as TeacherDashboardData;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Update the cache with fresh data
      queryClient.setQueryData(teacherQueryKeys.dashboard, data);
    },
    onError: (error) => {
      console.error('Error refreshing teacher dashboard data:', error);
    },
  });
}

/**
 * Custom hook for prefetching teacher dashboard data
 * Useful for prefetching data before navigation
 */
export function usePrefetchTeacherDashboard() {
  const queryClient = useQueryClient();
  const handleAuthError = useAuthErrorHandler();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: teacherQueryKeys.dashboard,
      queryFn: async (): Promise<TeacherDashboardData> => {
        try {
          const response = await ApiService.directorDashboard.fetchTeacherDashboard();
          if (!response.success) {
            const error = new Error(response.message || 'Failed to fetch teacher dashboard data');
            await handleAuthError(error);
            throw error;
          }
          return response.data as TeacherDashboardData;
        } catch (error) {
          await handleAuthError(error);
          throw error;
        }
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Custom hook for invalidating teacher dashboard cache
 * Useful when data needs to be refetched (e.g., after mutations)
 */
export function useInvalidateTeacherDashboard() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: teacherQueryKeys.dashboard });
  };
}

/**
 * Custom hook for getting teacher dashboard data from cache
 * Returns cached data without making a network request
 */
export function useTeacherDashboardCache() {
  const queryClient = useQueryClient();
  
  return queryClient.getQueryData<TeacherDashboardData>(teacherQueryKeys.dashboard);
}
