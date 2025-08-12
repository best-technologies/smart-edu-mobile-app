import { ScrollView, Text, View } from 'react-native';
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
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <EmptyState title="No data available" subtitle="Unable to load subjects data." />
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
  );
}
