import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuickAction } from '@/mock';

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Quick Actions
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerClassName="gap-6"
      >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          onPress={action.onPress}
          activeOpacity={0.7}
          className="items-center"
        >
          <View 
            className="h-16 w-16 items-center justify-center rounded-full mb-2"
            style={{ backgroundColor: `${action.color}15` }}
          >
            <Ionicons name={action.icon as any} size={24} color={action.color} />
          </View>
          <Text 
            className="text-sm font-semibold text-center text-gray-900 dark:text-gray-100"
          >
            {action.title}
          </Text>
        </TouchableOpacity>
      ))}
      </ScrollView>
    </View>
  );
}

export default QuickActions;
