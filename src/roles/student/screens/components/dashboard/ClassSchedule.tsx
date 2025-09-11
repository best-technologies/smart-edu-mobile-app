import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScheduleItem {
  subject: {
    id: string;
    name: string;
    code: string;
    color: string;
  };
  teacher: {
    id: string;
    name: string;
  };
  time: {
    from: string;
    to: string;
    label: string;
  };
  room: string;
}

interface DaySchedule {
  day: string;
  schedule: ScheduleItem[];
}

interface ClassScheduleProps {
  classSchedule: {
    today: DaySchedule;
    tomorrow: DaySchedule;
    day_after_tomorrow: DaySchedule;
  };
}

export default function ClassSchedule({ classSchedule }: ClassScheduleProps) {
  const formatTime = (time: string) => {
    return time;
  };

  // Add null checking for classSchedule
  if (!classSchedule) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          No schedule data available
        </Text>
      </View>
    );
  }

  const daySchedules = [
    {
      day: classSchedule.today?.day || 'Today',
      schedule: classSchedule.today?.schedule || [],
      color: '#10B981',
      icon: 'today-outline' as const,
    },
    {
      day: classSchedule.tomorrow?.day || 'Tomorrow',
      schedule: classSchedule.tomorrow?.schedule || [],
      color: '#F59E0B',
      icon: 'calendar-outline' as const,
    },
    {
      day: classSchedule.day_after_tomorrow?.day || 'Day After Tomorrow',
      schedule: classSchedule.day_after_tomorrow?.schedule || [],
      color: '#8B5CF6',
      icon: 'calendar-outline' as const,
    },
  ];

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Class Schedules
        </Text>
        <TouchableOpacity 
          activeOpacity={0.7}
          className="flex-row items-center gap-1"
          onPress={() => console.log('View Full Schedule')}
        >
          <Text className="text-sm font-semibold text-purple-600 dark:text-purple-400">
            View All
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#9333EA" />
        </TouchableOpacity>
      </View>

      {/* Schedule Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        {daySchedules.map((daySchedule) => (
          <View 
            key={daySchedule.day} 
            className="w-80 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4"
          >
            {/* Card Header */}
            <View className="flex-row items-center gap-2 mb-4">
              <View 
                className="h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${daySchedule.color}15` }}
              >
                <Ionicons name={daySchedule.icon} size={16} color={daySchedule.color} />
              </View>
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {daySchedule.day}
              </Text>
            </View>

            {/* Class List */}
            <View className="gap-3">
              {daySchedule.schedule.length > 0 ? (
                daySchedule.schedule.map((classItem) => (
                  <View key={`${classItem.subject.id}-${classItem.time.from}`} className="flex-row items-center">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {classItem.subject.name} • {classItem.subject.code}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(classItem.time.from)} - {formatTime(classItem.time.to)} • {classItem.room}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">
                        {classItem.teacher.name}
                      </Text>
                    </View>
                    <View 
                      className="h-8 w-1 rounded-full"
                      style={{ backgroundColor: classItem.subject.color }}
                    />
                  </View>
                ))
              ) : (
                <View className="py-4 items-center">
                  <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    No classes scheduled
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Arrows */}
      <View className="flex-row justify-center gap-4 mt-4">
        <TouchableOpacity 
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
        >
          <Ionicons name="chevron-back" size={20} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={0.7}
          className="h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800"
        >
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
