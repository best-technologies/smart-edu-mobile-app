import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ChatWithExistingScreen() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const subjects = [
    { id: 'all', name: 'All', count: 12 },
    { id: 'mathematics', name: 'Mathematics', count: 4 },
    { id: 'physics', name: 'Physics', count: 3 },
    { id: 'chemistry', name: 'Chemistry', count: 2 },
    { id: 'biology', name: 'Biology', count: 3 },
  ];

  const materials = [
    {
      id: '1',
      title: 'Advanced Calculus - Chapter 5',
      subject: 'Mathematics',
      type: 'PDF',
      size: '2.4 MB',
      lastUsed: '2 days ago',
      pages: 24,
      color: '#3B82F6',
    },
    {
      id: '2',
      title: 'Organic Chemistry Reactions',
      subject: 'Chemistry',
      type: 'PDF',
      size: '1.8 MB',
      lastUsed: '1 week ago',
      pages: 18,
      color: '#10B981',
    },
    {
      id: '3',
      title: 'Physics Lab Manual',
      subject: 'Physics',
      type: 'DOC',
      size: '3.2 MB',
      lastUsed: '3 days ago',
      pages: 32,
      color: '#F59E0B',
    },
    {
      id: '4',
      title: 'Cell Biology Notes',
      subject: 'Biology',
      type: 'PDF',
      size: '4.1 MB',
      lastUsed: '5 days ago',
      pages: 28,
      color: '#8B5CF6',
    },
  ];

  const handleStartChat = (material: any) => {
    // Navigate to chat interface
    console.log('Starting chat with:', material.title);
  };

  const renderMaterial = ({ item }: { item: any }) => (
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
        <View 
          className="w-12 h-12 rounded-xl items-center justify-center mr-4"
          style={{ backgroundColor: `${item.color}15` }}
        >
          <Ionicons 
            name={item.type === 'PDF' ? 'document-text' : 'document'} 
            size={24} 
            color={item.color} 
          />
        </View>
        
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {item.title}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {item.subject} • {item.pages} pages
          </Text>
          
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-xs text-gray-500 dark:text-gray-500 mr-4">
                {item.size}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-500">
                Used {item.lastUsed}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded-full mr-2">
                <Text className="text-xs font-medium text-purple-600 dark:text-purple-400">
                  Ready
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

        {/* Subject Filter */}
        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Filter by Subject
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-3">
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  onPress={() => setSelectedSubject(subject.name)}
                  className={`px-4 py-2 rounded-full ${
                    selectedSubject === subject.name
                      ? 'bg-purple-600'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedSubject === subject.name
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {subject.name} ({subject.count})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Materials List */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
              Your Materials
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-500">
              {materials.length} documents
            </Text>
          </View>

          <FlatList
            data={materials}
            renderItem={renderMaterial}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
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
