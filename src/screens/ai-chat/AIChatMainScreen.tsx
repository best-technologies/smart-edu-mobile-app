import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAIChatConversations } from '@/hooks/useAIChatConversations';
import { aiChatService, UsageLimits } from '@/services/api/aiChatService';
// import TopBar from '../components/shared/TopBar';
import DocumentUploadModal from './components/DocumentUploadModal';

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

export default function AIChatMainScreen() {
  const navigation = useNavigation<any>();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [usageLimits, setUsageLimits] = useState<UsageLimits | null>(null);
  const [isLoadingLimits, setIsLoadingLimits] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use TanStack Query hook for conversations
  const { conversations, isLoading, error, refreshConversations } = useAIChatConversations();

  // Fetch usage limits on component mount
  useEffect(() => {
    const fetchUsageLimits = async () => {
      try {
        setIsLoadingLimits(true);
        const response = await aiChatService.initiateAIChat('teacher');
        if (response.success && response.data) {
          setUsageLimits(response.data.usageLimits);
        }
      } catch (error) {
        console.error('Failed to fetch usage limits:', error);
      } finally {
        setIsLoadingLimits(false);
      }
    };

    fetchUsageLimits();
  }, []);

  const handleChatWithExisting = () => {
    navigation.navigate('ChatWithExisting');
  };

  const handleUploadNew = () => {
    setShowUploadModal(true);
  };

  // Helper functions for usage limits
  const canUploadFile = () => {
    if (!usageLimits) return true;
    return usageLimits.filesUploadedThisMonth < usageLimits.maxFilesPerMonth;
  };

  const canUseStorage = () => {
    if (!usageLimits) return true;
    return usageLimits.totalStorageUsedMB < usageLimits.maxStorageMB;
  };

  const getStorageUsagePercentage = () => {
    if (!usageLimits) return 0;
    return (usageLimits.totalStorageUsedMB / usageLimits.maxStorageMB) * 100;
  };

  const getFileUsagePercentage = () => {
    if (!usageLimits) return 0;
    return (usageLimits.filesUploadedThisMonth / usageLimits.maxFilesPerMonth) * 100;
  };

  const handleUploadSuccess = (document: any) => {
    
    // Navigate to AI chat screen with document data
    navigation.navigate('AIChat', {
      documentId: document.materialId || document.documentId,
      documentTitle: document.documentTitle,
      documentUrl: document.documentUrl,
      fileType: document.fileType,
      processingStatus: document.processingStatus,
      originalName: document.originalName,
      size: document.size
    });
  };

  const handleGeneralChat = () => {
    // Navigate to AI chat screen for general chat (no material/document)
    navigation.navigate('AIChat', {
      isGeneralChat: true
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh conversations
      await refreshConversations();
      
      // Refresh usage limits
      const response = await aiChatService.initiateAIChat('teacher');
      if (response.success && response.data) {
        setUsageLimits(response.data.usageLimits);
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsRefreshing(false);
    }
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            <View className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mb-4">
              <ActivityIndicator size="large" color="#8B5CF6" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Initializing AI Assistant
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Loading your documents and preparing AI chat...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="items-center">
            <View className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full items-center justify-center mb-4">
              <Ionicons name="alert-circle" size={32} color="#EF4444" />
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Initialization Failed
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // TanStack Query will automatically retry on focus
                navigation.goBack();
                navigation.navigate('AIChatMain');
              }}
              className="bg-purple-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1 px-6 py-4"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#8B5CF6']} // Android
            tintColor="#8B5CF6" // iOS
            title="Refreshing..."
            titleColor="#6B7280"
          />
        }
      >
        {/* Header Section */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-4">
                <Ionicons name="sparkles" size={24} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  AI Assistant
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Chat with documents using AI
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleGeneralChat}
              className="bg-purple-600 px-4 py-2 rounded-xl"
            >
              <Text className="text-white font-semibold text-sm">General Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Usage Limits Display */}
        {usageLimits && (
          <View className="mb-6 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Usage Limits
              </Text>
              <View className="flex-row items-center space-x-2">
                <View className={`w-2 h-2 rounded-full ${canUploadFile() ? 'bg-green-500' : 'bg-red-500'}`} />
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {canUploadFile() ? 'Can upload' : 'Upload limit reached'}
                </Text>
              </View>
            </View>
            
            {/* File Upload Progress */}
            <View className="mb-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs text-gray-600 dark:text-gray-400">Files this month</Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {usageLimits.filesUploadedThisMonth}/{usageLimits.maxFilesPerMonth}
                </Text>
              </View>
              <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <View 
                  className={`h-2 rounded-full ${getFileUsagePercentage() >= 100 ? 'bg-red-500' : getFileUsagePercentage() >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(getFileUsagePercentage(), 100)}%` }}
                />
              </View>
            </View>

            {/* Storage Usage Progress */}
            <View className="mb-2">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-xs text-gray-600 dark:text-gray-400">Storage used</Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {usageLimits.totalStorageUsedMB}MB/{usageLimits.maxStorageMB}MB
                </Text>
              </View>
              <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <View 
                  className={`h-2 rounded-full ${getStorageUsagePercentage() >= 100 ? 'bg-red-500' : getStorageUsagePercentage() >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(getStorageUsagePercentage(), 100)}%` }}
                />
              </View>
            </View>

            {/* Token Usage (small indicator) */}
            <View className="flex-row items-center justify-between">
              <Text className="text-xs text-gray-600 dark:text-gray-400">Tokens today</Text>
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                {usageLimits.tokensUsedThisWeek}/{usageLimits.maxTokensPerDay}
              </Text>
            </View>
          </View>
        )}

        {/* Help Section */}
        <View className="mb-6">
          <View className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700">
            <View className="flex-row items-start">
              <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-3 mt-1">
                <Ionicons name="help-circle" size={16} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  How it works
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 leading-5">
                  Upload your teaching materials and ask questions about the content. 
                  Our AI will help you create lesson plans, answer student questions, 
                  and generate assessments based on your documents.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Main Options */}
        <View className="space-y-4">
          {/* Chat with Existing Material */}
          <TouchableOpacity
            onPress={handleChatWithExisting}
            activeOpacity={0.8}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl items-center justify-center mr-4">
                <Ionicons name="chatbubbles" size={28} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Chat with Existing Material
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Start a conversation with your uploaded documents
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
            
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                  Available Materials
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {conversations.length} conversations available
                </Text>
              </View>
              <View className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                <Text className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {conversations.length > 0 ? 'Ready' : 'Empty'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Upload New Material */}
          <TouchableOpacity
            onPress={canUploadFile() && canUseStorage() ? handleUploadNew : undefined}
            activeOpacity={canUploadFile() && canUseStorage() ? 0.8 : 1}
            className={`rounded-2xl p-6 border mt-4 ${
              canUploadFile() && canUseStorage() 
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: canUploadFile() && canUseStorage() ? 0.1 : 0.05,
              shadowRadius: 8,
              elevation: canUploadFile() && canUseStorage() ? 3 : 1,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className={`w-14 h-14 rounded-xl items-center justify-center mr-4 ${
                canUploadFile() && canUseStorage() 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-gray-100 dark:bg-gray-600'
              }`}>
                <Ionicons 
                  name="cloud-upload" 
                  size={28} 
                  color={canUploadFile() && canUseStorage() ? "#10B981" : "#9CA3AF"} 
                />
              </View>
              <View className="flex-1">
                <Text className={`text-lg font-bold mb-1 ${
                  canUploadFile() && canUseStorage() 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Upload New Material
                </Text>
                <Text className={`text-sm ${
                  canUploadFile() && canUseStorage() 
                    ? 'text-gray-600 dark:text-gray-400' 
                    : 'text-gray-500 dark:text-gray-500'
                }`}>
                  {canUploadFile() && canUseStorage() 
                    ? 'Add documents to chat with AI assistant'
                    : !canUploadFile() 
                      ? 'Monthly upload limit reached'
                      : 'Storage limit reached'
                  }
                </Text>
              </View>
              {canUploadFile() && canUseStorage() && (
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              )}
            </View>
            
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                  Supported Formats
                </Text>
                <View className="flex-row flex-wrap gap-1">
                  {[
                    { type: 'PDF', maxSize: '50MB' },
                    { type: 'DOCX', maxSize: '50MB' },
                    { type: 'TXT', maxSize: '10MB' },
                    { type: 'RTF', maxSize: '10MB' }
                  ].map((docType, index) => (
                    <View key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md mr-1 mb-1">
                      <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {docType.type}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Max 50MB per file
                </Text>
              </View>
              <View className="bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <Text className="text-xs font-medium text-green-600 dark:text-green-400">
                  Upload
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity Section */}
        <View className="mt-8">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </Text>
          
          {conversations && conversations.length > 0 ? (
            <View className="space-y-3">
              {conversations.slice(0, 3).map((conversation) => (
                <View
                  key={conversation.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700"
                >
                  <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                      onPress={() => {
                        // Navigate to chat with this conversation
                        navigation.navigate('AIChat', {
                          conversationId: conversation.id,
                          conversationTitle: safeDecodeTitle(conversation.title),
                          materialId: conversation.materialId
                        });
                      }}
                      className="flex-1"
                    >
                      <View className="flex-row items-center mb-2">
                        <View className="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-3">
                          <Ionicons name="chatbubble" size={12} color="#8B5CF6" />
                        </View>
                        <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1" numberOfLines={1}>
                          {safeDecodeTitle(conversation.title)}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-500 dark:text-gray-500 ml-9">
                        {conversation.totalMessages} messages • {formatLastActivity(conversation.lastActivity)}
                      </Text>
                    </TouchableOpacity>
                    
                    {/* Action Buttons */}
                    <View className="flex-row items-center ml-3">
                      <TouchableOpacity
                        onPress={() => {
                          console.log('Edit chat title pressed for conversation:', conversation.id);
                        }}
                        className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mr-2"
                      >
                        <Ionicons name="pencil" size={12} color="#6B7280" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => {
                          console.log('Delete chat pressed for conversation:', conversation.id);
                        }}
                        className="w-7 h-7 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
                      >
                        <Ionicons name="trash" size={12} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {/* Status Badge */}
                  <View className="flex-row justify-end mt-2">
                    <View className={`px-2 py-1 rounded-full ${
                      conversation.status === 'ACTIVE' 
                        ? 'bg-green-100 dark:bg-green-900/30' 
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <Text className={`text-xs font-medium ${
                        conversation.status === 'ACTIVE' 
                          ? 'text-green-700 dark:text-green-400' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {conversation.status}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              
              {conversations.length > 3 && (
                <TouchableOpacity
                  onPress={() => {
                    // Navigate to full conversation history
                    navigation.navigate('AIChat', { showHistory: true });
                  }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 border border-gray-200 dark:border-gray-600"
                >
                  <Text className="text-sm text-center text-gray-600 dark:text-gray-400">
                    View all {conversations.length} conversations
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center mb-3">
                <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-3">
                  <Ionicons name="time" size={16} color="#8B5CF6" />
                </View>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  No recent conversations
                </Text>
              </View>
              <Text className="text-xs text-gray-500 dark:text-gray-500 ml-11">
                Start a conversation to see your chat history here
              </Text>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
        supportedTypes={['pdf', 'docx', 'txt', 'rtf']}
        maxSize="50MB"
        usageLimits={usageLimits}
      />
    </SafeAreaView>
  );
}
