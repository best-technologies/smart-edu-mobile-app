import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Topic, Video, Material } from './types';
import { capitalizeWords } from '@/utils/textFormatter';

interface TopicCardProps {
  topic: Topic;
  onAddVideo: () => void;
  onAddMaterial: () => void;
  onEditInstructions: () => void;
}

export function TopicCard({ topic, onAddVideo, onAddMaterial, onEditInstructions }: TopicCardProps) {
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
          <View className="flex-row items-center gap-3">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/40">
              <Text className="text-sm font-bold text-purple-600 dark:text-purple-400">
                {topic.order}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {capitalizeWords(topic.title)}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {capitalizeWords(topic.description)}
              </Text>
            </View>
          </View>
          <Ionicons 
            name={expanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#6b7280" 
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View className="border-t border-gray-200 dark:border-gray-700">
          {/* Videos Section */}
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Videos ({topic.videos.length})
              </Text>
              <TouchableOpacity
                onPress={onAddVideo}
                activeOpacity={0.7}
                className="flex-row items-center gap-1 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-lg"
              >
                <Ionicons name="add" size={14} color="#3b82f6" />
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Add Video
                </Text>
              </TouchableOpacity>
            </View>

            {topic.videos.length > 0 ? (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {topic.videos.map((video, index) => (
                  <View 
                    key={video.id} 
                    className={`w-48 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm ${
                      index === 0 ? 'ml-0' : 'ml-3'
                    }`}
                  >
                    <View className="relative">
                      <Image 
                        source={{ uri: video.thumbnail }} 
                        className="w-full h-24"
                        resizeMode="cover"
                      />
                      <View className="absolute inset-0 items-center justify-center bg-black/20">
                        <View className="h-8 w-8 items-center justify-center rounded-full bg-white/90">
                          <Ionicons name="play" size={16} color="#000" />
                        </View>
                      </View>
                    </View>
                    <View className="p-3">
                      <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={2}>
                        {capitalizeWords(video.title)}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                          {video.duration}
                        </Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(video.uploadedAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View className="items-center py-6">
                <Ionicons name="play-circle-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2">No videos yet</Text>
              </View>
            )}
          </View>

          {/* Materials Section */}
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Materials ({topic.materials.length})
              </Text>
              <TouchableOpacity
                onPress={onAddMaterial}
                activeOpacity={0.7}
                className="flex-row items-center gap-1 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-lg"
              >
                <Ionicons name="add" size={14} color="#10b981" />
                <Text className="text-sm font-medium text-green-600 dark:text-green-400">
                  Add Material
                </Text>
              </TouchableOpacity>
            </View>

            {topic.materials.length > 0 ? (
              <View className="gap-2">
                {topic.materials.map((material) => (
                  <View key={material.id} className="flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Ionicons 
                      name={getFileIcon(material.type) as any} 
                      size={20} 
                      color={getFileColor(material.type)} 
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {capitalizeWords(material.title)}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {material.size} • {new Date(material.uploadedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                      <Ionicons name="download-outline" size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center py-6">
                <Ionicons name="document-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2">No materials yet</Text>
              </View>
            )}
          </View>

          {/* Instructions Section */}
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Instructions
              </Text>
              <TouchableOpacity
                onPress={onEditInstructions}
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
                  {capitalizeWords(topic.instructions)}
                </Text>
              </View>
            ) : (
              <View className="items-center py-6">
                <Ionicons name="create-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 mt-2">No instructions yet</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

export default TopicCard;
