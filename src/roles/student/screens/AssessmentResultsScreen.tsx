import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AssessmentAnswersData, AssessmentSubmission, AssessmentAnswerQuestion } from '@/services/types/apiTypes';
import { StudentService } from '@/services/api/roleServices';
import CenteredLoader from '@/components/CenteredLoader';
import { useToast } from '@/contexts/ToastContext';

const { width } = Dimensions.get('window');

interface AssessmentResultsScreenProps {
  route: {
    params: {
      assessmentId: string;
      assessmentTitle: string;
    };
  };
  navigation: any;
}

export default function AssessmentResultsScreen({ route, navigation }: AssessmentResultsScreenProps) {
  const { assessmentId, assessmentTitle } = route.params;
  const { showError } = useToast();
  
  const [resultsData, setResultsData] = useState<AssessmentAnswersData | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<AssessmentSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessmentResults();
  }, []);

  const fetchAssessmentResults = async () => {
    try {
      setIsLoading(true);
      const studentService = new StudentService();
      
      // Debug: Check if method exists
      console.log('StudentService instance:', studentService);
      console.log('getAssessmentAnswers method:', typeof studentService.getAssessmentAnswers);
      
      let response;
      
      if (typeof studentService.getAssessmentAnswers !== 'function') {
        console.log('Method not found, trying alternative approach...');
        // Try to call the method directly from the prototype
        const method = Object.getPrototypeOf(studentService).getAssessmentAnswers;
        if (typeof method === 'function') {
          console.log('Found method on prototype, calling directly...');
          response = await method.call(studentService, assessmentId);
        } else {
          throw new Error('getAssessmentAnswers method not found on StudentService');
        }
      } else {
        response = await studentService.getAssessmentAnswers(assessmentId);
      }
      
      if (response.success) {
        setResultsData(response.data);
        // Set the latest submission as default selected
        if (response.data.submissions.length > 0) {
          setSelectedAttempt(response.data.submissions[0]);
        }
      } else {
        throw new Error(response.message || 'Failed to fetch assessment results');
      }
    } catch (error) {
      console.error('Error fetching assessment results:', error);
      showError('Error', 'Failed to load assessment results. Please try again.');
    } finally {
      setIsLoading(false);
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
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GRADED': return '#10b981';
      case 'SUBMITTED': return '#3b82f6';
      case 'PENDING': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'GRADED': return 'Graded';
      case 'SUBMITTED': return 'Submitted';
      case 'PENDING': return 'Pending';
      default: return status;
    }
  };

  // Calculate corrected score based on actual correct answers
  const calculateCorrectedScore = (questions: any[]) => {
    let correctCount = 0;
    let totalPoints = 0;
    
    questions.forEach(question => {
      totalPoints += question.points;
      const userSelectedOptions = question.user_answer?.selected_options || [];
      const isCorrect = userSelectedOptions.some((option: any) => option.is_correct);
      if (isCorrect) {
        correctCount += question.points;
      }
    });
    
    return {
      score: correctCount,
      totalPoints,
      percentage: totalPoints > 0 ? Math.round((correctCount / totalPoints) * 100) : 0
    };
  };

  // Calculate corrected passed attempts
  const calculateCorrectedPassedAttempts = () => {
    let passedCount = 0;
    submissions.forEach(submission => {
      const corrected = calculateCorrectedScore(submission.questions);
      if (corrected.percentage >= assessment.passing_score) {
        passedCount++;
      }
    });
    return passedCount;
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <CenteredLoader visible={true} />
      </SafeAreaView>
    );
  }

  if (!resultsData) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
            No Results Found
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Unable to load assessment results. Please try again.
          </Text>
          <TouchableOpacity
            onPress={fetchAssessmentResults}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { assessment, submissions, submission_summary } = resultsData;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1 text-center">
            Assessment Results
          </Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Assessment Overview */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {assessment.title}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {assessment.description}
            </Text>
            
            <View className="flex-row items-center gap-2 mb-3">
              <View className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {assessment.assessment_type}
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
                  className="text-xs font-semibold"
                  style={{ color: assessment.subject.color }}
                >
                  {assessment.subject.code}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="time-outline" size={14} color="#3b82f6" />
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {assessment.duration} min
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="star-outline" size={14} color="#8b5cf6" />
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {assessment.total_points} pts
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons name="person-outline" size={14} color="#6b7280" />
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {assessment.teacher.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Summary Stats */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Performance Summary
            </Text>
            
            <View className="flex-row items-center justify-between mb-3">
              <View className="items-center">
                <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {submission_summary.best_score}/{assessment.total_points}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">Best Score</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {calculateCorrectedPassedAttempts()}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">Passed (Corrected)</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {submission_summary.total_submissions}
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">Attempts</Text>
              </View>
            </View>
          </View>
{/* 
          Backend Grading Issue Notice
          <View className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
            <View className="flex-row items-start gap-2">
              <Ionicons name="warning" size={16} color="#f59e0b" />
              <View className="flex-1">
                <Text className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Scoring Notice
                </Text>
                <Text className="text-xs text-yellow-700 dark:text-yellow-300">
                  The backend has a grading issue. Scores shown are corrected based on your actual correct answers.
                </Text>
              </View>
            </View>
          </View> */}

          {/* Attempt Selection */}
          {submissions.length > 1 && (
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                Select Attempt
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {submissions.map((submission) => (
                    <TouchableOpacity
                      key={submission.submission_id}
                      onPress={() => setSelectedAttempt(submission)}
                      className={`px-4 py-2 rounded-lg border-2 ${
                        selectedAttempt?.submission_id === submission.submission_id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        selectedAttempt?.submission_id === submission.submission_id
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        Attempt {submission.attempt_number}
                      </Text>
                      <Text className={`text-xs ${
                        selectedAttempt?.submission_id === submission.submission_id
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {Math.round(submission.percentage * 10) / 10}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Selected Attempt Details */}
          {selectedAttempt && (
            <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Attempt {selectedAttempt.attempt_number} Details
                </Text>
                <View 
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: getStatusColor(selectedAttempt.status) + '20' }}
                >
                  <Text 
                    className="text-sm font-semibold"
                    style={{ color: getStatusColor(selectedAttempt.status) }}
                  >
                    {getStatusText(selectedAttempt.status)}
                  </Text>
                </View>
              </View>

              <View className="grid grid-cols-2 gap-4 mb-4">
                <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {(() => {
                      const corrected = calculateCorrectedScore(selectedAttempt.questions);
                      return `${corrected.score}/${corrected.totalPoints}`;
                    })()}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Score (Corrected)</Text>
                </View>
                <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {(() => {
                      const corrected = calculateCorrectedScore(selectedAttempt.questions);
                      return `${corrected.percentage}%`;
                    })()}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Percentage (Corrected)</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <Text>Submitted: {formatDate(selectedAttempt.submitted_at)}</Text>
                <Text>Time: {formatDuration(selectedAttempt.time_spent)}</Text>
              </View>
            </View>
          )}

          {/* Questions and Answers */}
          {selectedAttempt && (
            <View className="space-y-4">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Questions & Answers
              </Text>
              
              {selectedAttempt.questions.map((question, index) => (
                <QuestionResultCard 
                  key={question.id} 
                  question={question} 
                  questionNumber={index + 1} 
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Question Result Card Component
interface QuestionResultCardProps {
  question: AssessmentAnswerQuestion;
  questionNumber: number;
}

function QuestionResultCard({ question, questionNumber }: QuestionResultCardProps) {
  // Check if user actually selected the correct option(s) - backend has grading bug
  const userSelectedOptions = question.user_answer?.selected_options || [];
  const isCorrect = userSelectedOptions.some((option: any) => option.is_correct);
  const pointsEarned = isCorrect ? question.points : 0; // Award full points if correct

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Question Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center gap-2 mb-2">
            <View className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
              <Text className="text-blue-700 dark:text-blue-300 font-bold text-sm">
                {questionNumber}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {question.points} pt{question.points !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-6">
            {question.question_text}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${
          isCorrect 
            ? 'bg-green-100 dark:bg-green-900/30' 
            : 'bg-red-100 dark:bg-red-900/30'
        }`}>
          <Text className={`text-xs font-semibold ${
            isCorrect 
              ? 'text-green-700 dark:text-green-300' 
              : 'text-red-700 dark:text-red-300'
          }`}>
            {pointsEarned}/{question.points}
          </Text>
        </View>
      </View>

      {/* Question Image */}
      {question.question_image && (
        <View className="mb-3">
          <Image
            source={{ uri: question.question_image }}
            className="w-full h-48 rounded-lg"
            resizeMode="contain"
          />
        </View>
      )}

      {/* Options */}
      <View className="space-y-2">
        {question.options.map((option) => {
          const isSelected = question.user_answer?.selected_options.some(so => so.id === option.id) || false;
          const isCorrectOption = option.is_correct;
          
          return (
            <View
              key={option.id}
              className={`p-3 rounded-lg border-2 ${
                isSelected && isCorrectOption
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : isSelected && !isCorrectOption
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : isCorrectOption
                  ? 'border-green-300 bg-green-25 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
              }`}
            >
              <View className="flex-row items-center gap-3">
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                  isSelected && isCorrectOption
                    ? 'border-green-500 bg-green-500'
                    : isSelected && !isCorrectOption
                    ? 'border-red-500 bg-red-500'
                    : isCorrectOption
                    ? 'border-green-300 bg-green-100 dark:bg-green-900/30'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {isSelected && (
                    <Ionicons 
                      name="checkmark" 
                      size={12} 
                      color="white" 
                    />
                  )}
                  {!isSelected && isCorrectOption && (
                    <Ionicons 
                      name="checkmark" 
                      size={12} 
                      color="#10b981" 
                    />
                  )}
                </View>
                <Text className={`flex-1 ${
                  isSelected && isCorrectOption
                    ? 'text-green-800 dark:text-green-200 font-medium'
                    : isSelected && !isCorrectOption
                    ? 'text-red-800 dark:text-red-200 font-medium'
                    : isCorrectOption
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {option.text}
                </Text>
                {isCorrectOption && (
                  <Ionicons 
                    name="checkmark-circle" 
                    size={16} 
                    color="#10b981" 
                  />
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Explanation */}
      {question.explanation && (
        <View className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Text className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
            Explanation:
          </Text>
          <Text className="text-sm text-blue-700 dark:text-blue-300">
            {question.explanation}
          </Text>
        </View>
      )}
    </View>
  );
}
