import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Dimensions, Alert, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBar from './components/shared/TopBar';
import SimpleDraggableList from './components/subjects/SimpleDraggableList';
import VideoUploadModal from './components/subjects/VideoUploadModal';
import MaterialUploadModal from './components/subjects/MaterialUploadModal';
import InstructionModal from './components/subjects/InstructionModal';
import CreateTopicModal from './components/subjects/CreateTopicModal';
import CBTList from './components/CBTList';
import { capitalizeWords } from '@/utils/textFormatter';
import { useSubjectDetails } from '@/hooks/useSubjectDetails';
import { SubjectDetailsFilters, Topic, Video, Material } from './components/subjects/types';
import { useToast } from '@/contexts/ToastContext';
import { TeacherService } from '@/services/api/roleServices';
import { useQueryClient } from '@tanstack/react-query';
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
}

export default function SubjectDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { subject }: { subject: Subject } = route.params as any;
  const { showSuccess, showError } = useToast();
  
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'topics' | 'assessments'>('topics');
  const [assessmentCounts, setAssessmentCounts] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoize subjectId to prevent unnecessary re-renders
  const subjectId = useMemo(() => subject?.id || '', [subject?.id]);

  // API data using the hook
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
  } = useSubjectDetails({
    subjectId,
    page: 1,
    limit: 10,
    enabled: !!subjectId,
  });

  const queryClient = useQueryClient();

  // Refresh specific topic content
  const refreshTopicContent = useCallback(() => {
    // Invalidate the subject details query to refresh topic content
    queryClient.invalidateQueries({ queryKey: ['subjectDetails', subject?.id] });
    refetch();
  }, [queryClient, subject?.id, refetch]);

  // Use API data if available, fallback to route params
  const displaySubject = apiSubject || subject;
  const displayTopics = apiTopics || [];
  const displayStats = stats;
  
  // Local state for reordering topics
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  
  // Update local topics when API data changes
  useEffect(() => {
    if (apiTopics.length > 0) {
      setLocalTopics(apiTopics);
    }
  }, [apiTopics]);

  const handleAddTopic = () => {
    setShowCreateTopicModal(true);
  };

  const handleCreateTopic = async (topicData: any) => {
    try {
      const teacherService = new TeacherService();
      
      // Prepare the payload for the API
      const payload = {
        title: topicData.title,
        description: topicData.description,
        subject_id: topicData.subjectId,
        is_active: true
      };
      
      // Make the API call
      const response = await teacherService.createTopic(payload);
      
      if (response.success) {
        // Show success toast
        showSuccess(
          'Topic Created Successfully! 🎉',
          `"${capitalizeWords(topicData.title)}" has been added to ${capitalizeWords(displaySubject?.name || '')}`,
          5000
        );
        
        // Close the modal
        setShowCreateTopicModal(false);
        
        // Refresh the topics data from API
        invalidateAndRefetch();
      } else {
        // Show error toast
        showError(
          'Failed to Create Topic',
          response.message || 'Something went wrong. Please try again.',
          5000
        );
      }
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
    setSelectedTopic(topic);
    setShowVideoModal(true);
  };

  const handleAddMaterial = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowMaterialModal(true);
  };

  const handleEditInstructions = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowInstructionModal(true);
  };

  const handleTopicsReorder = (newTopics: Topic[]) => {
    setLocalTopics(newTopics);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreateCBT = () => {
    navigation.navigate('CBTCreation' as never, {
      subjectId: displaySubject?.id || subject?.id,
      subjectName: displaySubject?.name || subject?.name,
    });
  };

  const handleViewAllAssessments = () => {
    navigation.navigate('AssessmentsList' as never, {
      subjectId: displaySubject?.id || subject?.id,
      subjectName: displaySubject?.name || subject?.name,
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
            source={{ uri: displaySubject?.thumbnail || subject?.thumbnail }} 
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
              <View className="flex-row items-center gap-1">
                <Ionicons name="people-outline" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {displayStats?.totalStudents || displaySubject?.totalStudents || subject?.totalStudents || 0} students
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
                  value={currentSearch}
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
            <View className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
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

      {/* Content Area - Conditional based on active tab */}
      {activeTab === 'topics' ? (
        /* Topics List - Scrollable Container */
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
              subjectId={displaySubject?.id || subject?.id || ''}
              subjectName={displaySubject?.name || subject?.name || 'Subject'}
              subjectCode={apiSubject?.code || 'SUB'}
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

      {/* Modals */}
      <VideoUploadModal
        visible={showVideoModal}
        topic={selectedTopic}
        subjectId={displaySubject?.id || subject?.id || ''}
        onClose={() => {
          setShowVideoModal(false);
          setSelectedTopic(null);
        }}
      />

      <MaterialUploadModal
        visible={showMaterialModal}
        topic={selectedTopic}
        subjectId={displaySubject?.id || subject?.id || ''}
        topicId={selectedTopic?.id || ''}
        onClose={() => {
          setShowMaterialModal(false);
          setSelectedTopic(null);
        }}
      />

      <InstructionModal
        visible={showInstructionModal}
        topic={selectedTopic}
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
        subjectName={capitalizeWords(displaySubject?.name || '')}
        subjectId={displaySubject?.id || subject?.id || ''}
      />
      </ScrollView>
    </SafeAreaView>
  );
}
