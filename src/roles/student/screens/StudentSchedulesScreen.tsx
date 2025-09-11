import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import StudentTimetableGrid from './components/schedules/StudentTimetableGrid';
import { StudentSchedulesData, TimeSlot, ScheduleItem } from '@/services/types/apiTypes';

export default function StudentSchedulesScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch schedules data using React Query
  const {
    data: schedulesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['studentSchedules'],
    queryFn: () => ApiService.student.getSchedules(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } catch (error) {
      console.error('Error refreshing schedule data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  // Transform API data for the timetable component
  const timeSlots: TimeSlot[] = schedulesData?.data?.timetable_data?.timeSlots || [];
  const schedule = schedulesData?.data?.timetable_data?.schedule || {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: [],
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <View className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Loading Schedule...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text className="text-lg text-gray-600 dark:text-gray-400 text-center mb-4">
            Failed to load schedule
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Class Schedule
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {schedulesData?.data?.studentClass?.name || 'Your Class'}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={24} color="#6b7280" />
            </View>
          </View>
        </View>

        {/* Timetable Grid */}
        <View className="p-6">
          <StudentTimetableGrid
            studentClass={schedulesData?.data?.studentClass?.name || 'Your Class'}
            timeSlots={timeSlots}
            schedule={schedule}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}