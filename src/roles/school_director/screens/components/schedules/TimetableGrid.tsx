import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleItem, TimeSlot } from '@/services/api/directorService';

interface TimetableGridProps {
  selectedClass: string;
  timeSlots: TimeSlot[];
  schedule: {
    MONDAY: ScheduleItem[];
    TUESDAY: ScheduleItem[];
    WEDNESDAY: ScheduleItem[];
    THURSDAY: ScheduleItem[];
    FRIDAY: ScheduleItem[];
  };
}

export function TimetableGrid({ 
  selectedClass, 
  timeSlots, 
  schedule
}: TimetableGridProps) {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  // Use useMemo to calculate dimensions only when needed
  const { cellWidth, cellHeight } = useMemo(() => {
    // Use a try-catch to handle any potential navigation context issues
    try {
      const { width } = Dimensions.get('window');
      return {
        cellWidth: Math.max(120, (width - 80) / 4),
        cellHeight: 100
      };
    } catch (error) {
      console.error('Error calculating dimensions:', error);
      return { cellWidth: 120, cellHeight: 100 };
    }
  }, []);

  const getScheduleItemForTimeSlot = (day: string, timeSlotId: string): ScheduleItem | null => {
    const daySchedule = schedule[day as keyof typeof schedule];
    if (!daySchedule) return null;
    
    return daySchedule.find(item => item.timeSlotId === timeSlotId) || null;
  };

  const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const formatTime = (time: string) => {
    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <View className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      {/* Header */}
      <View className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <Text className="text-xl font-bold text-center">
          {selectedClass.toUpperCase()} Timetable
        </Text>
        <Text className="text-center mt-1 font-medium">
          Weekly Schedule Overview
        </Text>
      </View>

      {/* Legend */}
      <View className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Legend
        </Text>
        <View className="flex-row flex-wrap gap-4">
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded border-2 border-dashed border-gray-400 dark:border-gray-500" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Empty Period
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-4 h-4 rounded bg-green-200 dark:bg-green-600 border-2 border-green-300 dark:border-green-500" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Scheduled Class
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Ionicons name="cafe-outline" size={16} color="#9ca3af" />
            <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              Break Time
            </Text>
          </View>
        </View>
      </View>



      {/* Timetable Grid */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="bg-white dark:bg-gray-900"
      >
        <View>
          {/* Time Slots Header */}
          <View className="flex-row border-b border-gray-200 dark:border-gray-700">
            <View className="w-24 h-16 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 items-center justify-center">
              <Ionicons name="time-outline" size={20} color="#6b7280" />
            </View>
            {timeSlots.map((timeSlot) => (
              <View 
                key={timeSlot.id} 
                className="h-16 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 items-center justify-center px-2"
                style={{ width: cellWidth }}
              >
                <Text className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center">
                  {timeSlot.label.toUpperCase()}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
                  {formatTime(timeSlot.startTime)}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-500 text-center">
                  {formatTime(timeSlot.endTime)}
                </Text>
              </View>
            ))}
          </View>

          {/* Days and Periods */}
          {days.map((day) => (
            <View key={day} className="flex-row border-b border-gray-200 dark:border-gray-700">
              {/* Day Name */}
              <View className="w-24 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 items-center justify-center py-4">
                <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 text-center">
                  {formatDayName(day)}
                </Text>
              </View>

              {/* Periods for this day */}
              {timeSlots.map((timeSlot) => {
                const scheduleItem = getScheduleItemForTimeSlot(day, timeSlot.id);
                return (
                  <View 
                    key={timeSlot.id} 
                    className="border-r border-gray-200 dark:border-gray-700"
                    style={{ width: cellWidth, height: cellHeight }}
                  >
                    {scheduleItem && scheduleItem.subject ? (
                      <TouchableOpacity 
                        activeOpacity={0.8}
                        className="h-full p-3"
                        style={{
                          backgroundColor: scheduleItem.subject.color + '15',
                          borderLeftWidth: 4,
                          borderLeftColor: scheduleItem.subject.color,
                        }}
                        onPress={() => console.log('Edit period:', scheduleItem)}
                      >
                        <Text className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={1}>
                          {scheduleItem.subject.name}
                        </Text>
                        <Text className="text-xs text-gray-600 dark:text-gray-300 mb-1" numberOfLines={1}>
                          {scheduleItem.subject.code}
                        </Text>
                        {scheduleItem.teacher && (
                          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1" numberOfLines={1}>
                            {scheduleItem.teacher.name}
                          </Text>
                        )}
                        {scheduleItem.room && (
                          <View className="flex-row items-center mt-1">
                            <Ionicons name="location-outline" size={12} color="#6b7280" />
                            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1" numberOfLines={1}>
                              {scheduleItem.room}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity 
                        activeOpacity={0.7}
                        className="h-full p-3 items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600"
                        onPress={() => console.log('Add period for:', day, timeSlot.label)}
                      >
                        {timeSlot.label === 'break' ? (
                          <View className="items-center">
                            <Ionicons name="cafe-outline" size={20} color="#9ca3af" />
                            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                              Break
                            </Text>
                          </View>
                        ) : (
                          <View className="items-center">
                            <Ionicons name="add-circle-outline" size={20} color="#9ca3af" />
                            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">
                              Add Class
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default TimetableGrid;
