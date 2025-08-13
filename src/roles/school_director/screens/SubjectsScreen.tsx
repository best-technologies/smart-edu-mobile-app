import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { subjectsDashboardData } from '@/mock';
import TopBar from './components/shared/TopBar';
import Section from './components/shared/Section';
import SubjectStats from './components/subjects/SubjectStats';
import SubjectCard from './components/subjects/SubjectCard';
import SubjectPagination from './components/subjects/Pagination';
import EmptyState from './components/shared/EmptyState';

export default function SubjectsScreen() {
  const data = subjectsDashboardData.data;

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <EmptyState title="No data available" subtitle="Unable to load subjects data." />
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
        <SubjectStats subjects={data.subjects} />
      </Section>

      <Section title="All Subjects">
        {data.subjects.length > 0 ? (
          <View className="gap-4">
            {data.subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
            
            {/* Pagination */}
            <SubjectPagination 
              pagination={data.pagination} 
              onPageChange={handlePageChange}
            />
          </View>
        ) : (
          <EmptyState title="No subjects found" subtitle="No subjects are currently registered." />
        )}
      </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
