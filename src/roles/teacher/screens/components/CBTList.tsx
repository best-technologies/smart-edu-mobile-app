import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cbtService } from '@/services/api/cbtService';
import { CBTQuiz, AssessmentsResponse } from '@/services/types/cbtTypes';

interface CBTListProps {
  subjectId: string;
  onCBTSelect: (cbt: CBTQuiz) => void;
  onCreateCBT: () => void;
  onAssessmentCountsChange?: (counts: any) => void;
}

export default function CBTList({ 
  subjectId, 
  onCBTSelect, 
  onCreateCBT, 
  onAssessmentCountsChange 
}: CBTListProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  // Reset page when component mounts
  useEffect(() => {
    setPage(1);
  }, []);

  // Fetch Assessments with proper error handling
  const {
    data: assessmentsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['assessments', subjectId, page],
    queryFn: async () => {
      try {
        console.log('🔍 CBTList API call:', { subjectId, page, limit });
        const result = await cbtService.getAssessments(subjectId, page, limit);
        console.log('✅ CBTList API response:', result);
        return result;
      } catch (error) {
        console.error('❌ CBTList API error:', error);
        throw error;
      }
    },
    enabled: !!subjectId,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });

  // Update assessment counts when data changes
  useEffect(() => {
    if (assessmentsData?.counts && onAssessmentCountsChange) {
      console.log('📊 Updating assessment counts:', assessmentsData.counts);
      onAssessmentCountsChange(assessmentsData.counts);
    }
  }, [assessmentsData?.counts, onAssessmentCountsChange]);

  // Delete CBT mutation with better error handling
  const deleteCBTMutation = useMutation({
    mutationFn: async (cbtId: string) => {
      console.log('🗑️ Deleting CBT:', cbtId);
      return await cbtService.deleteQuiz(cbtId);
    },
    onSuccess: (data, cbtId) => {
      console.log('✅ CBT deleted successfully:', cbtId);
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['assessments', subjectId] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      
      // Show success feedback using Alert instead of toast
      Alert.alert(
        'Success',
        'Assessment deleted successfully',
        [{ text: 'OK' }]
      );
    },
    onError: (error: any, cbtId) => {
      console.error('❌ Delete CBT error:', error, 'for CBT:', cbtId);
      
      // Show error feedback using Alert instead of toast
      Alert.alert(
        'Error',
        error?.message || 'Failed to delete assessment. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  // Publish CBT mutation with better error handling
  const publishCBTMutation = useMutation({
    mutationFn: async (cbtId: string) => {
      console.log('🚀 Publishing CBT:', cbtId);
      return await cbtService.publishQuiz(cbtId);
    },
    onSuccess: (data, cbtId) => {
      console.log('✅ CBT published successfully:', cbtId);
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['assessments', subjectId] });
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      
      // Show success feedback using Alert instead of toast
      Alert.alert(
        'Success',
        'Assessment published successfully',
        [{ text: 'OK' }]
      );
    },
    onError: (error: any, cbtId) => {
      console.error('❌ Publish CBT error:', error, 'for CBT:', cbtId);
      
      // Show error feedback using Alert instead of toast
      Alert.alert(
        'Error',
        error?.message || 'Failed to publish assessment. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  const handleDeleteCBT = (cbt: CBTQuiz) => {
    Alert.alert(
      'Delete Assessment',
      `Are you sure you want to delete "${cbt.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            console.log('🗑️ User confirmed deletion of CBT:', cbt.id);
            deleteCBTMutation.mutate(cbt.id);
          }
        },
      ]
    );
  };

  const handlePublishCBT = (cbt: CBTQuiz) => {
    Alert.alert(
      'Publish Assessment',
      `Publish "${cbt.title}" to make it available to students?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Publish', 
          onPress: () => {
            console.log('🚀 User confirmed publication of CBT:', cbt.id);
            publishCBTMutation.mutate(cbt.id);
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
  const allCBTQuizzes = assessmentsData?.assessments 
    ? Object.values(assessmentsData.assessments).flat()
    : [];
  const pagination = assessmentsData?.pagination;

  // Use the assessments directly since filtering is now done on the server
  const cbtQuizzes = Array.isArray(allCBTQuizzes) ? allCBTQuizzes : [];

  console.log('📋 CBTList render:', {
    subjectId,
    page,
    isLoading,
    isFetching,
    cbtQuizzesCount: cbtQuizzes.length,
    hasError: !!error
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <View className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Loading Assessments...
        </Text>
      </View>
    );
  }

  if (error) {
    console.error('❌ CBTList render error:', error);
    return (
      <View className="flex-1 items-center justify-center py-16">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
          Error Loading Assessments
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-4 px-4">
          {error.message || 'Unable to load assessments. Please check your connection and try again.'}
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log('🔄 User requested refetch');
            refetch();
          }}
          activeOpacity={0.7}
          className="bg-blue-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
        >
          <Ionicons name="refresh" size={16} color="white" />
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cbtQuizzes.length === 0) {
    return (
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
            console.log('➕ User requested to create CBT');
            onCreateCBT();
          }}
          activeOpacity={0.7}
          className="bg-green-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
        >
          <Ionicons name="add-circle" size={16} color="white" />
          <Text className="text-white font-semibold">Create Assessment</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={() => {
            console.log('🔄 User initiated refresh');
            refetch();
          }}
          tintColor="#3b82f6"
        />
      }
    >
      <View>
        {cbtQuizzes.map((cbt) => (
          <View
            key={cbt.id}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 mb-4"
          >
            {/* CBT Header */}
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center gap-3 mb-2">
                  <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 flex-1">
                    {cbt.title}
                  </Text>
                </View>
                
                {/* Badges Row */}
                <View className="flex-row items-center gap-2 mb-3">
                  <View 
                    className="px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30"
                  >
                    <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                      {cbt.assessment_type}
                    </Text>
                  </View>
                  <View 
                    className="px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${getStatusColor(cbt.status, cbt.is_published)}20` }}
                  >
                    <Text 
                      className="text-xs font-semibold"
                      style={{ color: getStatusColor(cbt.status, cbt.is_published) }}
                    >
                      {getStatusText(cbt.status, cbt.is_published)}
                    </Text>
                  </View>
                </View>
                
                {cbt.description && (
                  <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    {cbt.description}
                  </Text>
                )}
              </View>
              
              {/* CBT Actions */}
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => {
                    console.log('👁️ User wants to view CBT:', cbt.id);
                    onCBTSelect(cbt);
                  }}
                  className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                  activeOpacity={0.7}
                >
                  <Ionicons name="eye-outline" size={20} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log('✏️ User wants to edit CBT:', cbt.id);
                    onCBTSelect(cbt);
                  }}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteCBT(cbt)}
                  className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  activeOpacity={0.7}
                  disabled={deleteCBTMutation.isPending}
                >
                  <Ionicons 
                    name={deleteCBTMutation.isPending ? "hourglass-outline" : "trash-outline"} 
                    size={20} 
                    color="#dc2626" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* CBT Details Grid */}
            <View className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-6">
                  <View className="flex-row items-center gap-2">
                    <View className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Ionicons name="time-outline" size={16} color="#3b82f6" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cbt.duration} min
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Ionicons name="help-circle-outline" size={16} color="#10b981" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cbt._count?.questions || 0} questions
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Ionicons name="star-outline" size={16} color="#8b5cf6" />
                  </View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {cbt.total_points} points
                  </Text>
                </View>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-6">
                  <View className="flex-row items-center gap-2">
                    <View className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <Ionicons name="refresh-outline" size={16} color="#f59e0b" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cbt.max_attempts} attempt{cbt.max_attempts !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="p-1.5 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <Ionicons name="trophy-outline" size={16} color="#eab308" />
                    </View>
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cbt.passing_score}% pass
                    </Text>
                  </View>
                </View>
                
                {/* Publish Button */}
                {!cbt.is_published && (
                  <TouchableOpacity
                    onPress={() => handlePublishCBT(cbt)}
                    disabled={publishCBTMutation.isPending}
                    className="px-4 py-2 bg-green-600 rounded-xl flex-row items-center gap-2 opacity-100"
                    style={{ 
                      opacity: publishCBTMutation.isPending ? 0.6 : 1 
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={publishCBTMutation.isPending ? "hourglass-outline" : "rocket-outline"} 
                      size={16} 
                      color="white" 
                    />
                    <Text className="text-white text-sm font-semibold">
                      {publishCBTMutation.isPending ? 'Publishing...' : 'Publish'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Tags */}
            {cbt.tags && cbt.tags.length > 0 && (
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="pricetag-outline" size={16} color="#6b7280" />
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tags:
                  </Text>
                </View>
                <View className="flex-row items-center gap-2 flex-wrap">
                  {cbt.tags.map((tag, index) => (
                    <View key={index} className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800">
                      <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>

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
    </ScrollView>
  );
}