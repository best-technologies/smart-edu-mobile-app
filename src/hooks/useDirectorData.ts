import { useDirectorDashboard, useRefreshDirectorDashboard, useInvalidateDirectorDashboard, useDirectorDashboardCache } from './useDirectorDashboard';
import { useToast } from '@/contexts/ToastContext';

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
