import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ManagedClass } from './types';

interface FilterChipsProps {
  classes: ManagedClass[];
  selectedClassId?: string;
  onClassFilter: (classId: string | undefined) => void;
}

export function FilterChips({ classes, selectedClassId, onClassFilter }: FilterChipsProps) {
  if (classes.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Filter by Class
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {/* All Classes Option */}
        <TouchableOpacity
          onPress={() => onClassFilter(undefined)}
          activeOpacity={0.7}
          className={`px-4 py-2 rounded-full border ${
            !selectedClassId
              ? 'bg-blue-500 border-blue-500'
              : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600'
          }`}
        >
          <Text 
            className={`text-sm font-medium ${
              !selectedClassId
                ? 'text-white'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            All Classes
          </Text>
        </TouchableOpacity>

        {/* Class Options */}
        {classes.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            onPress={() => onClassFilter(cls.id)}
            activeOpacity={0.7}
            className={`px-4 py-2 rounded-full border ${
              selectedClassId === cls.id
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white dark:bg-black border-gray-300 dark:border-gray-600'
            }`}
          >
            <Text 
              className={`text-sm font-medium ${
                selectedClassId === cls.id
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {cls.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default FilterChips;
