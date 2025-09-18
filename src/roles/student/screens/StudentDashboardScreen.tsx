import { ScrollView, View, RefreshControl, TouchableOpacity, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TopBar from './components/shared/TopBar';
import { 
  QuickActions, 
  SubjectsEnrolled, 
  ClassSchedule, 
  RecentNotifications 
} from './components/dashboard';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { CenteredLoader } from '@/components';
import { useState } from 'react';

export default function StudentDashboardScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useAuth();
  
  const { data: dashboardData, isLoading, error, refetch } = useStudentDashboard();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  if (isLoading && !dashboardData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <CenteredLoader visible={true} />
      </SafeAreaView>
    );
  }

  // Show basic UI even when API fails
  const showFallbackUI = error || !dashboardData;

  const quickActions = [
    {
      id: 'ai-assistance',
      title: 'AI Assistance',
      icon: 'sparkles' as const,
      color: '#8B5CF6',
      onPress: () => navigation.navigate('AIChatMain'),
      isAnimated: true,
    },
    {
      id: '1',
      title: 'Assessments',
      icon: 'document-text-outline' as const,
      color: '#3B82F6',
      onPress: () => navigation.navigate('Assessments'),
    },
    {
      id: '2',
      title: 'Results',
      icon: 'stats-chart-outline' as const,
      color: '#F59E0B',
      onPress: () => navigation.navigate('Results'),
    },
    {
      id: '3',
      title: 'Subjects',
      icon: 'book-outline' as const,
      color: '#8B5CF6',
      onPress: () => navigation.navigate('Subjects'),
    },
    {
      id: '4',
      title: 'Schedules',
      icon: 'calendar-outline' as const,
      color: '#EC4899',
      onPress: () => navigation.navigate('Schedules'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* TopBar with fallback data */}
      <TopBar 
        name={showFallbackUI ? "Student" : dashboardData.general_info.student.name}
        email={showFallbackUI ? "student@school.com" : dashboardData.general_info.student.email}
        displayPicture={showFallbackUI ? null : dashboardData.general_info.student.display_picture?.secure_url || null}
        classInfo={showFallbackUI ? {
          name: "Class Loading...",
          teacher: "Teacher Loading..."
        } : {
          name: dashboardData.general_info.student_class.name,
          teacher: dashboardData.general_info.class_teacher.name
        }}
        academicSession={showFallbackUI ? {
          year: "2024-2025",
          term: "Term 1"
        } : {
          year: dashboardData.general_info.current_session.academic_year,
          term: dashboardData.general_info.current_session.term
        }}
        onNotificationPress={() => console.log('Notifications pressed')}
      />
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-6 py-6 pb-32"
        showsVerticalScrollIndicator={false}
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
        {/* Error Banner */}
        {showFallbackUI && (
          <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-red-800 dark:text-red-200 font-semibold text-sm mb-1">
                  Connection Issue
                </Text>
                <Text className="text-red-600 dark:text-red-300 text-xs">
                  Some features may not be available. Check your connection and try again.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => refetch()}
                className="bg-red-500 px-3 py-2 rounded-md ml-3"
              >
                <Text className="text-white text-xs font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Actions Section - Always show */}
        <QuickActions actions={quickActions} />
        
        {/* Subjects Enrolled - Show with fallback data */}
        <SubjectsEnrolled 
          subjects={showFallbackUI ? [] : dashboardData.subjects_enrolled} 
          totalSubjects={showFallbackUI ? 0 : dashboardData.stats.total_subjects}
        />
        
        {/* Class Schedule - Show with fallback data */}
        <ClassSchedule classSchedule={showFallbackUI ? {
          today: { day: 'Today', schedule: [] },
          tomorrow: { day: 'Tomorrow', schedule: [] },
          day_after_tomorrow: { day: 'Day After', schedule: [] }
        } : dashboardData.class_schedule} />
        
        {/* Recent Notifications - Show with fallback data */}
        <RecentNotifications 
          notifications={showFallbackUI ? [] : dashboardData.notifications}
          pendingAssessments={showFallbackUI ? 0 : dashboardData.stats.pending_assessments}
        />

        {/* Logout Button - Always show at bottom */}
        {/* <View className="mt-8 mb-4">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 px-6 py-4 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
