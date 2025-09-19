import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DirectorTopic } from './directorTopicTypes';

interface DirectorTopicListProps {
  topics: DirectorTopic[];
  subjectColor: string;
  subjectName: string;
  subjectCode: string;
  onTopicPress: (topic: DirectorTopic) => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

export function DirectorTopicList({
  topics,
  subjectColor,
  subjectName,
  subjectCode,
  onTopicPress,
  isLoading = false,
  isRefreshing = false,
  onRefresh
}: DirectorTopicListProps) {
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-12">
        <View className="rounded-full h-12 w-12 border-b-2 border-purple-600" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Loading Topics...
        </Text>
      </View>
    );
  }

  if (topics.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-12 px-6">
        <Ionicons name="folder-outline" size={64} color="#9ca3af" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
          No Topics Available
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          This subject doesn't have any topics yet.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 px-6"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        ) : undefined
      }
    >
      <View className="space-y-4">
        {topics.map((topic, index) => (
          <TouchableOpacity
            key={topic.id}
            onPress={() => onTopicPress(topic)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3">
                <View 
                  className="w-10 h-10 rounded-lg items-center justify-center"
                  style={{ backgroundColor: `${subjectColor}20` }}
                >
                  <Ionicons name="folder-outline" size={20} color={subjectColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100" numberOfLines={1}>
                    {topic.title}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {subjectCode} • Topic {index + 1}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
            
            {topic.description && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3" numberOfLines={2}>
                {topic.description}
              </Text>
            )}

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {topic.videos?.length || 0} videos
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="document-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {topic.materials?.length || 0} materials
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="eye-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  View Details
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default DirectorTopicList;
