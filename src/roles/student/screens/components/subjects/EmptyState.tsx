import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  type: 'subjects';
  message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'subjects':
        return {
          icon: 'book-outline' as const,
          title: 'No Subjects Found',
          subtitle: message || 'You are not enrolled in any subjects yet.',
          description: 'Contact your teacher or administrator to get enrolled in subjects.'
        };
      default:
        return {
          icon: 'help-circle-outline' as const,
          title: 'No Data',
          subtitle: 'No information available at the moment.',
          description: 'Please try again later.'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
      <View className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-4">
        <Ionicons name={content.icon} size={32} color="#9CA3AF" />
      </View>
      
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
        {content.title}
      </Text>
      
      <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-2">
        {content.subtitle}
      </Text>
      
      <Text className="text-xs text-gray-400 dark:text-gray-500 text-center">
        {content.description}
      </Text>
    </View>
  );
}

export default EmptyState;
