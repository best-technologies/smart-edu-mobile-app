import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SchoolDirectorStackParamList } from '../../SchoolDirectorNavigator';
import { directorService, Subject, AvailableClass } from '@/services/api/directorService';
import EmptyState from '../../components/shared/EmptyState';
import SubjectCard from '../../components/subjects/SubjectCard';

export default function AllSubjectsListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SchoolDirectorStackParamList>>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<AvailableClass[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSubjects = useCallback(async (
    page: number = 1, 
    search: string = '', 
    classId: string | null = null,
    isLoadMore: boolean = false
  ) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const params: any = {
        page,
        limit: 20,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (classId) {
        params.classId = classId;
      }

      const response = await directorService.fetchSubjectsData(params);

      if (response.success && response.data) {
        const newSubjects = response.data.subjects;
        const pagination = response.data.pagination;
        const availableClasses = response.data.availableClasses || [];

        if (isLoadMore) {
          setSubjects(prev => [...prev, ...newSubjects]);
        } else {
          setSubjects(newSubjects);
        }

        // Update classes list if available
        if (availableClasses.length > 0) {
          setClasses(availableClasses);
        }

        setCurrentPage(page);
        setHasMore(page < pagination.totalPages);
        setTotalResults(pagination.total);
      } else {
        setError(response.message || 'Failed to fetch subjects');
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('Failed to load subjects. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Debounce search query
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Fetch subjects when debounced search query or selected class changes
  useEffect(() => {
    // Only search if query is empty or has at least 3 characters
    if (debouncedSearchQuery === '' || debouncedSearchQuery.length >= 3) {
      fetchSubjects(1, debouncedSearchQuery, selectedClassId);
    } else if (debouncedSearchQuery.length > 0 && debouncedSearchQuery.length < 3) {
      // If query is less than 3 characters, show all subjects
      fetchSubjects(1, '', selectedClassId);
    }
  }, [debouncedSearchQuery, selectedClassId]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchSubjects(currentPage + 1, searchQuery, selectedClassId, true);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setHasMore(true);
    fetchSubjects(1, searchQuery, selectedClassId);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleClassFilter = (classId: string | null) => {
    setSelectedClassId(classId);
    setCurrentPage(1);
    setHasMore(true);
  };

  const renderSubjectItem = ({ item, index }: { item: Subject; index: number }) => {
    return (
      <View className="flex-1 mx-1 mb-4">
        <SubjectCard 
          subject={item} 
          onUpdate={(updatedSubject) => {
            // Update the local subjects array
            setSubjects(prev => prev.map(subject => 
              subject.id === updatedSubject.id ? updatedSubject : subject
            ));
          }}
        />
      </View>
    );
  };

  const renderClassFilter = () => {
    // Calculate total subjects for "All" option
    const totalSubjects = classes.reduce((sum, classItem) => sum + classItem.subject_count, 0);
    
    return (
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
          className="flex-row"
        >
          {/* All Classes Option */}
          <TouchableOpacity
            onPress={() => handleClassFilter(null)}
            className={`mr-3 px-4 py-2 rounded-full border ${
              selectedClassId === null
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
            }`}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <Text
                className={`text-sm font-medium ${
                  selectedClassId === null
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                All
              </Text>
              <View className={`ml-2 px-1.5 py-0.5 rounded-full ${
                selectedClassId === null
                  ? 'bg-white/20'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                <Text
                  className={`text-xs font-semibold ${
                    selectedClassId === null
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {totalSubjects}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Individual Classes */}
          {classes.map((classItem) => (
            <TouchableOpacity
              key={classItem.id}
              onPress={() => handleClassFilter(classItem.id)}
              className={`mr-3 px-4 py-2 rounded-full border ${
                selectedClassId === classItem.id
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center">
                <Text
                  className={`text-sm font-medium ${
                    selectedClassId === classItem.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {classItem.name}
                </Text>
                <View className={`ml-2 px-1.5 py-0.5 rounded-full ${
                  selectedClassId === classItem.id
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  <Text
                    className={`text-xs font-semibold ${
                      selectedClassId === classItem.id
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {classItem.subject_count}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  };

  if (error && subjects.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <EmptyState 
            title="Error loading subjects" 
            subtitle="Unable to load subjects data. Please try again." 
          />
          <TouchableOpacity 
            onPress={handleRefresh}
            className="mt-4 px-6 py-3 bg-blue-600 rounded-xl flex-row items-center gap-2"
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#ffffff" />
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
            All Subjects
          </Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Search Bar */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search subjects by name or code..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-3 text-gray-900 dark:text-gray-100 text-base"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              className="ml-2"
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Class Filter - Sticky */}
      {renderClassFilter()}

      {/* Subjects List */}
      <FlatList
        data={subjects}
        renderItem={renderSubjectItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !isLoadingMore}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
            progressBackgroundColor="#ffffff"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading ? (
            <View className="py-8">
              <EmptyState 
                title="No subjects found" 
                subtitle={
                  searchQuery 
                    ? `No subjects match "${searchQuery}"` 
                    : selectedClassId 
                    ? "No subjects found for the selected class."
                    : "No subjects are currently registered."
                } 
              />
            </View>
          ) : null
        }
      />

      {/* Loading Overlay */}
      {isLoading && subjects.length === 0 && (
        <View className="absolute inset-0 bg-white dark:bg-gray-900 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-600 dark:text-gray-400">Loading subjects...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}
