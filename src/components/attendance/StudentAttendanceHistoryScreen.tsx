import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '@/contexts/ToastContext';
import CenteredLoader from '@/components/CenteredLoader';
import InlineLoader from '@/components/InlineLoader';
import { useStudentAttendanceHistory } from '@/hooks/useStudentAttendanceHistory';

interface Student {
  id: string;
  name: string;
  displayPicture?: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  student_id: string;
  class_name: string;
  class_id: string;
}

interface AttendanceSummary {
  totalSchoolDaysThisMonth: number;
  totalPresentThisMonth: number;
  totalSchoolDaysThisTerm: number;
  totalPresentThisTerm: number;
  lastAbsentDate: string | null;
}

interface AttendanceRecord {
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | 'PARTIAL' | 'HOLIDAY' | 'WEEKEND';
  isExcused: boolean;
  reason?: string;
  markedAt?: string;
  markedBy?: string;
}

export default function StudentAttendanceHistoryScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { student, role } = route.params as { student: Student; role: string };
  const { showSuccess, showError } = useToast();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  // Use the API hook
  const {
    data: attendanceData,
    isLoading,
    error,
    refetch
  } = useStudentAttendanceHistory({
    studentId: student.id,
    year: currentMonth.getFullYear(),
    month: currentMonth.getMonth() + 1, // JavaScript months are 0-based
    enabled: true
  });

  const attendanceSummary = (attendanceData as any)?.data?.summary || null;
  const attendanceRecords = (attendanceData as any)?.data?.records || [];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const navigateMonth = async (direction: 'prev' | 'next') => {
    setIsCalendarLoading(true);
    
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
    // The query will automatically refetch due to the year/month dependency
    setIsCalendarLoading(false);
  };

  const getAttendanceForDate = (date: string): AttendanceRecord | null => {
    return attendanceRecords.find((record: AttendanceRecord) => record.date === date) || null;
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toLocaleDateString('en-CA');
      const todayString = new Date().toLocaleDateString('en-CA');
      days.push({
        day,
        date: dateString,
        isToday: dateString === todayString,
        attendance: getAttendanceForDate(dateString),
      });
    }
    
    return days;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <Ionicons name="checkmark-circle" size={18} color="#10B981" />;
      case 'ABSENT':
        return <Ionicons name="close-circle" size={18} color="#EF4444" />;
      case 'LATE':
        return <Ionicons name="time" size={18} color="#F59E0B" />;
      case 'EXCUSED':
        return <Ionicons name="checkmark-circle-outline" size={18} color="#8B5CF6" />;
      case 'PARTIAL':
        return <Ionicons name="remove-circle" size={18} color="#F59E0B" />;
      case 'HOLIDAY':
        return <Ionicons name="gift" size={18} color="#EC4899" />;
      case 'WEEKEND':
        return <Ionicons name="home" size={18} color="#6B7280" />;
      default:
        return <Ionicons name="help-circle" size={18} color="#9CA3AF" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 dark:bg-green-900/20';
      case 'ABSENT':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'LATE':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'EXCUSED':
        return 'bg-purple-100 dark:bg-purple-900/20';
      case 'PARTIAL':
        return 'bg-orange-100 dark:bg-orange-900/20';
      case 'HOLIDAY':
        return 'bg-pink-100 dark:bg-pink-900/20';
      case 'WEEKEND':
        return 'bg-gray-100 dark:bg-gray-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  // Handle error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load attendance data
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Skeleton loading component
  const SkeletonCard = () => (
    <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
      <View className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
      <View className="flex-row space-x-4">
        <View className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 flex-1 h-20" />
        <View className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 flex-1 h-20" />
        <View className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 flex-1 h-20" />
        <View className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 flex-1 h-20" />
      </View>
    </View>
  );

  const SkeletonLegend = () => (
    <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 mb-4">
      <View className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2" />
      <View className="flex-row space-x-8">
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <View className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded ml-2" />
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <View className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded ml-2" />
        </View>
        <View className="flex-row items-center">
          <View className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <View className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded ml-2" />
        </View>
      </View>
    </View>
  );

  const SkeletonCalendar = () => (
    <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
      <View className="flex-row items-center justify-between mb-4">
        <View className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <View className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        <View className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </View>
      <View className="flex-row mb-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <View key={i} className="flex-1 items-center py-2">
            <View className="w-8 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          </View>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {Array.from({ length: 35 }).map((_, i) => (
          <View key={i} className="w-1/7 p-1">
            <View className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={18} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Attendance History
          </Text>
          <View className="w-8" />
        </View>

        {/* Student Info */}
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center mr-3">
            {student.displayPicture ? (
              <Image
                source={{ uri: student.displayPicture }}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <Ionicons name="person" size={24} color="#6B7280" />
            )}
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {student.name}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {student.student_id} • {student.class_name}
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <ScrollView className="flex-1">
          <View className="p-4">
            <SkeletonCard />
          </View>
          <View className="px-4 pb-3">
            <SkeletonLegend />
          </View>
          <View className="px-4 pb-6">
            <SkeletonCalendar />
          </View>
        </ScrollView>
      ) : (

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {/* Compact Summary Card */}
        <View className="p-4">
          <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Attendance Summary
            </Text>
            
            {/* Scrollable Cards Row */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              className="flex-row"
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {/* School Days This Month Card */}
              <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mr-3 min-w-[140px] items-center">
                <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {attendanceSummary?.totalSchoolDaysThisMonth}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
                  School Days This Month
                </Text>
              </View>
              
              {/* Present This Month Card */}
              <View className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mr-3 min-w-[120px] items-center">
                <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {attendanceSummary?.totalPresentThisMonth}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
                  Present This Month
                </Text>
              </View>
              
              {/* School Days This Term Card */}
              <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mr-3 min-w-[140px] items-center">
                <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {attendanceSummary?.totalSchoolDaysThisTerm}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
                  School Days This Term
                </Text>
              </View>
              
              {/* Present This Term Card */}
              <View className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mr-3 min-w-[120px] items-center">
                <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {attendanceSummary?.totalPresentThisTerm}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
                  Present This Term
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Legend Section */}
        <View className="px-4 pb-3">
          <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
            <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Legend
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              <View className="flex-row space-x-12">
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">Present</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="close-circle" size={18} color="#EF4444" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">Absent</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="time" size={18} color="#F59E0B" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">Late</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="remove-circle" size={18} color="#F59E0B" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">Partial</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="gift" size={18} color="#EC4899" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">Holiday</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="home" size={18} color="#6B7280" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400 ml-2">Weekend</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Calendar Section */}
        <View className="px-4 pb-6">
          <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            {/* Calendar Header */}
            <View className="flex-row items-center justify-between mb-4">
              <TouchableOpacity
                onPress={() => navigateMonth('prev')}
                disabled={isCalendarLoading}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isCalendarLoading 
                    ? 'bg-gray-200 dark:bg-gray-600' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {isCalendarLoading ? (
                  <InlineLoader size="small" />
                ) : (
                  <Ionicons name="chevron-back" size={16} color="#374151" />
                )}
              </TouchableOpacity>
              
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              
              <TouchableOpacity
                onPress={() => navigateMonth('next')}
                disabled={isCalendarLoading}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isCalendarLoading 
                    ? 'bg-gray-200 dark:bg-gray-600' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {isCalendarLoading ? (
                  <InlineLoader size="small" />
                ) : (
                  <Ionicons name="chevron-forward" size={16} color="#374151" />
                )}
              </TouchableOpacity>
            </View>

            {/* Calendar Days */}
            <View className="mb-4 relative">
              {/* Day Headers */}
              <View className="flex-row mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <View key={day} className="flex-1 items-center py-2">
                    <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View>
                {Array.from({ length: Math.ceil(getCalendarDays().length / 7) }, (_, weekIndex) => (
                  <View key={weekIndex} className="flex-row mb-1">
                    {getCalendarDays().slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => (
                      <View key={dayIndex} className="flex-1 p-1">
                        {day ? (
                          <TouchableOpacity
                            className={`h-16 items-center justify-center rounded-lg ${
                              day.isToday 
                                ? 'bg-blue-500 border-2 border-blue-600 shadow-lg' 
                                : day.attendance 
                                  ? getStatusColor(day.attendance.status)
                                  : 'bg-gray-50 dark:bg-gray-800'
                            }`}
                            onPress={() => {
                              if (day.attendance) {
                                Alert.alert(
                                  `${day.date}`,
                                  `Status: ${day.attendance.status}${day.attendance.reason ? `\nReason: ${day.attendance.reason}` : ''}`,
                                  [{ text: 'OK' }]
                                );
                              }
                            }}
                            disabled={isCalendarLoading}
                          >
                            <Text className={`${
                              day.isToday 
                                ? 'text-base font-bold text-white' 
                                : 'text-sm font-semibold'
                            } ${
                              day.attendance 
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              {day.day}
                            </Text>
                            {day.attendance && (
                              <View className="mt-1">
                                {getStatusIcon(day.attendance.status)}
                              </View>
                            )}
                          </TouchableOpacity>
                        ) : (
                          <View className="h-16" />
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>

              {/* Loading Overlay */}
              {isCalendarLoading && (
                <View className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 items-center justify-center rounded-lg">
                  <InlineLoader size="medium" />
                </View>
              )}
            </View>

          </View>
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
