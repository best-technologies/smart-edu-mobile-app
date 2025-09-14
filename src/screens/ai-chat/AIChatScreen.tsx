import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, StatusBar, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, FlatList, Keyboard, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import { setStringAsync } from 'expo-clipboard';
import { aiChatService, Conversation, ChatMessage as ApiChatMessage } from '../../services/api/aiChatService';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAIChatConversations } from '../../hooks/useAIChatConversations';
import { useConversationMessages } from '../../hooks/useConversationMessages';
import { professionalMarkdownStyles, professionalDarkMarkdownStyles } from '../../utils/markdownStyles';

type AIChatRouteParams = {
  materialTitle?: string;
  materialDescription?: string;
  materialUrl?: string;
  // Upload response data
  documentId?: string;
  documentTitle?: string;
  documentUrl?: string;
  fileType?: string;
  processingStatus?: string;
  // Conversation data
  conversationId?: string;
  conversationTitle?: string;
  materialId?: string;
  showHistory?: boolean;
  // General chat
  isGeneralChat?: boolean;
};

type AIChatRouteProp = RouteProp<{ AIChat: AIChatRouteParams }, 'AIChat'>;

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Function to convert markdown to plain text
const markdownToPlainText = (markdown: string): string => {
  return markdown
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '• ')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s*/gm, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

// Function to safely decode URL-encoded titles
const safeDecodeTitle = (title: string | null | undefined): string | null => {
  if (!title) return null;
  try {
    // Check if the title contains URL-encoded characters
    if (title.includes('%')) {
      return decodeURIComponent(title);
    }
    return title;
  } catch (error) {
    console.warn('Failed to decode title:', error);
    return title;
  }
};

