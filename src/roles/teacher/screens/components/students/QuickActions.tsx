import React from 'react';
import { TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    {
      id: 'attendance',
      label: 'Mark Attendance',
      icon: 'checkmark-circle-outline',
      color: 'bg-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      id: 'assignment',
      label: 'Create Assignment',
      icon: 'document-text-outline',
      color: 'bg-green-500',
      iconColor: 'text-green-500',
    },
    {
      id: 'message',
      label: 'Message Class',
      icon: 'chatbubble-outline',
      color: 'bg-orange-500',
      iconColor: 'text-orange-500',
    },
    {
      id: 'grades',
      label: 'Enter Grades',
      icon: 'bar-chart-outline',
      color: 'bg-purple-500',
      iconColor: 'text-purple-500',
    },
    {
      id: 'export',
      label: 'Export Data',
      icon: 'download-outline',
      color: 'bg-gray-500',
      iconColor: 'text-gray-500',
    },
  ];

  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Quick Actions
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3"
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => onAction(action.id)}
            activeOpacity={0.7}
            className="items-center min-w-[100px]"
          >
            <View className={`h-12 w-12 rounded-xl items-center justify-center mb-2 ${action.color}`}>
              <Ionicons name={action.icon as any} size={24} color="white" />
            </View>
            <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default QuickActions;
