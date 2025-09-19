import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuestionType } from '@/services/types/cbtTypes';

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onTypeSelect: (type: QuestionType) => void;
  onAddQuestion: (questionData: any) => void;
  onCancel?: () => void; // Add cancel functionality
  isLoading: boolean;
  isNew?: boolean;
  status?: 'idle' | 'saving' | 'success' | 'error';
  error?: string;
  onRetry?: () => void;
  questionData?: any; // For displaying pending question data
}

const QUESTION_TYPES: Array<{
  type: QuestionType;
  label: string;
  description: string;
  icon: string;
  color: string;
}> = [
  {
    type: 'MULTIPLE_CHOICE_SINGLE',
    label: 'Multiple choice',
    description: 'Single answer from multiple options',
    icon: 'radio-button-on',
    color: '#3b82f6',
  },
  {
    type: 'MULTIPLE_CHOICE_MULTIPLE',
    label: 'Checkboxes',
    description: 'Multiple answers from options',
    icon: 'checkbox',
    color: '#10b981',
  },
  {
    type: 'SHORT_ANSWER',
    label: 'Short answer',
    description: 'Brief text response',
    icon: 'text',
    color: '#f59e0b',
  },
  {
    type: 'LONG_ANSWER',
    label: 'Paragraph',
    description: 'Long text response',
    icon: 'document-text',
    color: '#8b5cf6',
  },
  {
    type: 'TRUE_FALSE',
    label: 'True/False',
    description: 'Binary choice question',
    icon: 'checkmark-circle',
    color: '#ef4444',
  },
  {
    type: 'NUMERIC',
    label: 'Numeric',
    description: 'Number input with validation',
    icon: 'calculator',
    color: '#06b6d4',
  },
  {
    type: 'FILL_IN_BLANK',
    label: 'Fill in the blank',
    description: 'Complete the sentence',
    icon: 'create',
    color: '#84cc16',
  },
  {
    type: 'MATCHING',
    label: 'Matching',
    description: 'Match items from two lists',
    icon: 'swap-horizontal',
    color: '#f97316',
  },
  {
    type: 'ORDERING',
    label: 'Ordering',
    description: 'Arrange items in sequence',
    icon: 'list',
    color: '#ec4899',
  },
  {
    type: 'FILE_UPLOAD',
    label: 'File upload',
    description: 'Upload documents or images',
    icon: 'cloud-upload',
    color: '#6366f1',
  },
  {
    type: 'DATE',
    label: 'Date',
    description: 'Date picker input',
    icon: 'calendar',
    color: '#14b8a6',
  },
  {
    type: 'RATING_SCALE',
    label: 'Rating scale',
    description: 'Rate on a scale',
    icon: 'star',
    color: '#eab308',
  },
];

