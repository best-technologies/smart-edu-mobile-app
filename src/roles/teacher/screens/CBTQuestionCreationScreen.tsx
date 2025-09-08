import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl,
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
import ActionButtons from './components/ActionButtons';

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

export default function CBTQuestionCreationScreen() {
  const navigation = useNavigation<TeacherNavigationProp>();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { quizId, quizTitle, subjectId } = (route.params as RouteParams) || {};

  // State for managing questions
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [newQuestionType, setNewQuestionType] = useState<QuestionType>('MULTIPLE_CHOICE_SINGLE');

  // Fetch existing questions
  const {
    data: existingQuestions = [],
    isLoading: questionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ['cbt-questions', quizId],
    queryFn: () => cbtService.getQuizQuestions(quizId),
    enabled: !!quizId,
  });

  // Update local state when questions are fetched
  useEffect(() => {
    if (existingQuestions.length > 0) {
      setQuestions(existingQuestions);
    }
  }, [existingQuestions]);

  // Add question mutation
  const addQuestionMutation = useMutation({
    mutationFn: (questionData: CreateQuestionRequest) => cbtService.addQuestion(quizId, questionData),
    onSuccess: (newQuestion) => {
      setQuestions(prev => [...prev, newQuestion]);
      setEditingQuestion(null);
      showSuccess('✅ Question Added', 'Your question has been added successfully!');
      queryClient.invalidateQueries({ queryKey: ['cbt-questions', quizId] });
    },
    onError: (error: any) => {
      console.error('Add Question Error:', error);
      showError('❌ Failed to Add Question', error.message || 'Failed to add question');
    },
  });

  // Update question mutation
  const updateQuestionMutation = useMutation({
    mutationFn: ({ questionId, questionData }: { questionId: string; questionData: Partial<CreateQuestionRequest> }) => 
      cbtService.updateQuestion(quizId, questionId, questionData),
    onSuccess: (updatedQuestion) => {
      setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
      setEditingQuestion(null);
      showSuccess('✅ Question Updated', 'Your question has been updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['cbt-questions', quizId] });
    },
    onError: (error: any) => {
      console.error('Update Question Error:', error);
      showError('❌ Failed to Update Question', error.message || 'Failed to update question');
    },
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: (questionId: string) => cbtService.deleteQuestion(quizId, questionId),
    onSuccess: (_, questionId) => {
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      showSuccess('✅ Question Deleted', 'Question has been removed successfully!');
      queryClient.invalidateQueries({ queryKey: ['cbt-questions', quizId] });
    },
    onError: (error: any) => {
      console.error('Delete Question Error:', error);
      showError('❌ Failed to Delete Question', error.message || 'Failed to delete question');
    },
  });

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion: CreateQuestionRequest = {
      question_text: '',
      question_type: type,
      order: questions.length + 1,
      points: 1,
      is_required: true,
      difficulty_level: 'MEDIUM',
      show_hint: false,
      allow_multiple_attempts: false,
      ...(type === 'MULTIPLE_CHOICE_SINGLE' || type === 'MULTIPLE_CHOICE_MULTIPLE' ? {
        options: [
          { option_text: '', order: 1, is_correct: false },
          { option_text: '', order: 2, is_correct: false },
        ]
      } : {}),
    };

    addQuestionMutation.mutate(newQuestion);
  };

  const handleUpdateQuestion = (questionId: string, questionData: Partial<CreateQuestionRequest>) => {
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
      question_text: question.question_text,
      question_type: question.question_type,
      order: questions.length + 1,
      points: question.points,
      is_required: question.is_required,
      difficulty_level: question.difficulty_level,
      show_hint: question.show_hint,
      allow_multiple_attempts: question.allow_multiple_attempts,
      hint_text: question.hint_text,
      explanation: question.explanation,
      min_length: question.min_length,
      max_length: question.max_length,
      min_value: question.min_value,
      max_value: question.max_value,
      time_limit: question.time_limit,
      image_url: question.image_url,
      audio_url: question.audio_url,
      video_url: question.video_url,
      options: question.options?.map(option => ({
        option_text: option.option_text,
        order: option.order,
        is_correct: option.is_correct,
        image_url: option.image_url,
        audio_url: option.audio_url,
      })),
      correct_answers: question.correct_answers?.map(answer => ({
        answer_text: answer.answer_text,
        answer_number: answer.answer_number,
        answer_date: answer.answer_date,
        option_ids: answer.option_ids,
        answer_json: answer.answer_json,
      })),
    };

    addQuestionMutation.mutate(duplicatedQuestion);
  };

  const isLoading = addQuestionMutation.isPending || updateQuestionMutation.isPending || deleteQuestionMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 -ml-2"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Add Questions
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {quizTitle}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('CBTQuizDetail', { quizId })}
              className="px-4 py-2 bg-blue-600 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-white font-medium text-sm">
                Preview
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerClassName="p-4 pb-24"
        refreshControl={
          <RefreshControl
            refreshing={questionsLoading}
            onRefresh={refetchQuestions}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Questions List */}
        {questions.length > 0 ? (
          <View className="space-y-4">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                isEditing={editingQuestion === question.id}
                onEdit={() => setEditingQuestion(question.id)}
                onSave={(questionData) => handleUpdateQuestion(question.id, questionData)}
                onCancel={() => setEditingQuestion(null)}
                onDelete={() => handleDeleteQuestion(question.id)}
                onDuplicate={() => handleDuplicateQuestion(question)}
                isLoading={isLoading}
              />
            ))}
          </View>
        ) : (
          <View className="flex-1 items-center justify-center py-16">
            <Ionicons name="help-circle-outline" size={64} color="#9ca3af" />
            <Text className="text-xl font-semibold text-gray-500 dark:text-gray-400 mt-4">
              No Questions Yet
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-center mt-2">
              Start building your quiz by adding your first question
            </Text>
          </View>
        )}

        {/* Add Question Section */}
        <View className="mt-8">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Add New Question
          </Text>
          <QuestionTypeSelector
            selectedType={newQuestionType}
            onTypeSelect={setNewQuestionType}
            onAddQuestion={handleAddQuestion}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>

      {/* Floating Action Buttons */}
      <ActionButtons
        onAddQuestion={() => handleAddQuestion(newQuestionType)}
        onAddImage={() => {/* TODO: Implement image picker */}}
        onAddVideo={() => {/* TODO: Implement video picker */}}
        isLoading={isLoading}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 mx-6 shadow-lg">
            <View className="flex-row items-center">
              <InlineSpinner size="small" color="#3b82f6" />
              <Text className="text-gray-900 dark:text-gray-100 font-medium ml-3">
                Processing question...
              </Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
