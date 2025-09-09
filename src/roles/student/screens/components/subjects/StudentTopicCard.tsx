import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudentTopic, StudentTopicVideo, StudentTopicMaterial } from './studentTopicTypes';
import { capitalizeWords } from '@/utils/textFormatter';
import { StudentTopicContentTabs } from './StudentTopicContentTabs';

interface StudentTopicCardProps {
  topic: StudentTopic;
  subjectName?: string;
  subjectCode?: string;
  subjectColor: string;
  onRefresh?: () => void;
}

export default function StudentTopicCard({ 
  topic, 
  subjectName,
  subjectCode,
  subjectColor,
  onRefresh
}: StudentTopicCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleVideoPress = async (video: StudentTopicVideo) => {
    try {
      const supported = await Linking.canOpenURL(video.url);
      if (supported) {
        await Linking.openURL(video.url);
      } else {
        Alert.alert('Error', 'Cannot open video link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open video');
    }
  };

  const handleMaterialPress = async (material: StudentTopicMaterial) => {
    try {
      const supported = await Linking.canOpenURL(material.fileUrl);
      if (supported) {
        await Linking.openURL(material.fileUrl);
      } else {
        Alert.alert('Error', 'Cannot open material file');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open material');
    }
  };

  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-4">
      {/* Topic Header */}
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
        className="p-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <View 
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${subjectColor}20` }}
            >
              <Text 
                className="text-sm font-bold"
                style={{ color: subjectColor }}
              >
                {topic.order || '?'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {topic.title ? capitalizeWords(topic.title) : 'Untitled Topic'}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {topic.description ? capitalizeWords(topic.description) : 'No description available'}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2 flex-shrink-0">
            <View className="flex-row items-center gap-1">
              <Ionicons name="play-circle-outline" size={14} color="#3B82F6" />
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                {topic.videoCount}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="document-outline" size={14} color="#10B981" />
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                {topic.materialCount}
              </Text>
            </View>
            <Ionicons 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#6b7280" 
            />
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="border-t border-gray-200 dark:border-gray-700">
          {/* Instructions Section - Always visible */}
          {topic.instructions && (
            <View className="p-4 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="information-circle-outline" size={16} color="#F59E0B" />
                <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  Instructions
                </Text>
              </View>
              <View className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {capitalizeWords(topic.instructions)}
                </Text>
              </View>
            </View>
          )}

          {/* Topic Content Tabs */}
          <View className="p-4">
            <StudentTopicContentTabs
              topic={topic}
              topicTitle={topic.title}
              topicDescription={topic.description}
              topicInstructions={topic.instructions}
              subjectName={subjectName}
              subjectCode={subjectCode}
              subjectColor={subjectColor}
              onVideoPress={handleVideoPress}
              onMaterialPress={handleMaterialPress}
              onRefresh={onRefresh}
            />
          </View>
        </View>
      )}
    </View>
  );
}