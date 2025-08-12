import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cellWidth = (width - 48) / 8; // 8 columns (1 for days + 7 time slots)
const cellHeight = 80;

interface TimetableGridProps {
  selectedClass: string;
  days: string[];
  timeSlots: string[];
  selectedDay: string;
  onDayChange: (day: string) => void;
  timetableData?: Record<string, Record<string, ClassPeriod | null>>;
}

interface ClassPeriod {
  subject: string;
  teacher: string;
  color: string;
}

export function TimetableGrid({ 
  selectedClass, 
  days, 
  timeSlots, 
  selectedDay, 
  onDayChange,
  timetableData = {}
}: TimetableGridProps) {

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
          Weekly Timetable - {selectedClass}
        </Text>
      </View>

      {/* Day Selection Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200 dark:border-gray-700"
      >
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => onDayChange(day)}
            activeOpacity={0.7}
            className={`px-4 py-3 border-b-2 ${
              selectedDay === day
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedDay === day
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Timetable Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Time Slots Header */}
          <View className="flex-row">
            <View className="w-20 h-12 bg-gray-100 dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 items-center justify-center">
              <Ionicons name="time-outline" size={16} color="#6b7280" />
            </View>
            {timeSlots.map((time, index) => (
              <View 
                key={time} 
                className="w-24 h-12 bg-gray-100 dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 items-center justify-center"
                style={{ width: cellWidth }}
              >
                <Text className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
                  {time}
                </Text>
              </View>
            ))}
          </View>

          {/* Days and Periods */}
          {days.map((day) => (
            <View key={day} className="flex-row">
              {/* Day Name */}
              <View className="w-20 bg-gray-50 dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 items-center justify-center">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {day.slice(0, 3)}
                </Text>
              </View>

              {/* Periods for this day */}
              {timeSlots.map((time) => {
                const period = timetableData[day][time];
                return (
                  <View 
                    key={time} 
                    className="border-r border-b border-gray-200 dark:border-gray-700"
                    style={{ width: cellWidth, height: cellHeight }}
                  >
                    {period ? (
                      <TouchableOpacity 
                        activeOpacity={0.8}
                        className={`h-full p-2 ${getColorClasses(period.color)}`}
                        onPress={() => console.log('Edit period:', period)}
                      >
                        <Text className={`text-xs font-semibold ${getTextColor(period.color)}`}>
                          {period.subject}
                        </Text>
                        <Text className={`text-xs ${getTextColor(period.color)} opacity-80`}>
                          {period.teacher}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        activeOpacity={0.7}
                        className="h-full p-2 items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600"
                        onPress={() => console.log('Add period for:', day, time)}
                      >
                        <Ionicons name="add" size={16} color="#9ca3af" />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Legend
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {['purple', 'green', 'blue', 'orange', 'red'].map((color) => (
            <View key={color} className="flex-row items-center gap-1">
              <View className={`w-3 h-3 rounded-full ${getColorClasses(color)}`} />
              <Text className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {color}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default TimetableGrid;
