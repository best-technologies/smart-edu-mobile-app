import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { capitalizeWords } from '@/utils/textFormatter';
import { 
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
  topicId: string;
  onAddVideo: () => void;
  onAddMaterial: () => void;
  onAddAssignment: () => void;
  onAddQuiz: () => void;
}

type TabType = 'videos' | 'materials' | 'assignments' | 'others';

export function TopicContentTabs({ 
  topicId, 
  onAddVideo, 
  onAddMaterial, 
  onAddAssignment, 
  onAddQuiz 
}: TopicContentTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('videos');
  const [content, setContent] = useState<TopicContentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs: { key: TabType; label: string; icon: string; count: number }[] = [
    { 
      key: 'videos', 
      label: 'Videos', 
      icon: 'play-circle-outline',
      count: content?.contentSummary.totalVideos || 0
    },
    { 
      key: 'materials', 
      label: 'Materials', 
      icon: 'document-outline',
      count: content?.contentSummary.totalMaterials || 0
    },
    { 
      key: 'assignments', 
      label: 'Assignments', 
      icon: 'clipboard-outline',
      count: content?.contentSummary.totalAssignments || 0
    },
    { 
      key: 'others', 
      label: 'Others', 
      icon: 'ellipsis-horizontal-outline',
      count: (content?.contentSummary.totalQuizzes || 0) + 
              (content?.contentSummary.totalLiveClasses || 0) + 
              (content?.contentSummary.totalLibraryResources || 0)
    }
  ];

  useEffect(() => {
    fetchTopicContent();
  }, [topicId]);

  const fetchTopicContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.teacher.getTopicContent(topicId);
      
      if (response.success && response.data) {
        console.log('Topic content fetched successfully:', response.data);
        console.log('Videos data:', response.data.videos);
        if (response.data.videos && response.data.videos.length > 0) {
          console.log('First video thumbnail:', response.data.videos[0].thumbnail);
        }
        setContent(response.data);
      } else {
        setError(response.message || 'Failed to fetch topic content');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching topic content:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTabButton = (tab: typeof tabs[0]) => (
    <TouchableOpacity
      key={tab.key}
      onPress={() => setActiveTab(tab.key)}
      activeOpacity={0.7}
      className={`flex-1 py-3 px-2 rounded-lg flex-row items-center justify-center ${
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
      <Text className={`ml-1 text-sm font-medium ${
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
    </TouchableOpacity>
  );

  const renderVideosTab = () => (
    <View className="space-y-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Videos ({content?.videos.length || 0})
        </Text>
        <TouchableOpacity
          onPress={onAddVideo}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded-lg"
        >
          <Ionicons name="add" size={14} color="#3b82f6" />
          <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Add Video
          </Text>
        </TouchableOpacity>
      </View>

      {content?.videos && content.videos.length > 0 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {content.videos.map((video, index) => {
            console.log(`Video ${index} thumbnail:`, video.thumbnail);
            return (
              <View 
                key={video.id} 
                className={`w-48 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm ${
                  index === 0 ? 'ml-0' : 'ml-3'
                }`}
              >
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
                  <View className="absolute inset-0 items-center justify-center bg-black/20">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-white/90">
                      <Ionicons name="play" size={16} color="#000" />
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
                </View>
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View className="items-center py-8">
          <Ionicons name="play-circle-outline" size={48} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">No videos available yet</Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            Start by adding your first video lesson
          </Text>
        </View>
      )}
    </View>
  );

  const renderMaterialsTab = () => (
    <View className="space-y-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Materials ({content?.materials.length || 0})
        </Text>
        <TouchableOpacity
          onPress={onAddMaterial}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 bg-green-100 dark:bg-green-900/40 px-3 py-2 rounded-lg"
        >
          <Ionicons name="add" size={14} color="#10b981" />
          <Text className="text-sm font-medium text-green-600 dark:text-green-400">
            Add Material
          </Text>
        </TouchableOpacity>
      </View>

      {content?.materials && content.materials.length > 0 ? (
        <View className="space-y-3">
          {content.materials.map((material) => (
            <View key={material.id} className="flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Ionicons name="document-outline" size={20} color="#3b82f6" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {material.title ? capitalizeWords(material.title) : 'Untitled Material'}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {material.description}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {material.size} • {new Date(material.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Ionicons name="download-outline" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <Ionicons name="document-outline" size={48} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">No materials available yet</Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            Add study materials, PDFs, and other resources
          </Text>
        </View>
      )}
    </View>
  );

  const renderAssignmentsTab = () => (
    <View className="space-y-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Assignments ({content?.assignments.length || 0})
        </Text>
        <TouchableOpacity
          onPress={onAddAssignment}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 bg-orange-100 dark:bg-orange-900/40 px-3 py-2 rounded-lg"
        >
          <Ionicons name="add" size={14} color="#f59e0b" />
          <Text className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Add Assignment
          </Text>
        </TouchableOpacity>
      </View>

      {content?.assignments && content.assignments.length > 0 ? (
        <View className="space-y-3">
          {content.assignments.map((assignment) => (
            <View key={assignment.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                {assignment.title ? capitalizeWords(assignment.title) : 'Untitled Assignment'}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {assignment.description}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Max Score: {assignment.maxScore}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="items-center py-8">
          <Ionicons name="clipboard-outline" size={48} color="#9ca3af" />
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
            Quizzes ({content?.quizzes.length || 0})
          </Text>
          <TouchableOpacity
            onPress={onAddQuiz}
            activeOpacity={0.7}
            className="flex-row items-center gap-1 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-lg"
          >
            <Ionicons name="add" size={14} color="#8b5cf6" />
            <Text className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Add Quiz
            </Text>
          </TouchableOpacity>
        </View>

        {content?.quizzes && content.quizzes.length > 0 ? (
          <View className="space-y-2">
            {content.quizzes.map((quiz) => (
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
          Live Classes ({content?.liveClasses.length || 0})
        </Text>

        {content?.liveClasses && content.liveClasses.length > 0 ? (
          <View className="space-y-2">
            {content.liveClasses.map((liveClass) => (
              <View key={liveClass.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {liveClass.title ? capitalizeWords(liveClass.title) : 'Untitled Live Class'}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {liveClass.description}
                </Text>
                <View className="flex-row items-center gap-4">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(liveClass.scheduledAt).toLocaleDateString()}
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
          Library Resources ({content?.libraryResources.length || 0})
        </Text>

        {content?.libraryResources && content.libraryResources.length > 0 ? (
          <View className="space-y-2">
            {content.libraryResources.map((resource) => (
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
                    {new Date(resource.createdAt).toLocaleDateString()}
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

  if (loading) {
    return (
      <View className="items-center justify-center py-12">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-500 dark:text-gray-400 mt-3 text-center">
          Loading topic content...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="items-center justify-center py-12">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="text-red-500 dark:text-red-400 mt-2 text-center">
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchTopicContent}
          activeOpacity={0.7}
          className="mt-3 bg-blue-600 py-2 px-4 rounded-lg"
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      {/* Tab Navigation */}
      <View className="flex-row gap-2">
        {tabs.map(renderTabButton)}
      </View>

      {/* Tab Content */}
      <View className="min-h-[400px]">
        {renderTabContent()}
      </View>
    </View>
  );
}
