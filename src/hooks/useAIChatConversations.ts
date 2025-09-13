import { useQuery, useQueryClient } from '@tanstack/react-query';
import { aiChatService, Conversation } from '@/services/api/aiChatService';
import { useUserProfile } from './useUserProfile';

interface UseAIChatConversationsReturn {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  refreshConversations: () => Promise<void>;
  clearConversations: () => void;
}

/**
 * Custom hook for managing AI chat conversations using TanStack Query
 * 
 * This hook handles conversation list fetching with proper caching:
 * - Only fetches when user is authenticated and has a role
 * - Uses TanStack Query for caching and deduplication
 * - Prevents multiple API calls for the same data
 */
export const useAIChatConversations = (): UseAIChatConversationsReturn => {
  const { userProfile } = useUserProfile();
  const queryClient = useQueryClient();

  // Use TanStack Query for conversations
  const {
    data: conversations = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['aiChatConversations', userProfile?.role],
    queryFn: async () => {
      if (!userProfile?.role) {
        throw new Error('User role not available');
      }
      
      const response = await aiChatService.initiateAIChat(userProfile.role);
      if (response.success && response.data) {
        return response.data.conversations || [];
      }
      throw new Error(response.message || 'Failed to fetch conversations');
    },
    enabled: !!userProfile?.role, // Only fetch when user has a role
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Manual refresh function
  const refreshConversations = async () => {
    await refetch();
  };

  // Clear conversations data
  const clearConversations = () => {
    queryClient.removeQueries({ queryKey: ['aiChatConversations'] });
  };

  return {
    conversations,
    isLoading,
    error: error?.message || null,
    refreshConversations,
    clearConversations,
  };
};

export default useAIChatConversations;
