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
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Types - Import from director service for compatibility
import { Subject, AvailableClass } from '@/services/api/directorService';

// Re-export types for convenience
export type { Subject, AvailableClass };

export interface SubjectStats {
  totalSubjects: number;
  totalStudents: number;
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  averageProgress: number;
}

export interface AcademicSession {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface SubjectPagination {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Props interface
export interface SubjectsListScreenProps {
  // Data
  subjects: Subject[];
  classes?: AvailableClass[];
  stats?: SubjectStats;
  academicSession?: AcademicSession;
  pagination?: SubjectPagination;
  
  // Loading states
  isLoading?: boolean;
  isRefreshing?: boolean;
  isLoadingMore?: boolean;
  
  // Error handling
  error?: string | null;
  
  // Actions
  onRefresh?: () => void;
  onLoadMore?: () => void;
  onSubjectPress?: (subject: Subject) => void;
  onSubjectEdit?: (subject: Subject) => void;
  onSubjectManage?: (subject: Subject) => void;
  onClassPress?: (classItem: AvailableClass) => void;
  onSearch?: (query: string) => void;
  onClassFilter?: (classId: string | null) => void;
  onPageChange?: (page: number) => void;
  
  // Configuration
  userRole?: 'teacher' | 'student' | 'director';
  showStats?: boolean;
  showClasses?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  showPagination?: boolean;
  showRefresh?: boolean;
  showLoadMore?: boolean;
  enableEdit?: boolean;
  enableManage?: boolean;
  
  // UI customization
  title?: string;
  subtitle?: string;
  emptyStateTitle?: string;
  emptyStateSubtitle?: string;
  searchPlaceholder?: string;
  
  // Navigation
  navigation?: any;
  onBack?: () => void;
  showBackButton?: boolean;
  
  // Additional actions
  additionalActions?: React.ReactNode;
}

// Subject Card Component - Exact design from teacher's SubjectCard
interface SubjectCardProps {
  subject: Subject;
  onPress?: (subject: Subject) => void;
  onEdit?: (subject: Subject) => void;
  onManage?: (subject: Subject) => void;
  enableEdit?: boolean;
  enableManage?: boolean;
  userRole?: 'teacher' | 'student' | 'director';
}

function SubjectCard({ 
  subject, 
  onPress, 
  onEdit, 
  onManage, 
  enableEdit = false, 
  enableManage = false,
  userRole = 'teacher'
}: SubjectCardProps) {
  const getDefaultThumbnail = () => {
    // Default calculus/math image when thumbnail is null
    return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const capitalizeWords = (text: string) => {
    return text.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress(subject);
    }
  };

  const handleEditPress = (e: any) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(subject);
    }
  };

