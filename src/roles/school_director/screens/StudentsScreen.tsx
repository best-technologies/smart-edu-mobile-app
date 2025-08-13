import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { studentsDashboardData } from '@/mock';
import TopBar from './components/shared/TopBar';
import Section from './components/shared/Section';
import StudentStats from './components/students/StudentStats';
import StudentCard from './components/students/StudentCard';
import StudentPagination from './components/students/StudentPagination';
import EmptyState from './components/shared/EmptyState';

export default function StudentsScreen() {
  const data = studentsDashboardData.data;

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <EmptyState title="No data available" subtitle="Unable to load students data." />
        </View>
      </SafeAreaView>
    );
  }

  const handlePageChange = (page: number) => {
    // TODO: Implement pagination logic
    console.log('Navigate to page:', page);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-4 pb-24 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <TopBar
          name="director"
          email="director@school.edu"
          schoolId="sch_1234567890"
          avatarUri={undefined}
        />

      <Section title="Overview">
        <StudentStats stats={data.basic_details} />
      </Section>

      <Section title="All Students">
        {data.students.length > 0 ? (
          <View className="gap-4">
            {data.students.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
            
            {/* Pagination */}
            <StudentPagination 
              pagination={data.pagination} 
              onPageChange={handlePageChange}
            />
          </View>
        ) : (
          <EmptyState title="No students found" subtitle="No students are currently registered." />
        )}
      </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
