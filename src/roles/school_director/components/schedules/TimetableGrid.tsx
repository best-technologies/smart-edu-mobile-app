import React, { useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { ScheduleItem, TimeSlot } from '@/services/api/directorService';
import CreateScheduleModal from './CreateScheduleModal';

// Predefined color palette for subjects
const SUBJECT_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F43F5E', // Rose
];

// Function to get a consistent color for a subject
const getSubjectColor = (subjectName: string): string => {
  if (!subjectName) return SUBJECT_COLORS[0];
  
  // Create a simple hash from the subject name
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    const char = subjectName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color
  const colorIndex = Math.abs(hash) % SUBJECT_COLORS.length;
  return SUBJECT_COLORS[colorIndex];
};

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
  onScheduleCreated?: () => void;
}

export function TimetableGrid({ 
  selectedClass, 
  timeSlots, 
  schedule,
  onScheduleCreated
}: TimetableGridProps) {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
  // Reset modal state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset modal states when screen is focused
      setIsModalVisible(false);
      setSelectedDay('');
      setSelectedTimeSlot('');
    }, [])
  );

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

  // Modal handlers
  const handleOpenModal = (day: string, timeSlotId: string) => {
    setSelectedDay(day);
    setSelectedTimeSlot(timeSlotId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleModalSuccess = () => {
    // This will be called when a schedule is successfully created
    // The parent component should handle refreshing the data
    console.log('Schedule created successfully');
    if (onScheduleCreated) {
      // Add a small delay to ensure modal is fully closed
      setTimeout(() => {
        try {
          onScheduleCreated();
        } catch (error) {
          console.error('Error in onScheduleCreated callback:', error);
        }
      }, 100);
    }
  };

  const getScheduleItemForTimeSlot = (day: string, timeSlotId: string): ScheduleItem | null => {
    const daySchedule = schedule[day as keyof typeof schedule];
    if (!daySchedule) return null;
    
    return daySchedule.find(item => item.timeSlotId === timeSlotId) || null;
  };

  const formatDayName = (day: string) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const formatClassName = (className: string) => {
    return className.toUpperCase().replace('JSS', 'JSS ').replace('SS', 'SS ');
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
          {formatClassName(selectedClass)} Timetable
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
                          backgroundColor: getSubjectColor(scheduleItem.subject.name) + '15',
                          borderLeftWidth: 4,
                          borderLeftColor: getSubjectColor(scheduleItem.subject.name),
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
                        onPress={() => handleOpenModal(day, timeSlot.id)}
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

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        selectedDay={selectedDay}
        selectedTimeSlot={selectedTimeSlot}
        selectedClass={selectedClass}
        timeSlots={timeSlots}
      />
    </View>
  );
}

export default TimetableGrid;
