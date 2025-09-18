import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Animated, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { capitalizeWords } from '@/utils/textFormatter';
import { useQuery } from '@tanstack/react-query';
import { 
  Topic,
  TopicContentResponse,
  TopicContentVideo,
  TopicContentMaterial,
  TopicContentAssignment,
  TopicContentQuiz,
  TopicContentLiveClass,
  TopicContentLibraryResource
} from './types';
import { ApiService } from '@/services/api';

interface TopicContentTabsProps {
  topic: Topic;
  topicTitle?: string;
  topicDescription?: string;
  topicInstructions?: string;
  subjectName?: string;
  subjectCode?: string;
  onAddVideo: () => void;
  onAddMaterial: () => void;
  onAddAssignment: () => void;
  onAddQuiz: () => void;
  onRefresh?: () => void;
}

// Animated AI Icon Component
const AnimatedAIIcon = ({ onPress }: { onPress: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const createBreathingAnimation = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => createBreathingAnimation());
    };

    createBreathingAnimation();
    return () => {
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, [opacityAnim, scaleAnim]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <Pressable
        onPress={onPress}
        className="w-10 h-10 bg-white dark:bg-gray-100 rounded-full items-center justify-center shadow-lg border-2 border-purple-200 dark:border-purple-300"
        style={{
          shadowColor: '#8B5CF6',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 10,
        }}
      >
        <Ionicons name="sparkles" size={20} color="#8B5CF6" />
      </Pressable>
    </Animated.View>
  );
};

