import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Subject } from './types';
import { capitalizeWords } from '@/utils/textFormatter';

interface SubjectCardProps {
  subject: Subject;
  onPress: () => void;
}

export function SubjectCard({ subject, onPress }: SubjectCardProps) {
  const getDefaultThumbnail = () => {
    // Default calculus/math image when thumbnail is null
    return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm"
    >
      {/* Thumbnail with Color Overlay */}
      <View className="relative">
        <Image 
          source={{ uri: subject.thumbnail?.secure_url || getDefaultThumbnail() }} 
          className="w-full h-32"
          resizeMode="cover"
        />
        <View 
          className="absolute inset-0 opacity-20"
          style={{ backgroundColor: subject.color }}
        />
        
        {/* Subject Code Badge */}
        <View className="absolute top-3 left-3">
          <View className="px-2 py-1 rounded-lg bg-white/90 dark:bg-black/90">
            <Text className="text-xs font-bold text-gray-900 dark:text-gray-100">
              {subject.code}
            </Text>
          </View>
        </View>

      </View>

      {/* Content */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={1}>
          {capitalizeWords(subject.name)}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3" numberOfLines={2}>
          {capitalizeWords(subject.description)}
        </Text>

        {/* Classes Taking Subject */}
        {subject.classesTakingSubject.length > 0 && (
          <View className="mb-3">
            <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Classes ({subject.classesTakingSubject.length})
            </Text>
            <View className="flex-row flex-wrap gap-1">
              {subject.classesTakingSubject.slice(0, 2).map((cls, index) => (
                <View 
                  key={cls.id}
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${subject.color}20` }}
                >
                  <Text 
                    className="text-xs font-medium"
                    style={{ color: subject.color }}
                  >
                    {capitalizeWords(cls.name)}
                  </Text>
                </View>
              ))}
              {subject.classesTakingSubject.length > 2 && (
                <View className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    +{subject.classesTakingSubject.length - 2}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Content Stats */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {subject.contentCounts.totalVideos}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="document-outline" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {subject.contentCounts.totalMaterials}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="library-outline" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {subject.contentCounts.totalAssignments}
              </Text>
            </View>
          </View>
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(subject.updatedAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default SubjectCard;
