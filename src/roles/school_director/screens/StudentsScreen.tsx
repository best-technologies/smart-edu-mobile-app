import { ScrollView, Text, View } from 'react-native';
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
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <EmptyState title="No data available" subtitle="Unable to load students data." />
      </View>
    );
  }

  const handlePageChange = (page: number) => {
    // TODO: Implement pagination logic
    console.log('Navigate to page:', page);
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black" contentContainerClassName="px-4 pb-12 pt-6">
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
  );
}
