import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudentsBasicDetails } from '@/mock';

interface StudentStatsProps {
  stats: StudentsBasicDetails;
}

export function StudentStats({ stats }: StudentStatsProps) {
  const inactiveStudents = stats.totalStudents - stats.activeStudents;

  return (
    <View className="gap-3">
      {/* Main Stats Row */}
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                <Ionicons name="school-outline" size={18} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Total Students</Text>
                <Text className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{stats.totalStudents}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Ionicons name="checkmark-circle-outline" size={18} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Active</Text>
                <Text className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{stats.activeStudents}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Secondary Stats Row */}
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-xl bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                <Ionicons name="close-circle-outline" size={16} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Inactive</Text>
                <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{inactiveStudents}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-8 w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                <Ionicons name="people-outline" size={16} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Classes</Text>
                <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{stats.totalClasses}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default StudentStats;
