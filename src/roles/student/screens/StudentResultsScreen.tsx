import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from './components/shared/TopBar';
import { mockStudentDashboardData } from '@/mock/student';

// Mock results data for students
const mockResults = [
  {
    id: '1',
    title: 'Mathematics Quiz - Chapter 5',
    type: 'QUIZ',
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
    score: 42,
    totalPoints: 50,
    percentage: 84,
    grade: 'A',
    status: 'GRADED',
    submittedAt: '2024-01-20T10:30:00.000Z',
    gradedAt: '2024-01-21T14:15:00.000Z',
    feedback: 'Excellent work! You showed great understanding of algebraic expressions.',
    questions: [
      { id: '1', question: 'Solve: 2x + 5 = 13', correct: true, points: 5 },
      { id: '2', question: 'Simplify: 3(x + 2)', correct: true, points: 5 },
      { id: '3', question: 'Factor: x² - 4', correct: false, points: 0 },
      { id: '4', question: 'Solve: x/2 = 8', correct: true, points: 5 },
      { id: '5', question: 'Expand: (x + 3)²', correct: true, points: 5 }
    ]
  },
  {
    id: '2',
    title: 'Science Assignment - Photosynthesis',
    type: 'ASSIGNMENT',
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
    score: 88,
    totalPoints: 100,
    percentage: 88,
    grade: 'A',
    status: 'GRADED',
    submittedAt: '2024-01-25T15:45:00.000Z',
    gradedAt: '2024-01-26T09:30:00.000Z',
    feedback: 'Well-researched assignment with good use of scientific terminology.',
    questions: []
  },
  {
    id: '3',
    title: 'English Practice Test',
    type: 'PRACTICE',
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
    score: 65,
    totalPoints: 80,
    percentage: 81,
    grade: 'A',
    status: 'GRADED',
    submittedAt: '2024-01-22T11:20:00.000Z',
    gradedAt: '2024-01-23T16:45:00.000Z',
    feedback: 'Good comprehension skills. Work on grammar and punctuation.',
    questions: [
      { id: '1', question: 'Reading Comprehension - Passage 1', correct: true, points: 20 },
      { id: '2', question: 'Grammar - Subject-Verb Agreement', correct: false, points: 0 },
      { id: '3', question: 'Vocabulary - Synonyms', correct: true, points: 15 },
      { id: '4', question: 'Writing - Essay Structure', correct: true, points: 30 }
    ]
  },
  {
    id: '4',
    title: 'History CBT - World War II',
    type: 'CBT',
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
    score: 48,
    totalPoints: 60,
    percentage: 80,
    grade: 'A',
    status: 'GRADED',
    submittedAt: '2024-01-18T14:00:00.000Z',
    gradedAt: '2024-01-19T10:20:00.000Z',
    feedback: 'Good knowledge of key events. Review the causes and consequences.',
    questions: [
      { id: '1', question: 'When did WWII start?', correct: true, points: 10 },
      { id: '2', question: 'Who was the leader of Nazi Germany?', correct: true, points: 10 },
      { id: '3', question: 'Which country was not part of the Axis?', correct: false, points: 0 },
      { id: '4', question: 'What was the Holocaust?', correct: true, points: 15 },
      { id: '5', question: 'When did WWII end?', correct: true, points: 15 }
    ]
  },
  {
    id: '5',
    title: 'Mathematics Midterm Exam',
    type: 'EXAM',
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
    score: 72,
    totalPoints: 100,
    percentage: 72,
    grade: 'B',
    status: 'GRADED',
    submittedAt: '2024-01-15T09:00:00.000Z',
    gradedAt: '2024-01-17T12:30:00.000Z',
    feedback: 'Good effort. Focus on problem-solving strategies and double-check your work.',
    questions: [
      { id: '1', question: 'Algebra - Linear Equations', correct: true, points: 20 },
      { id: '2', question: 'Geometry - Area and Perimeter', correct: false, points: 0 },
      { id: '3', question: 'Statistics - Mean and Median', correct: true, points: 15 },
      { id: '4', question: 'Trigonometry - Basic Ratios', correct: true, points: 25 },
      { id: '5', question: 'Word Problems', correct: false, points: 0 }
    ]
  }
];

const ASSESSMENT_TYPES = [
  'All',
  'QUIZ',
  'ASSIGNMENT',
  'PRACTICE',
  'CBT',
  'EXAM'
];

const GRADE_FILTERS = [
  'All',
  'A',
  'B',
  'C',
  'D',
  'F'
];

