import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from './components/shared/TopBar';
import { useStudentAssessments } from '@/hooks/useStudentAssessments';
import { Assessment } from '@/services/types/apiTypes';
import CenteredLoader from '@/components/CenteredLoader';
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


interface StudentTasksScreenProps {
  navigation: any;
}

export default function StudentTasksScreen({ navigation }: StudentTasksScreenProps) {
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
    // Navigate to assessment taking screen
    navigation.navigate('AssessmentTaking', {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title
    });
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

  // Show loading state only on initial load
  if (isLoading && !assessmentsData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <CenteredLoader visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      
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
        <View className="px-4 py-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Tasks
            </Text>
            <View className="flex-row items-center gap-4">
              <View className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Session: {generalInfo?.current_session?.academic_year || 'N/A'}
                </Text>
              </View>
              <View className="bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-green-700 dark:text-green-300">
                  Term: {generalInfo?.current_session?.term || 'N/A'}
                </Text>
              </View>
            </View>
          </View>

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

          {/* Assessments List */}
          {filteredAssessments.length === 0 ? (
            <View className="flex-1 items-center justify-center py-16">
              <Ionicons name="help-circle-outline" size={64} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                No Tasks Found
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
                      <Text className={`text-lg font-bold mb-2 ${
                        isOverdue(assessment.due_date)
                          ? 'text-red-900 dark:text-red-100'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {assessment.title}
                      </Text>
                      
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

                  {/* Assessment Details Grid */}
                  <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-4">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="time-outline" size={14} color="#3b82f6" />
                          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {assessment.duration} min
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="help-circle-outline" size={14} color="#10b981" />
                          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {assessment.questions_count} questions
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="star-outline" size={14} color="#8b5cf6" />
                          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {assessment.total_points} pts
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Due Date and Teacher Info */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-1">
                        <Ionicons 
                          name="calendar-outline" 
                          size={14} 
                          color={isOverdue(assessment.due_date) ? '#ef4444' : isDueSoon(assessment.due_date) ? '#f59e0b' : '#6b7280'} 
                        />
                        <Text 
                          className="text-sm font-medium"
                          style={{ 
                            color: isOverdue(assessment.due_date) ? '#ef4444' : isDueSoon(assessment.due_date) ? '#f59e0b' : '#6b7280'
                          }}
                        >
                          Due: {formatDate(assessment.due_date)} at {formatTime(assessment.due_date)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="person-outline" size={14} color="#6b7280" />
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {assessment.teacher.name}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    onPress={() => handleStartAssessment(assessment)}
                    className={`w-full py-3 rounded-lg flex-row items-center justify-center gap-2 ${
                      isOverdue(assessment.due_date)
                        ? 'bg-red-600'
                        : assessment.status === 'ACTIVE' 
                          ? 'bg-blue-600' 
                          : 'bg-gray-400'
                    }`}
                    activeOpacity={0.8}
                    disabled={assessment.status !== 'ACTIVE'}
                  >
                    <Ionicons 
                      name={
                        isOverdue(assessment.due_date)
                          ? 'alert-circle-outline'
                          : assessment.status === 'ACTIVE' 
                            ? 'play-outline' 
                            : 'lock-closed-outline'
                      } 
                      size={16} 
                      color="white" 
                    />
                    <Text className="text-white font-semibold">
                      {isOverdue(assessment.due_date)
                        ? 'Overdue - Submit Now'
                        : assessment.status === 'ACTIVE' 
                          ? 'Start Assessment' 
                          : 'Not Available'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
