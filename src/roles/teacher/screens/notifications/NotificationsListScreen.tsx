import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TopBar from '../components/shared/TopBar';
import NotificationCard from '../components/notifications/NotificationCard';
import { Notification } from '../components/notifications/types';

export default function NotificationsListScreen() {
  const navigation = useNavigation();

  // Mock data for now - this would come from an API call
  const notifications: Notification[] = [
    {
      id: 'mock-1',
      title: 'Staff Meeting',
      description: 'Monthly staff meeting scheduled for tomorrow at 10:00 AM in the conference room.',
      type: 'all',
      comingUpOn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      title: 'Exam Schedule',
      description: 'Mid-term exams starting next week. Please prepare your students accordingly.',
      type: 'teachers',
      comingUpOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-3',
      title: 'Parent-Teacher Conference',
      description: 'Annual parent-teacher conference scheduled for next month.',
      type: 'teachers',
      comingUpOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-4',
      title: 'School Holiday',
      description: 'School will be closed for the upcoming holiday break.',
      type: 'all',
      comingUpOn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-5',
      title: 'Professional Development',
      description: 'Mandatory professional development session for all teachers.',
      type: 'teachers',
      comingUpOn: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const handleNotificationPress = (notification: Notification) => {
    (navigation as any).navigate('NotificationDetail', { notification });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Notifications
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Notifications List */}
        <View className="space-y-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={handleNotificationPress}
              variant="list"
            />
          ))}
        </View>

        {/* Empty State */}
        {notifications.length === 0 && (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
              No Notifications
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
              You're all caught up! No notifications at the moment.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