export default function StudentResultsScreen() {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleTypeFilterChange = (filter: string) => {
    setSelectedTypeFilter(filter);
  };

  const handleGradeFilterChange = (filter: string) => {
    setSelectedGradeFilter(filter);
  };

  const handleViewResult = (result: any) => {
    console.log('View result details:', result.title);
    // TODO: Navigate to detailed result view
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return '#10b981'; // green
      case 'B': return '#3b82f6'; // blue
      case 'C': return '#f59e0b'; // yellow
      case 'D': return '#f97316'; // orange
      case 'F': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getGradeBackgroundColor = (grade: string) => {
    switch (grade) {
      case 'A': return '#10b98120'; // green
      case 'B': return '#3b82f620'; // blue
      case 'C': return '#f59e0b20'; // yellow
      case 'D': return '#f9731620'; // orange
      case 'F': return '#ef444420'; // red
      default: return '#6b728020'; // gray
    }
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

  // Apply client-side filtering
  const filteredResults = mockResults.filter(result => {
    const typeMatch = selectedTypeFilter === 'All' || result.type === selectedTypeFilter;
    const gradeMatch = selectedGradeFilter === 'All' || result.grade === selectedGradeFilter;
    return typeMatch && gradeMatch;
  });

  // Calculate statistics
  const totalAssessments = mockResults.length;
  const averageScore = mockResults.reduce((sum, result) => sum + result.percentage, 0) / totalAssessments;
  const gradeDistribution = {
    A: mockResults.filter(r => r.grade === 'A').length,
    B: mockResults.filter(r => r.grade === 'B').length,
    C: mockResults.filter(r => r.grade === 'C').length,
    D: mockResults.filter(r => r.grade === 'D').length,
    F: mockResults.filter(r => r.grade === 'F').length
  };

  // Calculate counts for filter tabs
  const typeCounts = {
    All: mockResults.length,
    QUIZ: mockResults.filter(r => r.type === 'QUIZ').length,
    ASSIGNMENT: mockResults.filter(r => r.type === 'ASSIGNMENT').length,
    PRACTICE: mockResults.filter(r => r.type === 'PRACTICE').length,
    CBT: mockResults.filter(r => r.type === 'CBT').length,
    EXAM: mockResults.filter(r => r.type === 'EXAM').length
  };

  const gradeCounts = {
    All: mockResults.length,
    A: gradeDistribution.A,
    B: gradeDistribution.B,
    C: gradeDistribution.C,
    D: gradeDistribution.D,
    F: gradeDistribution.F
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
              My Results
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

          {/* Statistics Cards */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Performance Overview
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Average Score</Text>
                  <Ionicons name="trending-up-outline" size={16} color="#10b981" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {averageScore.toFixed(1)}%
                </Text>
              </View>
              <View className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Total Assessments</Text>
                  <Ionicons name="document-text-outline" size={16} color="#3b82f6" />
                </View>
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {totalAssessments}
                </Text>
              </View>
            </View>
          </View>

          {/* Grade Distribution */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Grade Distribution
            </Text>
            <View className="flex-row gap-2">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <View 
                  key={grade}
                  className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 items-center"
                >
                  <View 
                    className="w-8 h-8 rounded-full items-center justify-center mb-1"
                    style={{ backgroundColor: getGradeBackgroundColor(grade) }}
                  >
                    <Text 
                      className="text-lg font-bold"
                      style={{ color: getGradeColor(grade) }}
                    >
                      {grade}
                    </Text>
                  </View>
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {count}
                  </Text>
                </View>
              ))}
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
                  onPress={() => handleTypeFilterChange(key)}
                  className={`px-3 py-2 rounded-full border ${
                    selectedTypeFilter === key
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-xs font-medium ${
                    selectedTypeFilter === key
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {key} ({count})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Grade Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            className="mb-4"
          >
            <View className="flex-row items-center gap-1">
              {Object.entries(gradeCounts).map(([key, count]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleGradeFilterChange(key)}
                  className={`px-2 py-1 rounded-full border ${
                    selectedGradeFilter === key
                      ? 'bg-purple-500 border-purple-500'
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-xs font-medium ${
                    selectedGradeFilter === key
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {key} ({count})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Results List */}
          {filteredResults.length === 0 ? (
            <View className="flex-1 items-center justify-center py-16">
              <Ionicons name="help-circle-outline" size={64} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                No Results Found
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                No results match your current filters
              </Text>
            </View>
          ) : (
            <View>
              {filteredResults.map((result) => (
                <View
                  key={result.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-3"
                >
                  {/* Result Header */}
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 mr-3">
                      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {result.title}
                      </Text>
                      
                      {/* Badges Row */}
                      <View className="flex-row items-center gap-2 mb-2">
                        <View className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                            {result.type}
                          </Text>
                        </View>
                        <View 
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: getGradeBackgroundColor(result.grade) }}
                        >
                          <Text 
                            className="text-xs font-medium"
                            style={{ color: getGradeColor(result.grade) }}
                          >
                            Grade: {result.grade}
                          </Text>
                        </View>
                        <View 
                          className="px-2 py-1 rounded-full"
                          style={{ 
                            backgroundColor: result.subject.color + '20',
                            borderColor: result.subject.color,
                            borderWidth: 1
                          }}
                        >
                          <Text 
                            className="text-xs font-medium"
                            style={{ color: result.subject.color }}
                          >
                            {result.subject.code}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Score Display */}
                  <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-4">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="trophy-outline" size={16} color="#f59e0b" />
                          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {result.score}/{result.totalPoints}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="stats-chart-outline" size={16} color="#3b82f6" />
                          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {result.percentage}%
                          </Text>
                        </View>
                        <View 
                          className="px-3 py-1 rounded-full"
                          style={{ backgroundColor: getGradeBackgroundColor(result.grade) }}
                        >
                          <Text 
                            className="text-lg font-bold"
                            style={{ color: getGradeColor(result.grade) }}
                          >
                            {result.grade}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Feedback */}
                  {result.feedback && (
                    <View className="mb-3">
                      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Teacher Feedback:
                      </Text>
                      <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                        {result.feedback}
                      </Text>
                    </View>
                  )}

                  {/* Submission and Grading Info */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          Submitted: {formatDate(result.submittedAt)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="checkmark-circle-outline" size={14} color="#10b981" />
                        <Text className="text-sm text-gray-600 dark:text-gray-400">
                          Graded: {formatDate(result.gradedAt)}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="person-outline" size={14} color="#6b7280" />
                      <Text className="text-sm text-gray-600 dark:text-gray-400">
                        {result.teacher.name}
                      </Text>
                    </View>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity
                    onPress={() => handleViewResult(result)}
                    className="w-full py-3 bg-blue-600 rounded-lg flex-row items-center justify-center gap-2"
                    activeOpacity={0.8}
                  >
                    <Ionicons name="eye-outline" size={16} color="white" />
                    <Text className="text-white font-semibold">View Details</Text>
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
