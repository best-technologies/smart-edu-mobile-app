import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SchoolDirectorStackParamList } from '../../SchoolDirectorNavigator';
import { useDirectorTeachers, useRefreshDirectorTeachers } from '@/hooks/useDirectorTeachers';
import Section from '../../components/shared/Section';
import TeacherStats from '../../components/teachers/TeacherStats';
import TeacherCard from '../../components/teachers/TeacherCard';
import EmptyState from '../../components/shared/EmptyState';
import { CenteredLoader } from '@/components';

export default function TeachersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SchoolDirectorStackParamList>>();
  const { data, isLoading, error, refetch } = useDirectorTeachers();
  const refreshMutation = useRefreshDirectorTeachers();

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const handleViewAllTeachers = () => {
    navigation.navigate('AllTeachersList');
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
        contentContainerClassName="px-4 pb-24 pt-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshMutation.isPending}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        <Section title="Overview">
          {data?.basic_details && <TeacherStats stats={data.basic_details} />}
        </Section>

        <Section 
          title="All Teachers"
          action={
            <TouchableOpacity
              onPress={handleViewAllTeachers}
              className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium mr-1">
                View All
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#2563eb" />
            </TouchableOpacity>
          }
        >
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
