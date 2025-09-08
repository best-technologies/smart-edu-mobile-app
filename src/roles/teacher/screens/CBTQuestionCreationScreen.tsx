import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { cbtService } from '@/services/api/cbtService';
import { CBTQuestion, CreateQuestionRequest, QuestionType } from '@/services/types/cbtTypes';
import InlineSpinner from '@/components/InlineSpinner';
import { useToast } from '@/contexts/ToastContext';
import QuestionCard from './components/QuestionCard';
import QuestionTypeSelector from './components/QuestionTypeSelector';

type TeacherStackParamList = {
  TeacherTabs: undefined;
  SubjectDetail: { subject: any };
  VideoDemo: any;
  CBTCreation: { subjectId?: string; subjectName?: string };
  CBTQuizDetail: { quizId: string };
  CBTQuestionCreation: { quizId: string; quizTitle: string; subjectId: string };
};

type TeacherNavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

interface RouteParams {
  quizId: string;
  quizTitle: string;
  subjectId: string;
}

const QUESTION_TYPES: Array<{
  type: QuestionType;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    type: 'MULTIPLE_CHOICE_SINGLE',
    label: 'Multiple choice',
    icon: 'radio-button-on',
    description: 'Choose one answer'
  },
  {
    type: 'MULTIPLE_CHOICE_MULTIPLE',
    label: 'Checkboxes',
    icon: 'checkbox',
    description: 'Choose multiple answers'
  },
  {
    type: 'SHORT_ANSWER',
    label: 'Short answer',
    icon: 'text-outline',
    description: 'Brief text response'
  },
  {
    type: 'LONG_ANSWER',
    label: 'Paragraph',
    icon: 'document-text-outline',
    description: 'Long text response'
  },
  {
    type: 'TRUE_FALSE',
    label: 'True/False',
    icon: 'checkmark-circle-outline',
    description: 'Binary choice'
  },
];


