import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockUpcomingEvents } from '../../mock/parentMockData';

interface UpcomingEventsProps {
  onViewAll?: () => void;
}

export default function UpcomingEvents({ onViewAll }: UpcomingEventsProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return 'clipboard' as keyof typeof Ionicons.glyphMap;
      case 'meeting':
        return 'people' as keyof typeof Ionicons.glyphMap;
      case 'event':
        return 'calendar' as keyof typeof Ionicons.glyphMap;
      case 'deadline':
        return 'time' as keyof typeof Ionicons.glyphMap;
      default:
        return 'calendar-outline' as keyof typeof Ionicons.glyphMap;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'exam':
        return { bg: '#ef444420', text: '#ef4444' };
      case 'meeting':
        return { bg: '#3b82f620', text: '#3b82f6' };
      case 'event':
        return { bg: '#8b5cf620', text: '#8b5cf6' };
      case 'deadline':
        return { bg: '#f59e0b20', text: '#f59e0b' };
      default:
        return { bg: '#6b728020', text: '#6b7280' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Upcoming Events
        </Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-indigo-600 dark:text-indigo-400 font-medium">
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="space-y-3">
        {mockUpcomingEvents.slice(0, 3).map((event) => {
          const colors = getEventColor(event.type);
          return (
            <TouchableOpacity
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex-row items-start"
              activeOpacity={0.7}
            >
              {/* Date Badge */}
              <View className="mr-3">
                <View className="w-12 h-12 rounded-lg items-center justify-center" style={{ backgroundColor: colors.bg }}>
                  <Text className="text-xs font-semibold" style={{ color: colors.text }}>
                    {formatDate(event.date).split(' ')[0]}
                  </Text>
                  <Text className="text-base font-bold" style={{ color: colors.text }}>
                    {formatDate(event.date).split(' ')[1]}
                  </Text>
                </View>
              </View>

              {/* Event Details */}
              <View className="flex-1">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {event.title}
                    </Text>
                    <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {event.description}
                    </Text>
                    {event.childName && (
                      <Text className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                        {event.childName}
                      </Text>
                    )}
                  </View>
                  <View className="w-6 h-6 rounded-full items-center justify-center" style={{ backgroundColor: colors.bg }}>
                    <Ionicons name={getEventIcon(event.type)} size={14} color={colors.text} />
                  </View>
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {event.time}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

