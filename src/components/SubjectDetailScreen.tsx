import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Dimensions, Alert, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { capitalizeWords } from '@/utils/textFormatter';
import { useToast } from '@/contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

// Import role-specific hooks and components
import { useSubjectDetails } from '@/hooks/useSubjectDetails';
import { useStudentSubjectDetails } from '@/hooks/useStudentSubjectDetails';
import { useDirectorSubjectDetails } from '@/hooks/useDirectorSubjectDetails';

// Import role-specific components
import SimpleDraggableList from '@/roles/teacher/screens/components/subjects/SimpleDraggableList';
import VideoUploadModal from '@/roles/teacher/screens/components/subjects/VideoUploadModal';
import MaterialUploadModal from '@/roles/teacher/screens/components/subjects/MaterialUploadModal';
import InstructionModal from '@/roles/teacher/screens/components/subjects/InstructionModal';
import CreateTopicModal from '@/roles/teacher/screens/components/subjects/CreateTopicModal';
import CBTList from '@/roles/teacher/screens/components/CBTList';
import { StudentTopicList, StudentTopicDetailModal } from '@/roles/student/screens/components/subjects';
import { DirectorTopicList, DirectorTopicDetailModal } from '@/roles/school_director/screens/components/subjects';

// Import types
import { SubjectDetailsFilters, Topic, Video, Material } from '@/roles/teacher/screens/components/subjects/types';
import { StudentTopic } from '@/roles/student/screens/components/subjects/studentTopicTypes';
import { DirectorTopic } from '@/roles/school_director/screens/components/subjects/directorTopicTypes';
import { CBTQuiz } from '@/services/types/cbtTypes';

const { width } = Dimensions.get('window');

interface Subject {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  totalStudents: number;
  progress: number;
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
  classes: string[];
  color?: string;
  code?: string;
}

interface SubjectDetailScreenProps {
  userRole: 'teacher' | 'student' | 'director';
  subject: Subject;
  onBack?: () => void;
}

