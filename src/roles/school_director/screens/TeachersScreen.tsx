import { ScrollView, Text, View } from 'react-native';
import { teachersDashboardData } from '@/mock';
import TopBar from './components/shared/TopBar';
import Section from './components/shared/Section';
import TeacherStats from './components/teachers/TeacherStats';
import TeacherCard from './components/teachers/TeacherCard';
import EmptyState from './components/shared/EmptyState';

export default function TeachersScreen() {
  const data = teachersDashboardData.data;

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <EmptyState title="No data available" subtitle="Unable to load teachers data." />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black" contentContainerClassName="px-4 pb-12 pt-6">
      <TopBar
        name="director"
        email="director@school.edu"
        schoolId="sch_1234567890"
        avatarUri={undefined}
      />

      <Section title="Overview">
        <TeacherStats stats={data.basic_details} />
      </Section>

      <Section title="All Teachers">
        {data.teachers.length > 0 ? (
          <View className="gap-4">
            {data.teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </View>
        ) : (
          <EmptyState title="No teachers found" subtitle="No teachers are currently registered." />
        )}
      </Section>
    </ScrollView>
  );
}
