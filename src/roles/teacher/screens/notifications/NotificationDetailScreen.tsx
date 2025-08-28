import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBar from '../components/shared/TopBar';
import { Notification } from '../components/notifications/types';
import { getNotificationIcon, getNotificationColor, formatFullDate, getTimeLabel } from '../components/notifications/utils';

export default function NotificationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const notification = (route.params as any)?.notification as Notification;

  if (!notification) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <TopBar />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Notification Not Found
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            The notification you're looking for doesn't exist.
          </Text>
          <TouchableOpacity 
            onPress={() => (navigation as any).goBack()}
            className="px-6 py-3 bg-blue-600 rounded-xl flex-row items-center gap-2"
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const icon = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);
  const timeLabel = getTimeLabel(notification.comingUpOn);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <View className="flex-row items-center gap-4 mb-4">
            <View 
              className="h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${color}15` }}
            >
              <Ionicons name={icon as any} size={28} color={color} />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                {notification.title}
              </Text>
              <View 
                className="px-3 py-1 rounded-full self-start"
                style={{ backgroundColor: `${color}15` }}
              >
                <Text 
                  className="text-sm font-medium"
                  style={{ color: color }}
                >
                  {notification.type}
                </Text>
              </View>
            </View>
          </View>

          <View 
            className="px-4 py-2 rounded-xl"
            style={{ backgroundColor: `${color}10` }}
          >
            <Text 
              className="text-base font-semibold text-center"
              style={{ color: color }}
            >
              {timeLabel}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Description
          </Text>
          <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
            {notification.description}
          </Text>
        </View>

        {/* Details */}
        <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Details
          </Text>
          
          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Event Date</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatFullDate(notification.comingUpOn)}
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Created</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatFullDate(notification.createdAt)}
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Last Updated</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatFullDate(notification.updatedAt)}
              </Text>
            </View>
            
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Notification ID</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {notification.id}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
