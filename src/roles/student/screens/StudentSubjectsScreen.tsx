import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import TopBar from './components/shared/TopBar';
import { 
  SubjectCard, 
  SubjectStats, 
  SearchBar, 
  EmptyState, 
  Pagination,
  Subject,
  AcademicSession,
  SubjectPagination
} from './components/subjects';
import type { SubjectStats as SubjectStatsType } from './components/subjects/types';
import { useStudentSubjects } from '@/hooks/useStudentSubjects';
import { CenteredLoader } from '@/components';

export default function StudentSubjectsScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: subjectsData, isLoading, error, refetch } = useStudentSubjects();
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);

  // Update filtered subjects when data changes
  React.useEffect(() => {
    if (subjectsData?.subjects) {
      if (searchQuery.trim() === '') {
        setFilteredSubjects(subjectsData.subjects);
      } else {
        const filtered = subjectsData.subjects.filter(subject =>
          subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subject.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSubjects(filtered);
      }
    }
  }, [subjectsData, searchQuery]);

  const handleSubjectPress = (subject: Subject) => {
    // TODO: Navigate to subject details (read-only)
    console.log('View subject:', subject.name);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !subjectsData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <CenteredLoader visible={true} />
      </SafeAreaView>
    );
  }

  if (error || !subjectsData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-lg text-gray-600 dark:text-gray-400 text-center mb-4">
            Failed to load subjects data
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const hasData = filteredSubjects.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="pb-32"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header Section */}
        <View className="bg-white dark:bg-black px-6 py-3 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                My Subjects
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                View your enrolled subjects and learning materials
              </Text>
            </View>
          </View>
        </View>

        {hasData ? (
          <>
            {/* Stats Section */}
            <View className="px-6 py-3">
              <SubjectStats 
                stats={subjectsData.stats} 
                academicSession={subjectsData.academicSession}
              />
            </View>

            {/* Search Section */}
            <View className="px-6 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search subjects by name, code, or description..."
                className="mb-3"
              />
            </View>

            {/* Subjects Count */}
            <View className="px-6 py-1 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {filteredSubjects.length} Subject{filteredSubjects.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </Text>
            </View>

            {/* Subjects Grid */}
            <View className="px-6 py-3">
              <View className="flex-row flex-wrap gap-3">
                {filteredSubjects.map((subject: Subject) => (
                  <View key={subject.id} style={{ width: '48%' }}>
                    <SubjectCard 
                      subject={subject}
                      onPress={() => handleSubjectPress(subject)}
                    />
                  </View>
                ))}
              </View>

              {/* Pagination */}
              {subjectsData.pagination && subjectsData.pagination.totalPages > 1 && (
                <View className="mt-6">
                  <Pagination 
                    pagination={subjectsData.pagination}
                    onPageChange={(page) => console.log('Page changed:', page)}
                  />
                </View>
              )}
            </View>
          </>
        ) : (
          <View className="px-6 py-8">
            <EmptyState 
              type="subjects" 
              message={
                searchQuery
                  ? `No subjects found matching "${searchQuery}".`
                  : undefined
              }
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
