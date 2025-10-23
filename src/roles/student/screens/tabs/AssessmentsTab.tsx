import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudentAssessments } from '@/hooks/useStudentAssessments';
import { Assessment } from '@/services/types/apiTypes';
import { useToast } from '@/contexts/ToastContext';

interface AssessmentsTabProps {
  navigation: any;
}

export default function AssessmentsTab({ navigation }: AssessmentsTabProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);
  const { showError } = useToast();

  // API call without filters - fetch all data once
  const { 
    data: assessmentsData, 
    isLoading, 
    error, 
    refetch 
  } = useStudentAssessments();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      showError('Refresh Failed', 'Failed to refresh assessments');
    } finally {
      setRefreshing(false);
    }
  };

  // Show error toast when API call fails
  useEffect(() => {
    if (error) {
      console.log('API Error:', error);
      showError('Failed to Load', 'Could not load assessments. Please try again.');
    }
  }, [error, showError]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
  };

  const handleStartAssessment = (assessment: Assessment) => {
    console.log('Starting assessment:', assessment.title);
    // Navigate to instructions screen first
    navigation.navigate('AssessmentInstructions', {
      assessment: assessment
    });
  };

  const handleAssessmentAction = (assessment: Assessment) => {
    if (assessment.student_attempts?.has_reached_max) {
      // Show grade/view results
      handleViewGrade(assessment);
    } else {
      // Start/retake assessment
      handleStartAssessment(assessment);
    }
  };

  const handleViewGrade = (assessment: Assessment) => {
    console.log('View grade button clicked for:', assessment.title);
    // Navigate to assessment results screen
    navigation.navigate('AssessmentResults', {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title
    });
  };

  const canTakeAssessment = (assessment: Assessment) => {
    // Can take if status is ACTIVE and either no attempts or has remaining attempts
    return assessment.status === 'ACTIVE' && 
           (!assessment.student_attempts || 
            assessment.student_attempts.remaining_attempts > 0);
  };

  // Calculate corrected percentage based on actual correct answers
  const calculateCorrectedPercentage = (assessment: Assessment) => {
    if (!assessment.performance_summary?.best_attempt) return 0;
    
    // Backend is working correctly, just round the percentage for display
    return Math.round(assessment.performance_summary.highest_percentage * 10) / 10;
  };

  const getButtonStyle = (assessment: Assessment) => {
    if (assessment.status !== 'ACTIVE') {
      return 'bg-gray-400';
    }
    
    if (assessment.student_attempts?.has_reached_max) {
      return 'bg-green-600'; // View grade button
    }
    
    if (isOverdue(assessment.due_date)) {
      return 'bg-red-600'; // Overdue - urgent
    }
    
    if (assessment.student_attempts?.total_attempts > 0) {
      return 'bg-orange-600'; // Retake assessment
    }
    
    return 'bg-blue-600'; // Start assessment
  };

  const getButtonIcon = (assessment: Assessment) => {
    if (assessment.status !== 'ACTIVE') {
      return 'lock-closed-outline';
    }
    
    if (assessment.student_attempts?.has_reached_max) {
      return 'eye-outline'; // View grade
    }
    
    if (isOverdue(assessment.due_date)) {
      return 'alert-circle-outline'; // Overdue
    }
    
    if (assessment.student_attempts?.total_attempts > 0) {
      return 'refresh-outline'; // Retake
    }
    
    return 'play-outline'; // Start
  };

  const getButtonText = (assessment: Assessment) => {
    if (assessment.status !== 'ACTIVE') {
      return 'Not Available';
    }
    
    if (assessment.student_attempts?.has_reached_max) {
      return 'View Grade';
    }
    
    if (isOverdue(assessment.due_date)) {
      return 'Overdue - Submit Now';
    }
    
    // Note: Two-button case is handled separately in the UI
    return 'Start Assessment';
  };

  const getStatusColor = (status: string) => {
    if (status === 'ACTIVE') return '#10b981'; // green
    if (status === 'DRAFT') return '#f59e0b'; // yellow
    if (status === 'CLOSED') return '#ef4444'; // red
    if (status === 'ARCHIVED') return '#6b7280'; // gray
    return '#6b7280'; // gray
  };

  const getStatusText = (status: string) => {
    if (status === 'ACTIVE') return 'Active';
    if (status === 'DRAFT') return 'Draft';
    if (status === 'CLOSED') return 'Closed';
    if (status === 'ARCHIVED') return 'Archived';
    return status;
  };

  const parseDate = (dateString: string): Date => {
    // Handle both ISO format and pre-formatted dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string:', dateString);
      return new Date(); // fallback to current date
    }
    return date;
  };

  const formatDate = (dateString: string) => {
    const date = parseDate(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = parseDate(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isOverdue = (dueDate: string) => {
    const due = parseDate(dueDate);
    return due < new Date();
  };

  const isDueSoon = (dueDate: string) => {
    const due = parseDate(dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  const getOverdueDays = (dueDate: string) => {
    const due = parseDate(dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get assessments from API response
  const allAssessments = assessmentsData?.data?.assessments || [];
  const generalInfo = assessmentsData?.data?.general_info;

  // Client-side filtering
  const filteredAssessments = allAssessments.filter((assessment: Assessment) => {
    // Filter by assessment type
    let typeMatch = true;
    if (selectedFilter !== 'All') {
      if (selectedFilter === 'OTHER') {
        const mainCategories = ['ASSIGNMENT', 'CBT', 'EXAM'];
        typeMatch = !mainCategories.includes(assessment.assessment_type);
      } else {
        typeMatch = assessment.assessment_type === selectedFilter;
      }
    }

    // Filter by status
    let statusMatch = true;
    if (selectedStatusFilter !== 'All') {
      statusMatch = assessment.status === selectedStatusFilter;
    }

    return typeMatch && statusMatch;
  });

  // Calculate counts for filter tabs using all assessments
  const typeCounts = {
    All: allAssessments.length,
    ASSIGNMENT: allAssessments.filter((a: Assessment) => a.assessment_type === 'ASSIGNMENT').length,
    QUIZ: allAssessments.filter((a: Assessment) => a.assessment_type === 'QUIZ').length,
    CBT: allAssessments.filter((a: Assessment) => a.assessment_type === 'CBT').length,
    EXAM: allAssessments.filter((a: Assessment) => a.assessment_type === 'EXAM').length,
    OTHER: allAssessments.filter((a: Assessment) => !['ASSIGNMENT', 'CBT', 'EXAM'].includes(a.assessment_type)).length
  };

  const statusCounts = {
    All: allAssessments.length,
    ACTIVE: allAssessments.filter((a: Assessment) => a.status === 'ACTIVE').length,
    DRAFT: allAssessments.filter((a: Assessment) => a.status === 'DRAFT').length,
    CLOSED: allAssessments.filter((a: Assessment) => a.status === 'CLOSED').length,
    ARCHIVED: allAssessments.filter((a: Assessment) => a.status === 'ARCHIVED').length
  };

  // Count overdue assessments
  const overdueCount = allAssessments.filter((a: Assessment) => isOverdue(a.due_date)).length;

  return (
    <ScrollView 
      className="flex-1"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#3b82f6"
        />
      }
    >
      {/* Overdue Alert Banner */}
      {overdueCount > 0 && (
        <View className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <View className="flex-row items-center gap-3">
            <Ionicons name="alert-circle" size={24} color="#dc2626" />
            <View className="flex-1">
              <Text className="text-red-800 dark:text-red-200 font-bold text-base">
                {overdueCount} Assessment{overdueCount !== 1 ? 's' : ''} Overdue
              </Text>
              <Text className="text-red-700 dark:text-red-300 text-sm mt-1">
                Please complete these assessments as soon as possible
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        className="mb-4"
      >
        <View className="flex-row items-center gap-2">
          {Object.entries(typeCounts).map(([key, count]) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleFilterChange(key)}
              className={`px-3 py-2 rounded-full border ${
                selectedFilter === key
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-xs font-medium ${
                selectedFilter === key
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {key} ({count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Status Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        className="mb-4"
      >
        <View className="flex-row items-center gap-1">
          {Object.entries(statusCounts).map(([key, count]) => (
            <TouchableOpacity
              key={key}
              onPress={() => handleStatusFilterChange(key)}
              className={`px-2 py-1 rounded-full border ${
                selectedStatusFilter === key
                  ? 'bg-purple-500 border-purple-500'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
              activeOpacity={0.7}
            >
              <Text className={`text-xs font-medium ${
                selectedStatusFilter === key
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {key} ({count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Mock Data Indicator - Removed for production */}
      {/* {false && (
        <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 mx-4">
          <View className="flex-row items-center gap-2">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text className="text-blue-800 dark:text-blue-200 font-medium text-sm">
              Demo Mode
            </Text>
            <Text className="text-blue-700 dark:text-blue-300 text-sm">
              • Showing sample assessments for UI testing
            </Text>
          </View>
        </View>
      )} */}

      {/* Assessments List */}
      {filteredAssessments.length === 0 ? (
        <View className="flex-1 items-center justify-center py-16">
          <Ionicons name="help-circle-outline" size={64} color="#9ca3af" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            No Assessments Found
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            No assessments match your current filters
          </Text>
        </View>
      ) : (
        <View>
          {filteredAssessments.map((assessment: Assessment) => (
            <View
              key={assessment.id}
              className={`rounded-lg p-4 shadow-sm mb-3 ${
                isOverdue(assessment.due_date)
                  ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Overdue Notification Banner */}
              {isOverdue(assessment.due_date) && (
                <View className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-3">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="warning" size={20} color="#dc2626" />
                    <Text className="text-red-800 dark:text-red-200 font-semibold text-sm">
                      OVERDUE
                    </Text>
                    <Text className="text-red-700 dark:text-red-300 text-sm">
                      • {getOverdueDays(assessment.due_date)} day{getOverdueDays(assessment.due_date) !== 1 ? 's' : ''} past due
                    </Text>
                  </View>
                </View>
              )}

              {/* Assessment Header */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className={`text-lg font-bold flex-1 ${
                      isOverdue(assessment.due_date)
                        ? 'text-red-900 dark:text-red-100'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {assessment.title}
                    </Text>
                    
                    {/* Status Indicator */}
                    <View 
                      className="px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: getStatusColor(assessment.status) + '20',
                        borderColor: getStatusColor(assessment.status),
                        borderWidth: 1
                      }}
                    >
                      <Text 
                        className="text-xs font-bold"
                        style={{ color: getStatusColor(assessment.status) }}
                      >
                        {assessment.status}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Badges Row */}
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {assessment.assessment_type}
                      </Text>
                    </View>
                    <View 
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${getStatusColor(assessment.status)}20` }}
                    >
                      <Text 
                        className="text-xs font-medium"
                        style={{ color: getStatusColor(assessment.status) }}
                      >
                        {getStatusText(assessment.status)}
                      </Text>
                    </View>
                    <View 
                      className="px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: assessment.subject.color + '20',
                        borderColor: assessment.subject.color,
                        borderWidth: 1
                      }}
                    >
                      <Text 
                        className="text-xs font-medium"
                        style={{ color: assessment.subject.color }}
                      >
                        {assessment.subject.code}
                      </Text>
                    </View>
                  </View>
                  
                  {assessment.description && (
                    <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5 mb-2">
                      {assessment.description}
                    </Text>
                  )}
                </View>
              </View>

              {/* Assessment Details Grid - Compact */}
              <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 mb-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="time-outline" size={12} color="#3b82f6" />
                      <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {assessment.duration} min
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="help-circle-outline" size={12} color="#10b981" />
                      <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {assessment.questions_count} q
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="star-outline" size={12} color="#8b5cf6" />
                      <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {assessment.total_points} pts
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Performance Summary - Compact */}
              {assessment.student_attempts && (
                <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 mb-3">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="repeat-outline" size={12} color="#3b82f6" />
                        <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {assessment.student_attempts.total_attempts}/{assessment.max_attempts}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="refresh-outline" size={12} color="#10b981" />
                        <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                          {assessment.student_attempts.remaining_attempts} left
                        </Text>
                      </View>
                    </View>
                    
                    {/* Best Performance - Inline */}
                    {assessment.performance_summary?.best_attempt ? (
                      <View className="flex-row items-center gap-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons 
                            name="trophy" 
                            size={12} 
                            color="#f59e0b" 
                          />
                          <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Best: {assessment.performance_summary.highest_score}/{assessment.performance_summary.overall_achievable_mark} ({Math.round(assessment.performance_summary.highest_percentage * 10) / 10}%)
                          </Text>
                        </View>
                        {/* Pass/Fail Badge */}
                        <View 
                          className="px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: calculateCorrectedPercentage(assessment) >= assessment.passing_score ? '#10b981' : '#ef4444'
                          }}
                        >
                          <Text className="text-xs font-bold text-white">
                            {calculateCorrectedPercentage(assessment) >= assessment.passing_score ? 'PASS' : 'FAIL'}
                          </Text>
                        </View>
                      </View>
                    ) : assessment.student_attempts.latest_attempt ? (
                      <View className="flex-row items-center gap-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons 
                            name={assessment.student_attempts.latest_attempt.passed ? "checkmark-circle" : "close-circle"} 
                            size={12} 
                            color={assessment.student_attempts.latest_attempt.passed ? "#10b981" : "#ef4444"} 
                          />
                          <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Latest: {assessment.student_attempts.latest_attempt.total_score}/{assessment.total_points} ({Math.round(assessment.student_attempts.latest_attempt.percentage * 10) / 10}%)
                          </Text>
                        </View>
                        {/* Pass/Fail Badge */}
                        <View 
                          className="px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: Math.round(assessment.student_attempts.latest_attempt.percentage * 10) / 10 >= assessment.passing_score ? '#10b981' : '#ef4444'
                          }}
                        >
                          <Text className="text-xs font-bold text-white">
                            {Math.round(assessment.student_attempts.latest_attempt.percentage * 10) / 10 >= assessment.passing_score ? 'PASS' : 'FAIL'}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
              )}

              {/* Due Date and Teacher Info - Compact */}
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <Ionicons 
                      name="calendar-outline" 
                      size={12} 
                      color={isOverdue(assessment.due_date) ? '#ef4444' : isDueSoon(assessment.due_date) ? '#f59e0b' : '#6b7280'} 
                    />
                    <Text 
                      className="text-xs font-medium"
                      style={{ 
                        color: isOverdue(assessment.due_date) ? '#ef4444' : isDueSoon(assessment.due_date) ? '#f59e0b' : '#6b7280'
                      }}
                    >
                      Due: {formatDate(assessment.due_date)}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="person-outline" size={12} color="#6b7280" />
                    <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {assessment.teacher.name}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              {assessment.student_attempts?.total_attempts > 0 && !assessment.student_attempts?.has_reached_max ? (
                // Two buttons for attempted assessments with remaining attempts
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => handleStartAssessment(assessment)}
                    className="flex-1 bg-orange-600 py-3 rounded-lg flex-row items-center justify-center gap-2"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh-outline" size={16} color="white" />
                    <Text className="text-white font-semibold">
                      Retake Assessment
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleViewGrade(assessment)}
                    className="flex-1 bg-green-600 py-3 rounded-lg flex-row items-center justify-center gap-2"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="eye-outline" size={16} color="white" />
                    <Text className="text-white font-semibold">
                      View Grade
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Single button for other cases
                <TouchableOpacity
                  onPress={() => handleAssessmentAction(assessment)}
                  className={`w-full py-3 rounded-lg flex-row items-center justify-center gap-2 ${
                    getButtonStyle(assessment)
                  }`}
                  activeOpacity={0.8}
                  disabled={!canTakeAssessment(assessment) && !assessment.student_attempts?.has_reached_max}
                >
                  <Ionicons 
                    name={getButtonIcon(assessment)} 
                    size={16} 
                    color="white" 
                  />
                  <Text className="text-white font-semibold">
                    {getButtonText(assessment)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
