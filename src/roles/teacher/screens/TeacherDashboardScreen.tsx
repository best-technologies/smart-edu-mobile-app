import { ScrollView, View, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from './components/shared/TopBar';
import QuickActions from './components/dashboard/QuickActions';
import QuickStats from './components/dashboard/QuickStats';
import UpcomingClasses from './components/dashboard/UpcomingClasses';
import FloatingActionButton from './components/shared/FloatingActionButton';
import CenteredLoader from '@/components/CenteredLoader';
import { useTeacherDashboard, useRefreshTeacherDashboard } from '@/hooks/useDirectorDashboard';
import { QuickStat, DayClasses } from '@/mock/teacher';
import { formatClassName, formatSubjectName, formatRoomName, formatTime, formatDay } from '@/utils/textFormatter';

export default function TeacherDashboardScreen() {
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useTeacherDashboard();

  const refreshMutation = useRefreshTeacherDashboard();

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync();
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    }
  };

  // Transform API data to match component expectations
  const quickStats: QuickStat[] = dashboardData ? [
    {
      id: 'students',
      title: 'Total Students',
      value: dashboardData.managed_class.students.total.toString(),
      icon: 'people-outline',
      color: '#8B5CF6',
      trend: 'up' as const,
    },
    {
      id: 'male-students',
      title: 'Male Students',
      value: dashboardData.managed_class.students.males.toString(),
      icon: 'male-outline',
      color: '#3B82F6',
      trend: 'neutral' as const,
    },
    {
      id: 'female-students',
      title: 'Female Students',
      value: dashboardData.managed_class.students.females.toString(),
      icon: 'female-outline',
      color: '#EC4899',
      trend: 'neutral' as const,
    },
    {
      id: 'managed-class',
      title: 'Managed Class',
      value: formatClassName(dashboardData.managed_class.name),
      icon: 'school-outline',
      color: '#10B981',
      trend: 'neutral' as const,
    },
  ] : [];

  const upcomingClasses: DayClasses[] = dashboardData ? [
    {
      day: `${formatDay(dashboardData.class_schedules.today.day)}'s Classes`,
      icon: 'time-outline',
      color: '#10B981',
      classes: dashboardData.class_schedules.today.schedule.map(item => ({
        id: `${item.subject.id}-${item.time.from}`,
        subject: formatSubjectName(item.subject.name),
        classCode: formatClassName(item.class.name),
        startTime: formatTime(item.time.from),
        endTime: formatTime(item.time.to),
        room: formatRoomName(item.room),
        color: item.subject.color,
      })),
    },
    {
      day: `${formatDay(dashboardData.class_schedules.tomorrow.day)}'s Classes`,
      icon: 'time-outline',
      color: '#F59E0B',
      classes: dashboardData.class_schedules.tomorrow.schedule.map(item => ({
        id: `${item.subject.id}-${item.time.from}`,
        subject: formatSubjectName(item.subject.name),
        classCode: formatClassName(item.class.name),
        startTime: formatTime(item.time.from),
        endTime: formatTime(item.time.to),
        room: formatRoomName(item.room),
        color: item.subject.color,
      })),
    },
    {
      day: `${formatDay(dashboardData.class_schedules.day_after_tomorrow.day)}'s Classes`,
      icon: 'time-outline',
      color: '#8B5CF6',
      classes: dashboardData.class_schedules.day_after_tomorrow.schedule.map(item => ({
        id: `${item.subject.id}-${item.time.from}`,
        subject: formatSubjectName(item.subject.name),
        classCode: formatClassName(item.class.name),
        startTime: formatTime(item.time.from),
        endTime: formatTime(item.time.to),
        room: formatRoomName(item.room),
        color: item.subject.color,
      })),
    },
  ] : [];

  const quickActions = [
    {
      id: '1',
      title: 'Take Attendance',
      icon: 'checkmark-circle-outline',
      color: '#10B981',
      onPress: () => console.log('Take Attendance'),
    },
    {
      id: '2',
      title: 'Grade Assignments',
      icon: 'document-text-outline',
      color: '#3B82F6',
      onPress: () => console.log('Grade Assignments'),
    },
    {
      id: '3',
      title: 'Schedule Class',
      icon: 'calendar-outline',
      color: '#8B5CF6',
      onPress: () => console.log('Schedule Class'),
    },
    {
      id: '4',
      title: 'View Reports',
      icon: 'bar-chart-outline',
      color: '#F59E0B',
      onPress: () => console.log('View Reports'),
    },
  ];

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <TopBar />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error loading dashboard
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            Unable to load dashboard data. Please try again.
          </Text>
          <TouchableOpacity 
            onPress={() => refetch()}
            className="px-6 py-3 bg-blue-600 rounded-xl flex-row items-center gap-2"
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#ffffff" />
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-6 py-6 pb-32"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshMutation.isPending}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {isLoading ? (
          <CenteredLoader visible={true} text="Loading dashboard..." />
        ) : dashboardData ? (
          <>
            <QuickActions actions={quickActions} />
            
            <QuickStats stats={quickStats} />
            
            <UpcomingClasses classes={upcomingClasses} />
          </>
        ) : (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No data available
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Dashboard data is not available at the moment.
            </Text>
          </View>
        )}
      </ScrollView>
      
      <FloatingActionButton />
    </SafeAreaView>
  );
}
