import { ScrollView, View, RefreshControl, TouchableOpacity, Text } from 'react-native';
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
import { mockStudentDashboardData } from '@/mock/student';
import { useState } from 'react';

export default function StudentDashboardScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  
  // Using mock data for now
  const dashboardData = mockStudentDashboardData.data;

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const quickActions = [
    {
      id: '1',
      title: 'Assessments',
      icon: 'document-text-outline' as const,
      color: '#3B82F6',
      onPress: () => console.log('Assessments'),
    },
    {
      id: '2',
      title: 'Results',
      icon: 'stats-chart-outline' as const,
      color: '#F59E0B',
      onPress: () => console.log('Results'),
    },
    {
      id: '3',
      title: 'Subjects',
      icon: 'book-outline' as const,
      color: '#8B5CF6',
      onPress: () => console.log('Subjects'),
    },
    {
      id: '4',
      title: 'Schedules',
      icon: 'calendar-outline' as const,
      color: '#EC4899',
      onPress: () => console.log('Schedules'),
    },
    {
      id: '5',
      title: 'Tasks',
      icon: 'list-outline' as const,
      color: '#EF4444',
      onPress: () => console.log('Tasks'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar 
        name={dashboardData.general_info.student.name}
        email={dashboardData.general_info.student.email}
        displayPicture={dashboardData.general_info.student.display_picture}
        classInfo={{
          name: dashboardData.general_info.student_class.name,
          teacher: dashboardData.general_info.class_teacher.name
        }}
        academicSession={{
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
        {/* Quick Actions Section */}
        <QuickActions actions={quickActions} />
        
        {/* Subjects Enrolled */}
        <SubjectsEnrolled 
          subjects={dashboardData.subjects_enrolled} 
          totalSubjects={dashboardData.stats.total_subjects}
        />
        
        {/* Class Schedule */}
        <ClassSchedule classSchedule={dashboardData.class_schedule} />
        
        {/* Recent Notifications */}
        <RecentNotifications 
          notifications={dashboardData.notifications}
          pendingAssessments={dashboardData.stats.pending_assessments}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
