import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDirectorTeachers, useRefreshDirectorTeachers } from '@/hooks/useDirectorTeachers';
import TopBar from './components/shared/TopBar';
import Section from './components/shared/Section';
import TeacherStats from './components/teachers/TeacherStats';
import TeacherCard from './components/teachers/TeacherCard';
import EmptyState from './components/shared/EmptyState';
import { CenteredLoader } from '@/components';

export default function TeachersScreen() {
  const { data, isLoading, error, refetch } = useDirectorTeachers();
  const refreshMutation = useRefreshDirectorTeachers();

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  // Show loading state
  if (isLoading && !data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <CenteredLoader visible={true} text="Loading teachers..." />
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load teachers
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            {error.message || 'Something went wrong while loading teachers data.'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshMutation.isPending}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
      <TopBar
        name="director"
        email="director@school.edu"
        schoolId="sch_1234567890"
        avatarUri={undefined}
      />

      <Section title="Overview">
        {data?.basic_details && <TeacherStats stats={data.basic_details} />}
      </Section>

      <Section title="All Teachers">
        {data?.teachers && data.teachers.length > 0 ? (
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
