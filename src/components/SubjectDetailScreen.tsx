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
// import { useDirectorSubjectDetails } from '@/hooks/useDirectorSubjectDetails';

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

  // const directorData = useDirectorSubjectDetails({
  //   subjectId,
  //   enabled: !!subjectId && userRole === 'director',
  // });

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
          subject: studentData.data,
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
          refetch: () => Promise.resolve(),
          invalidateAndRefetch: () => Promise.resolve(),
        };
      default:
        return null;
    }
  };

  const roleData = getDataByRole();

  // Use API data if available, fallback to route params
  const displaySubject = roleData?.subject || subject;
  const displayTopics = roleData?.topics || [];
  const displayStats = roleData?.stats;
  
  // Local state for reordering topics (teacher only)
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  
  // Update local topics when API data changes (teacher only)
  useEffect(() => {
    if (userRole === 'teacher' && roleData && roleData.topics && roleData.topics.length > 0) {
      setLocalTopics(roleData.topics as Topic[]);
    }
  }, [roleData?.topics, userRole]);

  // Teacher-specific handlers
  const handleAddTopic = () => {
    if (userRole === 'teacher') {
      setShowCreateTopicModal(true);
    }
  };

  const handleCreateTopic = async (topicData: any) => {
    if (userRole !== 'teacher') return;
    
    try {
      const { TeacherService } = await import('@/services/api/roleServices');
      const teacherService = new TeacherService();
      
      const payload = {
        title: topicData.title,
        description: topicData.description,
        subject_id: topicData.subjectId,
        is_active: true
      };
      
      const response = await teacherService.createTopic(payload);
      
      if (response.success) {
        showSuccess(
          'Topic Created Successfully! 🎉',
          `"${capitalizeWords(topicData.title)}" has been added to ${capitalizeWords(displaySubject?.name || '')}`,
          5000
        );
        
        setShowCreateTopicModal(false);
        roleData?.invalidateAndRefetch?.();
      } else {
        showError(
          'Failed to Create Topic',
          response.message || 'Something went wrong. Please try again.',
          5000
        );
      }
    } catch (error) {
      console.error('Error creating topic:', error);
      showError(
        'Error Creating Topic',
        'Network error or server issue. Please check your connection and try again.',
        5000
      );
    }
  };

  const handleAddVideo = (topic: Topic) => {
    if (userRole === 'teacher') {
      setSelectedTopic(topic);
      setShowVideoModal(true);
    }
  };

  const handleAddMaterial = (topic: Topic) => {
    if (userRole === 'teacher') {
      setSelectedTopic(topic);
      setShowMaterialModal(true);
    }
  };

  const handleEditInstructions = (topic: Topic) => {
    if (userRole === 'teacher') {
      setSelectedTopic(topic);
      setShowInstructionModal(true);
    }
  };

  const handleTopicsReorder = (newTopics: Topic[]) => {
    if (userRole === 'teacher') {
      setLocalTopics(newTopics);
    }
  };

  // Student/Director handlers
  const handleTopicPress = (topic: StudentTopic | DirectorTopic) => {
    if (userRole === 'student' || userRole === 'director') {
      setSelectedTopic(topic);
      setShowTopicModal(true);
    }
  };

  const handleCloseTopicModal = () => {
    setShowTopicModal(false);
    setSelectedTopic(null);
  };

  // Common handlers
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  const handleCreateCBT = () => {
    if (userRole === 'teacher') {
      navigation.navigate('CBTCreation' as never, {
        subjectId: displaySubject?.id || subject?.id,
        subjectName: displaySubject?.name || subject?.name,
      });
    }
  };

  const handleViewAllAssessments = () => {
    if (userRole === 'teacher') {
      navigation.navigate('AssessmentsList' as never, {
        subjectId: displaySubject?.id || subject?.id,
        subjectName: displaySubject?.name || subject?.name,
      });
    }
  };

  const handleCBTSelect = (cbt: CBTQuiz) => {
    if (userRole === 'teacher') {
      try {
        navigation.navigate('CBTQuestionCreation' as never, {
          quizId: cbt.id,
          quizTitle: cbt.title,
          subjectId: cbt.subject_id,
        });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  const handleAssessmentCountsChange = (counts: any) => {
    if (userRole === 'teacher') {
      setAssessmentCounts(counts);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (userRole === 'teacher') {
        await roleData?.invalidateAndRefetch?.();
      } else {
        await roleData?.refetch?.();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Refresh specific topic content (teacher only)
  const refreshTopicContent = useCallback(() => {
    if (userRole === 'teacher') {
      queryClient.invalidateQueries({ queryKey: ['subjectDetails', subject?.id] });
      roleData?.refetch?.();
    }
  }, [queryClient, subject?.id, roleData?.refetch, userRole]);

  // Loading state
  if (roleData?.isLoading && !roleData?.data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <View className="rounded-full h-12 w-12 border-b-2 border-purple-600" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Loading {userRole === 'teacher' ? 'Topics' : 'Subject Details'}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (roleData?.error && !roleData?.isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Error Loading {userRole === 'teacher' ? 'Topics' : 'Subject Details'}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-4">
            {roleData.error.toString()}
          </Text>
          <TouchableOpacity
            onPress={() => roleData?.refetch?.()}
            activeOpacity={0.7}
            className="bg-purple-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
          >
            <Ionicons name="refresh" size={16} color="white" />
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Course Header */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={handleBack} className="p-2">
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Image 
              source={{ 
                uri: typeof displaySubject?.thumbnail === 'string' 
                  ? displaySubject.thumbnail 
                  : displaySubject?.thumbnail?.secure_url || subject?.thumbnail || ''
              }} 
              className="w-16 h-16 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {capitalizeWords(displaySubject?.name || subject?.name || '')}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {capitalizeWords(displaySubject?.description || subject?.description || '')}
              </Text>
              <View className="flex-row items-center gap-4 mt-2">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    {displayStats?.totalVideos || displaySubject?.totalVideos || subject?.totalVideos || 0} videos
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="document-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    {displayStats?.totalMaterials || displaySubject?.totalMaterials || subject?.totalMaterials || 0} materials
                  </Text>
                </View>
                {userRole === 'teacher' && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="people-outline" size={14} color="#6b7280" />
                    <Text className="text-xs text-gray-600 dark:text-gray-400">
                      {(displayStats as any)?.totalStudents || (displaySubject as any)?.totalStudents || (subject as any)?.totalStudents || 0} students
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Content based on role */}
        {userRole === 'teacher' ? (
          // Teacher-specific content
          <>
            {/* Topics Section */}
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
                
                {/* Action Buttons */}
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
              </View>

              {/* Search and Filters - Only for Topics tab */}
              {activeTab === 'topics' && (
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
                        value={roleData?.currentSearch || ''}
                        onChangeText={roleData?.updateSearch || undefined}
                        className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-900 dark:text-gray-100"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={roleData?.clearFilters || undefined}
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
            </View>

            {/* Content Area */}
            {activeTab === 'topics' ? (
              /* Topics List */
              !roleData?.isLoading && !roleData?.error && localTopics.length > 0 ? (
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
                    subjectId={displaySubject?.id || subject?.id || ''}
                    subjectName={displaySubject?.name || subject?.name || 'Subject'}
                    subjectCode={displaySubject?.code || 'SUB'}
                    onAddVideo={handleAddVideo}
                    onAddMaterial={handleAddMaterial}
                    onEditInstructions={handleEditInstructions}
                    onTopicsReorder={handleTopicsReorder}
                    onRefresh={refreshTopicContent}
                    onScroll={(event) => {
                      if (event?.type === 'drag_start') {
                        setIsDragging(true);
                      } else if (event?.type === 'drag_end') {
                        setIsDragging(false);
                      }
                    }}
                  />
                </ScrollView>
              ) : !roleData?.isLoading && !roleData?.error ? (
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
            ) : (
              /* Assessments Tab */
              <View className="flex-1 px-6">
                <CBTList
                  subjectId={subjectId}
                  onCBTSelect={handleCBTSelect}
                  onCreateCBT={handleCreateCBT}
                  onAssessmentCountsChange={handleAssessmentCountsChange}
                />
              </View>
            )}
          </>
        ) : (
          // Student/Director content
          <>
            {/* Topics Section */}
            <View className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Topics & Content
                </Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="folder-outline" size={16} color="#6b7280" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {displayTopics.length} topics
                  </Text>
                </View>
              </View>
            </View>

            {/* Topics List */}
            {userRole === 'student' ? (
              <StudentTopicList
                topics={displayTopics as any}
                subjectColor={displaySubject?.color || '#3B82F6'}
                subjectName={displaySubject?.name || ''}
                subjectCode={displaySubject?.code || ''}
                onTopicPress={handleTopicPress}
                isLoading={roleData?.isLoading || false}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            ) : (
              <DirectorTopicList
                topics={displayTopics as any}
                subjectColor={displaySubject?.color || '#3B82F6'}
                subjectName={displaySubject?.name || ''}
                subjectCode={displaySubject?.code || ''}
                onTopicPress={handleTopicPress}
                isLoading={roleData?.isLoading || false}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* Modals - Teacher only */}
      {userRole === 'teacher' && (
        <>
          <VideoUploadModal
            visible={showVideoModal}
            topic={selectedTopic as Topic}
            subjectId={displaySubject?.id || subject?.id || ''}
            onClose={() => {
              setShowVideoModal(false);
              setSelectedTopic(null);
            }}
          />

          <MaterialUploadModal
            visible={showMaterialModal}
            topic={selectedTopic as Topic}
            subjectId={displaySubject?.id || subject?.id || ''}
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

          <CreateTopicModal
            visible={showCreateTopicModal}
            onClose={() => setShowCreateTopicModal(false)}
            onSubmit={handleCreateTopic}
            subjectName={capitalizeWords(displaySubject?.name || '')}
            subjectId={displaySubject?.id || subject?.id || ''}
          />
        </>
      )}

      {/* Topic Detail Modals - Student/Director */}
      {userRole === 'student' && (
        <StudentTopicDetailModal
          visible={showTopicModal}
          topic={selectedTopic as StudentTopic}
          subjectColor={displaySubject?.color || '#3B82F6'}
          onClose={handleCloseTopicModal}
        />
      )}

      {userRole === 'director' && (
        <DirectorTopicDetailModal
          visible={showTopicModal}
          topic={selectedTopic as DirectorTopic}
          subjectColor={displaySubject?.color || '#3B82F6'}
          onClose={handleCloseTopicModal}
        />
      )}
    </SafeAreaView>
  );
}

export default SubjectDetailScreen;
