import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ScheduleClass } from '@/services/api/directorService';

interface ClassSelectorProps {
  classes: ScheduleClass[];
  selectedClassId: string | null;
  onClassSelect: (classId: string) => void;
}

export function ClassSelector({ 
  classes, 
  selectedClassId, 
  onClassSelect 
}: ClassSelectorProps) {
  const formatClassName = (name: string) => {
    return name.toUpperCase().replace('JSS', 'JSS ').replace('SS', 'SS ');
  };

  if (classes.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Select Class:
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        className="flex-row"
      >
        {classes.map((classItem) => (
          <TouchableOpacity
            key={classItem.classId}
            onPress={() => onClassSelect(classItem.classId)}
            activeOpacity={0.7}
            className={`mr-3 px-4 py-2 rounded-full border ${
              selectedClassId === classItem.classId
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <Text className={`text-sm font-medium ${
              selectedClassId === classItem.classId
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {formatClassName(classItem.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default ClassSelector;
