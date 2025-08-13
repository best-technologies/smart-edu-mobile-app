import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboardScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header with Logout */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Student Dashboard
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Welcome to your learning portal
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="p-2 rounded-full bg-red-50 dark:bg-red-900/20"
            accessibilityLabel="Logout"
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-6 py-6 pb-24"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center justify-center py-12">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Student Dashboard
          </Text>
          <Text className="text-gray-600 dark:text-gray-300 text-center">
            Your student dashboard content will appear here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
