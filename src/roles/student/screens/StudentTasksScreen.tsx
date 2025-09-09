import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from './components/shared/TopBar';
import { mockStudentDashboardData } from '@/mock/student';

const { width } = Dimensions.get('window');

const ASSESSMENT_TYPES = [
  'ASSIGNMENT',
  'QUIZ',
  'PRACTICE',
  'CBT',
  'EXAM',
  'OTHER'
];

// Mock assessment data for students
const mockAssessments = [
  {
    id: '1',
    title: 'Mathematics Quiz - Chapter 5',
    description: 'Quiz covering algebraic expressions and equations',
    assessment_type: 'QUIZ',
    status: 'ACTIVE',
    duration: 30,
    total_points: 50,
    questions_count: 15,
    subject: {
      id: '1',
      name: 'Mathematics',
      code: 'MATH101',
      color: '#3B82F6'
    },
    teacher: {
      id: '1',
      name: 'John Doe'
    },
    due_date: '2024-01-25T23:59:00.000Z',
    created_at: '2024-01-15T10:00:00.000Z',
    is_published: true,
    _count: {
      questions: 15
    }
  },
  {
    id: '2',
    title: 'Science Assignment - Photosynthesis',
    description: 'Research assignment on the process of photosynthesis in plants',
    assessment_type: 'ASSIGNMENT',
    status: 'ACTIVE',
    duration: 120,
    total_points: 100,
    questions_count: 0,
    subject: {
      id: '2',
      name: 'Science',
      code: 'SCI101',
      color: '#10B981'
    },
    teacher: {
      id: '2',
      name: 'Jane Smith'
    },
    due_date: '2024-01-30T23:59:00.000Z',
    created_at: '2024-01-10T14:30:00.000Z',
    is_published: true,
    _count: {
      questions: 0
    }
  },
  {
    id: '3',
    title: 'English Practice Test',
    description: 'Practice test for upcoming English examination',
    assessment_type: 'PRACTICE',
    status: 'ACTIVE',
    duration: 60,
    total_points: 80,
    questions_count: 25,
    subject: {
      id: '3',
      name: 'English',
      code: 'ENG101',
      color: '#F59E0B'
    },
    teacher: {
      id: '3',
      name: 'Mike Johnson'
    },
    due_date: '2024-02-05T23:59:00.000Z',
    created_at: '2024-01-12T09:15:00.000Z',
    is_published: true,
    _count: {
      questions: 25
    }
  },
  {
    id: '4',
    title: 'History CBT - World War II',
    description: 'Computer-based test on World War II events and consequences',
    assessment_type: 'CBT',
    status: 'ACTIVE',
    duration: 45,
    total_points: 60,
    questions_count: 20,
    subject: {
      id: '4',
      name: 'History',
      code: 'HIS101',
      color: '#EF4444'
    },
    teacher: {
      id: '4',
      name: 'Sarah Wilson'
    },
    due_date: '2024-01-28T23:59:00.000Z',
    created_at: '2024-01-08T16:45:00.000Z',
    is_published: true,
    _count: {
      questions: 20
    }
  }
];

export default function StudentTasksScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
  };

  const handleStartAssessment = (assessment: any) => {
    console.log('Starting assessment:', assessment.title);
    // TODO: Navigate to assessment taking screen
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  // Apply client-side filtering
  const filteredAssessments = mockAssessments.filter(assessment => {
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

  // Calculate counts for filter tabs
  const typeCounts = {
    All: mockAssessments.length,
    ASSIGNMENT: mockAssessments.filter(a => a.assessment_type === 'ASSIGNMENT').length,
    QUIZ: mockAssessments.filter(a => a.assessment_type === 'QUIZ').length,
    CBT: mockAssessments.filter(a => a.assessment_type === 'CBT').length,
    EXAM: mockAssessments.filter(a => a.assessment_type === 'EXAM').length,
    OTHER: mockAssessments.filter(a => !['ASSIGNMENT', 'CBT', 'EXAM'].includes(a.assessment_type)).length
  };

  const statusCounts = {
    All: mockAssessments.length,
    ACTIVE: mockAssessments.filter(a => a.status === 'ACTIVE').length,
    DRAFT: mockAssessments.filter(a => a.status === 'DRAFT').length,
    CLOSED: mockAssessments.filter(a => a.status === 'CLOSED').length,
    ARCHIVED: mockAssessments.filter(a => a.status === 'ARCHIVED').length
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar 
        name={mockStudentDashboardData.data.general_info.student.name}
        email={mockStudentDashboardData.data.general_info.student.email}
        displayPicture={mockStudentDashboardData.data.general_info.student.display_picture}
        classInfo={{
          name: mockStudentDashboardData.data.general_info.student_class.name,
          teacher: mockStudentDashboardData.data.general_info.class_teacher.name
        }}
        academicSession={{
          year: mockStudentDashboardData.data.general_info.current_session.academic_year,
          term: mockStudentDashboardData.data.general_info.current_session.term
        }}
        onNotificationPress={() => console.log('Notifications pressed')}
      />
      
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
                  Session: {mockStudentDashboardData.data.general_info.current_session.academic_year}
                </Text>
              </View>
              <View className="bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-green-700 dark:text-green-300">
                  Term: {mockStudentDashboardData.data.general_info.current_session.term}
                </Text>
              </View>
            </View>
          </View>

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
              {filteredAssessments.map((assessment) => (
                <View
                  key={assessment.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-3"
                >
                  {/* Assessment Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 mr-3">
                      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
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
                      assessment.status === 'ACTIVE' 
                        ? 'bg-blue-600' 
                        : 'bg-gray-400'
                    }`}
                    activeOpacity={0.8}
                    disabled={assessment.status !== 'ACTIVE'}
                  >
                    <Ionicons 
                      name={assessment.status === 'ACTIVE' ? 'play-outline' : 'lock-closed-outline'} 
                      size={16} 
                      color="white" 
                    />
                    <Text className="text-white font-semibold">
                      {assessment.status === 'ACTIVE' ? 'Start Assessment' : 'Not Available'}
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
