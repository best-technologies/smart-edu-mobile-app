import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Alert,
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAssessmentQuestions } from '@/hooks/useAssessmentQuestions';
import { AssessmentQuestion, QuestionOption } from '@/services/types/apiTypes';
import CenteredLoader from '@/components/CenteredLoader';
import { useToast } from '@/contexts/ToastContext';

const { width } = Dimensions.get('window');

interface AssessmentTakingScreenProps {
  route: {
    params: {
      assessmentId: string;
      assessmentTitle: string;
    };
  };
  navigation: any;
}

export default function AssessmentTakingScreen({ route, navigation }: AssessmentTakingScreenProps) {
  const { assessmentId, assessmentTitle } = route.params;
  const { showError, showSuccess } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    data: questionsData, 
    isLoading, 
    error 
  } = useAssessmentQuestions(assessmentId);

  const assessment = questionsData?.data?.assessment;
  const questions = questionsData?.data?.questions || [];
  const totalQuestions = questionsData?.data?.total_questions || 0;

  // Initialize timer when assessment loads
  useEffect(() => {
    if (assessment && !isSubmitted) {
      setTimeRemaining(assessment.duration * 60); // Convert minutes to seconds
      
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [assessment, isSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, optionId: string, isMultipleChoice: boolean = true) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (isMultipleChoice) {
        // For multiple choice, toggle the option
        if (currentAnswers.includes(optionId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter(id => id !== optionId)
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, optionId]
          };
        }
      } else {
        // For single choice (true/false), replace the answer
        return {
          ...prev,
          [questionId]: [optionId]
        };
      }
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleAutoSubmit = () => {
    Alert.alert(
      'Time Up!',
      'Your time has expired. The assessment will be submitted automatically.',
      [{ text: 'OK', onPress: () => handleSubmit() }]
    );
  };

  const handleSubmit = () => {
    setShowConfirmSubmit(true);
  };

  const confirmSubmit = () => {
    setIsSubmitted(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // TODO: Submit answers to backend
    showSuccess('Assessment Submitted', 'Your answers have been submitted successfully');
    
    // Navigate back after a delay
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  const getAnsweredQuestionsCount = () => {
    return Object.keys(answers).filter(questionId => 
      answers[questionId] && answers[questionId].length > 0
    ).length;
  };

  const isQuestionAnswered = (questionId: string) => {
    return answers[questionId] && answers[questionId].length > 0;
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    const currentAnswers = answers[question.id] || [];
    const isAnswered = isQuestionAnswered(question.id);

    return (
      <View key={question.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-4">
        {/* Question Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <View className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <Text className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Q{question.order}
              </Text>
            </View>
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
              of {totalQuestions}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {question.points} pt{question.points !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Question Text */}
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-7">
          {question.question_text}
        </Text>

        {/* Question Image */}
        {question.question_image && (
          <View className="mb-6">
            <Image
              source={{ uri: question.question_image }}
              className="w-full h-64 rounded-xl"
              resizeMode="contain"
              style={{ backgroundColor: '#f9fafb' }}
            />
          </View>
        )}

        {/* Options */}
        <View className="space-y-4">
          {question.options.map((option: QuestionOption) => {
            const isSelected = currentAnswers.includes(option.id);
            const isMultipleChoice = question.question_type === 'MULTIPLE_CHOICE';
            
            return (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleAnswerSelect(question.id, option.id, isMultipleChoice)}
                className={`p-5 rounded-xl border-2 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center gap-4">
                  <View className={`w-7 h-7 rounded-full border-2 items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-500'
                  }`}>
                    {isSelected && (
                      <Ionicons 
                        name={isMultipleChoice ? "checkmark" : "radio-button-on"} 
                        size={18} 
                        color="white" 
                      />
                    )}
                  </View>
                  <Text className={`flex-1 text-lg leading-6 ${
                    isSelected
                      ? 'text-blue-900 dark:text-blue-100 font-semibold'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {option.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Answer Status */}
        <View className={`mt-6 p-4 rounded-xl ${
          isAnswered 
            ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-gray-100 dark:bg-gray-700'
        }`}>
          <View className="flex-row items-center gap-2">
            <Ionicons 
              name={isAnswered ? "checkmark-circle" : "ellipse-outline"} 
              size={20} 
              color={isAnswered ? "#10b981" : "#6b7280"} 
            />
            <Text className={`text-sm font-medium ${
              isAnswered 
                ? 'text-green-700 dark:text-green-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {isAnswered 
                ? `Answered (${currentAnswers.length} option${currentAnswers.length !== 1 ? 's' : ''} selected)`
                : 'Not answered yet'
              }
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <CenteredLoader visible={true} />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
          <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
            Failed to Load Assessment
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Could not load the assessment questions. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!assessment || questions.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="help-circle" size={64} color="#6b7280" />
          <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
            No Questions Found
          </Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
            This assessment doesn't have any questions available.
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
              {assessmentTitle}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {assessment?.assessment_type} • {assessment?.subject?.name}
            </Text>
          </View>
          <View className="w-8" />
        </View>
        
        {/* Timer and Progress */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Ionicons 
              name="time" 
              size={16} 
              color={timeRemaining < 300 ? '#ef4444' : '#6b7280'} 
            />
            <Text className={`font-mono text-base ${
              timeRemaining < 300 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {formatTime(timeRemaining)}
            </Text>
          </View>
          
          <View className="flex-row items-center gap-4">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {getAnsweredQuestionsCount()}/{totalQuestions} answered
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {assessment?.total_points} pts
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Question Navigation */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          <View className="flex-row gap-2">
            {questions.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuestionJump(index)}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600'
                    : isQuestionAnswered(questions[index].id)
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  index === currentQuestionIndex
                    ? 'text-white'
                    : isQuestionAnswered(questions[index].id)
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Question Content */}
      <ScrollView className="flex-1 p-4">
        {renderQuestion(currentQuestion)}
      </ScrollView>

      {/* Navigation Footer */}
      <View className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex-row items-center gap-2 px-4 py-3 rounded-xl ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 dark:bg-gray-700'
                : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <Ionicons 
              name="chevron-back" 
              size={20} 
              color={currentQuestionIndex === 0 ? '#9ca3af' : '#374151'} 
            />
            <Text className={`font-semibold ${
              currentQuestionIndex === 0
                ? 'text-gray-400'
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentQuestionIndex === totalQuestions - 1 ? (
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-row items-center gap-2 bg-green-600 px-6 py-3 rounded-xl"
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold text-base">Submit Assessment</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNextQuestion}
              className="flex-row items-center gap-2 bg-blue-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-bold text-base">Next</Text>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center p-4">
          <View className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Submit Assessment?
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 mb-6">
              You have answered {getAnsweredQuestionsCount()} out of {totalQuestions} questions. 
              Are you sure you want to submit?
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowConfirmSubmit(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-600 py-3 rounded-lg"
              >
                <Text className="text-center font-medium text-gray-700 dark:text-gray-300">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmSubmit}
                className="flex-1 bg-green-600 py-3 rounded-lg"
              >
                <Text className="text-center font-medium text-white">
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
