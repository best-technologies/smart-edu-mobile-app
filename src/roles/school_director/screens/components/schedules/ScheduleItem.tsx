import React from 'react';
import { Text, View } from 'react-native';
import { ScheduleItem as ScheduleItemType } from '@/services/api/directorService';

interface ScheduleItemProps {
  item: ScheduleItemType;
  isToday?: boolean;
}

export function ScheduleItem({ item, isToday = false }: ScheduleItemProps) {
  if (!item.subject) {
    return (
      <View className={`p-3 rounded-lg border-2 border-dashed ${
        isToday 
          ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
      }`}>
        <Text className={`text-xs font-medium ${
          isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {item.label}
        </Text>
        <Text className={`text-xs ${
          isToday ? 'text-blue-500 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'
        }`}>
          Free Period
        </Text>
      </View>
    );
  }

  return (
    <View 
      className={`p-3 rounded-lg border ${
        isToday 
          ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
      style={{
        borderLeftWidth: 4,
        borderLeftColor: item.subject.color,
      }}
    >
      <Text className={`text-xs font-medium ${
        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
      }`}>
        {item.label}
      </Text>
      
      <Text className="text-sm font-bold text-gray-900 dark:text-gray-100 mt-1" numberOfLines={1}>
        {item.subject.name}
      </Text>
      
      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1" numberOfLines={1}>
        {item.subject.code}
      </Text>
      
      {item.teacher && (
        <Text className="text-xs text-gray-600 dark:text-gray-300 mt-1" numberOfLines={1}>
          {item.teacher.name}
        </Text>
      )}
      
      {item.room && (
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1" numberOfLines={1}>
          {item.room}
        </Text>
      )}
      
      <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {item.startTime} - {item.endTime}
      </Text>
    </View>
  );
}

export default ScheduleItem;
