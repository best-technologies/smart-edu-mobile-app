import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <EmptyState title="No data available" subtitle="Unable to load teachers data." />
        </View>
      </SafeAreaView>
    );
  }

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
    </SafeAreaView>
  );
}
