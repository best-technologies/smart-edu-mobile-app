import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { useTeacherSubjects } from '@/hooks/useTeacherSubjects';
import { CenteredLoader } from '@/components';
import { cbtService } from '@/services/api/cbtService';
import { CBTQuiz, AssessmentsResponse } from '@/services/types/cbtTypes';
import { useToast } from '@/contexts/ToastContext';

const { width } = Dimensions.get('window');

const ASSESSMENT_TYPES = [
  'ASSIGNMENT',
  'QUIZ',
  'PRACTICE',
  'CBT',
  'EXAM',
  'OTHER'
];

export default function AssessmentsListScreen() {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
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
      showSuccess('Assessment Deleted', 'Assessment has been deleted successfully');
    },
    onError: (error: any, assessmentId) => {
      console.error('❌ Delete assessment error:', error, 'for assessment:', assessmentId);
      showError('Delete Failed', error?.message || 'Failed to delete assessment. Please try again.');
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
      showSuccess('Assessment Published', 'Assessment has been published successfully');
    },
    onError: (error: any, assessmentId) => {
      console.error('❌ Publish assessment error:', error, 'for assessment:', assessmentId);
      showError('Publish Failed', error?.message || 'Failed to publish assessment. Please try again.');
    },
  });

  // Update assessment mutation
  const updateAssessmentMutation = useMutation({
    mutationFn: async ({ assessmentId, assessmentData }: { assessmentId: string; assessmentData: any }) => {
      console.log('✏️ Updating assessment:', assessmentId, assessmentData);
      return await cbtService.updateQuiz(assessmentId, assessmentData);
    },
    onSuccess: (data, { assessmentId }) => {
      console.log('✅ Assessment updated successfully:', assessmentId);
      queryClient.invalidateQueries({ queryKey: ['assessments', selectedSubjectId] });
      showSuccess('Assessment Updated', 'Assessment has been updated successfully');
    },
    onError: (error: any, { assessmentId }) => {
      console.error('❌ Update assessment error:', error, 'for assessment:', assessmentId);
      showError('Update Failed', error?.message || 'Failed to update assessment. Please try again.');
    },
  });

  const handleSubjectPress = (subject: any) => {
    console.log('Subject pressed:', subject.name);
    setSelectedSubjectId(subject.id);
    setPage(1); // Reset to first page when changing subjects
    setSelectedFilter('All'); // Reset filter when changing subjects
    setSelectedStatusFilter('All'); // Reset status filter when changing subjects
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    // Reset status filter when assessment type changes
    setSelectedStatusFilter('All');
    // No need to reset page since we're filtering client-side
  };

  const handleStatusFilterChange = (statusFilter: string) => {
    setSelectedStatusFilter(statusFilter);
    // No need to reset page since we're filtering client-side
  };

  // Inline editing helper functions
  const startEditing = (assessmentId: string, field: string, currentValue: string) => {
    setEditingAssessmentId(assessmentId);
    setEditingField(field);
    setEditingValue(currentValue);
  };

  const saveEdit = (assessmentId: string) => {
    if (!editingField) return;

    const updateData: any = {};
    
    switch (editingField) {
      case 'title':
        updateData.title = editingValue;
        break;
      case 'description':
        updateData.description = editingValue;
        break;
      case 'duration':
        updateData.duration = parseInt(editingValue) || 60;
        break;
      case 'max_attempts':
        updateData.max_attempts = parseInt(editingValue) || 1;
        break;
      case 'passing_score':
        updateData.passing_score = parseInt(editingValue) || 50;
        break;
      case 'total_points':
        updateData.total_points = parseInt(editingValue) || 100;
        break;
      case 'assessment_type':
        updateData.assessment_type = editingValue;
        break;
    }

    // Call the update mutation
    updateAssessmentMutation.mutate({ assessmentId, assessmentData: updateData });
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingAssessmentId(null);
    setEditingField(null);
    setEditingValue('');
  };

  const handleCreateAssessment = () => {
    if (!selectedSubjectId) {
      showError('No Subject Selected', 'Please select a subject first before creating an assessment.');
      return;
    }

    const selectedSubject = subjects.find(subject => subject.id === selectedSubjectId);
    if (!selectedSubject) {
      showError('Subject Not Found', 'Selected subject not found. Please try again.');
      return;
    }

    console.log('➕ Navigating to CBT Creation with subject:', selectedSubject.name);
    navigation.navigate('CBTCreation', {
      subjectId: selectedSubjectId,
      subjectName: selectedSubject.name,
    });
  };

  const handleViewAssessment = (assessment: CBTQuiz) => {
    console.log('👁️ Navigating to question creation for assessment:', assessment.title);
    navigation.navigate('CBTQuestionCreation', {
      quizId: assessment.id,
      quizTitle: assessment.title,
      subjectId: assessment.subject_id,
    });
  };

  const handleEditAssessment = (assessment: CBTQuiz) => {
    console.log('✏️ Navigating to question creation for assessment:', assessment.title);
    navigation.navigate('CBTQuestionCreation', {
      quizId: assessment.id,
      quizTitle: assessment.title,
      subjectId: assessment.subject_id,
    });
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

  const handleUnpublishAssessment = (assessment: CBTQuiz) => {
    Alert.alert(
      'Unpublish Assessment',
      `Unpublish "${assessment.title}" and change it back to draft?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unpublish', 
          onPress: () => {
            console.log('⏸️ User confirmed unpublishing of assessment:', assessment.id);
            const updateData = { status: 'DRAFT' };
            updateAssessmentMutation.mutate({ assessmentId: assessment.id, assessmentData: updateData });
          }
        },
      ]
    );
  };

  const getStatusColor = (status: string, isPublished: boolean) => {
    if (status === 'ACTIVE') return '#10b981'; // green
    if (status === 'DRAFT') return '#f59e0b'; // yellow
    if (status === 'CLOSED') return '#ef4444'; // red
    if (status === 'ARCHIVED') return '#6b7280'; // gray
    return '#6b7280'; // gray
  };

  const getStatusText = (status: string, isPublished: boolean) => {
    if (status === 'ACTIVE') return 'Active';
    if (status === 'DRAFT') return 'Draft';
    if (status === 'CLOSED') return 'Closed';
    if (status === 'ARCHIVED') return 'Archived';
    return status;
  };

  // Convert grouped assessments to flat array and apply client-side filtering
  const allAssessments = assessmentsData?.assessments 
    ? Object.values(assessmentsData.assessments).flat()
    : [];
  const pagination = assessmentsData?.pagination;
  
  // Apply client-side filtering
  const filteredAssessments = Array.isArray(allAssessments) 
    ? allAssessments.filter(assessment => {
        // Filter by assessment type
        let typeMatch = true;
        if (selectedFilter !== 'All') {
          if (selectedFilter === 'OTHER') {
            // Show assessments that are not in the main categories
            const mainCategories = ['ASSIGNMENT', 'CBT', 'EXAM'];
            typeMatch = !mainCategories.includes(assessment.assessment_type);
          } else {
            typeMatch = assessment.assessment_type === selectedFilter;
          }
        }

        // Filter by status
        let statusMatch = true;
        if (selectedStatusFilter !== 'All') {
          if (selectedStatusFilter === 'Active') {
            statusMatch = assessment.status === 'ACTIVE';
          } else if (selectedStatusFilter === 'Closed') {
            statusMatch = assessment.status === 'CLOSED';
          } else if (selectedStatusFilter === 'Draft') {
            statusMatch = assessment.status === 'DRAFT';
          } else if (selectedStatusFilter === 'Archived') {
            statusMatch = assessment.status === 'ARCHIVED';
          }
        }

        return typeMatch && statusMatch;
      })
    : [];
  
  const assessments = filteredAssessments;


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
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Assessment
            </Text>
            <View className="flex-row items-center gap-4">
              <View className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Session: 2024/2025
                </Text>
              </View>
              <View className="bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-green-700 dark:text-green-300">
                  Term: 1st
                </Text>
              </View>
            </View>
          </View>
          
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
                  onPress={handleCreateAssessment}
                  activeOpacity={0.7}
                  className="bg-green-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
                >
                  <Ionicons name="add" size={16} color="white" />
                  <Text className="text-white font-semibold text-sm">Assessment</Text>
                </TouchableOpacity>
              </View>

              {/* Filter Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                className="mb-4"
              >
                <View className="flex-row items-center gap-2">
                  {(() => {
                    const counts = assessmentsData?.counts || {} as any;
                    const totalCount = Object.values(counts).reduce((sum: number, count: any) => sum + count, 0);
                    
                    const filterTabs = [
                      { key: 'All', label: 'All', count: totalCount },
                      { key: 'ASSIGNMENT', label: 'Assignment', count: counts.ASSIGNMENT || 0 },
                      { key: 'CBT', label: 'CBT', count: counts.CBT || 0 },
                      { key: 'EXAM', label: 'Exam', count: counts.EXAM || 0 },
                      { 
                        key: 'OTHER', 
                        label: 'Other', 
                        count: (counts.OTHER || 0) + (counts.FORMATIVE || 0) + (counts.SUMMATIVE || 0) + 
                               (counts.DIAGNOSTIC || 0) + (counts.BENCHMARK || 0) + (counts.PRACTICE || 0) + 
                               (counts.MOCK_EXAM || 0) + (counts.QUIZ || 0) + (counts.TEST || 0)
                      }
                    ];

                    return filterTabs.map((tab) => (
                      <TouchableOpacity
                        key={tab.key}
                        onPress={() => handleFilterChange(tab.key)}
                        className={`px-3 py-2 rounded-full border ${
                          selectedFilter === tab.key
                            ? 'bg-blue-600 border-blue-600'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                        }`}
                        activeOpacity={0.7}
                      >
                        <Text className={`text-xs font-medium ${
                          selectedFilter === tab.key
                            ? 'text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {tab.label} ({tab.count})
                        </Text>
                      </TouchableOpacity>
                    ));
                  })()}
                </View>
              </ScrollView>

              {/* Status Filter Tabs - Mini Filter */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 4 }}
                className="mb-4"
              >
                <View className="flex-row items-center gap-1">
                  {(() => {
                    // First filter by assessment type to get contextual assessments
                    let contextualAssessments = allAssessments;
                    if (selectedFilter !== 'All') {
                      if (selectedFilter === 'OTHER') {
                        const mainCategories = ['ASSIGNMENT', 'CBT', 'EXAM'];
                        contextualAssessments = allAssessments.filter(a => !mainCategories.includes(a.assessment_type));
                      } else {
                        contextualAssessments = allAssessments.filter(a => a.assessment_type === selectedFilter);
                      }
                    }

                    // Calculate status counts based on contextual assessments
                    const statusCounts = {
                      All: contextualAssessments.length,
                      Active: contextualAssessments.filter(a => a.status === 'ACTIVE').length,
                      Closed: contextualAssessments.filter(a => a.status === 'CLOSED').length,
                      Draft: contextualAssessments.filter(a => a.status === 'DRAFT').length,
                      Archived: contextualAssessments.filter(a => a.status === 'ARCHIVED').length,
                    };
                    
                    const statusTabs = [
                      { key: 'All', label: 'All', count: statusCounts.All },
                      { key: 'Active', label: 'Active', count: statusCounts.Active },
                      { key: 'Closed', label: 'Closed', count: statusCounts.Closed },
                      { key: 'Draft', label: 'Draft', count: statusCounts.Draft },
                      { key: 'Archived', label: 'Archived', count: statusCounts.Archived },
                    ];

                    return statusTabs.map((tab) => (
                      <TouchableOpacity
                        key={tab.key}
                        onPress={() => handleStatusFilterChange(tab.key)}
                        className={`px-2 py-1 rounded-full border ${
                          selectedStatusFilter === tab.key
                            ? 'bg-purple-500 border-purple-500'
                            : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                        }`}
                        activeOpacity={0.7}
                      >
                        <Text className={`text-xs font-medium ${
                          selectedStatusFilter === tab.key
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {tab.label} ({tab.count})
                        </Text>
                      </TouchableOpacity>
                    ));
                  })()}
                </View>
              </ScrollView>
              
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
                    onPress={handleCreateAssessment}
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
                          {editingAssessmentId === assessment.id && editingField === 'title' ? (
                            <View className="flex-row items-center mb-1">
                              <TextInput
                                value={editingValue}
                                onChangeText={setEditingValue}
                                placeholder="Enter assessment title"
                                className="flex-1 text-base font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600"
                                placeholderTextColor="#9ca3af"
                                autoFocus
                              />
                              <View className="flex-row ml-2">
                                <TouchableOpacity
                                  onPress={() => saveEdit(assessment.id)}
                                  className="p-1 mr-1"
                                  activeOpacity={0.7}
                                >
                                  <Ionicons name="checkmark" size={16} color="#10b981" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={cancelEdit}
                                  className="p-1"
                                  activeOpacity={0.7}
                                >
                                  <Ionicons name="close" size={16} color="#ef4444" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => startEditing(assessment.id, 'title', assessment.title || '')}
                              activeOpacity={0.7}
                            >
                              <Text className="text-base font-bold text-gray-900 dark:text-gray-100 mb-1">
                                {assessment.title}
                              </Text>
                            </TouchableOpacity>
                          )}
                          
                          {/* Badges Row */}
                          <View className="flex-row items-center gap-2 mb-2">
                            {editingAssessmentId === assessment.id && editingField === 'assessment_type' ? (
                              <View className="flex-row items-center">
                                <View className="relative">
                                  <View className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-32">
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                      {ASSESSMENT_TYPES.map((type) => (
                                        <TouchableOpacity
                                          key={type}
                                          onPress={() => {
                                            const updateData = { assessment_type: type };
                                            updateAssessmentMutation.mutate({ assessmentId: assessment.id, assessmentData: updateData });
                                            cancelEdit();
                                          }}
                                          className={`px-3 py-2 border-b border-gray-200 dark:border-gray-700 ${
                                            editingValue === type 
                                              ? 'bg-blue-50 dark:bg-blue-900/20' 
                                              : 'bg-white dark:bg-gray-800'
                                          }`}
                                          activeOpacity={0.7}
                                        >
                                          <Text className={`text-sm font-medium ${
                                            editingValue === type 
                                              ? 'text-blue-600 dark:text-blue-400' 
                                              : 'text-gray-700 dark:text-gray-300'
                                          }`}>
                                            {type}
                                          </Text>
                                        </TouchableOpacity>
                                      ))}
                                    </ScrollView>
                                  </View>
                                </View>
                                <TouchableOpacity
                                  onPress={cancelEdit}
                                  className="p-1 ml-2"
                                  activeOpacity={0.7}
                                >
                                  <Ionicons name="close" size={16} color="#ef4444" />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => startEditing(assessment.id, 'assessment_type', assessment.assessment_type || '')}
                                activeOpacity={0.7}
                              >
                                <View 
                                  className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30"
                                >
                                  <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                    {assessment.assessment_type}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )}
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
                          
                          {editingAssessmentId === assessment.id && editingField === 'description' ? (
                            <View className="mb-2">
                              <TextInput
                                value={editingValue}
                                onChangeText={setEditingValue}
                                placeholder="Enter assessment description"
                                className="text-xs text-gray-600 dark:text-gray-400 bg-transparent border-b border-gray-300 dark:border-gray-600"
                                placeholderTextColor="#9ca3af"
                                multiline
                                autoFocus
                              />
                              <View className="flex-row mt-2">
                                <TouchableOpacity
                                  onPress={() => saveEdit(assessment.id)}
                                  className="p-1 mr-1"
                                  activeOpacity={0.7}
                                >
                                  <Ionicons name="checkmark" size={14} color="#10b981" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={cancelEdit}
                                  className="p-1"
                                  activeOpacity={0.7}
                                >
                                  <Ionicons name="close" size={14} color="#ef4444" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : assessment.description ? (
                            <TouchableOpacity
                              onPress={() => startEditing(assessment.id, 'description', assessment.description || '')}
                              activeOpacity={0.7}
                            >
                              <Text className="text-xs text-gray-600 dark:text-gray-400 leading-4" numberOfLines={2}>
                                {assessment.description}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => startEditing(assessment.id, 'description', '')}
                              activeOpacity={0.7}
                            >
                              <Text className="text-xs text-gray-400 dark:text-gray-500 italic">
                                Tap to add description
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        
                        {/* Assessment Actions */}
                        <View className="flex-row items-center gap-1">
                          <TouchableOpacity
                            onPress={() => handleViewAssessment(assessment)}
                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                            activeOpacity={0.7}
                          >
                            <Ionicons name="eye-outline" size={14} color="#3b82f6" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleEditAssessment(assessment)}
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
                              {editingAssessmentId === assessment.id && editingField === 'duration' ? (
                                <View className="flex-row items-center">
                                  <TextInput
                                    value={editingValue}
                                    onChangeText={setEditingValue}
                                    placeholder="Duration"
                                    className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-transparent border-b border-gray-300 dark:border-gray-600 w-12"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="numeric"
                                    autoFocus
                                  />
                                  <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">min</Text>
                                  <View className="flex-row ml-1">
                                    <TouchableOpacity
                                      onPress={() => saveEdit(assessment.id)}
                                      className="p-0.5 mr-1"
                                      activeOpacity={0.7}
                                    >
                                      <Ionicons name="checkmark" size={12} color="#10b981" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={cancelEdit}
                                      className="p-0.5"
                                      activeOpacity={0.7}
                                    >
                                      <Ionicons name="close" size={12} color="#ef4444" />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => startEditing(assessment.id, 'duration', assessment.duration?.toString() || '60')}
                                  activeOpacity={0.7}
                                >
                                  <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {assessment.duration} min
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Ionicons name="help-circle-outline" size={12} color="#10b981" />
                              <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {assessment._count?.questions || 0} q
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Ionicons name="star-outline" size={12} color="#8b5cf6" />
                              {editingAssessmentId === assessment.id && editingField === 'total_points' ? (
                                <View className="flex-row items-center">
                                  <TextInput
                                    value={editingValue}
                                    onChangeText={setEditingValue}
                                    placeholder="Points"
                                    className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-transparent border-b border-gray-300 dark:border-gray-600 w-12"
                                    placeholderTextColor="#9ca3af"
                                    keyboardType="numeric"
                                    autoFocus
                                  />
                                  <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">pts</Text>
                                  <View className="flex-row ml-1">
                                    <TouchableOpacity
                                      onPress={() => saveEdit(assessment.id)}
                                      className="p-0.5 mr-1"
                                      activeOpacity={0.7}
                                    >
                                      <Ionicons name="checkmark" size={12} color="#10b981" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={cancelEdit}
                                      className="p-0.5"
                                      activeOpacity={0.7}
                                    >
                                      <Ionicons name="close" size={12} color="#ef4444" />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => startEditing(assessment.id, 'total_points', assessment.total_points?.toString() || '100')}
                                  activeOpacity={0.7}
                                >
                                  <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {assessment.total_points} pts
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                          
                          {/* Publish/Unpublish Button */}
                          {assessment.status === 'ACTIVE' ? (
                            <TouchableOpacity
                              onPress={() => handleUnpublishAssessment(assessment)}
                              disabled={updateAssessmentMutation.isPending}
                              className="px-2 py-1 bg-orange-600 rounded-lg flex-row items-center gap-1"
                              style={{ 
                                opacity: updateAssessmentMutation.isPending ? 0.6 : 1 
                              }}
                              activeOpacity={0.7}
                            >
                              <Ionicons 
                                name={updateAssessmentMutation.isPending ? "hourglass-outline" : "pause-outline"} 
                                size={10} 
                                color="white" 
                              />
                              <Text className="text-white text-xs font-medium">
                                {updateAssessmentMutation.isPending ? 'Unpublishing...' : 'Unpublish'}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                if ((assessment._count?.questions || 0) === 0) {
                                  showError('Cannot Publish', 'Assessment must have at least one question before publishing');
                                  return;
                                }
                                handlePublishAssessment(assessment);
                              }}
                              disabled={publishAssessmentMutation.isPending || (assessment._count?.questions || 0) === 0}
                              className={`px-2 py-1 rounded-lg flex-row items-center gap-1 ${
                                (assessment._count?.questions || 0) === 0 
                                  ? 'bg-gray-400' 
                                  : 'bg-green-600'
                              }`}
                              style={{ 
                                opacity: publishAssessmentMutation.isPending || (assessment._count?.questions || 0) === 0 ? 0.6 : 1 
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
                            {editingAssessmentId === assessment.id && editingField === 'max_attempts' ? (
                              <View className="flex-row items-center">
                                <TextInput
                                  value={editingValue}
                                  onChangeText={setEditingValue}
                                  placeholder="Attempts"
                                  className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-transparent border-b border-gray-300 dark:border-gray-600 w-8"
                                  placeholderTextColor="#9ca3af"
                                  keyboardType="numeric"
                                  autoFocus
                                />
                                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">attempts</Text>
                                <View className="flex-row ml-1">
                                  <TouchableOpacity
                                    onPress={() => saveEdit(assessment.id)}
                                    className="p-0.5 mr-1"
                                    activeOpacity={0.7}
                                  >
                                    <Ionicons name="checkmark" size={12} color="#10b981" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={cancelEdit}
                                    className="p-0.5"
                                    activeOpacity={0.7}
                                  >
                                    <Ionicons name="close" size={12} color="#ef4444" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => startEditing(assessment.id, 'max_attempts', assessment.max_attempts?.toString() || '1')}
                                activeOpacity={0.7}
                              >
                                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {assessment.max_attempts} attempt{assessment.max_attempts !== 1 ? 's' : ''}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="trophy-outline" size={12} color="#eab308" />
                            {editingAssessmentId === assessment.id && editingField === 'passing_score' ? (
                              <View className="flex-row items-center">
                                <TextInput
                                  value={editingValue}
                                  onChangeText={setEditingValue}
                                  placeholder="Score"
                                  className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-transparent border-b border-gray-300 dark:border-gray-600 w-8"
                                  placeholderTextColor="#9ca3af"
                                  keyboardType="numeric"
                                  autoFocus
                                />
                                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1">% pass</Text>
                                <View className="flex-row ml-1">
                                  <TouchableOpacity
                                    onPress={() => saveEdit(assessment.id)}
                                    className="p-0.5 mr-1"
                                    activeOpacity={0.7}
                                  >
                                    <Ionicons name="checkmark" size={12} color="#10b981" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={cancelEdit}
                                    className="p-0.5"
                                    activeOpacity={0.7}
                                  >
                                    <Ionicons name="close" size={12} color="#ef4444" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() => startEditing(assessment.id, 'passing_score', assessment.passing_score?.toString() || '50')}
                                activeOpacity={0.7}
                              >
                                <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  {assessment.passing_score}% pass
                                </Text>
                              </TouchableOpacity>
                            )}
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
