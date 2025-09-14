import { useQuery, useQueryClient } from '@tanstack/react-query';
import { aiChatService, ChatMessage as ApiChatMessage, UsageLimits } from '@/services/api/aiChatService';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseConversationMessagesReturn {
  messages: ChatMessage[];
  usageLimits: UsageLimits | null;
  isLoading: boolean;
  error: string | null;
  refreshMessages: () => Promise<void>;
  clearMessages: () => void;
}

/**
 * Custom hook for managing conversation messages using TanStack Query
 * 
 * This hook handles message fetching with proper caching:
 * - Only fetches when conversationId is provided
 * - Uses TanStack Query for caching and deduplication
 * - Converts API messages to local format
 */
export const useConversationMessages = (conversationId: string | null): UseConversationMessagesReturn => {
  const queryClient = useQueryClient();

  // Use TanStack Query for messages
  const {
    data: queryData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['conversationMessages', conversationId],
    queryFn: async () => {
      if (!conversationId) {
        throw new Error('Conversation ID not provided');
      }
      
      const response = await aiChatService.getConversationMessages(conversationId, 20, 0);
      if (response.success && response.data) {
        // Convert API messages to local format and sort by creation time (oldest first)
        const apiMessages = response.data.conversationHistory.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        return {
          messages: apiMessages.map(msg => ({
            id: msg.id,
            text: msg.content,
            isUser: msg.role === 'USER',
            timestamp: new Date(msg.createdAt)
          })),
          usageLimits: response.data.usageLimits
        };
      }
      throw new Error(response.message || 'Failed to fetch messages');
    },
    enabled: !!conversationId, // Only fetch when conversationId is provided
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const messages = queryData?.messages || [];
  const usageLimits = queryData?.usageLimits || null;

  // Manual refresh function
  const refreshMessages = async () => {
    await refetch();
  };

  // Clear messages data
  const clearMessages = () => {
    queryClient.removeQueries({ queryKey: ['conversationMessages', conversationId] });
  };

  return {
    messages,
    usageLimits,
    isLoading,
    error: error?.message || null,
    refreshMessages,
    clearMessages,
  };
};

export default useConversationMessages;
