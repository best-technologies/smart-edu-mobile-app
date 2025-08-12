import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-6">
      <Ionicons name="planet-outline" size={28} color="#9ca3af" />
      <Text className="text-gray-500 dark:text-gray-400 font-medium mt-2">{title}</Text>
      {subtitle ? <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1">{subtitle}</Text> : null}
    </View>
  );
}

export default EmptyState;


