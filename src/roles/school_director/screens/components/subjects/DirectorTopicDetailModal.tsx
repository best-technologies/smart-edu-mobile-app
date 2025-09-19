import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DirectorTopic } from './directorTopicTypes';
import { TopicContentTabs } from '@/components';

interface DirectorTopicDetailModalProps {
  visible: boolean;
  topic: DirectorTopic | null;
  subjectColor: string;
  onClose: () => void;
}

export function DirectorTopicDetailModal({
  visible,
  topic,
  subjectColor,
  onClose
}: DirectorTopicDetailModalProps) {
  if (!topic) return null;

  const handleVideoPress = (video: any) => {
    // Director can view videos but not edit
    console.log('Director viewing video:', video);
  };

  const handleMaterialPress = (material: any) => {
    // Director can view materials but not edit
    console.log('Director viewing material:', material);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <View className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center justify-between">
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
                  Topic Details
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6 space-y-6">
            {/* Topic Description */}
            {topic.description && (
              <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Description
                </Text>
                <Text className="text-base text-gray-900 dark:text-gray-100 leading-6">
                  {topic.description}
                </Text>
              </View>
            )}

            {/* Topic Content Tabs */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <TopicContentTabs
                topic={topic}
                topicTitle={topic.title}
                topicDescription={topic.description}
                subjectName={topic.subjectName || 'Subject'}
                subjectCode={topic.subjectCode || 'SUB'}
                userRole="director"
                onVideoPress={handleVideoPress}
                onMaterialPress={handleMaterialPress}
              />
            </View>

            {/* Topic Stats */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Content Statistics
              </Text>
              <View className="grid grid-cols-2 gap-4">
                <View className="items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Ionicons name="play-circle-outline" size={24} color="#3b82f6" />
                  <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {topic.videos?.length || 0}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Videos
                  </Text>
                </View>
                <View className="items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Ionicons name="document-outline" size={24} color="#10b981" />
                  <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                    {topic.materials?.length || 0}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Materials
                  </Text>
                </View>
              </View>
            </View>

            {/* Topic Info */}
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Topic Information
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Status</Text>
                  <View className="flex-row items-center gap-1">
                    <View 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: topic.isActive ? '#10b981' : '#ef4444' }}
                    />
                    <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {topic.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Created</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString() : 'Unknown'}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Last Updated</Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {topic.updatedAt ? new Date(topic.updatedAt).toLocaleDateString() : 'Unknown'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default DirectorTopicDetailModal;
