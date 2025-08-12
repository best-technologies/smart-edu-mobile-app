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
        contentContainerClassName="gap-3"
      >
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          onPress={action.onPress}
          activeOpacity={0.7}
          className="min-w-[140px] px-4 py-3 rounded-xl border-2 items-center"
          style={{ borderColor: `${action.color}30` }}
        >
          <View 
            className="h-10 w-10 items-center justify-center rounded-lg mb-2"
            style={{ backgroundColor: `${action.color}15` }}
          >
            <Ionicons name={action.icon as any} size={20} color={action.color} />
          </View>
          <Text 
            className="text-sm font-semibold text-center"
            style={{ color: action.color }}
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
