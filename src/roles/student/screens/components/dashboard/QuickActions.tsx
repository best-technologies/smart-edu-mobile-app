import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Quick Actions
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-1"
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={action.onPress}
            activeOpacity={0.8}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 items-center min-w-[100px]"
          >
            <View 
              className="w-12 h-12 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: `${action.color}20` }}
            >
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