export default function QuestionTypeSelector({
  selectedType,
  onTypeSelect,
  onAddQuestion,
  onCancel,
  isLoading,
  isNew = false,
  status = 'idle',
  error,
  onRetry,
  questionData,
}: QuestionTypeSelectorProps) {
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [questionText, setQuestionText] = useState(questionData?.question_text || '');
  const [options, setOptions] = useState(
    questionData?.options?.map((opt: any) => ({
      text: opt.option_text || '',
      isCorrect: opt.is_correct || false
    })) || [{ text: '', isCorrect: false }]
  );
  const [isRequired, setIsRequired] = useState(questionData?.is_required ?? true);

  const selectedTypeInfo = QUESTION_TYPES.find(t => t.type === selectedType);

  // Initialize options based on question type
  useEffect(() => {
    if (selectedType === 'TRUE_FALSE') {
      setOptions([
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: false }
      ]);
    } else if (selectedType === 'MULTIPLE_CHOICE_SINGLE' || selectedType === 'MULTIPLE_CHOICE_MULTIPLE') {
      setOptions([
        { text: '', isCorrect: false },
      ]);
    }
  }, [selectedType]);

  // Validation logic
  const getValidationMessage = () => {
    // 1. Question text must not be empty
    if (!questionText.trim()) {
      return 'Please enter a question';
    }

    // 2. For multiple choice questions
    if (selectedType === 'MULTIPLE_CHOICE_SINGLE' || selectedType === 'MULTIPLE_CHOICE_MULTIPLE') {
      // Must have at least 2 options
      if (options.length < 2) {
        return 'Add at least 2 options';
      }
      
      // All options must have text
      const hasEmptyOptions = options.some((option: { text: string; isCorrect: boolean }) => !option.text.trim());
      if (hasEmptyOptions) {
        return 'Fill in all option text';
      }
      
      // At least one option must be selected as correct
      const hasCorrectAnswer = options.some((option: { text: string; isCorrect: boolean }) => option.isCorrect);
      if (!hasCorrectAnswer) {
        return 'Select the correct answer';
      }
    }

    // 3. For TRUE_FALSE questions
    if (selectedType === 'TRUE_FALSE') {
      // At least one option must be selected
      const hasSelectedAnswer = options.some((option: { text: string; isCorrect: boolean }) => option.isCorrect);
      if (!hasSelectedAnswer) {
        return 'Select True or False';
      }
    }

    return null; // No validation errors
  };

  const isFormValid = () => {
    return getValidationMessage() === null;
  };

  const handleAddQuestion = () => {
    if (!isFormValid()) {
      return; // Don't proceed if validation fails
    }
    const questionData = {
      question_text: questionText,
      question_type: selectedType,
      order: 1,
      points: 1,
      is_required: isRequired,
      difficulty_level: 'MEDIUM' as const,
      show_hint: false,
      allow_multiple_attempts: false,
      ...(selectedType === 'MULTIPLE_CHOICE_SINGLE' || selectedType === 'MULTIPLE_CHOICE_MULTIPLE' ? {
        options: options.map((opt: { text: string; isCorrect: boolean }, idx: number) => ({
          option_text: opt.text,
          order: idx + 1,
          is_correct: opt.isCorrect,
        }))
      } : {}),
    };

    onAddQuestion(questionData);
    setShowTypeModal(false);
  };

  return (
    <View className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border mb-4 ${
      isNew ? 'border-purple-300 dark:border-purple-600' : 'border-gray-200 dark:border-gray-700'
    }`}>
        {/* Drag Handle */}
        <View className="flex-row items-start">
          <View className="w-8 h-16 flex items-center justify-center">
            <View className="flex-row flex-wrap w-3 h-4 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <View key={i} className="w-1 h-1 bg-gray-400 rounded-full" />
              ))}
            </View>
          </View>
          
          {/* Status Indicator - Only show for pending questions, not new question form */}
          {!isNew && (
            <View className="absolute top-2 right-2 z-10">
              {status === 'saving' && (
              <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center">
                <Ionicons name="refresh" size={16} color="#3b82f6" />
              </View>
            )}
            {status === 'success' && (
              <View className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={16} color="#10b981" />
              </View>
            )}
            {status === 'error' && (
              <TouchableOpacity 
                onPress={onRetry}
                className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full items-center justify-center"
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="refresh" size={16} color="#dc2626" />
              </TouchableOpacity>
            )}
            </View>
          )}
        
        {/* Main Question Content */}
        <View className="flex-1 pt-4 pr-4 pb-4">
          {/* Question Title with Blue Left Border */}
          <View className="border-l-4 border-blue-500 pl-4 mb-4">
            {status === 'idle' ? (
              <TextInput
                value={questionText}
                onChangeText={setQuestionText}
                placeholder="Untitled Question"
                className="text-lg font-normal text-gray-900 dark:text-gray-100 bg-transparent"
                placeholderTextColor="#9ca3af"
                multiline
              />
            ) : (
              <Text className="text-lg font-normal text-gray-900 dark:text-gray-100">
                {questionText || 'Untitled Question'}
              </Text>
            )}
            <View className="h-0.5 bg-purple-500 mt-2" />
          </View>

          {/* Question Type Selector */}
          <View className="flex-row items-center justify-between mb-4 px-4">
            <TouchableOpacity
              onPress={() => setShowTypeModal(true)}
              className="flex-row items-center gap-2"
              activeOpacity={0.7}
            >
              <Ionicons name="radio-button-on" size={20} color="#6b7280" />
              <Text className="text-gray-700 dark:text-gray-300">
                {selectedTypeInfo?.label}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity className="p-1">
              <Ionicons name="image-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Options - Only show for multiple choice questions */}
          {(selectedType === 'MULTIPLE_CHOICE_SINGLE' || selectedType === 'MULTIPLE_CHOICE_MULTIPLE') && (
            <View className="px-4 mb-4">
              <View className="space-y-4">
                {options.map((option: { text: string; isCorrect: boolean }, index: number) => (
                  <View key={`option-${index}`} className="flex-row items-center gap-3 py-2">
                    <TouchableOpacity
                      onPress={() => {
                        const newOptions = [...options];
                        if (selectedType === 'MULTIPLE_CHOICE_SINGLE') {
                          // For single choice, only one can be correct
                          newOptions.forEach((opt: { text: string; isCorrect: boolean }, i: number) => {
                            opt.isCorrect = i === index;
                          });
                        } else {
                          // For multiple choice, toggle the selected one
                          newOptions[index].isCorrect = !newOptions[index].isCorrect;
                        }
                        setOptions(newOptions);
                      }}
                      className="p-1"
                    >
                      <View className={`w-4 h-4 rounded-full border-2 ${
                        option.isCorrect ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                      } items-center justify-center`}>
                        {option.isCorrect && <View className="w-2 h-2 bg-white rounded-full" />}
                      </View>
                    </TouchableOpacity>
                    {status === 'idle' ? (
                      <TextInput
                        value={option.text}
                        onChangeText={(text) => {
                          const newOptions = [...options];
                          newOptions[index].text = text;
                          setOptions(newOptions);
                        }}
                        placeholder={option.text === '' ? 'Enter option text' : `Option ${index + 1}`}
                        className="flex-1 text-gray-700 dark:text-gray-300 bg-transparent py-2"
                        placeholderTextColor="#9ca3af"
                      />
                    ) : (
                      <Text className="flex-1 text-gray-700 dark:text-gray-300 py-2">
                        {option.text || `Option ${index + 1}`}
                      </Text>
                    )}
                    <TouchableOpacity 
                      onPress={() => {
                        if (options.length > 1) {
                          const newOptions = options.filter((_: { text: string; isCorrect: boolean }, i: number) => i !== index);
                          setOptions(newOptions);
                        }
                      }}
                      className="p-2 ml-1"
                    >
                      <Ionicons name="close" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    setOptions([...options, { text: '', isCorrect: false }]);
                  }}
                  className="flex-row items-center gap-3 py-3"
                  activeOpacity={0.7}
                >
                  <View className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  <Text className="text-gray-500 dark:text-gray-400">
                    Add option
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TRUE_FALSE Options */}
          {selectedType === 'TRUE_FALSE' && (
            <View className="px-4 mb-4">
              <View className="space-y-4">
                <View className="flex-row items-center gap-3 py-2">
                  <TouchableOpacity
                    onPress={() => {
                      const newOptions = [
                        { text: 'True', isCorrect: true },
                        { text: 'False', isCorrect: false }
                      ];
                      setOptions(newOptions);
                    }}
                    className="p-1"
                  >
                    <View className={`w-4 h-4 rounded-full border-2 ${
                      options[0]?.isCorrect ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                    } items-center justify-center`}>
                      {options[0]?.isCorrect && <View className="w-2 h-2 bg-white rounded-full" />}
                    </View>
                  </TouchableOpacity>
                  <Text className="flex-1 text-gray-700 dark:text-gray-300 py-2">True</Text>
                </View>
                <View className="flex-row items-center gap-3 py-2">
                  <TouchableOpacity
                    onPress={() => {
                      const newOptions = [
                        { text: 'True', isCorrect: false },
                        { text: 'False', isCorrect: true }
                      ];
                      setOptions(newOptions);
                    }}
                    className="p-1"
                  >
                    <View className={`w-4 h-4 rounded-full border-2 ${
                      options[1]?.isCorrect ? 'bg-purple-600 border-purple-600' : 'border-gray-300'
                    } items-center justify-center`}>
                      {options[1]?.isCorrect && <View className="w-2 h-2 bg-white rounded-full" />}
                    </View>
                  </TouchableOpacity>
                  <Text className="flex-1 text-gray-700 dark:text-gray-300 py-2">False</Text>
                </View>
              </View>
            </View>
          )}

          {/* Validation Message */}
          {!isFormValid() && (
            <View className="px-4 mb-2">
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <View className="flex-row items-center">
                  <Ionicons name="alert-circle" size={16} color="#dc2626" />
                  <Text className="text-red-600 dark:text-red-400 ml-2 text-sm font-medium">
                    {getValidationMessage()}
                  </Text>
                </View>
              </View>
            </View>
          )}


          {/* API Error Message - Only show for pending questions, not new question form */}
          {status === 'error' && error && !isNew && (
            <View className="px-4 mb-2">
              <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <View className="flex-row items-center">
                  <Ionicons name="alert-circle" size={16} color="#dc2626" />
                  <Text className="text-red-600 dark:text-red-400 ml-2 text-sm font-medium flex-1">
                    {error}
                  </Text>
                  <TouchableOpacity 
                    onPress={onRetry} 
                    className="ml-2 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"
                    activeOpacity={0.7}
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                  >
                    <Ionicons name="refresh" size={16} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Bottom Toolbar - Only show for new questions */}
          {status === 'idle' && (
            <View className="px-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-4">
                  <View className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">Required</Text>
                    <Switch
                      value={isRequired}
                      onValueChange={setIsRequired}
                      trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                      thumbColor={isRequired ? '#ffffff' : '#f3f4f6'}
                    />
                  </View>
                </View>
                <View className="flex-row items-center gap-3">
                  {/* Cancel Button - Only show for new questions */}
                  {isNew && onCancel && (
                    <TouchableOpacity
                      onPress={onCancel}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 flex-row items-center"
                      activeOpacity={0.8}
                    >
                      <Ionicons name="close" size={18} color="#6b7280" />
                      <Text className="text-gray-600 dark:text-gray-400 font-medium ml-2 text-sm">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={handleAddQuestion}
                    disabled={isLoading || !isFormValid()}
                    className={`px-4 py-2 rounded-lg flex-row items-center ${
                      isLoading || !isFormValid() ? 'bg-gray-400' : 'bg-purple-600'
                    }`}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add-circle" size={18} color="white" />
                    <Text className="text-white font-medium ml-2 text-sm">
                      Add Question
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>


      {/* Question Type Modal */}
      <Modal
        visible={showTypeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTypeModal(false)}
      >
        <View className="flex-1 bg-white dark:bg-gray-900">
          {/* Modal Header */}
          <View className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Choose Question Type
              </Text>
              <TouchableOpacity
                onPress={() => setShowTypeModal(false)}
                className="p-2"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Question Types List */}
          <ScrollView className="flex-1 p-4">
            <View className="space-y-3">
              {QUESTION_TYPES.map((typeInfo) => (
                <TouchableOpacity
                  key={typeInfo.type}
                  onPress={() => {
                    onTypeSelect(typeInfo.type);
                    setShowTypeModal(false);
                  }}
                  className={`flex-row items-center p-4 rounded-xl border ${
                    selectedType === typeInfo.type
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                  activeOpacity={0.7}
                >
                  <View 
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${typeInfo.color}20` }}
                  >
                    <Ionicons 
                      name={typeInfo.icon as any} 
                      size={24} 
                      color={typeInfo.color} 
                    />
                  </View>
                  
                  <View className="flex-1 ml-4">
                    <Text className={`text-lg font-semibold ${
                      selectedType === typeInfo.type
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {typeInfo.label}
                    </Text>
                    <Text className={`text-sm ${
                      selectedType === typeInfo.type
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {typeInfo.description}
                    </Text>
                  </View>

                  {selectedType === typeInfo.type && (
                    <Ionicons name="checkmark-circle" size={24} color={typeInfo.color} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}