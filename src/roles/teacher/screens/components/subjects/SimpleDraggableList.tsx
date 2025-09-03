import React, { useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, PanResponder, Animated, Dimensions, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopicCard from './TopicCard';
import { Topic } from './types';
import { TeacherService } from '@/services/api/roleServices';
import { useToast } from '@/contexts/ToastContext';

const { height: screenHeight } = Dimensions.get('window');

interface SimpleDraggableListProps {
  topics: Topic[];
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  onAddVideo: (topic: Topic) => void;
  onAddMaterial: (topic: Topic) => void;
  onEditInstructions: (topic: Topic) => void;
  onTopicsReorder: (newTopics: Topic[]) => void;
  onRefresh?: () => void;
  onScroll?: (event: any) => void;
}

export function SimpleDraggableList({
  topics,
  subjectId,
  subjectName,
  subjectCode,
  onAddVideo,
  onAddMaterial,
  onEditInstructions,
  onTopicsReorder,
  onRefresh,
  onScroll
}: SimpleDraggableListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { showSuccess, showError } = useToast();
  const teacherService = useMemo(() => new TeacherService(), []);
  
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const itemHeight = 130; // More accurate height including margins
  
  // Create animated values for smooth repositioning
  const itemPositions = useRef<{ [key: string]: Animated.Value }>({}).current;
  
  // Initialize position animations for each topic
  useEffect(() => {
    if (topics && topics.length > 0) {
      topics.forEach((topic, index) => {
        if (!itemPositions[topic.id]) {
          itemPositions[topic.id] = new Animated.Value(0);
        }
      });
    }
  }, [topics, itemPositions]);

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

  const calculateNewIndex = (gestureY: number, currentIndex: number): number => {
    // Constrain dragging to only within the topics list area
    const minDragY = -currentIndex * itemHeight; // Can't drag above first topic
    const maxDragY = (topics.length - 1 - currentIndex) * itemHeight; // Can't drag below last topic
    
    const constrainedY = Math.max(minDragY, Math.min(gestureY, maxDragY));
    const draggedTopY = currentIndex * itemHeight + constrainedY;
    
    let newIndex = Math.round(draggedTopY / itemHeight);
    return Math.max(0, Math.min(newIndex, topics.length - 1));
  };

  const animateToPosition = (topicId: string, targetY: number, duration: number = 300) => {
    if (!itemPositions[topicId]) return;
    
    Animated.timing(itemPositions[topicId], {
      toValue: targetY,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const updateListPositions = (draggedIndex: number, newIndex: number) => {
    if (draggedIndex === newIndex) return;
    
    // Animate all items to their new positions
    topics.forEach((topic, index) => {
      let targetY = 0;
      
      if (draggedIndex < newIndex) {
        // Moving down: shift items up
        if (index > draggedIndex && index <= newIndex) {
          targetY = -itemHeight;
        }
      } else {
        // Moving up: shift items down
        if (index >= newIndex && index < draggedIndex) {
          targetY = itemHeight;
        }
      }
      
      if (index !== draggedIndex) {
        animateToPosition(topic.id, targetY, 200);
      }
    });
    
    setHoveredIndex(newIndex);
  };

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setIsReordering(true);
    
    try {
      const newTopics = [...topics];
      const [movedTopic] = newTopics.splice(fromIndex, 1);
      newTopics.splice(toIndex, 0, movedTopic);
      
      // Optimistic update
      onTopicsReorder(newTopics);
      
             // Reset positions for new order
       newTopics.forEach((topic, index) => {
         animateToPosition(topic.id, 0, 300);
       });
      
      const response = await teacherService.reorderTopic(
        subjectId,
        movedTopic.id,
        toIndex + 1
      );
      
      if (response.success) {
        showSuccess(
          'Topic Reordered Successfully!',
          `"${movedTopic.title}" moved to position ${toIndex + 1}`,
          3000
        );
        
        if (onRefresh) {
          onRefresh();
        }
             } else {
         // Revert on error
         onTopicsReorder(topics);
         topics.forEach((topic, index) => {
           animateToPosition(topic.id, 0, 300);
         });
         showError(
          'Failed to Reorder Topic',
          response.message || 'Something went wrong. Please try again.',
          4000
        );
      }
         } catch (error) {
       // Revert on error
       onTopicsReorder(topics);
       topics.forEach((topic, index) => {
         animateToPosition(topic.id, 0, 300);
       });
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
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (draggedIndex === null) return false;
        
        // Only capture pan if the gesture is primarily vertical and significant
        const isVerticalGesture = Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
        const isSignificantMovement = Math.abs(gestureState.dy) > 10;
        
        return isVerticalGesture && isSignificantMovement;
      },
      
      onPanResponderGrant: () => {
        if (draggedIndex !== null) {
          Vibration.vibrate(50); // Haptic feedback
          
          // Scale up the dragged item
          Animated.spring(scale, {
            toValue: 1.05,
            useNativeDriver: false,
            tension: 200,
            friction: 8,
          }).start();
          
          // Disable parent scroll during drag
          if (onScroll) {
            // This will help coordinate with parent scroll
            onScroll({ type: 'drag_start' });
          }
        }
      },
      
             onPanResponderMove: (evt, gestureState) => {
         if (draggedIndex === null) return;
         
         // Apply drag constraints
         const minDragY = -draggedIndex * itemHeight;
         const maxDragY = (topics.length - 1 - draggedIndex) * itemHeight;
         const constrainedY = Math.max(minDragY, Math.min(gestureState.dy, maxDragY));
         
         pan.setValue({ x: 0, y: constrainedY });
         
         const newIndex = calculateNewIndex(constrainedY, draggedIndex);
         if (newIndex !== hoveredIndex) {
           updateListPositions(draggedIndex, newIndex);
         }
       },
      
      onPanResponderRelease: (evt, gestureState) => {
        if (draggedIndex !== null) {
          const newIndex = calculateNewIndex(gestureState.dy, draggedIndex);
          
          // Reset drag animations
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              tension: 200,
              friction: 10,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: false,
              tension: 200,
              friction: 8,
            })
          ]).start();
          
          // Handle reorder
          if (newIndex !== draggedIndex) {
            handleReorder(draggedIndex, newIndex);
                     } else {
             // Reset positions if no reorder
             topics.forEach((topic, index) => {
               animateToPosition(topic.id, 0, 200);
             });
           }
        }
        
        setDraggedIndex(null);
        setHoveredIndex(null);
        
        // Re-enable parent scroll after drag
        if (onScroll) {
          onScroll({ type: 'drag_end' });
        }
      },
    }), [draggedIndex, hoveredIndex, pan, scale, topics]);

  const startDrag = (index: number) => {
    if (!topics || !Array.isArray(topics) || index < 0 || index >= topics.length) {
      return;
    }
    
    const topic = topics[index];
    if (!topic || typeof topic !== 'object' || !topic.title || typeof topic.title !== 'string') {
      return;
    }
    
    setDraggedIndex(index);
    setHoveredIndex(index);
    
    // Initialize position if not exists
    if (!itemPositions[topic.id]) {
      itemPositions[topic.id] = new Animated.Value(index * itemHeight);
    }
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
    <View 
      className="relative"
      onLayout={(event) => {
        // Notify parent of layout changes for better scroll coordination
        if (onScroll) {
          onScroll(event);
        }
      }}
    >
      {/* Reorder Instructions */}
      <View className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons name="information-circle" size={16} color="#3b82f6" />
            <Text className="text-xs text-blue-700 dark:text-blue-300">
              Long press and drag to reorder topics
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

                   {/* Topics Container with Drag Boundaries */}
      <View className="gap-2 relative">
        {/* Top drag boundary indicator */}
        {draggedIndex !== null && (
          <View className="h-1 bg-red-400 rounded-full opacity-60 mb-2" />
        )}
        
        {topics.map((topic, index) => {
           if (!topic || !topic.id || !topic.title || typeof topic.title !== 'string') {
             return null;
           }
           
           const isDragged = draggedIndex === index;
           const isHovered = hoveredIndex === index && !isDragged;
           
           return (
             <Animated.View
               key={topic.id}
               style={[
                 {
                   zIndex: isDragged ? 1000 : 1,
                 },
                 isDragged ? {
                   transform: [
                     { translateY: pan.y },
                     { scale: scale }
                   ],
                 } : {
                   transform: [
                     { translateY: itemPositions[topic.id] || new Animated.Value(0) }
                   ],
                 }
               ]}
               {...(isDragged ? panResponder.panHandlers : {})}
             >
               <View 
                 className={`mb-2 ${isDragged ? 'bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600 rounded-lg' : ''} ${isHovered ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
               >
                 <TopicCard
                   topic={topic}
                   subjectName={subjectName}
                   subjectCode={subjectCode}
                   onAddVideo={onAddVideo}
                   onAddMaterial={onAddMaterial}
                   onEditInstructions={onEditInstructions}
                   onLongPress={() => startDrag(index)}
                   onRefresh={onRefresh}
                 />
               </View>
               
               {/* Drop indicator */}
               {draggedIndex !== null && hoveredIndex === index && draggedIndex !== index && (
                 <View 
                   className="h-1 bg-blue-500 rounded-full opacity-80"
                 />
               )}
             </Animated.View>
                     );
        })}
        
        {/* Bottom drag boundary indicator */}
        {draggedIndex !== null && (
          <View className="h-1 bg-red-400 rounded-full opacity-60 mt-2" />
        )}
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