export default function CBTQuestionCreationScreen() {
  const navigation = useNavigation<TeacherNavigationProp>();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { quizId, quizTitle, subjectId } = (route.params as RouteParams) || {};

  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);

  // Fetch existing questions
  const {
    data: assessmentQuestionsData,
    isLoading: questionsLoading,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ['assessment-questions', quizId],
    queryFn: () => cbtService.getAssessmentQuestions(quizId),
    enabled: !!quizId,
  });

  useEffect(() => {
    if (assessmentQuestionsData) {
      setQuestions(assessmentQuestionsData.questions || []);
      setAssessmentData(assessmentQuestionsData.assessment);
    }
  }, [assessmentQuestionsData]);

  // Mutations
  const addQuestionMutation = useMutation({
    mutationFn: (questionData: CreateQuestionRequest) => cbtService.addQuestion(quizId, questionData),
    onSuccess: (newQuestion) => {
      setQuestions(prev => [...prev, newQuestion]);
      setIsAddingQuestion(false);
      showSuccess('Question Added', 'Your question has been added successfully!');
      // Don't invalidate queries here to avoid refetching and potential state conflicts
    },
    onError: (error: any) => {
      showError('Failed to Add Question', error.message || 'Failed to add question');
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, questionData }: { questionId: string; questionData: Partial<CreateQuestionRequest> }) => 
      cbtService.updateQuestion(quizId, questionId, questionData),
    onSuccess: (updatedQuestion) => {
      setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
      showSuccess('Question Updated', 'Your question has been updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['assessment-questions', quizId] });
    },
    onError: (error: any) => {
      showError('Failed to Update Question', error.message || 'Failed to update question');
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) => cbtService.deleteQuestion(quizId, questionId),
    onSuccess: (_, questionId) => {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      showSuccess('Question Deleted', 'Question has been removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['assessment-questions', quizId] });
    },
    onError: (error: any) => {
      showError('Failed to Delete Question', error.message || 'Failed to delete question');
    },
  });

  const handleAddQuestion = (questionData: CreateQuestionRequest) => {
    addQuestionMutation.mutate(questionData);
  };

  const handleUpdateQuestion = (questionId: string, questionData: CreateQuestionRequest) => {
    updateQuestionMutation.mutate({ questionId, questionData });
  };

  const handleDeleteQuestion = (questionId: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteQuestionMutation.mutate(questionId)
        },
      ]
    );
  };

  const handleDuplicateQuestion = (question: CBTQuestion) => {
    const duplicatedQuestion: CreateQuestionRequest = {
      question_text: question.question_text + ' (Copy)',
      question_type: question.question_type,
      order: questions.length + 1,
      points: question.points,
      is_required: question.is_required,
      difficulty_level: question.difficulty_level,
      show_hint: question.show_hint,
      allow_multiple_attempts: question.allow_multiple_attempts,
      options: question.options?.map(option => ({
        option_text: option.option_text,
        order: option.order,
        is_correct: option.is_correct,
      })),
    };

    addQuestionMutation.mutate(duplicatedQuestion);
  };

  const isLoading = addQuestionMutation.isPending || updateQuestionMutation.isPending || deleteQuestionMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 -ml-2 mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {assessmentData?.title || quizTitle}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {questions.length} {questions.length === 1 ? 'question' : 'questions'}
              {assessmentData && ` • ${assessmentData.total_points} points`}
            </Text>
          </View>
        </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          className="flex-1"
          contentContainerClassName="p-6"
          refreshControl={
            <RefreshControl
              refreshing={questionsLoading}
              onRefresh={refetchQuestions}
              tintColor="#8b5cf6"
            />
          }
        >
          {/* Questions List */}
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index + 1}
              isEditing={false}
              onEdit={() => {}}
              onSave={(questionData) => handleUpdateQuestion(question.id, questionData as CreateQuestionRequest)}
              onCancel={() => {}}
              onDelete={() => handleDeleteQuestion(question.id)}
              onDuplicate={() => handleDuplicateQuestion(question)}
              onAddQuestion={() => setIsAddingQuestion(true)}
              isLoading={isLoading}
            />
          ))}

          {/* Add Question Button - when there are existing questions */}
          {questions.length > 0 && !isAddingQuestion && (
            <TouchableOpacity
              onPress={() => setIsAddingQuestion(true)}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 p-6 mb-6"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="add" size={24} color="#8b5cf6" />
                <Text className="text-purple-600 dark:text-purple-400 font-medium ml-2 text-lg">
                  Add Question
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Add New Question */}
          {isAddingQuestion && (
            <QuestionTypeSelector
              selectedType="MULTIPLE_CHOICE_SINGLE"
              onTypeSelect={() => {}}
              onAddQuestion={(questionData) => {
                handleAddQuestion(questionData);
                setIsAddingQuestion(false);
              }}
              isLoading={isLoading}
              isNew={true}
            />
          )}

          {/* Empty State */}
          {questions.length === 0 && !isAddingQuestion && (
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-24 h-24 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mb-6">
                <Ionicons name="help-circle-outline" size={48} color="#8b5cf6" />
              </View>
              <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Start with your first question
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mb-8 px-8">
                Create engaging questions to build your quiz
              </Text>
              <TouchableOpacity
                onPress={() => setIsAddingQuestion(true)}
                className="px-6 py-3 bg-purple-600 rounded-lg flex-row items-center"
              >
                <Ionicons name="add" size={20} color="white" />
                <Text className="text-white font-medium ml-2">Add First Question</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="h-20" />
        </ScrollView>

        {/* Bottom Icon Bar */}
        {!isAddingQuestion && (
          <View className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <View className="flex-row items-center justify-between">
              {/* Left Actions */}
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity
                  onPress={() => navigation.navigate('CBTQuizDetail', { quizId })}
                  className="flex-row items-center px-3 py-2 bg-gray-100 dark:bg-gray-600 rounded-lg"
                >
                  <Ionicons name="eye-outline" size={16} color="#6b7280" />
                  <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm">Preview</Text>
                </TouchableOpacity>
              </View>
              
              {/* Center Icon Bar */}
              {/* <View className="flex-row items-center space-x-4">
                <TouchableOpacity className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full items-center justify-center">
                  <Ionicons name="document" size={20} color="#6b7280" />
                </TouchableOpacity>
                
                <TouchableOpacity className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full items-center justify-center">
                  <Ionicons name="text" size={20} color="#6b7280" />
                </TouchableOpacity>
                
                <TouchableOpacity className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full items-center justify-center">
                  <Ionicons name="image" size={20} color="#6b7280" />
                </TouchableOpacity>
                
                <TouchableOpacity className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full items-center justify-center">
                  <Ionicons name="videocam" size={20} color="#6b7280" />
                </TouchableOpacity>
                
                <TouchableOpacity className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-full items-center justify-center">
                  <Ionicons name="list" size={20} color="#6b7280" />
                </TouchableOpacity>
              </View> */}
              
              {/* Right Actions */}
              <View className="flex-row items-center space-x-2">
                <TouchableOpacity
                  onPress={() => setIsAddingQuestion(true)}
                  className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center shadow-lg"
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}