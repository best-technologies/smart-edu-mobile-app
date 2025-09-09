import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  comingUpOn: string;
  createdAt: string;
}

interface RecentNotificationsProps {
  notifications: Notification[];
  pendingAssessments?: number;
}

export default function RecentNotifications({ notifications = [], pendingAssessments }: RecentNotificationsProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Past due';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return 'school-outline';
      case 'assignment':
        return 'document-text-outline';
      case 'meeting':
        return 'people-outline';
      case 'event':
        return 'calendar-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'exam':
        return '#EF4444';
      case 'assignment':
        return '#F59E0B';
      case 'meeting':
        return '#3B82F6';
      case 'event':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  if (!notifications || notifications.length === 0) {
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
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Recent Notifications
          </Text>
          {pendingAssessments && pendingAssessments > 0 && (
            <View className="px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
              <Text className="text-xs font-medium text-orange-700 dark:text-orange-300">
                {pendingAssessments} Pending
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          onPress={() => console.log('View All Notifications')}
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
        {notifications?.map((notification) => (
          <View
            key={notification.id}
            className="w-72 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4"
          >
            {/* Header with Icon and Date */}
            <View className="flex-row items-start justify-between mb-3">
              <View 
                className="h-8 w-8 rounded-lg items-center justify-center"
                style={{ backgroundColor: `${getNotificationColor(notification.type)}15` }}
              >
                <Ionicons 
                  name={getNotificationIcon(notification.type)} 
                  size={16} 
                  color={getNotificationColor(notification.type)} 
                />
              </View>
              <View className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                <Text className="text-xs text-gray-600 dark:text-gray-300">
                  {formatDate(notification.comingUpOn)}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {notification.title}
            </Text>
            
            {/* Description */}
            <Text className="text-sm text-gray-600 dark:text-gray-300 leading-5 mb-3">
              {notification.description}
            </Text>

            {/* Coming Up Info */}
            {notification.comingUpOn && (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {(() => {
                    try {
                      const date = new Date(notification.comingUpOn);
                      if (isNaN(date.getTime())) return 'Invalid date';
                      return date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      });
                    } catch (error) {
                      return 'Invalid date';
                    }
                  })()}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
