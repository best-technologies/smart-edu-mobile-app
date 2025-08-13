import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScheduleItem as ScheduleItemType } from '@/services/api/directorService';
import ScheduleItem from './ScheduleItem';

interface DayScheduleProps {
  day: string;
  schedule: ScheduleItemType[];
  isToday?: boolean;
  timeSlots?: Array<{ id: string; startTime: string; endTime: string; label: string; order: number }>;
}

export function DaySchedule({ day, schedule, isToday = false, timeSlots = [] }: DayScheduleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDay = (dayName: string) => {
    return dayName.charAt(0) + dayName.slice(1).toLowerCase();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Create a map of schedule items by timeSlotId for easy lookup
  const scheduleMap = new Map();
  schedule.forEach(item => {
    scheduleMap.set(item.timeSlotId, item);
  });

  // Get all time slots for this day, or use provided timeSlots if schedule is empty
  const dayTimeSlots = schedule.length > 0 ? schedule : timeSlots;

  return (
    <View className={`rounded-xl border ${
      isToday 
        ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    } overflow-hidden`}>
      {/* Day Header - Always Clickable */}
      <TouchableOpacity 
        onPress={toggleExpanded}
        activeOpacity={0.7}
        className="p-4 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Text className={`text-lg font-bold ${
            isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'
          }`}>
            {formatDay(day)}
            {isToday && (
              <Text className="text-sm font-normal text-blue-500 dark:text-blue-300 ml-2">
                (Today)
              </Text>
            )}
          </Text>
          {schedule.length > 0 && (
            <View className="ml-3 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                {schedule.filter(item => item.subject).length} periods
              </Text>
            </View>
          )}
        </View>
        
        <View className="flex-row items-center">
          {schedule.length === 0 && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mr-2">
              No schedule
            </Text>
          )}
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={isToday ? "#3b82f6" : "#6b7280"} 
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isExpanded && (
        <View className="px-4 pb-4">
          {dayTimeSlots.length > 0 ? (
            <View className="space-y-3">
              {dayTimeSlots.map((item, index) => {
                // If we have actual schedule data, use it
                if (schedule.length > 0) {
                  const scheduleItem = item as ScheduleItemType;
                  return (
                    <ScheduleItem 
                      key={`${day}-${scheduleItem.timeSlotId}-${index}`} 
                      item={scheduleItem} 
                      isToday={isToday}
                    />
                  );
                } else {
                  // If no schedule data, show empty time slots
                  const timeSlot = item as { id: string; startTime: string; endTime: string; label: string; order: number };
                  return (
                    <View 
                      key={`${day}-empty-${timeSlot.id}-${index}`}
                      className={`p-3 rounded-lg border-2 border-dashed ${
                        isToday 
                          ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                      }`}
                    >
                      <Text className={`text-xs font-medium ${
                        isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {timeSlot.label}
                      </Text>
                      <Text className={`text-xs ${
                        isToday ? 'text-blue-500 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {timeSlot.startTime} - {timeSlot.endTime}
                      </Text>
                      <Text className={`text-xs ${
                        isToday ? 'text-blue-400 dark:text-blue-200' : 'text-gray-300 dark:text-gray-600'
                      }`}>
                        No class scheduled
                      </Text>
                    </View>
                  );
                }
              })}
            </View>
          ) : (
            <View className="py-8 items-center">
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                No time slots configured
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default DaySchedule;
