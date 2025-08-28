import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notification, NotificationCardProps } from './types';
import { getNotificationIcon, getNotificationColor, formatNotificationDate } from './utils';

export function NotificationCard({ notification, onPress, variant = 'dashboard' }: NotificationCardProps) {
  const icon = getNotificationIcon(notification.type);
  const color = getNotificationColor(notification.type);
  const timeLabel = formatNotificationDate(notification.comingUpOn);

  if (variant === 'dashboard') {
    return (
      <TouchableOpacity
        onPress={() => onPress(notification)}
        activeOpacity={0.7}
        className="min-w-[280px] px-4 py-3 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800"
      >
        <View className="flex-row items-start gap-3">
          <View 
            className="h-10 w-10 items-center justify-center rounded-full mt-1"
            style={{ backgroundColor: `${color}15` }}
          >
            <Ionicons name={icon as any} size={20} color={color} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 flex-1">
                {notification.title}
              </Text>
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${color}15` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: color }}
                >
                  {timeLabel}
                </Text>
              </View>
            </View>
            <Text 
              className="text-sm text-gray-500 dark:text-gray-400 leading-5"
              numberOfLines={variant === 'dashboard' ? 2 : 3}
              ellipsizeMode="tail"
            >
              {notification.description}
            </Text>
            <View className="flex-row items-center gap-2 mt-2">
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${color}10` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: color }}
                >
                  {notification.type}
                </Text>
              </View>
              <Text className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // List variant
  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
      className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 p-4"
    >
      <View className="flex-row items-start gap-3">
        <View 
          className="h-12 w-12 items-center justify-center rounded-full mt-1"
          style={{ backgroundColor: `${color}15` }}
        >
          <Ionicons name={icon as any} size={24} color={color} />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 flex-1">
              {notification.title}
            </Text>
            <View 
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: `${color}15` }}
            >
              <Text 
                className="text-xs font-medium"
                style={{ color: color }}
              >
                {timeLabel}
              </Text>
            </View>
          </View>
          <Text className="text-sm text-gray-500 dark:text-gray-400 leading-5 mb-3">
            {notification.description}
          </Text>
          <View className="flex-row items-center justify-between">
            <View 
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: `${color}10` }}
            >
              <Text 
                className="text-xs font-medium"
                style={{ color: color }}
              >
                {notification.type}
              </Text>
            </View>
            <Text className="text-xs text-gray-400">
              {new Date(notification.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
}

export default NotificationCard;
