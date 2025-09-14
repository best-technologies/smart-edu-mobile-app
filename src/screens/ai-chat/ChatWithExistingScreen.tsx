import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAIChatConversations } from '../../hooks/useAIChatConversations';

export default function ChatWithExistingScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use TanStack Query hook for conversations
  const { conversations, isLoading, error } = useAIChatConversations();


  const handleStartChat = (conversation: any) => {
    // Navigate to chat interface with conversation data
    navigation.navigate('AIChat', {
      conversationId: conversation.id,
      conversationTitle: conversation.title,
      materialId: conversation.materialId
    });
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

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleStartChat(item)}
      activeOpacity={0.8}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-gray-700"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start">
        <View className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl items-center justify-center mr-4">
          <Ionicons name="chatbubble" size={24} color="#8B5CF6" />
        </View>
        
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {item.totalMessages} messages • {formatLastActivity(item.lastActivity)}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500">
                Material ID: {item.materialId}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <View className={`px-2 py-1 rounded-full mr-2 ${
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
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Existing Materials
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {/* Search Bar */}
        <View className="mb-6">
          <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search materials..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-gray-900 dark:text-gray-100"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>


        {/* Conversations List */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Your Conversations
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-500">
              {conversations?.length || 0} conversations
            </Text>
          </View>

          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text className="text-gray-600 dark:text-gray-400 mt-2">
                Loading conversations...
              </Text>
            </View>
          ) : error ? (
            <View className="items-center py-8">
              <View className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full items-center justify-center mb-4">
                <Ionicons name="alert-circle" size={32} color="#EF4444" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Failed to Load
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {error}
              </Text>
            </View>
          ) : conversations && conversations.length > 0 ? (
            <FlatList
              data={conversations}
              renderItem={renderConversation}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center py-8">
              <View className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-4">
                <Ionicons name="chatbubbles-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No Conversations Yet
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Start a conversation to see it appear here
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700">
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mr-3">
              <Ionicons name="bulb" size={16} color="#8B5CF6" />
            </View>
            <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Pro Tip
            </Text>
          </View>
          <Text className="text-xs text-gray-600 dark:text-gray-400 leading-5">
            Select any material to start chatting with AI. You can ask questions about the content, 
            request summaries, or generate quiz questions based on the material.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
