import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services';
import { UserProfile } from '@/services/types/apiTypes';
import { useAuth } from '@/contexts/AuthContext';

interface UseUserProfileReturn {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  clearProfile: () => void;
}

/**
 * Custom hook for managing user profile data using TanStack Query
 * 
 * This hook handles user profile fetching with proper caching:
 * - Only fetches when user is authenticated
 * - Uses TanStack Query for caching and deduplication
 * - Prevents multiple API calls for the same data
 */
export const useUserProfile = (): UseUserProfileReturn => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  // Use TanStack Query for user profile
  const {
    data: userProfile,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      const response = await ApiService.user.getProfile();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch user profile');
    },
    enabled: isAuthenticated && !!user?.id, // Only fetch when authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Manual refresh function
  const refreshProfile = async () => {
    await refetch();
  };

  // Clear profile data
  const clearProfile = () => {
    queryClient.removeQueries({ queryKey: ['userProfile'] });
  };

  return {
    userProfile: userProfile || null,
    isLoading,
    error: error?.message || null,
    refreshProfile,
    clearProfile,
  };
};

export default useUserProfile;
