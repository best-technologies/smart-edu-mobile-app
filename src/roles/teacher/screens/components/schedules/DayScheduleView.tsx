import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ClassPeriod {
  subject: string;
  teacher: string;
  color: string;
}

interface DayScheduleViewProps {
  day: string;
  timeSlots: string[];
  periods: Record<string, ClassPeriod | null>;
  onPeriodPress: (time: string, period: ClassPeriod | null) => void;
}

export function DayScheduleView({ day, timeSlots, periods, onPeriodPress }: DayScheduleViewProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'purple': return 'bg-purple-100 border-purple-300 dark:bg-purple-900/40 dark:border-purple-600';
      case 'green': return 'bg-green-100 border-green-300 dark:bg-green-900/40 dark:border-green-600';
      case 'blue': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/40 dark:border-blue-600';
      case 'orange': return 'bg-orange-100 border-orange-300 dark:bg-orange-900/40 dark:border-orange-600';
      case 'red': return 'bg-red-100 border-red-300 dark:bg-red-900/40 dark:border-red-600';
      default: return 'bg-gray-100 border-gray-300 dark:bg-gray-900/40 dark:border-gray-600';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'purple': return 'text-purple-800 dark:text-purple-200';
      case 'green': return 'text-green-800 dark:text-green-200';
      case 'blue': return 'text-blue-800 dark:text-blue-200';
      case 'orange': return 'text-orange-800 dark:text-orange-200';
      case 'red': return 'text-red-800 dark:text-red-200';
      default: return 'text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <View className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {day} Schedule
        </Text>
      </View>

      {/* Periods List */}
      <ScrollView className="max-h-96">
        {timeSlots.map((time) => {
          const period = periods[time];
          return (
            <TouchableOpacity
              key={time}
              onPress={() => onPeriodPress(time, period)}
              activeOpacity={0.8}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              <View className="flex-row items-center p-4">
                {/* Time */}
                <View className="w-20 items-center">
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {time.split(' - ')[0]}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-500">
                    {time.split(' - ')[1]}
                  </Text>
                </View>

                {/* Period Info */}
                <View className="flex-1 ml-4">
                  {period ? (
                    <View className={`p-3 rounded-lg border ${getColorClasses(period.color)}`}>
                      <Text className={`font-semibold ${getTextColor(period.color)}`}>
                        {period.subject}
                      </Text>
                      <Text className={`text-sm ${getTextColor(period.color)} opacity-80`}>
                        {period.teacher}
                      </Text>
                    </View>
                  ) : (
                    <View className="p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 items-center">
                      <Ionicons name="add" size={16} color="#9ca3af" />
                      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Add Period
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default DayScheduleView;
