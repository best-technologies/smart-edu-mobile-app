import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockRecentActivity } from '../../mock/parentMockData';

interface RecentActivityProps {
  onViewAll?: () => void;
}

export default function RecentActivity({ onViewAll }: RecentActivityProps) {
  const getActivityIcon = (icon: string) => {
    return icon as keyof typeof Ionicons.glyphMap;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recent Activity
        </Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-indigo-600 dark:text-indigo-400 font-medium">
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {mockRecentActivity.slice(0, 5).map((activity, index) => (
          <View
            key={activity.id}
            className={`p-4 ${
              index < mockRecentActivity.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
            }`}
          >
            <View className="flex-row items-start">
              {/* Icon */}
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${activity.color}20` }}
              >
                <Ionicons
                  name={getActivityIcon(activity.icon)}
                  size={20}
                  color={activity.color}
                />
              </View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      {activity.childName} • {activity.description}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(activity.date)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

