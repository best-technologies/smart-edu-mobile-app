import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DayClasses } from '@/mock';

export function UpcomingClasses({ classes }: { classes: DayClasses[] }) {
  return (
    <View className="mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Class Schedules
        </Text>
        <TouchableOpacity 
          activeOpacity={0.7}
          className="flex-row items-center gap-1"
        >
          <Text className="text-sm font-semibold text-purple-600 dark:text-purple-400">
            View All
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#9333EA" />
        </TouchableOpacity>
      </View>

      {/* Class Cards */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-4"
      >
        {classes.map((dayClass) => (
          <View 
            key={dayClass.day} 
            className="w-80 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4"
          >
            {/* Card Header */}
            <View className="flex-row items-center gap-2 mb-4">
              <View 
                className="h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${dayClass.color}15` }}
              >
                <Ionicons name={dayClass.icon as any} size={16} color={dayClass.color} />
              </View>
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {dayClass.day}
              </Text>
            </View>

            {/* Class List */}
            <View className="gap-3">
              {dayClass.classes.map((classItem) => (
                <View key={classItem.id} className="flex-row items-center">
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {classItem.subject} {classItem.classCode}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {classItem.startTime} - {classItem.endTime} • {classItem.room}
                    </Text>
                  </View>
                  <View 
                    className="h-8 w-1 rounded-full"
                    style={{ backgroundColor: classItem.color }}
                  />
                </View>
              ))}
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

export default UpcomingClasses;
