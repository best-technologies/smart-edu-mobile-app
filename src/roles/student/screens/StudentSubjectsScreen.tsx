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
import { mockStudentDashboardData } from '@/mock/student';

export default function StudentSubjectsScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from API
  const mockSubjectsData = {
    subjects: mockStudentDashboardData.data.subjects_enrolled.map(subject => ({
      id: subject.id,
      name: subject.name,
      code: subject.code,
      color: subject.color,
      description: `Learn ${subject.name} with ${subject.teacher.name}`,
      thumbnail: null,
      timetableEntries: [],
      classesTakingSubject: [{
        id: mockStudentDashboardData.data.general_info.student_class.id,
        name: mockStudentDashboardData.data.general_info.student_class.name
      }],
      contentCounts: {
        totalVideos: Math.floor(Math.random() * 20) + 5,
        totalMaterials: Math.floor(Math.random() * 15) + 3,
        totalAssignments: Math.floor(Math.random() * 10) + 2
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    stats: {
      totalSubjects: mockStudentDashboardData.data.subjects_enrolled.length,
      totalVideos: mockStudentDashboardData.data.subjects_enrolled.reduce((acc, sub) => acc + Math.floor(Math.random() * 20) + 5, 0),
      totalMaterials: mockStudentDashboardData.data.subjects_enrolled.reduce((acc, sub) => acc + Math.floor(Math.random() * 15) + 3, 0),
      totalAssignments: mockStudentDashboardData.data.subjects_enrolled.reduce((acc, sub) => acc + Math.floor(Math.random() * 10) + 2, 0)
    },
    academicSession: {
      id: 'session_1',
      academic_year: mockStudentDashboardData.data.general_info.current_session.academic_year,
      term: mockStudentDashboardData.data.general_info.current_session.term
    },
    pagination: {
      page: 1,
      limit: 10,
      total: mockStudentDashboardData.data.subjects_enrolled.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    }
  };

  const [subjects, setSubjects] = useState<Subject[]>(mockSubjectsData.subjects);
  const [stats] = useState<SubjectStatsType>(mockSubjectsData.stats);
  const [academicSession] = useState<AcademicSession>(mockSubjectsData.academicSession);
  const [pagination] = useState<SubjectPagination>(mockSubjectsData.pagination);

  const handleSubjectPress = (subject: Subject) => {
    // TODO: Navigate to subject details (read-only)
    console.log('View subject:', subject.name);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSubjects(mockSubjectsData.subjects);
    } else {
      const filtered = mockSubjectsData.subjects.filter(subject =>
        subject.name.toLowerCase().includes(query.toLowerCase()) ||
        subject.code.toLowerCase().includes(query.toLowerCase()) ||
        subject.description.toLowerCase().includes(query.toLowerCase())
      );
      setSubjects(filtered);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const hasData = subjects.length > 0;

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
                stats={stats} 
                academicSession={academicSession}
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
                {subjects.length} Subject{subjects.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </Text>
            </View>

            {/* Subjects Grid */}
            <View className="px-6 py-3">
              <View className="flex-row flex-wrap gap-3">
                {subjects.map((subject: Subject) => (
                  <View key={subject.id} style={{ width: '48%' }}>
                    <SubjectCard 
                      subject={subject}
                      onPress={() => handleSubjectPress(subject)}
                    />
                  </View>
                ))}
              </View>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <View className="mt-6">
                  <Pagination 
                    pagination={pagination}
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
