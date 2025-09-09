import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBar from './components/shared/TopBar';
import { 
  StudentTopicList, 
  StudentTopicDetailModal,
  StudentSubjectDetails,
  StudentTopic 
} from './components/subjects';
import { useStudentSubjectDetails } from '../../../hooks/useStudentSubjectDetails';

export default function StudentSubjectDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { subject }: { subject: any } = route.params as any;
  
  const [selectedTopic, setSelectedTopic] = useState<StudentTopic | null>(null);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Memoize subjectId to prevent unnecessary re-renders
  const subjectId = subject?.id || '';

  // API data using the hook
  const {
    data: subjectDetailsData,
    isLoading,
    error,
    refetch,
  } = useStudentSubjectDetails({
    subjectId,
    enabled: !!subjectId,
  });

  // Use API data if available, fallback to route params
  const displaySubject = subjectDetailsData || subject;
  const displayTopics = subjectDetailsData?.topics || [];
  
  const handleBack = () => {
    navigation.goBack();
  };

  const handleTopicPress = (topic: StudentTopic) => {
    setSelectedTopic(topic);
    setShowTopicModal(true);
  };

  const handleCloseTopicModal = () => {
    setShowTopicModal(false);
    setSelectedTopic(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading && !subjectDetailsData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <View className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            Loading Subject Details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !displaySubject) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <Text className="text-lg text-gray-600 dark:text-gray-400 text-center mb-4">
            Failed to load subject details
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
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
        {/* Course Header - Fixed Position */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={handleBack} className="p-2">
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            {displaySubject.thumbnail ? (
              <Image 
                source={{ uri: displaySubject.thumbnail.secure_url }} 
                className="w-16 h-16 rounded-xl"
                resizeMode="cover"
              />
            ) : (
              <View 
                className="w-16 h-16 rounded-xl items-center justify-center"
                style={{ backgroundColor: displaySubject.color || '#3B82F6' }}
              >
                <Ionicons name="book-outline" size={32} color="white" />
              </View>
            )}
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {displaySubject.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {displaySubject.code}
              </Text>
              <View className="flex-row items-center gap-4 mt-2">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="folder-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    {displaySubject.totalTopics || displayTopics.length} topics
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    {displaySubject.totalVideos || 0} videos
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="document-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    {displaySubject.totalMaterials || 0} materials
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Subject Description */}
        {displaySubject.description && (
          <View className="bg-white dark:bg-gray-800 mx-6 mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
              {displaySubject.description}
            </Text>
          </View>
        )}

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
               <StudentTopicList
                 topics={displayTopics}
                 subjectColor={displaySubject.color || '#3B82F6'}
                 subjectName={displaySubject.name}
                 subjectCode={displaySubject.code}
                 onTopicPress={handleTopicPress}
                 isLoading={isLoading}
                 isRefreshing={isRefreshing}
                 onRefresh={handleRefresh}
               />
      </ScrollView>

      {/* Topic Detail Modal */}
      <StudentTopicDetailModal
        visible={showTopicModal}
        topic={selectedTopic}
        subjectColor={displaySubject.color || '#3B82F6'}
        onClose={handleCloseTopicModal}
      />
    </SafeAreaView>
  );
}
