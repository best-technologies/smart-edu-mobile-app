import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Dimensions, Alert, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBar from './components/shared/TopBar';
import TopicCard from './components/subjects/TopicCard';
import VideoUploadModal from './components/subjects/VideoUploadModal';
import MaterialUploadModal from './components/subjects/MaterialUploadModal';
import InstructionModal from './components/subjects/InstructionModal';
import CreateTopicModal from './components/subjects/CreateTopicModal';
import { capitalizeWords } from '@/utils/textFormatter';
import { useSubjectDetails } from '@/hooks/useSubjectDetails';
import { SubjectDetailsFilters, Topic, Video, Material } from './components/subjects/types';
import { useToast } from '@/contexts/ToastContext';
import { TeacherService } from '@/services/api/roleServices';

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
  const navigation = useNavigation();
  const route = useRoute();
  const { subject }: { subject: Subject } = route.params as any;
  const { showSuccess, showError } = useToast();
  
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showCreateTopicModal, setShowCreateTopicModal] = useState(false);

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
    subjectId: subject?.id || '',
    page: 1,
    limit: 10,
    enabled: !!subject?.id,
  });

    // Use API data if available, fallback to route params
  const displaySubject = apiSubject || subject;
  const displayTopics = apiTopics || [];
  const displayStats = stats;

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

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="pb-20"
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={['#8b5cf6']} // Purple color to match theme
            tintColor="#8b5cf6"
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

        {/* Course Stats - Temporarily Removed */}
        {/* <View className="px-6 py-4">
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Course Progress
            </Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</Text>
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {displaySubject?.progress || subject?.progress || 0}%
              </Text>
            </View>
            <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View 
                className="h-full bg-purple-500"
                style={{ 
                  width: `${displaySubject?.progress || subject?.progress || 0}%` 
                }}
              />
            </View>
          </View>
        </View> */}

        {/* Topics Section */}
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Course Topics
            </Text>
            <TouchableOpacity
              onPress={handleAddTopic}
              activeOpacity={0.7}
              className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-semibold text-sm">Create Topic</Text>
            </TouchableOpacity>
          </View>

          {/* Search and Filters */}
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

          {/* Loading State */}
          {isLoading && (
            <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
              <View className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                Loading Topics...
              </Text>
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
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

          {/* Topics List */}
          {!isLoading && !error && displayTopics.length > 0 ? (
            <View className="gap-4">
              {displayTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onAddVideo={() => handleAddVideo(topic)}
                  onAddMaterial={() => handleAddMaterial(topic)}
                  onEditInstructions={() => handleEditInstructions(topic)}
                />
              ))}
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <View className="mt-6 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Page {pagination.page} of {pagination.totalPages}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {pagination.total} topics total
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-center gap-2">
                    <TouchableOpacity
                      onPress={() => updatePage(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className={`px-3 py-2 rounded-lg ${
                        pagination.hasPrev 
                          ? 'bg-purple-600' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      activeOpacity={0.7}
                    >
                      <Text className={`text-sm font-medium ${
                        pagination.hasPrev 
                          ? 'text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        Previous
                      </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      onPress={() => updatePage(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className={`px-3 py-2 rounded-lg ${
                        pagination.hasNext 
                          ? 'bg-purple-600' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                      activeOpacity={0.7}
                    >
                      <Text className={`text-sm font-medium ${
                        pagination.hasNext 
                          ? 'text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        Next
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : !isLoading && !error ? (
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
          ) : null}
        </View>
      </ScrollView>

      {/* Modals */}
      <VideoUploadModal
        visible={showVideoModal}
        topic={selectedTopic}
        onClose={() => {
          setShowVideoModal(false);
          setSelectedTopic(null);
        }}
      />

      <MaterialUploadModal
        visible={showMaterialModal}
        topic={selectedTopic}
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
    </SafeAreaView>
  );
}
