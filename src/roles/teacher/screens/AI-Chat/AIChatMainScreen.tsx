import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ApiService } from '@/services';
import { InitiateAIChatResponse } from '@/services/api/aiChatService';
import TopBar from '../components/shared/TopBar';
import DocumentUploadModal from './components/DocumentUploadModal';

export default function AIChatMainScreen() {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [aiChatData, setAiChatData] = useState<InitiateAIChatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    console.log('🎯 AI Chat Main Screen mounted, initializing...');
    initializeAIChat();
  }, []);

  const initializeAIChat = async () => {
    try {
      console.log('🚀 Starting AI chat initialization...');
      setIsLoading(true);
      setError(null);
      
    //   console.log('📡 Calling API service...');
      const response = await ApiService.aiChat.initiateAIChat('teacher');
    //   console.log('📡 API response:', response);
      
      if (response.success && response.data) {
        // console.log('✅ AI chat initialized successfully:', response.data);
        setAiChatData(response.data);
      } else {
        // console.log('❌ API response indicates failure:', response.message);
        setError(response.message || 'Failed to initialize AI chat');
      }
    } catch (err) {
      console.error('💥 Error initializing AI chat:', err);
      setError('Failed to initialize AI chat. Please try again.');
    } finally {
      console.log('🏁 AI chat initialization successful');
      setIsLoading(false);
    }
  };

  const handleChatWithExisting = () => {
    navigation.navigate('ChatWithExisting');
  };

  const handleUploadNew = () => {
    setShowUploadModal(true);
  };

  const handleUploadSuccess = (document: any) => {
    console.log('✅ Document uploaded successfully:', document);
    // Refresh the AI chat data to show the new document
    initializeAIChat();
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
              onPress={initializeAIChat}
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
      <ScrollView className="flex-1 px-6 py-4">
        {/* Header Section */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-4">
              <Ionicons name="sparkles" size={24} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                AI Assistant
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Chat with your teaching materials using AI
              </Text>
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
                  {aiChatData?.documentCount || 0} documents • {aiChatData?.uploadedDocuments?.length || 0} processed
                </Text>
              </View>
              <View className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                <Text className="text-xs font-medium text-blue-600 dark:text-blue-400">
                  {aiChatData?.documentCount && aiChatData.documentCount > 0 ? 'Ready' : 'Empty'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Upload New Material */}
          <TouchableOpacity
            onPress={handleUploadNew}
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
              <View className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl items-center justify-center mr-4">
                <Ionicons name="cloud-upload" size={28} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Upload New Material
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Add documents to chat with AI assistant
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
            
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                  Supported Formats
                </Text>
                <View className="flex-row flex-wrap gap-1">
                  {(aiChatData?.supportedDocumentTypes || [
                    { type: 'PDF', maxSize: '50MB' },
                    { type: 'DOCX', maxSize: '50MB' },
                    { type: 'TXT', maxSize: '10MB' },
                    { type: 'RTF', maxSize: '10MB' }
                  ]).map((docType, index) => (
                    <View key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md mr-1 mb-1">
                      <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {docType.type}
                      </Text>
                    </View>
                  ))}
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Max {aiChatData?.supportedDocumentTypes?.[0]?.maxSize || '50MB'} per file
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
        </View>

        {/* Help Section */}
        <View className="mt-6 mb-8">
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
      </ScrollView>

      {/* Document Upload Modal */}
      <DocumentUploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSuccess={handleUploadSuccess}
        supportedTypes={aiChatData?.supportedDocumentTypes?.map(type => type.type.toLowerCase()) || ['pdf', 'docx', 'txt', 'rtf']}
        maxSize={aiChatData?.supportedDocumentTypes?.[0]?.maxSize || '50MB'}
      />
    </SafeAreaView>
  );
}
