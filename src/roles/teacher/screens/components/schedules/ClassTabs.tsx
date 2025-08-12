import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

interface ClassTabsProps {
  classes: string[];
  selectedClass: string;
  onClassChange: (classId: string) => void;
}

export function ClassTabs({ classes, selectedClass, onClassChange }: ClassTabsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-6 py-4 gap-2"
    >
      {classes.map((classId) => (
        <TouchableOpacity
          key={classId}
          onPress={() => onClassChange(classId)}
          activeOpacity={0.7}
          className={`px-4 py-2 rounded-lg border ${
            selectedClass === classId
              ? 'bg-purple-600 border-purple-600'
              : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              selectedClass === classId
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {classId}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default ClassTabs;
