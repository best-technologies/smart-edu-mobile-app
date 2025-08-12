import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Subject {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  totalStudents: number;
  progress: number;
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
}

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
  onEdit: () => void;
  onManageContent: () => void;
  viewMode: 'grid' | 'list';
}

export function SubjectCard({ subject, onPress, onEdit, onManageContent, viewMode }: SubjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      case 'draft': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
      case 'archived': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (viewMode === 'grid') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
      >
        {/* Thumbnail */}
        <View className="relative">
          <Image 
            source={{ uri: subject.thumbnail }} 
            className="w-full h-32"
            resizeMode="cover"
          />
          <View className="absolute top-2 right-2">
            <View className={`px-2 py-1 rounded-full ${getStatusColor(subject.status)}`}>
              <Text className="text-xs font-semibold capitalize">{subject.status}</Text>
            </View>
          </View>
          <View className="absolute bottom-2 left-2 flex-row gap-2">
            <TouchableOpacity
              onPress={onEdit}
              activeOpacity={0.7}
              className="h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-black/90"
            >
              <Ionicons name="pencil" size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onManageContent}
              activeOpacity={0.7}
              className="h-8 w-8 items-center justify-center rounded-full bg-purple-500/90"
            >
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={1}>
            {subject.name}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3" numberOfLines={2}>
            {subject.description}
          </Text>

          {/* Progress Bar */}
          <View className="mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400">Progress</Text>
              <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {subject.progress}%
              </Text>
            </View>
            <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View 
                className={`h-full ${getProgressColor(subject.progress)}`}
                style={{ width: `${subject.progress}%` }}
              />
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalVideos}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="document-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalMaterials}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="people-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalStudents}</Text>
              </View>
            </View>
            <Text className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(subject.lastUpdated).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // List view
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4"
    >
      <View className="flex-row gap-4">
        {/* Thumbnail */}
        <View className="relative">
          <Image 
            source={{ uri: subject.thumbnail }} 
            className="w-20 h-20 rounded-xl"
            resizeMode="cover"
          />
          <View className="absolute -top-1 -right-1">
            <View className={`px-2 py-1 rounded-full ${getStatusColor(subject.status)}`}>
              <Text className="text-xs font-semibold capitalize">{subject.status}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={1}>
                {subject.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={2}>
                {subject.description}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={onEdit}
                activeOpacity={0.7}
                className="h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                <Ionicons name="pencil" size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onManageContent}
                activeOpacity={0.7}
                className="h-8 w-8 items-center justify-center rounded-lg bg-purple-500"
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="mb-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400">Progress</Text>
              <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                {subject.progress}%
              </Text>
            </View>
            <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View 
                className={`h-full ${getProgressColor(subject.progress)}`}
                style={{ width: `${subject.progress}%` }}
              />
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center gap-1">
                <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalVideos} videos</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="document-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalMaterials} materials</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="people-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalStudents} students</Text>
              </View>
            </View>
            <Text className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(subject.lastUpdated).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default SubjectCard;
