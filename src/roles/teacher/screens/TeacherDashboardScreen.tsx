import { ScrollView, View } from 'react-native';
import { teacherDashboardData } from '@/mock';
import TopBar from './components/shared/TopBar';
import QuickActions from './components/dashboard/QuickActions';
import QuickStats from './components/dashboard/QuickStats';
import UpcomingClasses from './components/dashboard/UpcomingClasses';
import FloatingActionButton from './components/shared/FloatingActionButton';

export default function TeacherDashboardScreen() {
  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <TopBar />
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-6 py-6 pb-24"
        showsVerticalScrollIndicator={false}
      >
        <QuickActions actions={teacherDashboardData.quickActions} />
        
        <QuickStats stats={teacherDashboardData.quickStats} />
        
        <UpcomingClasses classes={teacherDashboardData.upcomingClasses} />
      </ScrollView>
      
      <FloatingActionButton />
    </View>
  );
}
