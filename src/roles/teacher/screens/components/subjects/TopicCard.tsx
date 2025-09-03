import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Topic, Video, Material } from './types';
import { capitalizeWords } from '@/utils/textFormatter';
import { TopicContentTabs } from './TopicContentTabs';

interface TopicCardProps {
  topic: Topic;
  subjectName?: string;
  subjectCode?: string;
  onAddVideo: (topic: Topic) => void;
  onAddMaterial: (topic: Topic) => void;
  onEditInstructions: (topic: Topic) => void;
  onLongPress: () => void;
  onRefresh?: () => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export default function TopicCard({ 
  topic, 
  subjectName,
  subjectCode,
  onAddVideo, 
  onAddMaterial, 
  onEditInstructions, 
  onLongPress,
  onRefresh,
  isExpanded = false,
  onToggleExpanded
}: TopicCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return 'document-text-outline';
      case 'docx': return 'document-outline';
      case 'doc': return 'document-outline';
      case 'ppt': return 'easel-outline';
      case 'pptx': return 'easel-outline';
      case 'xlsx': return 'document-outline';
      case 'image': return 'image-outline';
      default: return 'document-outline';
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return '#ef4444';
      case 'docx': return '#3b82f6';
      case 'doc': return '#3b82f6';
      case 'ppt': return '#f59e0b';
      case 'pptx': return '#f59e0b';
      case 'xlsx': return '#10b981';
      case 'image': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Topic Header */}
              <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.8}
          className="p-4"
        >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40">
              <Text className="text-sm font-bold text-purple-600 dark:text-purple-400">
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
            <Ionicons 
              name={expanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#6b7280" 
            />
            <TouchableOpacity
              onLongPress={onLongPress}
              activeOpacity={0.7}
              className="h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              delayLongPress={300}
            >
              <Ionicons 
                name="reorder-three" 
                size={16} 
                color="#6b7280" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="border-t border-gray-200 dark:border-gray-700">
          {/* Instructions Section - Always visible */}
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Instructions
              </Text>
              <TouchableOpacity
                onPress={() => onEditInstructions(topic)}
                activeOpacity={0.7}
                className="flex-row items-center gap-1 bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded-lg"
              >
                <Ionicons name="pencil" size={14} color="#f59e0b" />
                <Text className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            {topic.instructions ? (
              <View className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-sm text-gray-700 dark:text-gray-300">
                  {topic.instructions ? capitalizeWords(topic.instructions) : 'No instructions available'}
                </Text>
              </View>
            ) : (
              <View className="items-center py-4">
                <Ionicons name="create-outline" size={32} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">No instructions yet</Text>
              </View>
            )}
          </View>

          {/* Topic Content Tabs */}
          <View className="p-4">
            <TopicContentTabs
              topic={topic}
              topicTitle={topic.title}
              topicDescription={topic.description}
              topicInstructions={topic.instructions}
              subjectName={subjectName}
              subjectCode={subjectCode}
              onAddVideo={() => onAddVideo(topic)}
              onAddMaterial={() => onAddMaterial(topic)}
              onAddAssignment={() => {
                // TODO: Implement add assignment functionality
                console.log('Add assignment for topic:', topic.id);
              }}
              onAddQuiz={() => {
                // TODO: Implement add quiz functionality
                console.log('Add quiz for topic:', topic.id);
              }}
              onRefresh={onRefresh}
            />
          </View>
        </View>
      )}
    </View>
  );
}
