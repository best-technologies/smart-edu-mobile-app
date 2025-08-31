import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  type: 'subjects' | 'classes';
  message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'subjects':
        return 'book-outline';
      case 'classes':
        return 'people-outline';
      default:
        return 'alert-circle-outline';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'subjects':
        return 'No Subjects Assigned';
      case 'classes':
        return 'No Classes Managed';
      default:
        return 'No Data Available';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'subjects':
        return message || 'You haven\'t been assigned to any subjects yet. Contact your school director to get started.';
      case 'classes':
        return message || 'You\'re not managing any classes at the moment. Your assigned classes will appear here.';
      default:
        return message || 'There\'s no data to display at the moment.';
    }
  };

  return (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <View className="items-center">
        {/* Icon */}
        <View className="h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Ionicons name={getIcon()} size={32} color="#9ca3af" />
        </View>

        {/* Title */}
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
          {getTitle()}
        </Text>

        {/* Description */}
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center leading-5 max-w-sm">
          {getDescription()}
        </Text>

        {/* Action Hint */}
        {type === 'subjects' && (
          <View className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <View className="flex-row items-center gap-3">
              <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                <Ionicons name="information-circle" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Need Help?
                </Text>
                <Text className="text-xs text-blue-700 dark:text-blue-300">
                  Contact your school director to get assigned to subjects and start creating content.
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

export default EmptyState;
