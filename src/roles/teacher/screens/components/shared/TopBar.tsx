import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function TopBar() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
            <Text className="text-white font-bold text-sm">JD</Text>
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Welcome back, Professor
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          activeOpacity={0.7}
          className="relative"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <Ionicons name="notifications-outline" size={20} color="#6B7280" />
          </View>
          <View className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full items-center justify-center">
            <Text className="text-xs text-white font-bold">3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default TopBar;
