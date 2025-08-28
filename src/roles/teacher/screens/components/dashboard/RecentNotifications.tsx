import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import NotificationCard from '../notifications/NotificationCard';
import { Notification } from '../notifications/types';

interface RecentNotificationsProps {
  notifications: Notification[];
}

export function RecentNotifications({ notifications }: RecentNotificationsProps) {
  const navigation = useNavigation();

  const handleNotificationPress = (notification: Notification) => {
    (navigation as any).navigate('NotificationDetail', { notification });
  };

  const handleViewAllPress = () => {
    (navigation as any).navigate('NotificationsList');
  };

  if (notifications.length === 0) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Recent Notifications
        </Text>
        <View className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-6 items-center">
          <Ionicons name="notifications-off-outline" size={48} color="#9CA3AF" />
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-1">
            No Notifications
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
            You're all caught up! No new notifications at the moment.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Recent Notifications
        </Text>
        <TouchableOpacity 
          onPress={handleViewAllPress}
          activeOpacity={0.7}
          className="flex-row items-center gap-1"
        >
          <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            View All
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#2563EB" />
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerClassName="gap-3"
      >
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onPress={handleNotificationPress}
            variant="dashboard"
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default RecentNotifications;
