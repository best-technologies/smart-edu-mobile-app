import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '@/services';
import { StudentTabResponse, StudentTabStudent } from '@/services/types/apiTypes';
import TopBar from './components/shared/TopBar';
import StudentCardNew from './components/students/StudentCardNew';
import StudentStats from './components/students/StudentStats';
import SearchBar from './components/students/SearchBar';
import FilterChips from './components/students/FilterChips';
import FloatingActionButton from './components/shared/FloatingActionButton';
import { capitalizeWords } from '@/utils/textFormatter';

export default function StudentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [data, setData] = useState<StudentTabResponse['data'] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentData = useCallback(async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const response = await ApiService.teacher.getStudentTab(page);
      
      if (response.success && response.data) {
        if (isRefresh || page === 1) {
          setData(response.data);
          setCurrentPage(1);
        } else {
          setData(prev => prev ? {
            ...prev,
            students: {
              ...prev.students,
              data: [...prev.students.data, ...response.data!.students.data],
              pagination: response.data!.students.pagination
            }
          } : response.data!);
        }
        
        setHasMore(response.data.students.pagination.has_next);
        setError(null);
      } else {
        setError('Failed to load student data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Unable to connect to server. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentData(1, true);
  }, [fetchStudentData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchStudentData(1, true);
    setRefreshing(false);
  }, [fetchStudentData]);

  const loadMore = useCallback(async () => {
    if (hasMore && !loadingMore && data) {
      const nextPage = currentPage + 1;
      await fetchStudentData(nextPage, false);
      setCurrentPage(nextPage);
    }
  }, [hasMore, loadingMore, data, currentPage, fetchStudentData]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-lg text-gray-500 dark:text-gray-400 mt-4">Loading students...</Text>
      </SafeAreaView>
    );
  }

  // Show error state with UI - this ensures teachers see the interface even with errors
  if (error && !data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <TopBar />
        
        <ScrollView className="flex-1" contentContainerClassName="pb-32">
          {/* Stats Section - Fallback */}
          <View className="px-6 py-4">
            <StudentStats stats={{
              totalStudents: 0,
              activeStudents: 0,
              totalClasses: 0
            }} />
          </View>

          {/* Classes Section - Fallback */}
          <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Classes You Manage
            </Text>
            <View className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-6">
              <View className="flex-row items-center justify-center">
                <Ionicons name="school-outline" size={24} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 ml-2 text-center">
                  No classes assigned yet
                </Text>
              </View>
            </View>
          </View>

          {/* Subjects Section - Fallback */}
          <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Subjects You Teach
            </Text>
            <View className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-6">
              <View className="flex-row items-center justify-center">
                <Ionicons name="book-outline" size={24} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 ml-2 text-center">
                  No subjects assigned yet
                </Text>
              </View>
            </View>
          </View>

          {/* Search and Filters - Always show */}
          <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search students by name, ID, or class..."
            />
            <View className="mt-3">
              <FilterChips 
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />
            </View>
          </View>

          {/* Students List Header */}
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                0 Students
              </Text>
            </View>
          </View>

          {/* Error State */}
          <View className="items-center justify-center py-12 px-6">
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 text-center">
              Unable to Load Students
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              {error}
            </Text>
            <TouchableOpacity 
              onPress={() => fetchStudentData(1, true)}
              className="mt-6 bg-blue-500 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingActionButton 
          icon="add"
          onPress={() => console.log('Add new student')}
        />
      </SafeAreaView>
    );
  }

  // Show fallback UI even when no data - this ensures teachers see the interface
  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <TopBar />
        
        <ScrollView className="flex-1" contentContainerClassName="pb-32">
          {/* Stats Section - Fallback */}
          <View className="px-6 py-4">
            <StudentStats stats={{
              totalStudents: 0,
              activeStudents: 0,
              totalClasses: 0
            }} />
          </View>

          {/* Classes Section - Fallback */}
          <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Classes You Manage
            </Text>
            <View className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-6">
              <View className="flex-row items-center justify-center">
                <Ionicons name="school-outline" size={24} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 ml-2 text-center">
                  No classes assigned yet
                </Text>
              </View>
            </View>
          </View>

          {/* Subjects Section - Fallback */}
          <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Subjects You Teach
            </Text>
            <View className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-6">
              <View className="flex-row items-center justify-center">
                <Ionicons name="book-outline" size={24} color="#9ca3af" />
                <Text className="text-gray-500 dark:text-gray-400 ml-2 text-center">
                  No subjects assigned yet
                </Text>
              </View>
            </View>
          </View>

          {/* Search and Filters - Always show */}
          <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
            <SearchBar 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search students by name, ID, or class..."
            />
            <View className="mt-3">
              <FilterChips 
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />
            </View>
          </View>

          {/* Students List Header */}
          <View className="px-6 py-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                0 Students
              </Text>
            </View>
          </View>

          {/* Empty State */}
          <View className="items-center justify-center py-12">
            <Ionicons name="school-outline" size={48} color="#9ca3af" />
            <Text className="text-lg font-semibold text-gray-500 dark:text-gray-400 mt-4">
              No Students Found
            </Text>
            <Text className="text-sm text-gray-400 dark:text-gray-500 text-center mt-2 px-6">
              You don't have any students assigned to your classes yet. Contact your administrator to get students assigned to your subjects.
            </Text>
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <FloatingActionButton 
          icon="add"
          onPress={() => console.log('Add new student')}
        />
      </SafeAreaView>
    );
  }

  const filteredStudents = (data?.students?.data || []).filter((student: StudentTabStudent) => {
    // Safety checks for student data
    if (!student) return false;
    
    const matchesSearch = (student.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (student.student_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (student.class?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && student.status === 'active') ||
                         (selectedFilter === 'inactive' && student.status === 'inactive') ||
                         (selectedFilter === 'suspended' && student.status === 'suspended');
    
    return matchesSearch && matchesFilter;
  });

  const handleStudentSelect = (studentId: string) => {
    if (!studentId) return;
    setSelectedStudents(prev => {
      const current = prev || [];
      return current.includes(studentId) 
        ? current.filter(id => id !== studentId)
        : [...current, studentId];
    });
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for students:`, selectedStudents || []);
    setSelectedStudents([]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />
      
      <FlatList
        className="flex-1"
        contentContainerClassName="pb-32"
        data={filteredStudents || []}
        keyExtractor={(item) => item?.id || Math.random().toString()}
        renderItem={({ item }) => {
          if (!item) return null;
          return (
            <View className="px-6 py-2">
              <StudentCardNew 
                student={item}
                isSelected={(selectedStudents || []).includes(item.id)}
                onSelect={() => handleStudentSelect(item.id)}
              />
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
            title="Pull to refresh"
            titleColor="#6b7280"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={() => (
          <>
            {/* Stats Section */}
            <View className="px-6 py-4">
            <StudentStats stats={{
              totalStudents: data?.summary?.total_students || 0,
              activeStudents: (data?.students?.data || []).filter(s => s?.status === 'active').length,
              totalClasses: data?.summary?.total_classes || 0
            }} />
            </View>

            {/* Classes Section */}
            {data?.classes && data.classes.length > 0 && (
              <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Classes You Manage
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {data.classes.map((classItem) => (
                    <View 
                      key={classItem.id} 
                      className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2"
                    >
                      <Text className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        {classItem.name}
                      </Text>
                      <Text className="text-xs text-blue-600 dark:text-blue-400">
                        {classItem.student_count} students • {classItem.subject_count} subjects
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Subjects Section */}
            <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Subjects You Teach
              </Text>
              {data?.subjects && data.subjects.length > 0 ? (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerClassName="gap-3 pr-4"
                >
                  {data.subjects.map((subject) => (
                    <View 
                      key={subject.id} 
                      className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 min-w-[160px]"
                      style={{ borderLeftColor: subject.color, borderLeftWidth: 4 }}
                    >
                      <Text className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
                        {capitalizeWords(subject.name)}
                      </Text>
                      <Text className="text-xs text-green-600 dark:text-green-400">
                        {subject.code}
                      </Text>
                      {subject.assigned_class && (
                        <Text className="text-xs text-green-600 dark:text-green-400 mt-1">
                          {capitalizeWords(subject.assigned_class.name)}
                        </Text>
                      )}
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-6">
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="book-outline" size={24} color="#9ca3af" />
                    <Text className="text-gray-500 dark:text-gray-400 ml-2 text-center">
                      No subjects assigned yet
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Search and Filters */}
            <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
              <SearchBar 
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search students by name, ID, or class..."
              />
              <View className="mt-3">
                <FilterChips 
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </View>
            </View>

            {/* Students List Header */}
            <View className="px-6 py-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {(filteredStudents || []).length} Student{(filteredStudents || []).length !== 1 ? 's' : ''}
                </Text>
                {(selectedStudents || []).length > 0 && (
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      {(selectedStudents || []).length} selected
                    </Text>
                    <TouchableOpacity 
                      onPress={() => setSelectedStudents([])}
                      className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
                    >
                      <Text className="text-sm text-gray-600 dark:text-gray-300">Clear</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-12">
            <Ionicons name="search-outline" size={48} color="#9ca3af" />
            <Text className="text-lg font-semibold text-gray-500 dark:text-gray-400 mt-4">
              No students found
            </Text>
            <Text className="text-sm text-gray-400 dark:text-gray-500 text-center mt-2">
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          loadingMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading more students...</Text>
            </View>
          ) : null
        )}
      />

      {/* Bulk Actions */}
      {(selectedStudents || []).length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4">
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => handleBulkAction('message')}
              className="flex-1 bg-blue-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Message Selected</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleBulkAction('export')}
              className="flex-1 bg-gray-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Export</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon="add"
        onPress={() => console.log('Add new student')}
      />
    </SafeAreaView>
  );
}