export default function AIChatScreen() {
  const route = useRoute<AIChatRouteProp>();
  const { userProfile } = useUserProfile();
  const { 
    materialTitle, 
    materialDescription, 
    materialUrl,
    documentId,
    documentTitle: rawDocumentTitle,
    documentUrl,
    fileType,
    processingStatus,
    conversationId,
    conversationTitle,
    materialId,
    showHistory,
    isGeneralChat
  } = route.params || {};
  
  // Decode URL-encoded title
  const documentTitle = rawDocumentTitle ? decodeURIComponent(rawDocumentTitle) : undefined;
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [showConversationHistory, setShowConversationHistory] = useState(showHistory || false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null);
  const [currentMaterialId, setCurrentMaterialId] = useState<string | null>(materialId || null);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [currentChatTitle, setCurrentChatTitle] = useState<string | null>(safeDecodeTitle(conversationTitle));
  const scrollViewRef = useRef<FlatList<ChatMessage>>(null);
  const messagesLoadedRef = useRef(false);
  const initialScrollDoneRef = useRef(false);

  // Use TanStack Query hooks
  const { conversations, isLoading: conversationsLoading, refreshConversations } = useAIChatConversations();
  const { messages, isLoading: messagesLoading, refreshMessages } = useConversationMessages(currentConversationId);
  
  // Combined loading state
  const isLoading = conversationsLoading || messagesLoading;
  
  // Combine API messages with local optimistic messages
  const displayMessages = [...messages, ...localMessages];

  // Improved scroll to bottom function for inverted FlatList
  const scrollToBottom = (animated: boolean = true, delay: number = 0) => {
    if (scrollViewRef.current && displayMessages.length > 0) {
      const scrollToEnd = () => {
        try {
          // For inverted FlatList, scroll to offset 0 to show the latest messages
          scrollViewRef.current?.scrollToOffset({ 
            offset: 0, 
            animated 
          });
          
        } catch (error) {
          console.log('❌ scrollToOffset failed:', error);
          // Fallback to scrollToEnd
          try {
            scrollViewRef.current?.scrollToEnd({ animated });
          } catch (fallbackError) {
            console.log('❌ scrollToEnd also failed:', fallbackError);
          }
        }
      };

      if (delay > 0) {
        setTimeout(scrollToEnd, delay);
      } else {
        scrollToEnd();
      }
    } else {
      // console.log('❌ Cannot scroll - missing ref or no messages');
    }
  };

  // Typewriter effect for AI responses
  const typewriterEffect = (text: string, callback?: () => void) => {
    // Ensure clean start
    setTypingText('');
    setIsTyping(true);
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        // Add 2-3 characters at once instead of 1
        const nextChars = text.slice(index, index + 5);
        setTypingText(prev => prev + nextChars);
        index += 5;
        scrollToBottom(true);
      } else {
        clearInterval(interval);
        setIsTyping(false);
        callback?.();
      }
    }, 3); // 3ms with 5 chars = much faster

    return interval;
  };

  // Load conversation messages and update state
  const loadConversationMessages = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    
    // Find the conversation to get materialId
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentMaterialId(conversation.materialId);
    }
    
    // Reset scroll state when loading new conversation
    messagesLoadedRef.current = false;
    initialScrollDoneRef.current = false;
    
    // Force scroll to bottom after loading new conversation
    setTimeout(() => {
      scrollToBottom(false);
      setTimeout(() => {
        scrollToBottom(false);
        setTimeout(() => scrollToBottom(false), 300);
      }, 200);
    }, 800);
  };

  // Initialize chat state based on route params
  useEffect(() => {
    // Load conversation messages if conversationId is provided
    if (conversationId) {
      loadConversationMessages(conversationId);
    } else if (documentId) {
      // For new conversations with uploaded documents, set materialId
      setCurrentMaterialId(documentId);
    }
    
    if (documentId) {
      // Document was uploaded, check processing status
      console.log('📄 Loading uploaded document:', {
        id: documentId,
        title: documentTitle,
        status: processingStatus
      });
    }
  }, [documentId, documentTitle, processingStatus, conversationId]);

  // Handle messages loading and auto-scroll - AGGRESSIVE
  useEffect(() => {
    if (displayMessages.length > 0) {
      // Immediate scroll
      scrollToBottom(false);
      // Multiple delayed scrolls to ensure it works
      setTimeout(() => scrollToBottom(false), 50);
      setTimeout(() => scrollToBottom(false), 150);
      setTimeout(() => scrollToBottom(false), 300);
      setTimeout(() => scrollToBottom(false), 500);
    }
  }, [displayMessages.length]);

  // Auto-scroll when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (messages.length > 0) {
        setTimeout(() => {
          scrollToBottom(false);
        }, 300);
      }
    }, [messages.length])
  );

  // Handle waiting for response changes
  useEffect(() => {
    if (isWaitingForResponse || isTyping) {
      scrollToBottom(true, 100);
    }
  }, [isWaitingForResponse, isTyping]);

  // Handle keyboard events for better scrolling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => scrollToBottom(true), 100);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setTimeout(() => scrollToBottom(true), 100);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() && !isWaitingForResponse && (currentMaterialId || isGeneralChat)) {
      const messageText = message.trim();
      setMessage('');
      setFailedMessage(null); // Clear any previous failed message
      setIsWaitingForResponse(true);
      
      // Add user message immediately (optimistic UI)
      const userMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        text: messageText,
        isUser: true,
        timestamp: new Date(),
      };
      setLocalMessages(prev => [userMessage, ...prev]);
      
      // Scroll to show the new message
      setTimeout(() => scrollToBottom(false), 100);
      
      try {
        // For new conversations, we need to create a conversation first
        // For now, we'll use a placeholder conversationId and let the backend handle it
        const conversationIdToUse = currentConversationId || 'new-conversation';
        
        // Log what we're sending to backend
        const materialIdToSend = isGeneralChat ? null : (currentMaterialId || null);
        const requestData = {
          message: messageText,
          materialId: materialIdToSend,
          conversationId: conversationIdToUse,
          isGeneralChat: isGeneralChat
        };
        console.log('📤 Sending to backend:', requestData);
        
        // Send message to API
        const response = await aiChatService.sendMessage(
          messageText,
          materialIdToSend,
          conversationIdToUse
        );
        
        if (response.success && response.data) {
          // Set conversationId from response if this is a new conversation
          if (!currentConversationId) {
            setCurrentConversationId(response.data.conversationId);
          }
          
          // Update chat title if provided in response (for general chat)
          if (response.data.chatTitle && !currentChatTitle) {
            setCurrentChatTitle(safeDecodeTitle(response.data.chatTitle));
          }
          
          // Clear local messages and refresh from API
          setLocalMessages([]);
          await refreshMessages();
          // Refresh conversations to update recent activity
          await refreshConversations();

          // Start typewriter effect for the latest AI response
          const latestMessage = response.data.content;
          if (latestMessage) {
            // Small delay to ensure clean typewriter start
            setTimeout(() => {
              typewriterEffect(latestMessage);
            }, 100);
          }
        } else {
          console.error('Failed to send message:', response.message);
          setFailedMessage(messageText); // Store failed message for retry
          // Remove the optimistic message on failure
          setLocalMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        setFailedMessage(messageText); // Store failed message for retry
        // Remove the optimistic message on failure
        setLocalMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
      } finally {
        setIsWaitingForResponse(false);
      }
    }
  };

  const handleRetryMessage = () => {
    if (failedMessage) {
      setMessage(failedMessage);
      setFailedMessage(null);
    }
  };

  const handleRecord = () => {
    setIsRecording(!isRecording);
    console.log('Recording:', !isRecording);
  };

  const handleTextChange = (text: string) => {
    setMessage(text);
    // Auto-scroll when user starts typing
    if (text.length > 0) {
      scrollToBottom(true, 50);
    }
  };

  const handleConversationSelect = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversationHistory(false);
    await loadConversationMessages(conversation.id);
  };

  const formatLastActivity = (lastActivity: string) => {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const renderConversationItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      onPress={() => handleConversationSelect(item)}
      className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {item.totalMessages} messages • {formatLastActivity(item.lastActivity)}
          </Text>
        </View>
        <View className="items-end">
          <View className={`px-2 py-1 rounded-full ${
            item.status === 'ACTIVE' 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Text className={`text-xs font-medium ${
              item.status === 'ACTIVE' 
                ? 'text-green-700 dark:text-green-400' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );


  // Loading Screen - only show for initial conversation loading
  if (isLoading && !currentConversationId && !documentId) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center flex-1">
            <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full items-center justify-center mr-3">
              <Ionicons name="sparkles" size={18} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              {materialTitle && (
                <Text className="text-sm font-medium text-purple-600 dark:text-purple-400" numberOfLines={1}>
                  {materialTitle}
                </Text>
              )}
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Chat Assistant
              </Text>
            </View>
          </View>
        </View>

        {/* Loading Content */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            {/* Animated AI Icon */}
            <View className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full items-center justify-center mb-6">
              <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
            
            {/* Loading Text */}
            <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 text-center">
              Initializing Chat
            </Text>
            
            <Text className="text-gray-600 dark:text-gray-400 text-center text-sm leading-6">
              {documentTitle ? (
                <>
                  Processing uploaded document: <Text className="font-semibold text-purple-600 dark:text-purple-400">"{documentTitle}"</Text>
                  {'\n\n'}Status: <Text className="font-semibold text-blue-600 dark:text-blue-400">{processingStatus || 'PENDING'}</Text>
                  {'\n\n'}Preparing for AI chat...
                </>
              ) : materialTitle ? (
                <>
                  Loading material: <Text className="font-semibold text-purple-600 dark:text-purple-400">"{materialTitle}"</Text>
                  {'\n\n'}Fetching content...
                </>
              ) : (
                "Preparing AI assistant..."
              )}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center flex-1">
          <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full items-center justify-center mr-3">
            <Ionicons name="sparkles" size={18} color="#8B5CF6" />
          </View>
          <View className="flex-1">
            {(currentChatTitle || documentTitle || materialTitle) && (
              <Text className="text-sm font-medium text-purple-600 dark:text-purple-400" numberOfLines={1}>
                {safeDecodeTitle(currentChatTitle) || documentTitle || materialTitle}
              </Text>
            )}
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI Chat Assistant
            </Text>
          </View>
        </View>
        
        {/* Conversation History Button */}
        {conversations.length > 0 && (
          <TouchableOpacity
            onPress={() => setShowConversationHistory(true)}
            className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center"
          >
            <Ionicons name="time-outline" size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Chat Messages Area */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <FlatList
          ref={scrollViewRef}
          data={displayMessages.slice().reverse()}
          keyExtractor={(item) => item.id}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          inverted={true}
          onLayout={() => {
            // Scroll to bottom when FlatList is laid out
            if (messages.length > 0) {
              setTimeout(() => scrollToBottom(false), 100);
            }
          }}
          onContentSizeChange={() => {
            // Always scroll to bottom when content changes
            scrollToBottom(false, 100);
          }}
          renderItem={({ item: msg, index }) => {
            // Since we're using inverted, the first item (index 0) is actually the last message
            const actualIndex = displayMessages.length - 1 - index;
            const isLastAIMessage = !msg.isUser && actualIndex === displayMessages.length - 1;
            const shouldShowTypewriter = isLastAIMessage && isTyping;
            
            return (
              <View key={msg.id} className={`mb-4 ${msg.isUser ? 'items-end' : 'items-start'}`}>
                <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.isUser 
                    ? 'bg-purple-600 rounded-br-md' 
                    : 'bg-gray-100 dark:bg-gray-800 rounded-bl-md'
                }`}>
                  {msg.isUser ? (
                    <Text className="text-sm leading-5 text-white">
                      {msg.text}
                    </Text>
                  ) : (
                    <View style={{ width: '100%' }}>
                      <Markdown 
                        style={professionalMarkdownStyles}
                        mergeStyle={false}
                      >
                        {shouldShowTypewriter ? typingText : msg.text}
                      </Markdown>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center justify-end mt-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mr-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  
                  {/* Action Buttons for AI Messages */}
                  {!msg.isUser && (
                    <View className="flex-row items-center space-x-1">
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Copy Message',
                            'Do you want to copy this response to clipboard?',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'Copy',
                                onPress: async () => {
                                  try {
                                    const plainText = markdownToPlainText(msg.text);
                                    await setStringAsync(plainText);
                                    Alert.alert('Copied!', 'Message copied to clipboard');
                                  } catch (error) {
                                    console.error('Failed to copy message:', error);
                                    Alert.alert('Error', 'Failed to copy message');
                                  }
                                },
                              },
                            ]
                          );
                        }}
                        className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
                      >
                        <Ionicons name="copy" size={12} color="#6B7280" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Download as PDF',
                            'Do you want to download this response as a PDF file? (Coming Soon)',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'Download',
                                onPress: () => {
                                  console.log('Download PDF pressed for:', msg.id);
                                  // TODO: Implement PDF download functionality
                                  Alert.alert('Coming Soon', 'PDF download feature will be available soon!');
                                },
                              },
                            ]
                          );
                        }}
                        className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
                      >
                        <Ionicons name="document-text" size={12} color="#6B7280" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Listen to Voice',
                            'Do you want to listen to this message as voice? (Coming Soon)',
                            [
                              {
                                text: 'Cancel',
                                style: 'cancel',
                              },
                              {
                                text: 'Listen',
                                onPress: () => {
                                  console.log('Speak message pressed for:', msg.id);
                                  // TODO: Implement text-to-speech functionality
                                  Alert.alert('Coming Soon', 'Voice playback feature will be available soon!');
                                },
                              },
                            ]
                          );
                        }}
                        className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
                      >
                        <Ionicons name="volume-high" size={12} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
          ListHeaderComponent={() => (
            <>
              {/* Welcome Message - Only show if no messages */}
              {displayMessages.length === 0 && !isLoading && (
                <View className="items-center mb-6">
                  <View className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-full items-center justify-center mb-4">
                    <Ionicons name="sparkles" size={24} color="#8B5CF6" />
                  </View>
                  <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    AI Assistant
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-center text-sm leading-6">
                    {currentChatTitle ? (
                      <>
                        Continuing conversation: <Text className="font-semibold text-purple-600 dark:text-purple-400">"{safeDecodeTitle(currentChatTitle)}"</Text>
                        {'\n\n'}You can continue asking questions or start a new topic.
                      </>
                    ) : documentTitle ? (
                      <>
                        You're now chatting about your uploaded document: <Text className="font-semibold text-purple-600 dark:text-purple-400">"{documentTitle}"</Text>
                        {'\n\n'}I can help you with questions about this document, create practice tests, quizzes, assignments, and exam questions based on this content.
                        {'\n\n'}What would you like to explore or learn about this document?
                      </>
                    ) : materialTitle ? (
                      <>
                        You're now chatting about <Text className="font-semibold text-purple-600 dark:text-purple-400">"{materialTitle}"</Text>. 
                        {'\n\n'}I can help you with questions pertaining to this material, and I can also assist you in creating practice tests, quizzes, assignments, and exam questions based on this content.
                        {'\n\n'}What would you like to explore or learn about this material?
                      </>
                    ) : isGeneralChat ? (
                      <>
                        Welcome to General Chat! <Text className="font-semibold text-purple-600 dark:text-purple-400">General AI Assistant</Text>
                        {'\n\n'}I'm here to help you with any questions, provide explanations, create study materials, or assist with educational topics.
                        {'\n\n'}What would you like to discuss or learn about today?
                      </>
                    ) : (
                      "Hi! I'm here to help you with your studies. Ask me anything!"
                    )}
                  </Text>
                  
                  {/* Recent Conversations Info */}
                  {conversations.length > 0 && (
                    <View className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-full">
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="time-outline" size={16} color="#3B82F6" />
                        <Text className="text-sm font-medium text-blue-800 dark:text-blue-300 ml-2">
                          Recent Conversations
                        </Text>
                      </View>
                      <Text className="text-xs text-blue-700 dark:text-blue-400">
                        You have {conversations.length} recent conversation{conversations.length !== 1 ? 's' : ''}. 
                        Tap the clock icon above to view them.
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Loading State for Messages */}
              {isLoading && displayMessages.length === 0 && (
                <View className="items-center mb-6">
                  <ActivityIndicator size="large" color="#8B5CF6" />
                  <Text className="text-gray-600 dark:text-gray-400 mt-2">
                    Loading conversation...
                  </Text>
                </View>
              )}
            </>
          )}
          ListFooterComponent={() => (
            <>
              {/* Failed Message Retry */}
              {failedMessage && !isWaitingForResponse && (
                <View className="mb-4 items-start">
                  <View className="bg-red-50 dark:bg-red-900/20 rounded-2xl rounded-bl-md px-4 py-3 border border-red-200 dark:border-red-800">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className="text-sm text-red-800 dark:text-red-200 font-medium mb-1">
                          Message failed to send
                        </Text>
                        <Text className="text-xs text-red-600 dark:text-red-400">
                          "{failedMessage}"
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={handleRetryMessage}
                        className="ml-3 bg-red-600 px-3 py-1 rounded-lg"
                      >
                        <Text className="text-xs text-white font-medium">Retry</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        />

        {/* Input Area */}
        <View className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <View className={`flex-row items-end rounded-2xl px-4 py-2 min-h-[44px] ${
            isWaitingForResponse 
              ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700' 
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            {/* Typing Indicator in Input */}
            {isWaitingForResponse && (
              <View className="flex-row items-center mr-3">
                <ActivityIndicator size="small" color="#8B5CF6" />
                <Text className="text-xs text-purple-600 dark:text-purple-400 ml-2 font-medium">
                  AI is typing...
                </Text>
              </View>
            )}
            
            {/* Text Input */}
            <TextInput
              value={message}
              onChangeText={handleTextChange}
              placeholder={isWaitingForResponse ? "typing..." : "Type your message..."}
              placeholderTextColor="#9ca3af"
              className="flex-1 text-gray-900 dark:text-gray-100 text-base max-h-20"
              multiline
              style={{ textAlignVertical: 'center' }}
              editable={!isWaitingForResponse}
              onFocus={() => {
                // Gentle scroll when input gets focus, with delay for keyboard
                setTimeout(() => scrollToBottom(true), 300);
              }}
            />
            
            {/* Record Button */}
            <TouchableOpacity
              onPress={handleRecord}
              activeOpacity={0.7}
              disabled={isWaitingForResponse}
              className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                isRecording 
                  ? 'bg-red-500' 
                  : isWaitingForResponse
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={16} 
                color={isRecording ? "white" : isWaitingForResponse ? "#9ca3af" : "#6b7280"} 
              />
            </TouchableOpacity>
            
            {/* Send Button */}
            <TouchableOpacity
              onPress={handleSendMessage}
              activeOpacity={0.7}
              disabled={!message.trim() || isWaitingForResponse}
              className={`w-8 h-8 rounded-full items-center justify-center ${
                message.trim() && !isWaitingForResponse
                  ? 'bg-purple-600' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              {isWaitingForResponse ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons 
                  name="send" 
                  size={16} 
                  color={message.trim() && !isWaitingForResponse ? "white" : "#9ca3af"} 
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Conversation History Modal */}
      {showConversationHistory && (
        <View className="absolute inset-0 bg-black/50 z-50">
          <View className="flex-1 bg-white dark:bg-gray-900 mt-16 rounded-t-3xl">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Conversations
              </Text>
              <TouchableOpacity
                onPress={() => setShowConversationHistory(false)}
                className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Conversations List */}
            <FlatList
              data={conversations}
              renderItem={renderConversationItem}
              keyExtractor={(item) => item.id}
              className="flex-1"
              showsVerticalScrollIndicator={false}
            />

            {/* Empty State */}
            {conversations.length === 0 && (
              <View className="flex-1 items-center justify-center px-6">
                <View className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
                  <Ionicons name="chatbubbles-outline" size={24} color="#9CA3AF" />
                </View>
                <Text className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Conversations Yet
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-center">
                  Start a new conversation to see it appear here
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}