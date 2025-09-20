import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SchoolDirectorStackParamList } from '../../SchoolDirectorNavigator';
import { directorService, Subject, AvailableClass } from '@/services/api/directorService';
import { SubjectsListScreen } from '@/components';

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleClassFilter = (classId: string | null) => {
    setSelectedClassId(classId);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleSubjectPress = (subject: Subject) => {
    console.log('Subject pressed:', subject.name);
    navigation.navigate('SubjectDetail', { subject });
  };

  const handleSubjectEdit = (subject: Subject) => {
    console.log('Edit subject:', subject.name);
    // TODO: Implement edit functionality
  };

  const handleSubjectManage = (subject: Subject) => {
    console.log('Manage subject:', subject.name);
    // TODO: Implement manage functionality
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SubjectsListScreen
      // Data
      subjects={subjects}
      classes={classes}
      isLoading={isLoading}
      isRefreshing={isLoading}
      isLoadingMore={isLoadingMore}
      error={error}
      
      // Actions
      onRefresh={handleRefresh}
      onLoadMore={handleLoadMore}
      onSubjectPress={handleSubjectPress}
      onSubjectEdit={handleSubjectEdit}
      onSubjectManage={handleSubjectManage}
      onSearch={handleSearch}
      onClassFilter={handleClassFilter}
      
      // Configuration
      userRole="director"
      showStats={false}
      showClasses={true}
      showSearch={true}
      showFilters={true}
      showPagination={false}
      showRefresh={true}
      showLoadMore={true}
      enableEdit={true}
      enableManage={true}
      
      // UI customization
      title="All Subjects"
      subtitle="Manage all subjects in your school"
      emptyStateTitle="No subjects found"
      emptyStateSubtitle="No subjects are currently registered."
      searchPlaceholder="Search subjects by name or code..."
      
      // Navigation
      onBack={handleBack}
      showBackButton={true}
    />
  );
}