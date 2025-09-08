import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TeacherStackParamList = {
  TeacherTabs: undefined;
  SubjectDetail: { subject: Subject };
  VideoDemo: {
    videoUri: string;
    videoTitle: string;
    videoDescription: string;
    topicTitle: string;
    topicDescription: string;
    topicInstructions: string;
    subjectName: string;
    subjectCode: string;
  };
  CBTCreation: { subjectId?: string; subjectName?: string };
  CBTQuizDetail: { quizId: string };
};

type TeacherNavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

import TopBar from './components/shared/TopBar';
import SubjectCard from './components/subjects/SubjectCard';
import SubjectStats from './components/subjects/SubjectStats';
import ManagedClasses from './components/subjects/ManagedClasses';
import EmptyState from './components/subjects/EmptyState';
import SearchBar from './components/subjects/SearchBar';
import Pagination from './components/subjects/Pagination';
import FilterChips from './components/subjects/FilterChips';
import { 
  Subject, 
  SubjectStats as SubjectStatsType, 
  ManagedClass as ManagedClassType,
  AcademicSession,
  SubjectPagination
} from './components/subjects/types';
import { useTeacherSubjects } from '@/hooks/useTeacherSubjects';

const { width } = Dimensions.get('window');

export default function SubjectsScreen() {
  const navigation = useNavigation<TeacherNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);

  // Use real data hook
  const {
    subjects,
    managedClasses,
    teachingSubjects,
    stats,
    academicSession,
    pagination,
    isLoading,
    error,
    refetch,
    searchSubjects,
    filterByClass,
    goToPage,
    filters,
  } = useTeacherSubjects();

  const handleSubjectPress = (subject: Subject) => {
    navigation.navigate('SubjectDetail', { subject });
  };

  const handleEditSubject = (subject: Subject) => {
    // TODO: Implement edit subject functionality
    console.log('Edit subject:', subject.name);
  };

  const handleManageContent = (subject: Subject) => {
    // TODO: Implement manage content functionality
    console.log('Manage content for:', subject.name);
  };


  const handleClassPress = (cls: ManagedClassType) => {
    // TODO: Navigate to class details or students list
    console.log('Class pressed:', cls.name);
  };

  const handleSearch = (query: string) => {
    searchSubjects(query);
  };

  const handleClassFilter = (classId: string | undefined) => {
    filterByClass(classId);
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const hasData = subjects.length > 0 || managedClasses.length > 0;

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
                Manage your subjects and teaching materials
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('VideoDemo' as never)}
              activeOpacity={0.7}
              className="bg-blue-600 px-3 py-1.5 rounded-lg flex-row items-center gap-2"
            >
              <Ionicons name="videocam" size={14} color="white" />
              <Text className="text-white font-semibold text-xs">Video Demo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View className="flex-1 items-center justify-center px-4">
            <EmptyState 
              type="subjects"
              message="Unable to load subjects data. Please try again."
            />
            <TouchableOpacity 
              onPress={onRefresh}
              className="mt-4 px-6 py-3 bg-blue-600 rounded-xl flex-row items-center gap-2"
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={18} color="#ffffff" />
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500 dark:text-gray-400">Loading subjects...</Text>
          </View>
        ) : hasData ? (
          <>
            {/* Stats Section */}
            <View className="px-6 py-3">
              <SubjectStats 
                stats={stats} 
                academicSession={academicSession}
              />
            </View>

            {/* Managed Classes Section */}
            <View className="px-6">
              <ManagedClasses 
                classes={managedClasses}
                onClassPress={handleClassPress}
              />
            </View>

            {/* Search and Filters Section */}
            <View className="px-6 py-3 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
              {/* Search Bar */}
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search subjects by name, code, or description..."
                className="mb-3"
              />

              {/* Filter Chips */}
              <FilterChips 
                classes={managedClasses}
                selectedClassId={filters.classId}
                onClassFilter={handleClassFilter}
              />
            </View>

            {/* Subjects Count */}
            <View className="px-6 py-1 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {subjects.length} Subject{subjects.length !== 1 ? 's' : ''} found
              </Text>
            </View>

            {/* Subjects Grid/List */}
            <View className="px-6 py-3">
              {subjects.length > 0 ? (
                <>
                  <View className="flex-row flex-wrap gap-3">
                    {subjects.map((subject: Subject) => (
                      <View key={subject.id} style={{ width: '48%' }}>
                        <SubjectCard 
                          subject={subject}
                          onPress={() => handleSubjectPress(subject)}
                          onEdit={() => handleEditSubject(subject)}
                          onManageContent={() => handleManageContent(subject)}
                        />
                      </View>
                    ))}
                  </View>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <View className="mt-6">
                      <Pagination 
                        pagination={pagination}
                        onPageChange={handlePageChange}
                      />
                    </View>
                  )}
                </>
              ) : (
                <EmptyState 
                  type="subjects" 
                  message={
                    filters.search || filters.classId
                      ? `No subjects found matching your search criteria.`
                      : undefined
                  }
                />
              )}
            </View>
          </>
        ) : (
          <EmptyState type="subjects" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
