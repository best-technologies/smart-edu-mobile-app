import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CBTQuestion, CreateQuestionRequest, QuestionType } from '@/services/types/cbtTypes';

interface QuestionCardProps {
  question: CBTQuestion;
  index: number;
  isEditing: boolean;
  onSave: (questionData: Partial<CreateQuestionRequest>) => void;
  onCancel: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onAddQuestion?: () => void;
  isLoading: boolean;
  isGreyedOut?: boolean;
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  MULTIPLE_CHOICE_SINGLE: 'Multiple choice',
  MULTIPLE_CHOICE_MULTIPLE: 'Checkboxes',
  SHORT_ANSWER: 'Short answer',
  LONG_ANSWER: 'Paragraph',
  TRUE_FALSE: 'True/False',
  FILL_IN_BLANK: 'Fill in the blank',
  MATCHING: 'Matching',
  ORDERING: 'Ordering',
  FILE_UPLOAD: 'File upload',
  NUMERIC: 'Numeric',
  DATE: 'Date',
  RATING_SCALE: 'Rating scale',
};

export default function QuestionCard({
  question,
  index,
  isEditing,
  onSave,
  onCancel,
  onDelete,
  onDuplicate,
  onAddQuestion,
  isLoading,
  isGreyedOut = false,
}: QuestionCardProps) {
  console.log('🟡 QuestionCard rendering - index:', index, 'question:', question?.id);
  
  // Safety check to ensure component is properly initialized
  if (!question) {
    console.log('❌ QuestionCard: No question provided');
    return null;
  }

  const editQuestionHandler = () => {
    console.log('🔴 Edit is pressed for question:', question.id);
  };
  
  const [editedData, setEditedData] = useState<Partial<CreateQuestionRequest>>({
    question_text: question.question_text,
    points: question.points,
    is_required: question.is_required,
    show_hint: question.show_hint,
    hint_text: question.hint_text,
    explanation: question.explanation,
    difficulty_level: question.difficulty_level,
  });

  // Local state for managing options during editing
  const [editOptions, setEditOptions] = useState<Array<{
    option_text: string;
    is_correct: boolean;
    order: number;
  }>>([]);

  // Initialize options when editing starts
  useEffect(() => {
    if (isEditing) {
      const initialOptions = question.options?.map(opt => ({
        option_text: opt.option_text,
        is_correct: opt.is_correct,
        order: opt.order,
      })) || [
        { option_text: 'Option 1', is_correct: false, order: 1 },
        { option_text: 'Option 2', is_correct: false, order: 2 },
      ];
      setEditOptions(initialOptions);
    }
  }, [isEditing, question.options]);

  const handleSave = () => {
    if (!editedData.question_text?.trim()) {
      console.log('Validation Error: Question text is required');
      return;
    }

    const dataToSave = {
      ...editedData,
      ...(question.question_type === 'MULTIPLE_CHOICE_SINGLE' || question.question_type === 'MULTIPLE_CHOICE_MULTIPLE' ? {
        options: editOptions
      } : {})
    };

    onSave(dataToSave);
  };

  const addOption = () => {
    setEditOptions([...editOptions, {
      option_text: `Option ${editOptions.length + 1}`,
      is_correct: false,
      order: editOptions.length + 1,
    }]);
  };

  const removeOption = (index: number) => {
    if (editOptions.length > 2) {
      setEditOptions(editOptions.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...editOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setEditOptions(newOptions);
  };

  const toggleCorrectAnswer = (index: number) => {
    const newOptions = [...editOptions];
    if (question.question_type === 'MULTIPLE_CHOICE_SINGLE') {
      // For single choice, only one can be correct
      newOptions.forEach((opt, i) => {
        opt.is_correct = i === index;
      });
    } else {
      // For multiple choice, toggle the selected one
      newOptions[index].is_correct = !newOptions[index].is_correct;
    }
    setEditOptions(newOptions);
  };

  const renderEditableOptions = () => {
    return (
      <View className="space-y-3">
        {editOptions.map((option, optionIndex) => (
          <View key={optionIndex} className="flex-row items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            {/* Remove button - only show if more than 2 options */}
            {editOptions.length > 2 && (
              <TouchableOpacity 
                onPress={() => removeOption(optionIndex)}
                className="p-1"
              >
                <Ionicons name="close-circle" size={20} color="#ef4444" />
              </TouchableOpacity>
            )}
            
            {/* Correct answer selector */}
            <TouchableOpacity
              onPress={() => toggleCorrectAnswer(optionIndex)}
              className="p-1"
            >
              {question.question_type === 'MULTIPLE_CHOICE_SINGLE' ? (
                <View className={`w-4 h-4 rounded-full border-2 ${
                  option.is_correct ? 'bg-green-500 border-green-500' : 'border-gray-400'
                } items-center justify-center`}>
                  {option.is_correct && <View className="w-2 h-2 bg-white rounded-full" />}
                </View>
              ) : (
                <View className={`w-4 h-4 rounded border-2 ${
                  option.is_correct ? 'bg-green-500 border-green-500' : 'border-gray-400'
                } items-center justify-center`}>
                  {option.is_correct && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
              )}
            </TouchableOpacity>
            
            {/* Option text input */}
            <TextInput
              value={option.option_text}
              onChangeText={(text) => updateOption(optionIndex, 'option_text', text)}
              placeholder={`Option ${optionIndex + 1}`}
              className="flex-1 text-gray-900 dark:text-gray-100 bg-transparent"
              placeholderTextColor="#9ca3af"
            />
          </View>
        ))}
        
        {/* Add option button */}
        <TouchableOpacity
          onPress={addOption}
          className="flex-row items-center gap-3 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
        >
          <Ionicons name="add" size={20} color="#6b7280" />
          <Text className="text-gray-500 dark:text-gray-400">Add option</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuestionPreview = () => {
    return (
      <View className="relative mb-4">
        {/* Clickable question content */}
        <View 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${
            isGreyedOut ? 'opacity-50' : ''
          }`}
        >
        {/* Question Number */}
        <View className="absolute top-2 left-2 z-10">
          <View className="w-6 h-6 bg-blue-500 rounded-full items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {index}
            </Text>
          </View>
        </View>

        {/* Edit indicator - removed from here */}

        {/* Drag Handle */}
        <View className="flex-row items-start">
          <View className="w-8 h-16 flex items-center justify-center">
            <View className="flex-row flex-wrap w-3 h-4 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <View key={i} className="w-1 h-1 bg-gray-400 rounded-full" />
              ))}
            </View>
          </View>
          
          {/* Main Question Content */}
          <View className="flex-1 pt-4 pr-16 pb-4">
            {/* Question Title with Blue Left Border */}
            <View className="border-l-4 border-blue-500 pl-4 mb-4">
              <Text className="text-lg font-normal text-gray-900 dark:text-gray-100" numberOfLines={3}>
                {question.question_text || 'Untitled Question New'}
              </Text>
              <View className="h-0.5 bg-purple-500 mt-2" />
            </View>

            {/* Question Type Selector */}
            <View className="flex-row items-center gap-2 mb-4 px-4">
              <Ionicons name="radio-button-on" size={20} color="#6b7280" />
              <Text className="text-gray-700 dark:text-gray-300">
                {QUESTION_TYPE_LABELS[question.question_type]}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#6b7280" />
            </View>

            {/* Options Preview (no close buttons in preview) */}
            <View className="px-4 mb-4">
              {renderQuestionTypePreview()}
            </View>

            {/* Bottom Toolbar - Only show required switch, no action buttons */}
            <View className="flex-row items-center justify-between px-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <View className="flex-row items-center gap-4">
                <View className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">Required</Text>
                  <Switch
                    value={question.is_required}
                    onValueChange={(value) => setEditedData(prev => ({ ...prev, is_required: value }))}
                    trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                    thumbColor={question.is_required ? '#ffffff' : '#f3f4f6'}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Action Icons - Vertical column positioned outside the greyed-out container */}
      <View className="absolute top-3 right-3 flex-col items-center gap-2 z-10">
        <TouchableOpacity 
          onPress={() => {
            console.log('🟢 Pencil icon pressed - index:', index);
            editQuestionHandler();
          }}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-600"
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={16} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onDuplicate} 
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-600"
          activeOpacity={0.7}
        >
          <Ionicons name="copy-outline" size={16} color="#6b7280" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onDelete} 
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-600"
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  const renderQuestionTypePreview = () => {
    switch (question.question_type) {
      case 'MULTIPLE_CHOICE_SINGLE':
      case 'MULTIPLE_CHOICE_MULTIPLE':
        return (
          <View className="space-y-3">
            {question.options?.map((option, optionIndex) => (
              <View key={optionIndex} className="flex-row items-center gap-3">
                <View className={`w-4 h-4 rounded-full border-2 border-gray-300`} />
                <Text className="flex-1 text-gray-700 dark:text-gray-300">
                  {option.option_text || `Option ${optionIndex + 1}`}
                </Text>
                {option.is_correct && (
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                )}
              </View>
            ))}
            <View className="flex-row items-center gap-3">
              <View className="w-4 h-4 rounded-full border-2 border-gray-300" />
              <Text className="text-gray-500 dark:text-gray-400">
                Add option
              </Text>
              <Text className="text-blue-600 dark:text-blue-400">
                or add "Other"
              </Text>
            </View>
          </View>
        );
      
      case 'SHORT_ANSWER':
        return (
          <View className="border-b border-gray-300 dark:border-gray-500 pb-2">
            <Text className="text-gray-400 dark:text-gray-500">
              Short answer text
            </Text>
          </View>
        );
      
      case 'LONG_ANSWER':
        return (
          <View className="border border-gray-300 dark:border-gray-500 rounded-lg p-3 min-h-20">
            <Text className="text-gray-400 dark:text-gray-500">
              Long answer text
            </Text>
          </View>
        );
      
      case 'TRUE_FALSE':
        return (
          <View className="space-y-3">
            <View className="flex-row items-center gap-3">
              <View className="w-4 h-4 rounded-full border-2 border-gray-300" />
              <Text className="text-gray-700 dark:text-gray-300">True</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="w-4 h-4 rounded-full border-2 border-gray-300" />
              <Text className="text-gray-700 dark:text-gray-300">False</Text>
            </View>
          </View>
        );
      
      case 'NUMERIC':
        return (
          <View className="border-b border-gray-300 dark:border-gray-500 pb-2">
            <Text className="text-gray-400 dark:text-gray-500">
              Enter a number
            </Text>
          </View>
        );
      
      default:
        return (
          <Text className="text-gray-400 dark:text-gray-500">
            {QUESTION_TYPE_LABELS[question.question_type]} question
          </Text>
        );
    }
  };

  const renderEditForm = () => {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Edit Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Edit Question {index}
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-white font-medium text-sm">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-gray-700 dark:text-gray-300 font-medium text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Question Text */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Question Text *
          </Text>
          <TextInput
            value={editedData.question_text}
            onChangeText={(text) => setEditedData(prev => ({ ...prev, question_text: text }))}
            placeholder="Enter your question"
            multiline
            numberOfLines={3}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Options for multiple choice questions */}
        {(question.question_type === 'MULTIPLE_CHOICE_SINGLE' || question.question_type === 'MULTIPLE_CHOICE_MULTIPLE') && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Options
            </Text>
            {renderEditableOptions()}
          </View>
        )}

        {/* Points */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Points
          </Text>
          <TextInput
            value={editedData.points?.toString() || ''}
            onChangeText={(text) => setEditedData(prev => ({ ...prev, points: parseFloat(text) || 1 }))}
            placeholder="1"
            keyboardType="numeric"
            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Hint */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Show Hint
            </Text>
            <Switch
              value={editedData.show_hint || false}
              onValueChange={(value) => setEditedData(prev => ({ ...prev, show_hint: value }))}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={editedData.show_hint ? '#ffffff' : '#f3f4f6'}
            />
          </View>
          {editedData.show_hint && (
            <TextInput
              value={editedData.hint_text || ''}
              onChangeText={(text) => setEditedData(prev => ({ ...prev, hint_text: text }))}
              placeholder="Enter hint text"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100"
              placeholderTextColor="#9ca3af"
            />
          )}
        </View>

        {/* Explanation */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Explanation (Optional)
          </Text>
          <TextInput
            value={editedData.explanation || ''}
            onChangeText={(text) => setEditedData(prev => ({ ...prev, explanation: text }))}
            placeholder="Explain the correct answer"
            multiline
            numberOfLines={3}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Required */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Required Question
          </Text>
          <Switch
            value={editedData.is_required || false}
            onValueChange={(value) => setEditedData(prev => ({ ...prev, is_required: value }))}
            trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
            thumbColor={editedData.is_required ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </View>
    );
  };

  return isEditing ? renderEditForm() : renderQuestionPreview();
}