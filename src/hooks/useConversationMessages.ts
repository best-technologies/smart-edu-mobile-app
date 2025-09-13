import { useQuery, useQueryClient } from '@tanstack/react-query';
import { aiChatService, ChatMessage as ApiChatMessage } from '@/services/api/aiChatService';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface UseConversationMessagesReturn {
  messages: ChatMessage[];
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
    data: messages = [],
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
        const apiMessages = response.data.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        return apiMessages.map(msg => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.role === 'USER',
          timestamp: new Date(msg.createdAt)
        }));
      }
      throw new Error(response.message || 'Failed to fetch messages');
    },
    enabled: !!conversationId, // Only fetch when conversationId is provided
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

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
    isLoading,
    error: error?.message || null,
    refreshMessages,
    clearMessages,
  };
};

export default useConversationMessages;