export function SubjectDetailScreen({ 
  userRole, 
  subject, 
  onBack 
}: SubjectDetailScreenProps) {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [selectedTopic, setSelectedTopic] = useState<Topic | StudentTopic | DirectorTopic | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'topics' | 'assessments'>('topics');
  const [assessmentCounts, setAssessmentCounts] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoize subjectId to prevent unnecessary re-renders
  const subjectId = useMemo(() => subject?.id || '', [subject?.id]);

  // Role-specific data hooks
  const teacherData = useSubjectDetails({
    subjectId,
    page: 1,
    limit: 10,
    enabled: !!subjectId && userRole === 'teacher',
  });

  const studentData = useStudentSubjectDetails({
    subjectId,
    enabled: !!subjectId && userRole === 'student',
  });

  const directorData = useDirectorSubjectDetails({
    subjectId,
    enabled: !!subjectId && userRole === 'director',
  });

  // Get data based on role
  const getDataByRole = () => {
    switch (userRole) {
      case 'teacher':
        return {
          data: teacherData.data,
          subject: teacherData.subject,
          topics: teacherData.topics,
          pagination: teacherData.pagination,
          stats: teacherData.stats,
          currentPage: teacherData.currentPage,
          currentSearch: teacherData.currentSearch,
          currentFilters: teacherData.currentFilters,
          isLoading: teacherData.isLoading,
          isFetching: teacherData.isFetching,
          error: teacherData.error,
          updateSearch: teacherData.updateSearch,
          updateFilters: teacherData.updateFilters,
          updatePage: teacherData.updatePage,
          resetToFirstPage: teacherData.resetToFirstPage,
          clearFilters: teacherData.clearFilters,
          refetch: teacherData.refetch,
          invalidateAndRefetch: teacherData.invalidateAndRefetch,
        };
      case 'student':
        return {
          data: studentData.data,
          subject: studentData.data || null,
          topics: studentData.data?.topics || [],
          pagination: null,
          stats: null,
          currentPage: null,
          currentSearch: null,
          currentFilters: null,
          isLoading: studentData.isLoading,
          isFetching: false,
          error: studentData.error,
          updateSearch: null,
          updateFilters: null,
          updatePage: null,
          resetToFirstPage: null,
          clearFilters: null,
          refetch: studentData.refetch,
          invalidateAndRefetch: studentData.refetch,
        };
      case 'director':
        return {
          data: directorData.data,
          subject: directorData.data,
          topics: directorData.data?.topics || [],
          pagination: null,
          stats: null,
          currentPage: null,
          currentSearch: null,
          currentFilters: null,
          isLoading: directorData.isLoading,
          isFetching: false,
          error: directorData.error,
          updateSearch: null,
          updateFilters: null,
          updatePage: null,
          resetToFirstPage: null,
          clearFilters: null,
          refetch: directorData.refetch,
          invalidateAndRefetch: directorData.refetch,
        };
      default:
        return {
          data: null,
          subject: null,
          topics: [],
          pagination: null,
          stats: null,
          currentPage: null,
          currentSearch: null,
          currentFilters: null,
          isLoading: false,
          isFetching: false,
          error: null,
          updateSearch: null,
          updateFilters: null,
          updatePage: null,
          resetToFirstPage: null,
          clearFilters: null,
          refetch: () => {},
          invalidateAndRefetch: () => {},
        };
    }
  };

  const {
    data: subjectDetailsData,
    subject: apiSubject,
    topics: apiTopics,
    pagination,
    stats,
    currentPage,
    currentSearch,
    currentFilters,
    isLoading,
    isFetching,
    error,
    updateSearch,
    updateFilters,
    updatePage,
    resetToFirstPage,
    clearFilters,
    refetch,
    invalidateAndRefetch,
  } = getDataByRole();

  // Refresh specific topic content
  const refreshTopicContent = useCallback(() => {
    // Invalidate the subject details query to refresh topic content
    queryClient.invalidateQueries({ queryKey: ['subjectDetails', subject?.id] });
    refetch();
  }, [queryClient, subject?.id, refetch]);

  // Use API data if available, fallback to route params
  const displaySubject = (apiSubject as any) || subject;
  const displayTopics = apiTopics || [];
  const displayStats = stats;
  
  // Local state for reordering topics
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  
  // Update local topics when API data changes
  useEffect(() => {
    if (apiTopics.length > 0) {
      // Convert topics to Topic type for consistency
      const convertedTopics = apiTopics.map((topic: any) => ({
        ...topic,
        status: topic.status || 'active',
        instructions: topic.instructions || '',
        order: topic.order || 0,
      })) as Topic[];
      setLocalTopics(convertedTopics);
    }
  }, [apiTopics]);

  const handleAddTopic = () => {
    setShowCreateTopicModal(true);
  };

  const handleCreateTopic = async (topicData: any) => {
    try {
      // For now, just show success message since we don't have director-specific topic creation
      showSuccess(
        'Topic Created Successfully! 🎉',
        `"${capitalizeWords(topicData.title)}" has been added to ${capitalizeWords((displaySubject as any)?.name || '')}`,
        5000
      );
      
      // Close the modal
      setShowCreateTopicModal(false);
      
      // Refresh the topics data from API
      invalidateAndRefetch();
    } catch (error) {
      console.error('Error creating topic:', error);
      
      // Show error toast
      showError(
        'Error Creating Topic',
        'Network error or server issue. Please check your connection and try again.',
        5000
      );
    }
  };

  const handleAddVideo = (topic: Topic) => {
    setSelectedTopic(topic as Topic);
    setShowVideoModal(true);
  };

  const handleAddMaterial = (topic: Topic) => {
    setSelectedTopic(topic as Topic);
    setShowMaterialModal(true);
  };

  const handleEditInstructions = (topic: Topic) => {
    setSelectedTopic(topic as Topic);
    setShowInstructionModal(true);
  };

  const handleTopicsReorder = (newTopics: Topic[]) => {
    setLocalTopics(newTopics);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleCreateCBT = () => {
    navigation.navigate('CBTCreation' as never, {
      subjectId: (displaySubject as any)?.id || subject?.id,
      subjectName: (displaySubject as any)?.name || subject?.name,
    });
  };

  const handleViewAllAssessments = () => {
    navigation.navigate('AssessmentsList' as never, {
      subjectId: (displaySubject as any)?.id || subject?.id,
      subjectName: (displaySubject as any)?.name || subject?.name,
    });
  };

  const handleCBTSelect = (cbt: CBTQuiz) => {
    try {
      // Navigate to CBT question creation or detail screen
      navigation.navigate('CBTQuestionCreation' as never, {
        quizId: cbt.id,
        quizTitle: cbt.title,
        subjectId: cbt.subject_id,
      });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback: just log the error instead of crashing
    }
  };

  const handleAssessmentCountsChange = (counts: any) => {
    setAssessmentCounts(counts);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh both topics and assessments data
      await Promise.all([
        invalidateAndRefetch(),
        // The CBTList component will handle its own refresh
      ]);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Course Header - Fixed Position */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={handleBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Image 
            source={{ uri: (displaySubject as any)?.thumbnail || subject?.thumbnail }} 
            className="w-16 h-16 rounded-xl"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {capitalizeWords((displaySubject as any)?.name || subject?.name || '')}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {capitalizeWords((displaySubject as any)?.description || subject?.description || '')}
            </Text>
            <View className="flex-row items-center gap-4 mt-2">
              <View className="flex-row items-center gap-1">
                <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {displayStats?.totalVideos || (displaySubject as any)?.totalVideos || subject?.totalVideos || 0} videos
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="document-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {displayStats?.totalMaterials || (displaySubject as any)?.totalMaterials || subject?.totalMaterials || 0} materials
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="people-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {displayStats?.totalStudents || (displaySubject as any)?.totalStudents || subject?.totalStudents || 0} students
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Topics Section - Fixed Position */}
      <View className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
        {/* Tab Navigation */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <TouchableOpacity
              onPress={() => setActiveTab('topics')}
              className={`px-4 py-2 rounded-md flex-row items-center gap-2 ${
                activeTab === 'topics' 
                  ? 'bg-blue-600' 
                  : 'bg-transparent'
              }`}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="folder-outline" 
                size={16} 
                color={activeTab === 'topics' ? 'white' : '#6b7280'} 
              />
              <Text className={`font-medium ${
                activeTab === 'topics' 
                  ? 'text-white' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                Topics
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('assessments')}
              className={`px-4 py-2 rounded-md flex-row items-center gap-2 ${
                activeTab === 'assessments' 
                  ? 'bg-blue-600' 
                  : 'bg-transparent'
              }`}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="help-circle-outline" 
                size={16} 
                color={activeTab === 'assessments' ? 'white' : '#6b7280'} 
              />
              <Text className={`font-medium ${
                activeTab === 'assessments' 
                  ? 'text-white' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                Assessments
              </Text>
            </TouchableOpacity>
          </View>
          
        {/* Action Buttons - Only show for teachers and directors */}
        {userRole !== 'student' && (
          <View className="flex-row items-center gap-2">
            {activeTab === 'topics' ? (
              <TouchableOpacity
                onPress={handleAddTopic}
                activeOpacity={0.7}
                className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
              >
                <Ionicons name="add" size={16} color="white" />
                <Text className="text-white font-semibold text-sm">Create Topic</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleCreateCBT}
                activeOpacity={0.7}
                className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
              >
                <Ionicons name="add-circle" size={16} color="white" />
                <Text className="text-white font-semibold text-sm">Create CBT</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        </View>

        {/* Search and Filters - Only for Topics tab and non-students */}
        {activeTab === 'topics' && updateSearch && userRole !== 'student' && (
          <View className="mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="flex-1 relative">
                <Ionicons 
                  name="search" 
                  size={20} 
                  color="#9ca3af" 
                  style={{ position: 'absolute', left: 12, top: 10, zIndex: 1 }}
                />
                <TextInput
                  placeholder="Search topics..."
                  value={currentSearch || ''}
                  onChangeText={updateSearch}
                  className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-gray-100"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              <TouchableOpacity
                onPress={clearFilters}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                activeOpacity={0.7}
              >
                <Text className="text-gray-600 dark:text-gray-400 text-sm">Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* View All Assessments Button - Only for Assessments tab */}
        {activeTab === 'assessments' && (
          <View className="mb-4">
            <TouchableOpacity
              onPress={handleViewAllAssessments}
              activeOpacity={0.7}
              className="bg-blue-600 px-4 py-3 rounded-lg flex-row items-center justify-center gap-2"
            >
              <Ionicons name="list-outline" size={18} color="white" />
              <Text className="text-white font-semibold text-sm">View All Assessments</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading State - Only for Topics tab */}
        {activeTab === 'topics' && isLoading && (
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
            <View className="rounded-full h-12 w-12 border-b-2 border-purple-600" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
              Loading Topics...
            </Text>
          </View>
        )}

        {/* Error State - Only for Topics tab */}
        {activeTab === 'topics' && error && !isLoading && (
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
            <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
              Error Loading Topics
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-4">
              {error.toString()}
            </Text>
            <TouchableOpacity
              onPress={() => refetch()}
              activeOpacity={0.7}
              className="bg-purple-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
            >
              <Ionicons name="refresh" size={16} color="white" />
              <Text className="text-white font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Content Area - Conditional based on active tab and user role */}
      {activeTab === 'topics' ? (
        userRole === 'student' ? (
          /* Student Topics List - Read-only */
          <StudentTopicList
            topics={localTopics as any[]}
            subjectColor={(displaySubject as any)?.color || '#3B82F6'}
            subjectName={(displaySubject as any)?.name || subject?.name || 'Subject'}
            subjectCode={(apiSubject as any)?.code || 'SUB'}
            onTopicPress={(topic) => {
              // Handle topic press for students - maybe show topic details
              console.log('Student pressed topic:', topic.title);
            }}
            isRefreshing={isRefreshing}
            onRefresh={refreshTopicContent}
          />
        ) : (
          /* Teacher/Director Topics List - With actions */
          !isLoading && !error && localTopics.length > 0 ? (
            <ScrollView 
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={!isDragging}
            >
              <SimpleDraggableList
                topics={localTopics}
                subjectId={(displaySubject as any)?.id || subject?.id || ''}
                subjectName={(displaySubject as any)?.name || subject?.name || 'Subject'}
                subjectCode={(apiSubject as any)?.code || 'SUB'}
                onAddVideo={handleAddVideo}
                onAddMaterial={handleAddMaterial}
                onEditInstructions={handleEditInstructions}
                onTopicsReorder={handleTopicsReorder}
                onRefresh={refreshTopicContent}
                onScroll={(event) => {
                  // Handle scroll events from drag operations
                  if (event?.type === 'drag_start') {
                    setIsDragging(true);
                  } else if (event?.type === 'drag_end') {
                    setIsDragging(false);
                  }
                }}
              />
            </ScrollView>
          ) : !isLoading && !error ? (
            <View className="flex-1 px-6 py-4">
              <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
                <Ionicons name="folder-outline" size={64} color="#9ca3af" />
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                  No Topics Yet
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-4">
                  Start by adding your first topic to organize your content
                </Text>
                <TouchableOpacity
                  onPress={handleAddTopic}
                  activeOpacity={0.7}
                  className="bg-purple-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
                >
                  <Ionicons name="add" size={16} color="white" />
                  <Text className="text-white font-semibold">Create Your First Topic</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        )
      ) : (
        /* Assessments Tab - Only for teachers and directors */
        userRole !== 'student' ? (
          <View className="flex-1 px-6">
            <CBTList
              subjectId={subjectId}
              onCBTSelect={handleCBTSelect}
              onCreateCBT={handleCreateCBT}
              onAssessmentCountsChange={handleAssessmentCountsChange}
            />
          </View>
        ) : (
          <View className="flex-1 px-6 py-4">
            <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
              <Ionicons name="help-circle-outline" size={64} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                Assessments Not Available
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                Students cannot access assessments from this view.
              </Text>
            </View>
          </View>
        )
      )}

      {/* Modals - Only show for teachers and directors */}
      {userRole !== 'student' && (
        <>
          <VideoUploadModal
            visible={showVideoModal}
            topic={selectedTopic as Topic}
            subjectId={(displaySubject as any)?.id || subject?.id || ''}
            onClose={() => {
              setShowVideoModal(false);
              setSelectedTopic(null);
            }}
          />

          <MaterialUploadModal
            visible={showMaterialModal}
            topic={selectedTopic as Topic}
            subjectId={(displaySubject as any)?.id || subject?.id || ''}
            topicId={selectedTopic?.id || ''}
            onClose={() => {
              setShowMaterialModal(false);
              setSelectedTopic(null);
            }}
          />

          <InstructionModal
            visible={showInstructionModal}
            topic={selectedTopic as Topic}
            onClose={() => {
              setShowInstructionModal(false);
              setSelectedTopic(null);
            }}
          />

          {/* Create Topic Modal */}
          <CreateTopicModal
            visible={showCreateTopicModal}
            onClose={() => setShowCreateTopicModal(false)}
            onSubmit={handleCreateTopic}
            subjectName={capitalizeWords((displaySubject as any)?.name || '')}
            subjectId={(displaySubject as any)?.id || subject?.id || ''}
          />
        </>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Default export for backward compatibility
export default function GlobalSubjectDetailScreen() {
  const route = useRoute();
  const { subject, userRole = 'teacher' } = route.params as any;
  
  return (
    <SubjectDetailScreen 
      userRole={userRole} 
      subject={subject} 
    />
  );
}