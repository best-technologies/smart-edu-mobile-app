import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudentsBasicDetails } from '@/mock';

interface StudentStatsProps {
  stats: StudentsBasicDetails;
}

export function StudentStats({ stats }: StudentStatsProps) {
  const inactiveStudents = stats.totalStudents - stats.activeStudents;

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerClassName="gap-3 pr-4"
    >
      {/* Total Students */}
      <View className="w-32 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3">
        <View className="items-center">
          <View className="h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 mb-2">
            <Ionicons name="school-outline" size={16} color="currentColor" />
          </View>
          <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-1">Total</Text>
          <Text className="text-lg font-extrabold text-gray-900 dark:text-gray-100 text-center">{stats.totalStudents}</Text>
        </View>
      </View>

      {/* Active Students */}
      <View className="w-32 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3">
        <View className="items-center">
          <View className="h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 mb-2">
            <Ionicons name="checkmark-circle-outline" size={16} color="currentColor" />
          </View>
          <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-1">Active</Text>
          <Text className="text-lg font-extrabold text-gray-900 dark:text-gray-100 text-center">{stats.activeStudents}</Text>
        </View>
      </View>

      {/* Inactive Students */}
      <View className="w-32 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3">
        <View className="items-center">
          <View className="h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 mb-2">
            <Ionicons name="close-circle-outline" size={16} color="currentColor" />
          </View>
          <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-1">Inactive</Text>
          <Text className="text-lg font-extrabold text-gray-900 dark:text-gray-100 text-center">{inactiveStudents}</Text>
        </View>
      </View>

      {/* Total Classes */}
      <View className="w-32 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3">
        <View className="items-center">
          <View className="h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 mb-2">
            <Ionicons name="people-outline" size={16} color="currentColor" />
          </View>
          <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-1">Classes</Text>
          <Text className="text-lg font-extrabold text-gray-900 dark:text-gray-100 text-center">{stats.totalClasses}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default StudentStats;