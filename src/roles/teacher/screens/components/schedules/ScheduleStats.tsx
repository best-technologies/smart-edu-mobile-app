import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScheduleStatsProps {
  selectedClass: string;
  totalPeriods: number;
  totalTeachers: number;
  totalSubjects: number;
}

export function ScheduleStats({ selectedClass, totalPeriods, totalTeachers, totalSubjects }: ScheduleStatsProps) {
  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {selectedClass} Schedule Overview
      </Text>
      
      <View className="flex-row gap-3">
        <View className="flex-1 items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 mb-2">
            <Ionicons name="time-outline" size={18} color="currentColor" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{totalPeriods}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">Periods</Text>
        </View>

        <View className="flex-1 items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 mb-2">
            <Ionicons name="people-outline" size={18} color="currentColor" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{totalTeachers}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">Teachers</Text>
        </View>

        <View className="flex-1 items-center">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 mb-2">
            <Ionicons name="book-outline" size={18} color="currentColor" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{totalSubjects}</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 text-center">Subjects</Text>
        </View>
      </View>
    </View>
  );
}

export default ScheduleStats;
