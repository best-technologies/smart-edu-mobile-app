import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubjectStats as SubjectStatsType } from './types';

interface SubjectStatsProps {
  stats: SubjectStatsType;
  academicSession?: {
    academic_year: string;
    term: string;
  };
}

export function SubjectStats({ stats, academicSession }: SubjectStatsProps) {
  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Subject Overview
          </Text>
          {academicSession && (
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {academicSession.academic_year} • {academicSession.term.charAt(0).toUpperCase() + academicSession.term.slice(1)} Term
            </Text>
          )}
        </View>
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
          <Ionicons name="book" size={20} color="white" />
        </View>
      </View>
      
      <View className="flex-row gap-3">
        <View className="flex-1 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3">
          <View className="flex-row items-center justify-between mb-1">
            <View className="h-6 w-6 items-center justify-center rounded-lg bg-purple-500">
              <Ionicons name="book-outline" size={14} color="white" />
            </View>
            <Ionicons name="trending-up" size={14} color="#8b5cf6" />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.totalSubjects}</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Subjects</Text>
        </View>

        <View className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3">
          <View className="flex-row items-center justify-between mb-1">
            <View className="h-6 w-6 items-center justify-center rounded-lg bg-blue-500">
              <Ionicons name="play-circle-outline" size={14} color="white" />
            </View>
            <Ionicons name="trending-up" size={14} color="#3b82f6" />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.totalVideos}</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Videos</Text>
        </View>

        <View className="flex-1 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-3">
          <View className="flex-row items-center justify-between mb-1">
            <View className="h-6 w-6 items-center justify-center rounded-lg bg-green-500">
              <Ionicons name="document-outline" size={14} color="white" />
            </View>
            <Ionicons name="trending-up" size={14} color="#10b981" />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.totalMaterials}</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Materials</Text>
        </View>

        <View className="flex-1 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-3">
          <View className="flex-row items-center justify-between mb-1">
            <View className="h-6 w-6 items-center justify-center rounded-lg bg-orange-500">
              <Ionicons name="people-outline" size={14} color="white" />
            </View>
            <Ionicons name="trending-up" size={14} color="#f97316" />
          </View>
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.totalClasses}</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">Classes</Text>
        </View>
      </View>
    </View>
  );
}

export default SubjectStats;
