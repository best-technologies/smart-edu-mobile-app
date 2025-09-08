import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTeacherSubjects } from '@/hooks/useTeacherSubjects';
import { CenteredLoader } from '@/components';
import { cbtService } from '@/services/api/cbtService';
import { CBTQuiz, AssessmentsResponse } from '@/services/types/cbtTypes';

const { width } = Dimensions.get('window');

export default function AssessmentsListScreen() {
  const queryClient = useQueryClient();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    subjects,
    isLoading: subjectsLoading,
    error: subjectsError,
    refetch: refetchSubjects,
  } = useTeacherSubjects();

  // Auto-select first subject when subjects are loaded
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubjectId) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects, selectedSubjectId]);

  // Fetch assessments for selected subject
  const {
    data: assessmentsData,
    isLoading: assessmentsLoading,
    error: assessmentsError,
    refetch: refetchAssessments,
    isFetching: assessmentsFetching,
  } = useQuery({
    queryKey: ['assessments', selectedSubjectId, page],
    queryFn: async () => {
      if (!selectedSubjectId) return null;
      try {
        console.log('🔍 Fetching assessments for subject:', selectedSubjectId);
        const result = await cbtService.getAssessments(selectedSubjectId, page, limit);
        console.log('✅ Assessments response:', result);
        return result;
      } catch (error) {
        console.error('❌ Assessments API error:', error);
        throw error;
      }
    },
    enabled: !!selectedSubjectId,
    staleTime: 30000,
    gcTime: 300000,
  });

  // Delete assessment mutation
  const deleteAssessmentMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      console.log('🗑️ Deleting assessment:', assessmentId);
      return await cbtService.deleteQuiz(assessmentId);
    },
    onSuccess: (data, assessmentId) => {
      console.log('✅ Assessment deleted successfully:', assessmentId);
      queryClient.invalidateQueries({ queryKey: ['assessments', selectedSubjectId] });
      Alert.alert(
        'Success',
        'Assessment deleted successfully',
        [{ text: 'OK' }]
      );
    },
    onError: (error: any, assessmentId) => {
      console.error('❌ Delete assessment error:', error, 'for assessment:', assessmentId);
      Alert.alert(
        'Error',
        error?.message || 'Failed to delete assessment. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  // Publish assessment mutation
  const publishAssessmentMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      console.log('🚀 Publishing assessment:', assessmentId);
      return await cbtService.publishQuiz(assessmentId);
    },
    onSuccess: (data, assessmentId) => {
      console.log('✅ Assessment published successfully:', assessmentId);
      queryClient.invalidateQueries({ queryKey: ['assessments', selectedSubjectId] });
      Alert.alert(
        'Success',
        'Assessment published successfully',
        [{ text: 'OK' }]
      );
    },
    onError: (error: any, assessmentId) => {
      console.error('❌ Publish assessment error:', error, 'for assessment:', assessmentId);
      Alert.alert(
        'Error',
        error?.message || 'Failed to publish assessment. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  const handleSubjectPress = (subject: any) => {
    console.log('Subject pressed:', subject.name);
    setSelectedSubjectId(subject.id);
    setPage(1); // Reset to first page when changing subjects
  };

  const handleDeleteAssessment = (assessment: CBTQuiz) => {
    Alert.alert(
      'Delete Assessment',
      `Are you sure you want to delete "${assessment.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            console.log('🗑️ User confirmed deletion of assessment:', assessment.id);
            deleteAssessmentMutation.mutate(assessment.id);
          }
        },
      ]
    );
  };

  const handlePublishAssessment = (assessment: CBTQuiz) => {
    Alert.alert(
      'Publish Assessment',
      `Publish "${assessment.title}" to make it available to students?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Publish', 
          onPress: () => {
            console.log('🚀 User confirmed publication of assessment:', assessment.id);
            publishAssessmentMutation.mutate(assessment.id);
          }
        },
      ]
    );
  };

  const getStatusColor = (status: string, isPublished: boolean) => {
    if (isPublished) return '#10b981'; // green
    if (status === 'DRAFT') return '#f59e0b'; // yellow
    if (status === 'ACTIVE') return '#3b82f6'; // blue
    return '#6b7280'; // gray
  };

  const getStatusText = (status: string, isPublished: boolean) => {
    if (isPublished) return 'Published';
    if (status === 'DRAFT') return 'Draft';
    if (status === 'ACTIVE') return 'Active';
    return status;
  };

  // Convert grouped assessments to flat array
  const allAssessments = assessmentsData?.assessments 
    ? Object.values(assessmentsData.assessments).flat()
    : [];
  const pagination = assessmentsData?.pagination;
  const assessments = Array.isArray(allAssessments) ? allAssessments : [];

  const handleRefresh = async () => {
    await Promise.all([
      refetchSubjects(),
      refetchAssessments(),
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={subjectsLoading || assessmentsFetching}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        <View className="px-4 py-6">
          <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Assessment
          </Text>
          
          {/* Subjects Loading State */}
          {subjectsLoading ? (
            <CenteredLoader visible={true} text="Loading subjects..." />
          ) : subjectsError ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                Error loading subjects
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                {subjectsError}
              </Text>
              <TouchableOpacity
                onPress={refetchSubjects}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : subjects.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No subjects found
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                You don't have any subjects assigned yet.
              </Text>
            </View>
          ) : (
            <View>
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Select Subject
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                className="mb-6"
              >
                {subjects.map((subject) => (
                  <TouchableOpacity
                    key={subject.id}
                    onPress={() => handleSubjectPress(subject)}
                    className="mr-4"
                    style={{ width: width * 0.4 }}
                  >
                    <View
                      className={`rounded-lg p-4 shadow-sm border-l-4 ${
                        selectedSubjectId === subject.id 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                          : 'bg-white dark:bg-gray-800'
                      }`}
                      style={{ borderLeftColor: subject.color }}
                    >
                      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {subject.code}
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400" numberOfLines={2}>
                        {subject.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Assessments Section */}
          {selectedSubjectId && (
            <View>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Assessments
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log('➕ User requested to create assessment');
                    // TODO: Navigate to create assessment
                  }}
                  activeOpacity={0.7}
                  className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
                >
                  <Ionicons name="add" size={16} color="white" />
                  <Text className="text-white font-semibold text-sm">Assessment</Text>
                </TouchableOpacity>
              </View>
              
              {/* Assessments Loading State */}
              {assessmentsLoading ? (
                <CenteredLoader visible={true} text="Loading assessments..." />
              ) : assessmentsError ? (
                <View className="flex-1 items-center justify-center py-8">
                  <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                  <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                    Error Loading Assessments
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-4 px-4">
                    {assessmentsError.message || 'Unable to load assessments. Please check your connection and try again.'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => refetchAssessments()}
                    activeOpacity={0.7}
                    className="bg-blue-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
                  >
                    <Ionicons name="refresh" size={16} color="white" />
                    <Text className="text-white font-semibold">Try Again</Text>
                  </TouchableOpacity>
                </View>
              ) : assessments.length === 0 ? (
                <View className="flex-1 items-center justify-center py-16">
                  <Ionicons name="help-circle-outline" size={64} color="#9ca3af" />
                  <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                    No Assessments Yet
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-6">
                    Create your first assessment to test your students' knowledge
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('➕ User requested to create assessment');
                      // TODO: Navigate to create assessment
                    }}
                    activeOpacity={0.7}
                    className="bg-green-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
                  >
                    <Ionicons name="add-circle" size={16} color="white" />
                    <Text className="text-white font-semibold">Create Assessment</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  {assessments.map((assessment) => (
                    <View
                      key={assessment.id}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700 mb-3"
                    >
                      {/* Assessment Header */}
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1 mr-3">
                          <Text className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {assessment.title}
                          </Text>
                          
                          {/* Badges Row */}
                          <View className="flex-row items-center gap-2 mb-2">
                            <View 
                              className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"
                            >
                              <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                {assessment.assessment_type}
                              </Text>
                            </View>
                            <View 
                              className="px-2 py-1 rounded-full"
                              style={{ backgroundColor: `${getStatusColor(assessment.status, assessment.is_published)}20` }}
                            >
                              <Text 
                                className="text-xs font-medium"
                                style={{ color: getStatusColor(assessment.status, assessment.is_published) }}
                              >
                                {getStatusText(assessment.status, assessment.is_published)}
                              </Text>
                            </View>
                          </View>
                          
                          {assessment.description && (
                            <Text className="text-xs text-gray-600 dark:text-gray-400 leading-4" numberOfLines={2}>
                              {assessment.description}
                            </Text>
                          )}
                        </View>
                        
                        {/* Assessment Actions */}
                        <View className="flex-row items-center gap-1">
                          <TouchableOpacity
                            onPress={() => {
                              console.log('👁️ User wants to view assessment:', assessment.id);
                              // TODO: Navigate to assessment details
                            }}
                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                            activeOpacity={0.7}
                          >
                            <Ionicons name="eye-outline" size={14} color="#3b82f6" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              console.log('✏️ User wants to edit assessment:', assessment.id);
                              // TODO: Navigate to edit assessment
                            }}
                            className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                            activeOpacity={0.7}
                          >
                            <Ionicons name="create-outline" size={14} color="#6b7280" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteAssessment(assessment)}
                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            activeOpacity={0.7}
                            disabled={deleteAssessmentMutation.isPending}
                          >
                            <Ionicons 
                              name={deleteAssessmentMutation.isPending ? "hourglass-outline" : "trash-outline"} 
                              size={14} 
                              color="#dc2626" 
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {/* Assessment Details Grid */}
                      <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 mb-2">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-4">
                            <View className="flex-row items-center gap-1">
                              <Ionicons name="time-outline" size={12} color="#3b82f6" />
                              <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {assessment.duration} min
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Ionicons name="help-circle-outline" size={12} color="#10b981" />
                              <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {assessment._count?.questions || 0} q
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Ionicons name="star-outline" size={12} color="#8b5cf6" />
                              <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {assessment.total_points} pts
                              </Text>
                            </View>
                          </View>
                          
                          {/* Publish Button */}
                          {!assessment.is_published && (
                            <TouchableOpacity
                              onPress={() => handlePublishAssessment(assessment)}
                              disabled={publishAssessmentMutation.isPending}
                              className="px-2 py-1 bg-green-600 rounded-lg flex-row items-center gap-1"
                              style={{ 
                                opacity: publishAssessmentMutation.isPending ? 0.6 : 1 
                              }}
                              activeOpacity={0.7}
                            >
                              <Ionicons 
                                name={publishAssessmentMutation.isPending ? "hourglass-outline" : "rocket-outline"} 
                                size={10} 
                                color="white" 
                              />
                              <Text className="text-white text-xs font-medium">
                                {publishAssessmentMutation.isPending ? 'Publishing...' : 'Publish'}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        
                        <View className="flex-row items-center gap-4 mt-1">
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="refresh-outline" size={12} color="#f59e0b" />
                            <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {assessment.max_attempts} attempt{assessment.max_attempts !== 1 ? 's' : ''}
                            </Text>
                          </View>
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="trophy-outline" size={12} color="#eab308" />
                            <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {assessment.passing_score}% pass
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Tags */}
                      {assessment.tags && assessment.tags.length > 0 && (
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="pricetag-outline" size={12} color="#6b7280" />
                          <View className="flex-row items-center gap-1 flex-wrap">
                            {assessment.tags.slice(0, 3).map((tag, index) => (
                              <View key={index} className="bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                                <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                  {tag}
                                </Text>
                              </View>
                            ))}
                            {assessment.tags.length > 3 && (
                              <Text className="text-xs text-gray-500 dark:text-gray-400">
                                +{assessment.tags.length - 3} more
                              </Text>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <View className="flex-row items-center justify-center gap-2 mt-6">
                  <TouchableOpacity
                    onPress={() => {
                      console.log('⬅️ User navigating to previous page:', page - 1);
                      setPage(page - 1);
                    }}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded-lg ${
                      page === 1 
                        ? 'bg-gray-200 dark:bg-gray-700' 
                        : 'bg-blue-600'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`font-medium ${
                      page === 1 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : 'text-white'
                    }`}>
                      Previous
                    </Text>
                  </TouchableOpacity>
                  
                  <Text className="text-gray-600 dark:text-gray-400 px-4">
                    Page {page} of {pagination.totalPages}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={() => {
                      console.log('➡️ User navigating to next page:', page + 1);
                      setPage(page + 1);
                    }}
                    disabled={page === pagination.totalPages}
                    className={`px-4 py-2 rounded-lg ${
                      page === pagination.totalPages 
                        ? 'bg-gray-200 dark:bg-gray-700' 
                        : 'bg-blue-600'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`font-medium ${
                      page === pagination.totalPages 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : 'text-white'
                    }`}>
                      Next
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
