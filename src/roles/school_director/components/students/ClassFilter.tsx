import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AvailableClass } from '@/services/api/directorService';

interface ClassFilterProps {
  availableClasses: AvailableClass[];
  selectedClassId: string | null;
  onClassSelect: (classId: string | null) => void;
}

export function ClassFilter({ 
  availableClasses, 
  selectedClassId, 
  onClassSelect 
}: ClassFilterProps) {
  const formatClassName = (name: string) => {
    return name.toUpperCase().replace('JSS', 'JSS ').replace('SS', 'SS ');
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Filter by Class:
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        className="flex-row"
      >
        {/* All Classes Option */}
        <TouchableOpacity
          onPress={() => onClassSelect(null)}
          activeOpacity={0.7}
          className={`mr-3 px-4 py-2 rounded-full border ${
            selectedClassId === null
              ? 'bg-blue-600 border-blue-600'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}
        >
          <Text className={`text-sm font-medium ${
            selectedClassId === null
              ? 'text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            All
          </Text>
        </TouchableOpacity>

        {/* Individual Class Options */}
        {availableClasses.map((classItem) => (
          <TouchableOpacity
            key={classItem.id}
            onPress={() => onClassSelect(classItem.id)}
            activeOpacity={0.7}
            className={`mr-3 px-4 py-2 rounded-full border ${
              selectedClassId === classItem.id
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <View className="flex-row items-center gap-2">
              <Text className={`text-sm font-medium ${
                selectedClassId === classItem.id
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {formatClassName(classItem.name)}
              </Text>
              <View className={`px-2 py-0.5 rounded-full ${
                selectedClassId === classItem.id
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}>
                <Text className={`text-xs font-medium ${
                  selectedClassId === classItem.id
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {classItem.student_count}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default ClassFilter;
