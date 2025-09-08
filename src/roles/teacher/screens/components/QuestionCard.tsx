import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CBTQuestion, CreateQuestionRequest, QuestionType } from '@/services/types/cbtTypes';

interface QuestionCardProps {
  question: CBTQuestion;
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (questionData: Partial<CreateQuestionRequest>) => void;
  onCancel: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  isLoading: boolean;
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
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onDuplicate,
  isLoading,
}: QuestionCardProps) {
  const [editedData, setEditedData] = useState<Partial<CreateQuestionRequest>>({
    question_text: question.question_text,
    points: question.points,
    is_required: question.is_required,
    show_hint: question.show_hint,
    hint_text: question.hint_text,
    explanation: question.explanation,
    difficulty_level: question.difficulty_level,
  });

  const handleSave = () => {
    if (!editedData.question_text?.trim()) {
      Alert.alert('Validation Error', 'Question text is required');
      return;
    }
    onSave(editedData);
  };

  const renderQuestionPreview = () => {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Question Header */}
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-2">
              <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Question {index}
              </Text>
              <View className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  {QUESTION_TYPE_LABELS[question.question_type]}
                </Text>
              </View>
              {question.is_required && (
                <Text className="text-red-500 text-sm">*</Text>
              )}
            </View>
            <Text className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {question.question_text}
            </Text>
            {question.hint_text && question.show_hint && (
              <Text className="text-sm text-gray-500 dark:text-gray-400 italic">
                💡 {question.hint_text}
              </Text>
            )}
          </View>
          
          {/* Question Actions */}
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={onEdit}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={18} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDuplicate}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={18} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onDelete}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30"
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={18} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Question Preview */}
        <View className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          {renderQuestionTypePreview()}
        </View>

        {/* Question Details */}
        <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="star-outline" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {question.points} point{question.points !== 1 ? 's' : ''}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Ionicons name="time-outline" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {question.difficulty_level}
              </Text>
            </View>
          </View>
          {question.explanation && (
            <View className="flex-row items-center gap-2">
              <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Has explanation
              </Text>
            </View>
          )}
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
                <View className={`w-4 h-4 rounded-full border-2 ${
                  question.question_type === 'MULTIPLE_CHOICE_SINGLE' 
                    ? 'border-gray-300' 
                    : 'border-gray-300'
                }`} />
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  {option.option_text || `Option ${optionIndex + 1}`}
                </Text>
                {option.is_correct && (
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                )}
              </View>
            ))}
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
