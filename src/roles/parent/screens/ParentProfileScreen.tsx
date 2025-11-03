import { ScrollView, View, Text, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TopBar } from '../components/shared';

export default function ParentProfileScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="p-6">
          {/* User Info Card */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <View className="items-center">
              <View className="w-24 h-24 rounded-full bg-indigo-600 items-center justify-center mb-4 shadow-lg">
                <Text className="text-4xl font-bold text-white">
                  {user?.first_name?.[0]}{user?.last_name?.[0]}
                </Text>
              </View>
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {user?.first_name} {user?.last_name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user?.email}
              </Text>
              <View className="mt-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                  Parent
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Placeholder */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
            <View className="p-4 border-b border-gray-100 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Settings
              </Text>
            </View>
            <View className="p-4">
              <Text className="text-gray-500 dark:text-gray-400 text-center py-8">
                Profile settings coming soon
              </Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800 flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text className="text-red-600 dark:text-red-400 font-semibold ml-2">
              Logout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}