export function TopicContentTabs({ 
  topic,
  topicTitle,
  topicDescription,
  topicInstructions,
  subjectName,
  subjectCode,
  onAddVideo, 
  onAddMaterial, 
  onAddAssignment, 
  onAddQuiz,
  onRefresh
}: TopicContentTabsProps) {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'videos' | 'materials' | 'assignments' | 'others'>('videos');

  // Fetch topic content using React Query for proper caching
  const {
    data: content,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['topicContent', topic.id],
    queryFn: () => ApiService.teacher.getTopicContent(topic.id),
    enabled: !!topic.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Use the fetched content data
  const videos = content?.data?.videos || [];
  const materials = content?.data?.materials || [];
  const assignments = content?.data?.assignments || [];
  const quizzes = content?.data?.quizzes || [];
  const liveClasses = content?.data?.liveClasses || [];
  const libraryResources = content?.data?.libraryResources || [];

  const tabs: { key: typeof activeTab; label: string; icon: string; count: number }[] = [
    { 
      key: 'videos', 
      label: 'Videos', 
      icon: 'play-circle-outline',
      count: content?.data?.contentSummary?.totalVideos || videos.length
    },
    { 
      key: 'materials', 
      label: 'Materials', 
      icon: 'document-outline',
      count: content?.data?.contentSummary?.totalMaterials || materials.length
    },
    // { 
    //   key: 'assignments', 
    //   label: 'Assignments', 
    //   icon: 'clipboard-outline',
    //   count: content?.data?.contentSummary?.totalAssignments || assignments.length
    // },
    // { 
    //   key: 'others', 
    //   label: 'Others', 
    //   icon: 'ellipsis-horizontal-outline',
    //   count: (content?.data?.contentSummary?.totalQuizzes || quizzes.length) + 
    //           (content?.data?.contentSummary?.totalLiveClasses || liveClasses.length) + 
    //           (content?.data?.contentSummary?.totalLibraryResources || libraryResources.length)
    // }
  ];

  const handleVideoPress = (video: TopicContentVideo) => {
    // Navigate to video player screen
    (navigation as any).navigate('VideoDemo', { 
      videoUri: video.url,
      videoTitle: video.title,
      videoDescription: video.description,
      topicTitle: topicTitle || 'Untitled Topic',
      topicDescription: topicDescription || 'No description available',
      topicInstructions: topicInstructions || 'Watch this video carefully and take notes on the key concepts. Pay attention to the examples shown and practice the problems discussed in the video.',
      subjectName: subjectName || 'Subject',
      subjectCode: subjectCode || 'SUB'
    });
  };

  const handleMaterialPress = (material: TopicContentMaterial) => {
    // For now, just show an alert. Later this can open a material viewer or download
    console.log('Material pressed:', material);
    // You can implement material viewing/downloading logic here
  };

  const handleAIChatPress = (material: TopicContentMaterial) => {
    // Navigate to AI Chat screen with materialId so sending works
    (navigation as any).navigate('AIChat', { 
      materialId: (material as any).id,
      materialTitle: material.title,
      materialDescription: material.description,
      materialUrl: material.url
    });
  };

  const getFileTypeFromUrl = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  };

  const getMaterialIcon = (url: string) => {
    const fileType = getFileTypeFromUrl(url);
    switch (fileType) {
      case 'pdf': return 'document-text-outline';
      case 'doc': 
      case 'docx': return 'document-outline';
      case 'ppt': 
      case 'pptx': return 'easel-outline';
      default: return 'document-outline';
    }
  };

  const getMaterialColor = (url: string) => {
    const fileType = getFileTypeFromUrl(url);
    switch (fileType) {
      case 'pdf': return '#ef4444';
      case 'doc': 
      case 'docx': return '#3b82f6';
      case 'ppt': 
      case 'pptx': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Handle refresh - use React Query refetch
  const handleRefresh = () => {
    refetch();
  };

  // Show loading state
  if (isLoading) {
    return (
      <View className="items-center justify-center py-12">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-500 dark:text-gray-400 mt-3 text-center">
          Loading topic content...
        </Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View className="items-center justify-center py-12">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="text-red-500 dark:text-red-400 mt-2 text-center">
          Failed to load topic content
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-3 bg-blue-600 py-2 px-4 rounded-lg"
        >
          <Text className="text-white font-medium">Retry</Text>
        </Pressable>
      </View>
    );
  }

  const renderTabButton = (tab: typeof tabs[0]) => (
    <Pressable
      key={tab.key}
      onPress={() => setActiveTab(tab.key)}
      className={`py-3 px-4 rounded-lg flex-row items-center justify-center min-w-fit ${
        activeTab === tab.key 
          ? 'bg-blue-100 dark:bg-blue-900/40' 
          : 'bg-gray-100 dark:bg-gray-800'
      }`}
    >
      <Ionicons 
        name={tab.icon as any} 
        size={16} 
        color={activeTab === tab.key ? '#3b82f6' : '#6b7280'} 
      />
      <Text className={`ml-1 text-sm font-medium whitespace-nowrap ${
        activeTab === tab.key 
          ? 'text-blue-600 dark:text-blue-400' 
          : 'text-gray-600 dark:text-gray-400'
      }`}>
        {tab.label}
      </Text>
      {tab.count > 0 && (
        <View className="ml-1 bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 min-w-[20px] items-center">
          <Text className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {tab.count}
          </Text>
        </View>
      )}
    </Pressable>
  );

  const renderVideosTab = () => (
    <View className="space-y-3">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Videos ({videos.length})
        </Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleRefresh}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Ionicons name="refresh" size={16} color="#6b7280" />
          </Pressable>
          <Pressable
            onPress={onAddVideo}
            className="flex-row items-center gap-1 bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded-lg"
          >
            <Ionicons name="add" size={14} color="#3b82f6" />
            <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Add Video
            </Text>
          </Pressable>
        </View>
      </View>

      {videos.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {videos
            .sort((a: TopicContentVideo, b: TopicContentVideo) => (a.order || 0) - (b.order || 0))
            .map((video: TopicContentVideo, index: number) => {
            return (
              <Pressable
                key={video.id}
                onPress={() => handleVideoPress(video)}
                className={`w-48 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative ${
                  index === 0 ? 'ml-0' : 'ml-3'
                }`}
              >
                {/* Order Badge */}
                <View className="absolute top-2 left-2 z-10 bg-blue-600 dark:bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-xs font-bold text-white">
                    {video.order || index + 1}
                  </Text>
                </View>
                <View className="relative">
                  {video.thumbnail && (typeof video.thumbnail === 'string' || video.thumbnail?.secure_url) ? (
                    <Image 
                      source={{ 
                        uri: typeof video.thumbnail === 'string' 
                          ? video.thumbnail 
                          : video.thumbnail.secure_url
                      }} 
                      className="w-full h-24"
                      resizeMode="cover"
                      onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
                    />
                  ) : (
                    <View className="w-full h-24 bg-gray-300 dark:bg-gray-600 items-center justify-center">
                      <Ionicons name="videocam-outline" size={32} color="#9ca3af" />
                    </View>
                  )}
                  <View className="absolute inset-0 items-center justify-center bg-black/30">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg">
                      <Ionicons name="play" size={20} color="#000" />
                    </View>
                  </View>
                </View>
                <View className="p-3">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={2}>
                    {video.title ? capitalizeWords(video.title) : 'Untitled Video'}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2" numberOfLines={2}>
                    {video.description}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {video.duration}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {video.size}
                    </Text>
                  </View>
                  <View className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Text className="text-xs text-blue-600 dark:text-blue-400 text-center font-medium">
                      Tap to watch
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View className="items-center py-6">
          <Ionicons name="play-circle-outline" size={40} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">No videos available yet</Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            Start by adding your first video lesson
          </Text>
        </View>
      )}
    </View>
  );

  const renderMaterialsTab = () => (
    <View className="space-y-3">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Materials ({materials.length})
        </Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={handleRefresh}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Ionicons name="refresh" size={16} color="#6b7280" />
          </Pressable>
          <Pressable
            onPress={onAddMaterial}
            className="flex-row items-center gap-1 bg-green-100 dark:bg-green-900/40 px-3 py-2 rounded-lg"
          >
            <Ionicons name="add" size={14} color="#10b981" />
            <Text className="text-sm font-medium text-green-600 dark:text-green-400">
              Add Material
            </Text>
          </Pressable>
        </View>
      </View>

      {materials.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {materials
            .sort((a: TopicContentMaterial, b: TopicContentMaterial) => (a.order || 0) - (b.order || 0))
            .map((material: TopicContentMaterial, index: number) => {
            return (
              <Pressable
                key={material.id}
                onPress={() => handleMaterialPress(material)}
                className={`w-48 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative ${
                  index === 0 ? 'ml-0' : 'ml-3'
                }`}
              >
                {/* Order Badge */}
                <View className="absolute top-2 left-2 z-10 bg-green-600 dark:bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                  <Text className="text-xs font-bold text-white">
                    {material.order || index + 1}
                  </Text>
                </View>

                {/* AI Icon - Top Right */}
                <View className="absolute top-2 right-2 z-20">
                  <AnimatedAIIcon onPress={() => handleAIChatPress(material)} />
                </View>

                {/* Material Preview Area */}
                <View className="h-24 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 items-center justify-center relative">
                  <Ionicons 
                    name={getMaterialIcon(material.url)} 
                    size={32} 
                    color={getMaterialColor(material.url)} 
                  />
                  <View className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1">
                    <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {getFileTypeFromUrl(material.url).toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Material Info */}
                <View className="p-3">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={2}>
                    {material.title ? capitalizeWords(material.title) : 'Untitled Material'}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2" numberOfLines={2}>
                    {material.description || 'No description available'}
                  </Text>
                  
                  {/* Material Stats */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="document-outline" size={12} color="#6b7280" />
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {material.size || 'Unknown size'}
                      </Text>
                    </View>
                    <Pressable 
                      className="p-1 rounded-full bg-gray-100 dark:bg-gray-700"
                    >
                      <Ionicons name="download-outline" size={14} color="#6b7280" />
                    </Pressable>
                  </View>
                  
                  {/* Upload Date */}
                  <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {material.createdAt ? new Date(material.createdAt).toLocaleDateString() : 'Unknown date'}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : (
        <View className="items-center py-6">
          <Ionicons name="document-outline" size={40} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">No materials available yet</Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            Add study materials, PDFs, and other resources
          </Text>
        </View>
      )}
    </View>
  );

  const renderAssignmentsTab = () => (
    <View className="space-y-3">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Assignments ({assignments.length})
        </Text>
        <Pressable
          onPress={onAddAssignment}
          className="flex-row items-center gap-1 bg-orange-100 dark:bg-orange-900/40 px-3 py-2 rounded-lg"
        >
          <Ionicons name="add" size={14} color="#f59e0b" />
          <Text className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Add Assignment
          </Text>
        </Pressable>
      </View>

      {assignments.length > 0 ? (
        <View className="space-y-3">
          {assignments
            .sort((a: TopicContentAssignment, b: TopicContentAssignment) => (a.order || 0) - (b.order || 0))
            .map((assignment: TopicContentAssignment) => (
            <View key={assignment.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg relative">
              {/* Order Badge */}
              <View className="absolute top-2 right-2 bg-orange-600 dark:bg-orange-500 rounded-full w-6 h-6 items-center justify-center">
                <Text className="text-xs font-bold text-white">
                  {assignment.order || 0}
                </Text>
              </View>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 pr-12">
                {assignment.title ? capitalizeWords(assignment.title) : 'Untitled Assignment'}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {assignment.description}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Max Score: {assignment.maxScore}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-6">
          <Ionicons name="clipboard-outline" size={40} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">No assignments available yet</Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            Create assignments to test student understanding
          </Text>
        </View>
      )}
    </View>
  );

  const renderOthersTab = () => (
    <View className="space-y-6">
      {/* Quizzes Section */}
      <View className="space-y-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Quizzes ({quizzes.length})
          </Text>
          <Pressable
            onPress={onAddQuiz}
            className="flex-row items-center gap-1 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-lg"
          >
            <Ionicons name="add" size={14} color="#8b5cf6" />
            <Text className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Add Quiz
            </Text>
          </Pressable>
        </View>

        {quizzes.length > 0 ? (
          <View className="space-y-2">
            {quizzes
              .sort((a: TopicContentQuiz, b: TopicContentQuiz) => (a.order || 0) - (b.order || 0))
              .map((quiz: TopicContentQuiz) => (
              <View key={quiz.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {quiz.title ? capitalizeWords(quiz.title) : 'Untitled Quiz'}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {quiz.description}
                </Text>
                <View className="flex-row items-center gap-4">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Duration: {quiz.duration} min
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Questions: {quiz.totalQuestions}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Pass: {quiz.passingScore}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-4">
            <Ionicons name="help-circle-outline" size={32} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">No quizzes yet</Text>
          </View>
        )}
      </View>

      {/* Live Classes Section */}
      <View className="space-y-3">
        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Live Classes ({liveClasses.length})
        </Text>

        {liveClasses.length > 0 ? (
          <View className="space-y-2">
            {liveClasses
              .sort((a: TopicContentLiveClass, b: TopicContentLiveClass) => (a.order || 0) - (b.order || 0))
              .map((liveClass: TopicContentLiveClass) => (
              <View key={liveClass.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {liveClass.title ? capitalizeWords(liveClass.title) : 'Untitled Live Class'}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {liveClass.description}
                </Text>
                <View className="flex-row items-center gap-4">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {liveClass.scheduledAt ? new Date(liveClass.scheduledAt).toLocaleDateString() : 'No date set'}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Duration: {liveClass.duration} min
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-4">
            <Ionicons name="videocam-outline" size={32} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">No live classes scheduled</Text>
          </View>
        )}
      </View>

      {/* Library Resources Section */}
      <View className="space-y-3">
        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
          Library Resources ({libraryResources.length})
        </Text>

        {libraryResources.length > 0 ? (
          <View className="space-y-2">
            {libraryResources
              .sort((a: TopicContentLibraryResource, b: TopicContentLibraryResource) => (a.order || 0) - (b.order || 0))
              .map((resource: TopicContentLibraryResource) => (
              <View key={resource.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {resource.title ? capitalizeWords(resource.title) : 'Untitled Resource'}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {resource.description}
                </Text>
                <View className="flex-row items-center gap-4">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Type: {resource.resourceType}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Unknown date'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center py-4">
            <Ionicons name="library-outline" size={32} color="#9ca3af" />
            <Text className="text-gray-500 dark:text-gray-400 text-center text-sm">No library resources</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'videos':
        return renderVideosTab();
      case 'materials':
        return renderMaterialsTab();
      case 'assignments':
        return renderAssignmentsTab();
      case 'others':
        return renderOthersTab();
      default:
        return null;
    }
  };

  return (
    <View className="space-y-4">
      {/* Tab Navigation - Horizontally Scrollable */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16, paddingLeft: 4 }}
        className="mb-4"
        scrollEventThrottle={16}
      >
        <View className="flex-row gap-3">
          {tabs.map(renderTabButton)}
        </View>
      </ScrollView>

      {/* Tab Content */}
      <View className="pb-4">
        {renderTabContent()}
      </View>
    </View>
  );
}
