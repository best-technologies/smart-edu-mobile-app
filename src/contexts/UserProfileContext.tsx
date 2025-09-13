import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfile } from '@/services/types/apiTypes';
import { useAuth } from './AuthContext';

interface UserProfileContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  clearProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
}

export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const { isAuthenticated, user } = useAuth();
  const { userProfile, isLoading, error, refreshProfile, clearProfile } = useUserProfile();

  // Clear profile when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear profile when user is not authenticated (logout)
      clearProfile();
    }
  }, [isAuthenticated, clearProfile]);

  const value: UserProfileContextType = {
    userProfile,
    isLoading,
    error,
    refreshProfile,
    clearProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfileContext(): UserProfileContextType {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfileContext must be used within a UserProfileProvider');
  }
  return context;
}

export default UserProfileProvider;
