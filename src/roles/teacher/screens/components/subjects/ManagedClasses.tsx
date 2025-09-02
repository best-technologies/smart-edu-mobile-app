import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ManagedClass } from './types';
import { capitalizeWords } from '@/utils/textFormatter';

interface ManagedClassesProps {
  classes: ManagedClass[];
  onClassPress?: (cls: ManagedClass) => void;
}

export function ManagedClasses({ classes, onClassPress }: ManagedClassesProps) {
  if (classes.length === 0) {
    return null;
  }

  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-3 mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <View className="h-6 w-6 items-center justify-center rounded-lg bg-blue-500">
            <Ionicons name="people" size={14} color="white" />
          </View>
          <Text className="text-base font-bold text-gray-900 dark:text-gray-100">
            Managed Classes
          </Text>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {classes.length} class{classes.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2">
        {classes.map((cls) => (
          <TouchableOpacity
            key={cls.id}
            onPress={() => onClassPress?.(cls)}
            activeOpacity={0.7}
            className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <Text className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {capitalizeWords(cls.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default ManagedClasses;
