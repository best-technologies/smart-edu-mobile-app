import { useDirectorDashboard, useRefreshDirectorDashboard, useInvalidateDirectorDashboard, useDirectorDashboardCache } from './useDirectorDashboard';
import { useToast } from '@/contexts/ToastContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { directorService, SubjectsQueryParams, SubjectsData, StudentsQueryParams, StudentsData } from '@/services/api/directorService';

/**
 * Comprehensive hook for managing director dashboard data
 * Provides loading states, error handling, refresh functionality, and cache management
 */
export function useDirectorData() {
  const { showSuccess, showError } = useToast();
  
  // Main dashboard data query
  const dashboardQuery = useDirectorDashboard();
  
  // Refresh mutation
  const refreshMutation = useRefreshDirectorDashboard();
  
  // Cache invalidation
  const invalidateCache = useInvalidateDirectorDashboard();
  
  // Cache access
  const cachedData = useDirectorDashboardCache();

  // Enhanced refresh function with toast notifications
  const refreshData = async () => {
    try {
      await refreshMutation.mutateAsync();
      showSuccess('Dashboard Updated', 'Dashboard data has been refreshed successfully');
    } catch (error) {
      showError('Refresh Failed', 'Failed to refresh dashboard data. Please try again.');
    }
  };

  // Force refetch from server
  const refetchData = async () => {
    try {
      await dashboardQuery.refetch();
      showSuccess('Data Refetched', 'Dashboard data has been updated from server');
    } catch (error) {
      showError('Refetch Failed', 'Failed to fetch fresh data from server');
    }
  };

  // Invalidate and refetch
  const invalidateAndRefetch = async () => {
    try {
      invalidateCache();
      await dashboardQuery.refetch();
      showSuccess('Cache Cleared', 'Cache cleared and data refreshed');
    } catch (error) {
      showError('Operation Failed', 'Failed to clear cache and refresh data');
    }
  };

  return {
    // Data
    data: dashboardQuery.data,
    cachedData,
    
    // Loading states
    isLoading: dashboardQuery.isLoading,
    isRefetching: dashboardQuery.isRefetching,
    isRefreshing: refreshMutation.isPending,
    
    // Error states
    error: dashboardQuery.error,
    isError: dashboardQuery.isError,
    
    // Actions
    refresh: refreshData,
    refetch: refetchData,
    invalidateAndRefetch,
    invalidateCache,
    
    // Query object for advanced usage
    query: dashboardQuery,
    refreshMutation,
  };
}

/**
 * Hook for managing subjects data with pagination and search
 */
export function useSubjectsData(initialParams?: SubjectsQueryParams) {
  const [params, setParams] = useState<SubjectsQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['subjects', params],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching subjects with params:', params);
        const result = await directorService.fetchSubjectsData(params);
        return result;
      } catch (err) {
        console.error('❌ Error fetching subjects:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Retry failed requests up to 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const subjectsData = response?.data;

  const updateParams = useCallback((newParams: Partial<SubjectsQueryParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when search or filters change
      page: newParams.search !== undefined || newParams.classId !== undefined ? 1 : prev.page,
    }));
  }, []);

  const goToPage = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  const searchSubjects = useCallback((searchTerm: string) => {
    updateParams({ search: searchTerm || undefined });
  }, [updateParams]);

  const filterByClass = useCallback((classId: string | null) => {
    updateParams({ classId: classId || undefined });
  }, [updateParams]);

  return {
    // Data
    subjects: subjectsData?.subjects || [],
    pagination: subjectsData?.pagination,
    filters: subjectsData?.filters,
    
    // State
    isLoading,
    error,
    
    // Actions
    refetch,
    goToPage,
    searchSubjects,
    filterByClass,
    updateParams,
    
    // Current params
    currentParams: params,
  };
}

/**
 * Hook for managing students data with pagination and search
 */
export function useStudentsData(initialParams?: StudentsQueryParams) {
  const [params, setParams] = useState<StudentsQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['students', params],
    queryFn: async () => {
      try {
        console.log('🔍 Fetching students with params:', params);
        const result = await directorService.fetchStudentsData(params);
        console.log('✅ Students fetched successfully:');
        return result;
      } catch (err) {
        console.error('❌ Error fetching students:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2, // Retry failed requests up to 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const studentsData = response?.data;

  const updateParams = useCallback((newParams: Partial<StudentsQueryParams>) => {
    setParams(prev => ({
      ...prev,
      ...newParams,
      // Reset to page 1 when search or filters change
      page: newParams.search !== undefined || newParams.classId !== undefined || newParams.status !== undefined ? 1 : prev.page,
    }));
  }, []);

  const goToPage = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  const searchStudents = useCallback((searchTerm: string) => {
    updateParams({ search: searchTerm || undefined });
  }, [updateParams]);

  const filterByClass = useCallback((classId: string | null) => {
    updateParams({ classId: classId || undefined });
  }, [updateParams]);

  const filterByStatus = useCallback((status: string | null) => {
    updateParams({ status: status || undefined });
  }, [updateParams]);

  return {
    // Data
    students: studentsData?.students || [],
    pagination: studentsData?.pagination,
    basicDetails: studentsData?.basic_details,
    availableClasses: studentsData?.available_classes || [],
    
    // State
    isLoading,
    error,
    
    // Actions
    refetch,
    goToPage,
    searchStudents,
    filterByClass,
    filterByStatus,
    updateParams,
    
    // Current params
    currentParams: params,
  };
}
