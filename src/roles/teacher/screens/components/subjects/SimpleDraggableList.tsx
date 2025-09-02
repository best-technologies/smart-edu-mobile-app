import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopicCard from './TopicCard';
import { Topic } from './types';
import { TeacherService } from '@/services/api/roleServices';
import { useToast } from '@/contexts/ToastContext';

const { height: screenHeight } = Dimensions.get('window');

interface SimpleDraggableListProps {
  topics: Topic[];
  subjectId: string;
  onAddVideo: (topic: Topic) => void;
  onAddMaterial: (topic: Topic) => void;
  onEditInstructions: (topic: Topic) => void;
  onTopicsReorder: (newTopics: Topic[]) => void;
  onRefresh?: () => void;
}

export function SimpleDraggableList({
  topics,
  subjectId,
  onAddVideo,
  onAddMaterial,
  onEditInstructions,
  onTopicsReorder,
  onRefresh
}: SimpleDraggableListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const { showSuccess, showError } = useToast();
  const teacherService = new TeacherService();
  
  const pan = useRef(new Animated.ValueXY()).current;
  const itemHeight = 120; // Approximate height of each topic card

  // Safety check for topics array
  if (!topics || !Array.isArray(topics)) {
    return (
      <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Invalid Topics Data
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          Please check the topics data format
        </Text>
      </View>
    );
  }

  // Additional safety check for individual topic properties
  const validTopics = topics.filter(topic => 
    topic && 
    typeof topic === 'object' && 
    topic.id && 
    topic.title && 
    typeof topic.title === 'string' &&
    topic.description && 
    typeof topic.description === 'string'
  );

  if (validTopics.length !== topics.length) {
    return (
      <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Invalid Topic Data
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          Some topics have missing or invalid properties
        </Text>
      </View>
    );
  }



  const handleReorder = async (fromIndex: number, toIndex: number) => {
    setIsReordering(true);
    
    try {
      // Create new array with reordered topics
      const newTopics = [...topics];
      const [movedTopic] = newTopics.splice(fromIndex, 1);
      newTopics.splice(toIndex, 0, movedTopic);
      
      // Update UI immediately (optimistic update)
      onTopicsReorder(newTopics);
      
      // Call backend API to reorder
      const response = await teacherService.reorderTopic(
        subjectId,
        movedTopic.id,
        toIndex + 1
      );
      
      if (response.success) {
        showSuccess(
          'Topic Reordered Successfully! 🎯',
          `"${movedTopic.title}" moved to position ${toIndex + 1}`,
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
    } catch (error) {
      // Revert on error
      onTopicsReorder(topics);
      showError(
        'Error Reordering Topic',
        'Network error or server issue. Please check your connection and try again.',
        4000
      );
    } finally {
      setIsReordering(false);
    }
  };

  const panResponder = useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return draggedIndex !== null;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to vertical movement when dragging
        if (draggedIndex === null) return false;
        
        const isVerticalMovement = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        const hasSignificantMovement = Math.abs(gestureState.dy) > 5; // Minimum movement threshold
        
        return isVerticalMovement && hasSignificantMovement;
      },
      onPanResponderGrant: (evt, gestureState) => {
        pan.setOffset({
          x: (pan.x as any)._value || 0,
          y: (pan.y as any)._value || 0,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        pan.setValue({ x: 0, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        
        if (draggedIndex !== null) {
          const newIndex = Math.round(gestureState.dy / itemHeight) + draggedIndex;
          const clampedIndex = Math.max(0, Math.min(newIndex, topics.length - 1));
          
          if (clampedIndex !== draggedIndex) {
            handleReorder(draggedIndex, clampedIndex);
          }
        }
        
        setDraggedIndex(null);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    }), [draggedIndex, pan, itemHeight, topics.length, handleReorder]);


  const startDrag = (index: number) => {
    // Safety check for topics array
    if (!topics || !Array.isArray(topics) || index < 0 || index >= topics.length) {
      return;
    }
    
    const topic = topics[index];
    if (!topic || typeof topic !== 'object') {
      return;
    }
    
    // Additional safety check for topic properties
    if (!topic.title || typeof topic.title !== 'string') {
      return;
    }
    
    setDraggedIndex(index);
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
              💡 Long press and drag to reorder topics
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

      {/* Topics List */}
      <View className="gap-2">
                {topics.map((topic, index) => {
          // Safety check for each topic before rendering
          if (!topic || !topic.id || !topic.title || typeof topic.title !== 'string') {
            return null;
          }
          
          return (
            <View key={topic.id}>
              {draggedIndex === index ? (
                // Dragging state - use Animated.View with panResponder
                <Animated.View
                  style={[
                    {
                      transform: [{ translateY: pan.y }],
                      zIndex: 1000,
                      elevation: 1000,
                    },
                  ]}
                  {...panResponder.panHandlers}
                >
                  <View className="mb-2 bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600 rounded-lg">
                    <TopicCard
                      topic={topic}
                      onAddVideo={onAddVideo}
                      onAddMaterial={onAddMaterial}
                      onEditInstructions={onEditInstructions}
                    />
                  </View>
                </Animated.View>
              ) : (
                // Normal state - TopicCard handles long press
                <View className="mb-4">
                  <TopicCard
                    topic={topic}
                    onAddVideo={onAddVideo}
                    onAddMaterial={onAddMaterial}
                    onEditInstructions={onEditInstructions}
                    onLongPress={() => startDrag(index)}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>

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

export default SimpleDraggableList;
