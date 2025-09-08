import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { cbtService } from '@/services/api/cbtService';
import { CreateQuizRequest, GradingType } from '@/services/types/cbtTypes';
import InlineSpinner from '@/components/InlineSpinner';
import { useToast } from '@/contexts/ToastContext';

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
  subjectId?: string;
  subjectName?: string;
}

export default function CBTCreationScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { subjectId, subjectName } = (route.params as RouteParams) || {};

  // Form state
  const [formData, setFormData] = useState<CreateQuizRequest>({
    title: '',
    description: '',
    instructions: '',
    subject_id: subjectId || '',
    duration: 30,
    max_attempts: 1,
    passing_score: 60,
    total_points: 100,
    shuffle_questions: true,
    shuffle_options: false,
    show_correct_answers: true,
    show_feedback: true,
    allow_review: true,
    grading_type: 'AUTOMATIC',
    auto_submit: true,
    tags: [],
    // Optional fields
    start_date: undefined,
    end_date: undefined,
    time_limit: undefined,
  });



  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: (quizData: CreateQuizRequest) => cbtService.createQuiz(quizData),
    onSuccess: (data) => {
      showSuccess(
        '🎉 CBT Created Successfully!', 
        `"${data.title}" has been created. Let's add some questions!`
      );
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['cbt-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['teacher-subjects'] });
      queryClient.invalidateQueries({ queryKey: ['cbt-quizzes', subjectId] });
      // Navigate to question creation page
      navigation.navigate('CBTQuestionCreation', { 
        quizId: data.id, 
        quizTitle: data.title,
        subjectId: data.subject_id 
      });
    },
    onError: (error: any) => {
      console.error('CBT Creation Error:', error);
      
      let errorMessage = 'An unexpected error occurred';
      let errorTitle = '❌ Failed to Create CBT';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 0) {
        errorTitle = '🌐 Connection Error';
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      } else if (error?.status === 401) {
        errorTitle = '🔐 Authentication Error';
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (error?.status === 403) {
        errorTitle = '🚫 Permission Denied';
        errorMessage = 'You do not have permission to create CBTs. Please contact your administrator.';
      } else if (error?.status >= 500) {
        errorTitle = '🔧 Server Error';
        errorMessage = 'The server is experiencing issues. Please try again later.';
      }
      
      showError(errorTitle, errorMessage);
    },
  });

  const handleInputChange = (field: keyof CreateQuizRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };


  const handleSubmit = () => {
    // Validation
    if (!formData.title.trim()) {
      showError('Validation Error', 'Quiz title is required');
      return;
    }

    if (!formData.subject_id) {
      showError('Validation Error', 'Subject ID is required');
      return;
    }

    if (formData.duration && formData.duration < 1) {
      showError('Validation Error', 'Duration must be at least 1 minute');
      return;
    }

    if (formData.passing_score && (formData.passing_score < 0 || formData.passing_score > 100)) {
      showError('Validation Error', 'Passing score must be between 0 and 100');
      return;
    }

    if (formData.total_points && formData.total_points < 1) {
      showError('Validation Error', 'Total points must be at least 1');
      return;
    }

    if (formData.max_attempts && formData.max_attempts < 1) {
      showError('Validation Error', 'Max attempts must be at least 1');
      return;
    }

    // Clean up the form data - remove undefined values
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== undefined && value !== '')
    ) as CreateQuizRequest;

    createQuizMutation.mutate(cleanedFormData);
  };



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
                Create CBT Quiz
              </Text>
              {subjectName && (
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  For {subjectName}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerClassName="p-4 pb-24"
      >
        {/* Basic Information */}
        <View className="bg-white dark:bg-black rounded-xl p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Basic Information
          </Text>

          {/* Quiz Title */}
          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quiz Title *
            </Text>
            <TextInput
              value={formData.title}
              onChangeText={(text) => handleInputChange('title', text)}
              placeholder="Enter quiz title"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Description */}
          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </Text>
            <TextInput
              value={formData.description}
              onChangeText={(text) => handleInputChange('description', text)}
              placeholder="Enter quiz description"
              multiline
              numberOfLines={2}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Instructions */}
          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Instructions
            </Text>
            <TextInput
              value={formData.instructions}
              onChangeText={(text) => handleInputChange('instructions', text)}
              placeholder="Enter instructions for students"
              multiline
              numberOfLines={2}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Tags */}
          <View className="mb-3">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (Optional)
            </Text>
            <TextInput
              value={formData.tags?.join(', ') || ''}
              onChangeText={(text) => {
                const tags = text.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                handleInputChange('tags', tags);
              }}
              placeholder="e.g., mathematics, final-exam, comprehensive"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-gray-100"
              placeholderTextColor="#9ca3af"
            />
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate tags with commas
            </Text>
          </View>

        </View>

        {/* Quiz Settings */}
        <View className="bg-white dark:bg-black rounded-xl p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Quiz Settings
          </Text>

          <View className="space-y-3">
            {/* Duration and Max Attempts Row */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (min)
                </Text>
                <TextInput
                  value={formData.duration?.toString() || ''}
                  onChangeText={(text) => handleInputChange('duration', parseInt(text) || undefined)}
                  placeholder="30"
                  keyboardType="numeric"
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Attempts
                </Text>
                <View className="flex-row items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <TouchableOpacity
                    onPress={() => {
                      const currentValue = formData.max_attempts || 1;
                      if (currentValue > 1) {
                        handleInputChange('max_attempts', currentValue - 1);
                      }
                    }}
                    className="p-2 border-r border-gray-200 dark:border-gray-700"
                    activeOpacity={0.7}
                    disabled={(formData.max_attempts || 1) <= 1}
                  >
                    <Ionicons 
                      name="remove" 
                      size={16} 
                      color={(formData.max_attempts || 1) <= 1 ? "#9ca3af" : "#374151"} 
                    />
                  </TouchableOpacity>
                  
                  <View className="flex-1 items-center py-2">
                    <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {formData.max_attempts || 1}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => {
                      const currentValue = formData.max_attempts || 1;
                      handleInputChange('max_attempts', currentValue + 1);
                    }}
                    className="p-2 border-l border-gray-200 dark:border-gray-700"
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Passing Score and Total Points Row */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Passing Score (%)
                </Text>
                <TextInput
                  value={formData.passing_score?.toString() || ''}
                  onChangeText={(text) => handleInputChange('passing_score', parseInt(text) || 60)}
                  placeholder="60"
                  keyboardType="numeric"
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Points
                </Text>
                <TextInput
                  value={formData.total_points?.toString() || ''}
                  onChangeText={(text) => handleInputChange('total_points', parseInt(text) || 100)}
                  placeholder="100"
                  keyboardType="numeric"
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-gray-900 dark:text-gray-100"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            {/* Grading Type */}
            <View>
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grading Type
              </Text>
              <View className="flex-row gap-2">
                {(['AUTOMATIC', 'MANUAL', 'MIXED'] as GradingType[]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => handleInputChange('grading_type', type)}
                    className={`flex-1 py-2.5 px-3 rounded-lg border ${
                      formData.grading_type === type
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={`text-center font-medium text-sm ${
                        formData.grading_type === type
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Advanced Settings */}
        <View className="bg-white dark:bg-black rounded-xl p-4 mb-4 shadow-sm border border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center mb-3">
            <Ionicons name="settings-outline" size={20} color="#6b7280" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 ml-2">
              Advanced Settings
            </Text>
          </View>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Configure advanced quiz behavior and student experience options
          </Text>

          <View className="space-y-3">
            {/* Security & Anti-Cheating */}
            <View className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Security & Anti-Cheating
              </Text>
              
              <View className="space-y-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Shuffle Questions
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Randomize question order
                    </Text>
                  </View>
                  <Switch
                    value={formData.shuffle_questions}
                    onValueChange={(value) => handleInputChange('shuffle_questions', value)}
                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                    thumbColor={formData.shuffle_questions ? '#ffffff' : '#f3f4f6'}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Shuffle Options
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Randomize answer choices
                    </Text>
                  </View>
                  <Switch
                    value={formData.shuffle_options}
                    onValueChange={(value) => handleInputChange('shuffle_options', value)}
                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                    thumbColor={formData.shuffle_options ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
              </View>
            </View>

            {/* Student Experience */}
            <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Student Experience
              </Text>
              
              <View className="space-y-2">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Correct Answers
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Display answers after completion
                    </Text>
                  </View>
                  <Switch
                    value={formData.show_correct_answers}
                    onValueChange={(value) => handleInputChange('show_correct_answers', value)}
                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                    thumbColor={formData.show_correct_answers ? '#ffffff' : '#f3f4f6'}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Show Feedback
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Provide question feedback
                    </Text>
                  </View>
                  <Switch
                    value={formData.show_feedback}
                    onValueChange={(value) => handleInputChange('show_feedback', value)}
                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                    thumbColor={formData.show_feedback ? '#ffffff' : '#f3f4f6'}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Allow Review
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Review answers before submit
                    </Text>
                  </View>
                  <Switch
                    value={formData.allow_review}
                    onValueChange={(value) => handleInputChange('allow_review', value)}
                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                    thumbColor={formData.allow_review ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
              </View>
            </View>

            {/* Time Management */}
            <View className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
              <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Time Management
              </Text>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto Submit
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Submit when time expires
                  </Text>
                </View>
                <Switch
                  value={formData.auto_submit}
                  onValueChange={(value) => handleInputChange('auto_submit', value)}
                  trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                  thumbColor={formData.auto_submit ? '#ffffff' : '#f3f4f6'}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={createQuizMutation.isPending}
          className={`py-3 px-6 rounded-xl flex-row items-center justify-center ${
            createQuizMutation.isPending
              ? 'bg-gray-400'
              : 'bg-blue-600'
          }`}
          activeOpacity={0.8}
        >
          {createQuizMutation.isPending ? (
            <>
              <InlineSpinner size="small" color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Creating Quiz...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="add-circle" size={18} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Create Quiz
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      {createQuizMutation.isPending && (
        <View className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 mx-6 shadow-lg">
            <View className="flex-row items-center">
              <InlineSpinner size="small" color="#3b82f6" />
              <Text className="text-gray-900 dark:text-gray-100 font-medium ml-3">
                Creating your quiz...
              </Text>
            </View>
            <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
              Please wait while we set up your CBT
            </Text>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}