  const handleManagePress = (e: any) => {
    e.stopPropagation();
    if (onManage) {
      onManage(subject);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={0.8}
      className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm"
    >
      {/* Thumbnail with Color Overlay */}
      <View className="relative">
        <Image 
          source={{ uri: (subject as any).thumbnail?.secure_url || getDefaultThumbnail() }} 
          className="w-full h-32"
          resizeMode="cover"
        />
        <View 
          className="absolute inset-0 opacity-20"
          style={{ backgroundColor: subject.color || '#3B82F6' }}
        />
        
        {/* Subject Code Badge */}
        <View className="absolute top-3 left-3">
          <View className="px-2 py-1 rounded-lg bg-white/90 dark:bg-black/90">
            <Text className="text-xs font-bold text-gray-900 dark:text-gray-100">
              {subject.code || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {(enableEdit || enableManage) && (
          <View className="absolute bottom-3 right-3 flex-row gap-2">
            {enableEdit && (
              <TouchableOpacity
                onPress={handleEditPress}
                activeOpacity={0.7}
                className="h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-black/90 shadow-sm"
              >
                <Ionicons name="pencil" size={14} color="#6b7280" />
              </TouchableOpacity>
            )}
            {enableManage && (
              <TouchableOpacity
                onPress={handleManagePress}
                activeOpacity={0.7}
                className="h-8 w-8 items-center justify-center rounded-full shadow-sm"
                style={{ backgroundColor: subject.color || '#3B82F6' }}
              >
                <Ionicons name="add" size={14} color="white" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1" numberOfLines={1}>
          {capitalizeWords(subject.name)}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3" numberOfLines={2}>
          {capitalizeWords(subject.description)}
        </Text>

        {/* Classes Taking Subject */}
        {subject.class && (
          <View className="mb-3">
            <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Class
            </Text>
            <View className="flex-row flex-wrap gap-1">
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: `${subject.color || '#3B82F6'}20` }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: subject.color || '#3B82F6' }}
                >
                  {capitalizeWords(subject.class.name)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Teachers */}
        {subject.teachers && subject.teachers.length > 0 && (
          <View className="mb-3">
            <Text className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Teachers ({subject.teachers.length})
            </Text>
            <View className="flex-row flex-wrap gap-1">
              {subject.teachers.slice(0, 2).map((teacher, index) => (
                <View 
                  key={teacher.id}
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${subject.color || '#3B82F6'}20` }}
                >
                  <Text 
                    className="text-xs font-medium"
                    style={{ color: subject.color || '#3B82F6' }}
                  >
                    {capitalizeWords(teacher.name)}
                  </Text>
                </View>
              ))}
              {subject.teachers.length > 2 && (
                <View className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    +{subject.teachers.length - 2}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Content Stats */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {(subject as any).totalVideos || 0}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="document-outline" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {(subject as any).totalMaterials || 0}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="library-outline" size={14} color="#6b7280" />
              <Text className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {(subject as any).totalAssignments || 0}
              </Text>
            </View>
          </View>
          <Text className="text-xs text-gray-400 dark:text-gray-500">
            {(subject as any).updatedAt ? formatDate((subject as any).updatedAt) : 'Recently updated'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Stats Component
function SubjectStats({ stats, academicSession }: { stats?: SubjectStats; academicSession?: AcademicSession }) {
  if (!stats) return null;

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Overview
        </Text>
        {academicSession && (
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {academicSession.name}
          </Text>
        )}
      </View>
      
      <View className="flex-row flex-wrap gap-4">
        <View className="flex-1 min-w-[120px]">
          <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalSubjects}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">Subjects</Text>
        </View>
        <View className="flex-1 min-w-[120px]">
          <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalStudents}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">Students</Text>
        </View>
        <View className="flex-1 min-w-[120px]">
          <Text className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalTopics}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">Topics</Text>
        </View>
        <View className="flex-1 min-w-[120px]">
          <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.totalVideos}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">Videos</Text>
        </View>
      </View>
    </View>
  );
}

// Empty State Component
function EmptyState({ 
  title = "No subjects found", 
  subtitle = "No subjects are currently available." 
}: { 
  title?: string; 
  subtitle?: string; 
}) {
  return (
    <View className="flex-1 items-center justify-center py-12 px-4">
      <Ionicons name="book-outline" size={64} color="#9ca3af" />
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
        {title}
      </Text>
      <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
        {subtitle}
      </Text>
    </View>
  );
}

// Main Component
export default function SubjectsListScreen({
  // Data
  subjects = [],
  classes = [],
  stats,
  academicSession,
  pagination,
  
  // Loading states
  isLoading = false,
  isRefreshing = false,
  isLoadingMore = false,
  
  // Error handling
  error = null,
  
  // Actions
  onRefresh,
  onLoadMore,
  onSubjectPress,
  onSubjectEdit,
  onSubjectManage,
  onClassPress,
  onSearch,
  onClassFilter,
  onPageChange,
  
  // Configuration
  userRole = 'teacher',
  showStats = true,
  showClasses = false,
  showSearch = true,
  showFilters = true,
  showPagination = true,
  showRefresh = true,
  showLoadMore = true,
  enableEdit = false,
  enableManage = false,
  
  // UI customization
  title = "Subjects",
  subtitle = "Manage your subjects and materials",
  emptyStateTitle = "No subjects found",
  emptyStateSubtitle = "No subjects are currently available.",
  searchPlaceholder = "Search subjects by name or code...",
  
  // Navigation
  navigation,
  onBack,
  showBackButton = false,
  
  // Additional actions
  additionalActions,
}: SubjectsListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, onSearch]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleClassFilter = (classId: string | null) => {
    setSelectedClassId(classId);
    if (onClassFilter) {
      onClassFilter(classId);
    }
  };

  const handleSubjectPress = (subject: Subject) => {
    if (onSubjectPress) {
      onSubjectPress(subject);
    }
  };

  const handleSubjectEdit = (subject: Subject) => {
    if (onSubjectEdit) {
      onSubjectEdit(subject);
    }
  };

  const handleSubjectManage = (subject: Subject) => {
    if (onSubjectManage) {
      onSubjectManage(subject);
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleLoadMore = () => {
    if (onLoadMore && !isLoadingMore) {
      onLoadMore();
    }
  };

  const renderSubjectItem = ({ item, index }: { item: Subject; index: number }) => {
    return (
      <View style={{ width: '48%', marginBottom: 12 }}>
        <SubjectCard 
          subject={item} 
          onPress={handleSubjectPress}
          onEdit={handleSubjectEdit}
          onManage={handleSubjectManage}
          enableEdit={enableEdit}
          enableManage={enableManage}
          userRole={userRole}
        />
      </View>
    );
  };

  const renderClassFilter = () => {
    if (!showFilters || classes.length === 0) return null;

    const totalSubjects = classes.reduce((sum, classItem) => sum + classItem.student_count, 0);
    
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
                    {(classItem as any).subject_count || 0}
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
          {showBackButton ? (
            <TouchableOpacity
              onPress={onBack}
              className="w-10 h-10 items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          ) : (
            <View className="w-10" />
          )}
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {title}
          </Text>
          <View className="w-10" />
        </View>
        {subtitle && (
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </Text>
        )}
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder={searchPlaceholder}
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
      )}

      {/* Class Filter */}
      {renderClassFilter()}

      {/* Stats Section */}
      {showStats && stats && (
        <View className="px-4 py-3">
          <SubjectStats stats={stats} academicSession={academicSession} />
        </View>
      )}

      {/* Additional Actions */}
      {additionalActions && (
        <View className="px-4 py-3">
          {additionalActions}
        </View>
      )}

      {/* Subjects List */}
      <FlatList
        data={subjects}
        renderItem={renderSubjectItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          showRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#3b82f6"
              colors={["#3b82f6"]}
              progressBackgroundColor="#ffffff"
            />
          ) : undefined
        }
        onEndReached={showLoadMore ? handleLoadMore : undefined}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading ? (
            <View className="py-8">
              <EmptyState 
                title={emptyStateTitle} 
                subtitle={emptyStateSubtitle} 
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
