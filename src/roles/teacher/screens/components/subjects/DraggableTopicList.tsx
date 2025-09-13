import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, RefreshControl, Animated } from 'react-native';
import DraggableFlatList, { 
  RenderItemParams, 
  ScaleDecorator 
} from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import TopicCard from './TopicCard';
import { Topic } from './types';
import { TeacherService } from '@/services/api/roleServices';
import { useToast } from '@/contexts/ToastContext';

interface DraggableTopicListProps {
  topics: Topic[];
  subjectId: string;
  onAddVideo: (topic: Topic) => void;
  onAddMaterial: (topic: Topic) => void;
  onEditInstructions: (topic: Topic) => void;
  onTopicsReorder: (newTopics: Topic[]) => void;
  onRefresh?: () => void;
}

export function DraggableTopicList({
  topics,
  subjectId,
  onAddVideo,
  onAddMaterial,
  onEditInstructions,
  onTopicsReorder,
  onRefresh
}: DraggableTopicListProps) {
  const [isReordering, setIsReordering] = useState(false);
  const { showSuccess, showError } = useToast();
  const teacherService = new TeacherService();

  const handleReorder = useCallback(async ({ data }: { data: Topic[] }) => {
    console.log('🔄 Drag ended, new data:', data);
    console.log('🔄 Original topics:', topics);
    console.log('🔄 New data:', data);
    
    // Check if data actually changed
    const hasChanged = JSON.stringify(data) !== JSON.stringify(topics);
    console.log('🔄 Has data changed?', hasChanged);
    
    if (!hasChanged) {
      console.log('❌ No changes detected, skipping reorder');
      return;
    }
    
    setIsReordering(true);
    
    try {
      // Update UI immediately (optimistic update)
      onTopicsReorder(data);
      
      // Find the topic that was moved and its new position
      const movedTopic = data.find((topic, index) => {
        const originalTopic = topics[index];
        return originalTopic && originalTopic.id !== topic.id;
      });
      
      if (movedTopic) {
        const newPosition = data.findIndex(t => t.id === movedTopic.id) + 1;
        
        // Call backend API to reorder
        const response = await teacherService.reorderTopic(
          subjectId,
          movedTopic.id,
          newPosition
        );
        
        if (response.success) {
          showSuccess(
            'Topic Reordered Successfully! 🎯',
            `"${movedTopic.title}" moved to position ${newPosition}`,
            3000
          );
        } else {
          // Revert on error
          onTopicsReorder(topics);
          showError(
            'Failed to Reorder Topic',
            response.message || 'Something went wrong. Please try again.',
            4000
          );
        }
      }
    } catch (error) {
      console.error('Error reordering topic:', error);
      
      // Revert on error
      onTopicsReorder(topics);
      showError(
        'Error Reordering Topic',
        'Network error or server issue. Please try again.',
        4000
      );
    } finally {
      setIsReordering(false);
    }
  }, [topics, subjectId, onTopicsReorder, showSuccess, showError, teacherService]);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Topic>) => {
    console.log('🎯 Rendering topic:', item.title, 'isActive:', isActive);
    
    return (
      <ScaleDecorator>
        <Animated.View
          className={`mb-4 ${isActive ? 'opacity-50 scale-105' : ''}`}
          style={isActive ? { transform: [{ scale: 1.05 }] } : undefined}
        >
          <TopicCard
            topic={item}
            onAddVideo={onAddVideo}
            onAddMaterial={onAddMaterial}
            onEditInstructions={onEditInstructions}
            onLongPress={() => {
              console.log('👆 Long press detected for topic:', item.title);
              drag();
            }}
          />
        </Animated.View>
      </ScaleDecorator>
    );
  };

  if (topics.length === 0) {
    return (
      <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
        <Ionicons name="folder-outline" size={64} color="#9ca3af" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
          No Topics Yet
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-4">
          Start by adding your first topic to organize your content
        </Text>
      </View>
    );
  }

  return (
    <View className="relative">
      {/* Reorder Instructions */}
      <View className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="information-circle" size={16} color="#3b82f6" />
            <Text className="text-xs text-blue-700 dark:text-blue-300">
              💡 Long press anywhere on a topic to drag and reorder
            </Text>
          </View>
          {onRefresh && (
            <TouchableOpacity
              onPress={onRefresh}
              className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800"
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={16} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Draggable List */}
      <DraggableFlatList
        data={topics}
        onDragEnd={handleReorder}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        dragItemOverflow={true}
        dragHitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={false}
              onRefresh={onRefresh}
              colors={['#8b5cf6']}
              tintColor="#8b5cf6"
            />
          ) : undefined
        }
      />

      {/* Reordering Indicator */}
      {isReordering && (
        <View className="absolute top-0 left-0 right-0 bg-purple-600 py-2 items-center">
          <Text className="text-white text-sm font-medium">
            Reordering topics...
          </Text>
        </View>
      )}
    </View>
  );
}

export default DraggableTopicList;
