import { ScrollView, View, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TopBar from './components/shared/TopBar';
import QuickActions from './components/dashboard/QuickActions';
import ManagedClasses from './components/dashboard/ManagedClasses';
import SubjectsTeaching from './components/dashboard/SubjectsTeaching';
import RecentNotifications from './components/dashboard/RecentNotifications';
import UpcomingClasses from './components/dashboard/UpcomingClasses';
import FloatingActionButton from './components/shared/FloatingActionButton';
import CenteredLoader from '@/components/CenteredLoader';
import { useTeacherDashboard, useRefreshTeacherDashboard } from '@/hooks/useDirectorDashboard';
import { DayClasses } from '@/mock/teacher';
import { formatClassName, formatSubjectName, formatRoomName, formatTime, formatDay } from '@/utils/textFormatter';

export default function TeacherDashboardScreen() {
  const navigation = useNavigation<any>();
  
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
  const managedClasses = dashboardData && dashboardData.managed_class ? [dashboardData.managed_class] : [];
  
  const subjectsTeaching = dashboardData ? dashboardData.subjects_teaching : [];
  
  // Use mock notifications if no notifications exist
  const notifications = dashboardData ? (
    dashboardData.recent_notifications.length > 0 
      ? dashboardData.recent_notifications 
      : [
          {
            id: 'mock-1',
            title: 'Staff Meeting',
            description: 'Monthly staff meeting scheduled for tomorrow at 10:00 AM in the conference room.',
            type: 'all',
            comingUpOn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'mock-2',
            title: 'Exam Schedule',
            description: 'Mid-term exams starting next week. Please prepare your students accordingly.',
            type: 'teachers',
            comingUpOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'mock-3',
            title: 'Parent-Teacher Conference',
            description: 'Annual parent-teacher conference scheduled for next month.',
            type: 'teachers',
            comingUpOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ]
  ) : [];

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
      id: 'ai-assistance',
      title: 'AI Assistance',
      icon: 'sparkles',
      color: '#8B5CF6',
      onPress: () => console.log('AI Assistance'),
      isAnimated: true,
    },
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
      title: 'Assessment',
      icon: 'clipboard-outline',
      color: '#EF4444',
      onPress: () => navigation.navigate('AssessmentsList'),
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
            
            <ManagedClasses classes={managedClasses} />
            
            <SubjectsTeaching subjects={subjectsTeaching} />
            
            <UpcomingClasses classes={upcomingClasses} />
            
            <RecentNotifications notifications={notifications} />
            
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
