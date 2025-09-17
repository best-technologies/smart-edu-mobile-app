import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ApiService } from '@/services/api';
import { StudentTopic, StudentTopicVideo, StudentTopicMaterial } from './studentTopicTypes';
import { capitalizeWords } from '@/utils/textFormatter';

interface StudentTopicContentTabsProps {
  topic: StudentTopic;
  topicTitle: string;
  topicDescription: string;
  topicInstructions?: string;
  subjectName?: string;
  subjectCode?: string;
  subjectColor: string;
  onVideoPress: (video: StudentTopicVideo) => void;
  onMaterialPress: (material: StudentTopicMaterial) => void;
  onRefresh?: () => void;
}

export function StudentTopicContentTabs({ 
  topic,
  topicTitle,
  topicDescription,
  topicInstructions,
  subjectName,
  subjectCode,
  subjectColor,
  onVideoPress,
  onMaterialPress,
  onRefresh
}: StudentTopicContentTabsProps) {
  const [activeTab, setActiveTab] = useState<'videos' | 'materials'>('videos');
  const navigation = useNavigation<any>();

  // Fetch topic content using React Query for proper caching
  const {
    data: content,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['studentTopicContent', topic.id],
    queryFn: () => ApiService.student.getTopicContent(topic.id),
    enabled: !!topic.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Use the fetched content data
  const videos = content?.data?.videos || [];
  const materials = content?.data?.materials || [];

  const tabs: { key: typeof activeTab; label: string; icon: string; count: number }[] = [
    {
      key: 'videos',
      label: 'Videos',
      icon: 'play-circle-outline',
      count: videos.length
    },
    {
      key: 'materials',
      label: 'Materials',
      icon: 'document-outline',
      count: materials.length
    }
  ];

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

  const renderVideos = () => {
    if (isLoading) {
      return (
        <View className="py-8 items-center">
          <View className=" rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">Loading videos...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="py-8 items-center">
          <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">Failed to load videos</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-2 px-4 py-2 bg-blue-600 rounded-lg"
          >
            <Text className="text-white text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (videos.length === 0) {
      return (
        <View className="py-8 items-center">
          <Ionicons name="play-circle-outline" size={40} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">No videos available yet</Text>
          <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
            Videos will appear here when available
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
      >
        {videos
          .sort((a: StudentTopicVideo, b: StudentTopicVideo) => (a.order || 0) - (b.order || 0))
          .map((video: StudentTopicVideo, index: number) => {
          return (
            <TouchableOpacity
              key={video.id}
              onPress={() => {
                // Navigate to video player screen
                navigation.navigate('StudentVideoPlayer', { 
                  videoUri: video.url,
                  videoTitle: video.title,
                  videoDescription: video.description,
                  topicTitle: topicTitle || 'Untitled Topic',
                  topicDescription: topicDescription || 'No description available',
                  topicInstructions: topicInstructions || 'Watch this video carefully and take notes on the key concepts. Pay attention to the examples shown and practice the problems discussed in the video.',
                  subjectName: subjectName || 'Subject',
                  subjectCode: subjectCode || 'SUB'
                });
              }}
              activeOpacity={0.8}
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
                    {formatDuration(video.duration)}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {video.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <View className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <Text className="text-xs text-blue-600 dark:text-blue-400 text-center font-medium">
                    Tap to watch
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const renderMaterials = () => {
    if (isLoading) {
      return (
        <View className="py-8 items-center">
          <View className=" rounded-full h-8 w-8 border-b-2 border-green-600" />
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">Loading materials...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="py-8 items-center">
          <Ionicons name="alert-circle-outline" size={32} color="#ef4444" />
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">Failed to load materials</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-2 px-4 py-2 bg-green-600 rounded-lg"
          >
            <Text className="text-white text-sm">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (materials.length === 0) {
      return (
        <View className="py-8 items-center">
          <Ionicons name="document-outline" size={48} color="#9ca3af" />
          <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">No materials available</Text>
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} className="max-h-64">
        {materials.map((material: StudentTopicMaterial, index: number) => (
          <TouchableOpacity
            key={material.id}
            onPress={() => onMaterialPress(material)}
            activeOpacity={0.7}
            className="flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2"
          >
            <View 
              className="h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${getFileColor(material.fileType)}20` }}
            >
              <Ionicons 
                name={getFileIcon(material.fileType)} 
                size={20} 
                color={getFileColor(material.fileType)} 
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100" numberOfLines={2}>
                {material.title}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {material.fileType.toUpperCase()} • {formatFileSize(material.fileSize)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
      {/* Tab Navigation */}
      <View className="flex-row bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 mb-4">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2 rounded-md flex-row items-center justify-center gap-2 ${
              activeTab === tab.key 
                ? 'bg-blue-600' 
                : 'bg-transparent'
            }`}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={16} 
              color={activeTab === tab.key ? 'white' : '#6b7280'} 
            />
            <Text className={`font-medium text-sm ${
              activeTab === tab.key 
                ? 'text-white' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {tab.label}
            </Text>
            {tab.count > 0 && (
              <View className={`px-2 py-1 rounded-full ${
                activeTab === tab.key 
                  ? 'bg-white/20' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <Text className={`text-xs font-medium ${
                  activeTab === tab.key 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {tab.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View className="min-h-[120px]">
        {activeTab === 'videos' ? renderVideos() : renderMaterials()}
      </View>
    </View>
  );
}
