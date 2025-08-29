import { useState, useEffect, useCallback } from 'react';
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
 * Custom hook for managing user profile data
 * 
 * This hook handles user profile fetching at the right moments:
 * 1. App initialization (if user is authenticated)
 * 2. After successful login
 * 3. After email verification
 * 4. Manual refresh when needed
 * 
 * It avoids unnecessary API calls by:
 * - Only fetching when user is authenticated
 * - Caching the profile data
 * - Providing manual refresh capability
 */
export const useUserProfile = (): UseUserProfileReturn => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuth();

  // Fetch user profile from API
  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // console.log('🔄 Fetching user profile...');
      const response = await ApiService.user.getProfile();
      
      if (response.success && response.data) {
        console.log('✅ User profile fetched successfully');
        setUserProfile(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch user profile');
      }
    } catch (err) {
      console.error('❌ Error fetching user profile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user profile';
      setError(errorMessage);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear profile data
  const clearProfile = useCallback(() => {
    setUserProfile(null);
    setError(null);
  }, []);

  // Manual refresh function
  const refreshProfile = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  // Effect to fetch profile when authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Only fetch if we don't already have profile data or if user data changed
      if (!userProfile || userProfile.id !== user.id) {
        fetchUserProfile();
      }
    } else {
      // Clear profile when not authenticated
      clearProfile();
    }
  }, [isAuthenticated, user?.id, userProfile?.id]);

  return {
    userProfile,
    isLoading,
    error,
    refreshProfile,
    clearProfile,
  };
};

export default useUserProfile;
