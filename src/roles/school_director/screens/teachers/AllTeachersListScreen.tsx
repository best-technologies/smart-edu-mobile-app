import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SchoolDirectorStackParamList } from '../../SchoolDirectorNavigator';
import { directorService } from '@/services/api/directorService';
import EmptyState from '../../components/shared/EmptyState';
import UpdateTeacherModal from '../../components/teachers/UpdateTeacherModal';
import { SuccessModal, ErrorModal } from '@/components';

// Define the Teacher interface based on the API response
interface Teacher {
  id: string;
  name: string;
  display_picture: string | null;
  contact: {
    phone: string;
    email: string;
  };
  totalSubjects: number;
  classTeacher: string;
  nextClass: {
    className: string;
    subject: string;
    startTime: string;
    endTime: string;
  } | null;
  status: 'active' | 'suspended';
}

export default function AllTeachersListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SchoolDirectorStackParamList>>();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Modal states
  const [updateTeacherModalVisible, setUpdateTeacherModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Reset modal state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset modal states when screen is focused
      setUpdateTeacherModalVisible(false);
      setSelectedTeacher(null);
      setSuccessModalVisible(false);
      setErrorModalVisible(false);
      setSuccessMessage('');
      setErrorMessage('');
    }, [])
  );

  const fetchTeachers = useCallback(async (page: number = 1, search: string = '', isLoadMore: boolean = false) => {
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

      const response = await directorService.fetchTeachersData(params);

      if (response.success && response.data) {
        const newTeachers = response.data.teachers;
        const pagination = response.data.pagination;

        if (isLoadMore) {
          setTeachers(prev => [...prev, ...newTeachers]);
        } else {
          setTeachers(newTeachers);
        }

        setCurrentPage(page);
        setHasMore(page < pagination.total_pages);
        setTotalResults(pagination.total_results);
      } else {
        setError(response.message || 'Failed to fetch teachers');
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to load teachers. Please try again.');
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

  // Fetch teachers when debounced search query changes
  useEffect(() => {
    // Only search if query is empty or has at least 3 characters
    if (debouncedSearchQuery === '' || debouncedSearchQuery.length >= 3) {
      fetchTeachers(1, debouncedSearchQuery);
    } else if (debouncedSearchQuery.length > 0 && debouncedSearchQuery.length < 3) {
      // If query is less than 3 characters, show all teachers
      fetchTeachers(1, '');
    }
  }, [debouncedSearchQuery]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchTeachers(currentPage + 1, debouncedSearchQuery, true);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setHasMore(true);
    fetchTeachers(1, debouncedSearchQuery);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleUpdateTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setUpdateTeacherModalVisible(true);
  };

  const renderTeacherItem = ({ item, index }: { item: Teacher; index: number }) => {
    const nameParts = item.name.split(' ');
    const initials = nameParts.length >= 2 
      ? `${nameParts[0].charAt(0).toUpperCase()}${nameParts[1].charAt(0).toUpperCase()}`
      : item.name.charAt(0).toUpperCase();

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active':
          return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
        case 'suspended':
          return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
      }
    };

    return (
      <View className="flex-1 mx-1 mb-4">
        <TouchableOpacity
          activeOpacity={0.8}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {/* Header with Avatar and Status */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 items-center justify-center mr-3">
                {item.display_picture ? (
                  <Image
                    source={{ uri: item.display_picture }}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <Text className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {initials}
                  </Text>
                )}
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 dark:text-gray-100" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1}>
                  {item.classTeacher !== 'None' ? item.classTeacher : 'No class assigned'}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2">
              <View className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                <Text className="text-xs font-semibold capitalize">{item.status}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleUpdateTeacher(item)}
                className="bg-blue-500 px-2 py-1 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-white text-xs font-medium">Update</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contact Info */}
          <View className="space-y-2 mb-3">
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2 flex-1" numberOfLines={1}>
                {item.contact.email}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="call-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2 flex-1" numberOfLines={1}>
                {item.contact.phone}
              </Text>
            </View>
          </View>

          {/* Teacher Info */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="book-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                {item.totalSubjects} {item.totalSubjects === 1 ? 'Subject' : 'Subjects'}
              </Text>
            </View>
            {item.nextClass && (
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={14} color="#6b7280" />
                <Text className="text-sm text-gray-600 dark:text-gray-300 ml-1">
                  Next: {item.nextClass.startTime}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
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

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <EmptyState
        title="No teachers found"
        subtitle={
          searchQuery
            ? `No teachers match "${searchQuery}"`
            : "No teachers are currently registered."
        }
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
            All Teachers
          </Text>
          <View className="w-10 h-10" />
        </View>
        
        {/* Search Bar */}
        <View className="mt-4">
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Search teachers (min. 3 characters)..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-3 text-gray-900 dark:text-gray-100 text-base"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => handleSearch('')}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <Text className="text-xs text-amber-600 dark:text-amber-400 mt-1 ml-1">
              Type at least 3 characters to search
            </Text>
          )}
        </View>

        {/* Results Count */}
        <View className="mt-3">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {isLoading ? 'Loading...' : 
             searchQuery.length > 0 && searchQuery.length < 3 ? 'Type at least 3 characters to search' :
             `${totalResults} teachers found${debouncedSearchQuery ? ` for "${debouncedSearchQuery}"` : ''}`
            }
          </Text>
        </View>
      </View>

      {/* Teachers List */}
      <FlatList
        data={teachers}
        renderItem={renderTeacherItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 16 }}
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
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />

      {/* Error State */}
      {error && (
        <View className="absolute inset-0 bg-white dark:bg-gray-800 items-center justify-center px-6">
          <EmptyState
            title="Error loading teachers"
            subtitle={error}
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
      )}

      {/* Update Teacher Modal */}
      <UpdateTeacherModal
        visible={updateTeacherModalVisible}
        teacher={selectedTeacher}
        onClose={() => {
          setUpdateTeacherModalVisible(false);
          setSelectedTeacher(null);
        }}
        onSuccess={() => {
          setUpdateTeacherModalVisible(false);
          setSelectedTeacher(null);
          handleRefresh(); // Refresh the list after update
        }}
        onShowSuccess={(message) => {
          setSuccessMessage(message);
          setSuccessModalVisible(true);
        }}
        onShowError={(message) => {
          setErrorMessage(message);
          setErrorModalVisible(true);
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        title="Success!"
        message={successMessage}
        onClose={() => {
          setSuccessModalVisible(false);
          setSuccessMessage('');
        }}
        confirmText="OK"
        autoClose={true}
        autoCloseDelay={3000}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        title="Error"
        message={errorMessage}
        onClose={() => {
          setErrorModalVisible(false);
          setErrorMessage('');
        }}
        closeText="OK"
        autoClose={false}
      />
    </SafeAreaView>
  );
}
