import React from 'react';
import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StudentTopicCard from './StudentTopicCard';
import { StudentTopic } from './studentTopicTypes';

interface StudentTopicListProps {
  topics: StudentTopic[];
  subjectColor: string;
  subjectName?: string;
  subjectCode?: string;
  onTopicPress: (topic: StudentTopic) => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export default function StudentTopicList({ 
  topics, 
  subjectColor, 
  subjectName,
  subjectCode,
  onTopicPress, 
  isLoading = false,
  isRefreshing = false,
  onRefresh 
}: StudentTopicListProps) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <View className=" rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Loading Topics...
        </Text>
      </View>
    );
  }

  if (topics.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <View className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 items-center">
          <Ionicons name="folder-outline" size={64} color="#9CA3AF" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            No Topics Available
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            This subject doesn't have any topics yet. Check back later for content.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
          />
        ) : undefined
      }
    >
      <View className="px-6 py-4">
        {topics.map((topic) => (
          <StudentTopicCard
            key={topic.id}
            topic={topic}
            subjectColor={subjectColor}
            subjectName={subjectName}
            subjectCode={subjectCode}
            onRefresh={onRefresh}
          />
        ))}
      </View>
    </ScrollView>
  );
}
