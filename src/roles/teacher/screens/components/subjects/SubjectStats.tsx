import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SubjectStatsProps {
  stats: {
    totalSubjects: number;
    totalVideos: number;
    totalStudents: number;
    totalMaterials: number;
  };
}

export function SubjectStats({ stats }: SubjectStatsProps) {
  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Subject Overview
      </Text>
      
      <View className="flex-row gap-3">
        <View className="flex-1 items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 mb-2">
            <Ionicons name="book-outline" size={18} color="currentColor" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.totalSubjects}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">Subjects</Text>
        </View>

        <View className="flex-1 items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 mb-2">
            <Ionicons name="play-circle-outline" size={18} color="currentColor" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.totalVideos}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">Videos</Text>
        </View>

        <View className="flex-1 items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 mb-2">
            <Ionicons name="people-outline" size={18} color="currentColor" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.totalStudents}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">Students</Text>
        </View>

        <View className="flex-1 items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 mb-2">
            <Ionicons name="document-outline" size={18} color="currentColor" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.totalMaterials}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">Materials</Text>
        </View>
      </View>
    </View>
  );
}

export default SubjectStats;
