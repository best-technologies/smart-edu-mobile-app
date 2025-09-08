import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuestionType } from '@/services/types/cbtTypes';

interface QuestionTypeSelectorProps {
  selectedType: QuestionType;
  onTypeSelect: (type: QuestionType) => void;
  onAddQuestion: (type: QuestionType) => void;
  isLoading: boolean;
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
  isLoading,
}: QuestionTypeSelectorProps) {
  const [showTypeModal, setShowTypeModal] = useState(false);

  const selectedTypeInfo = QUESTION_TYPES.find(t => t.type === selectedType);

  const handleAddQuestion = () => {
    onAddQuestion(selectedType);
    setShowTypeModal(false);
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Current Selection */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Question Type
          </Text>
          <TouchableOpacity
            onPress={() => setShowTypeModal(true)}
            className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-600"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons 
                name={selectedTypeInfo?.icon as any} 
                size={20} 
                color={selectedTypeInfo?.color} 
              />
              <View>
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  {selectedTypeInfo?.label}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedTypeInfo?.description}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-down" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Question Button */}
      <TouchableOpacity
        onPress={handleAddQuestion}
        disabled={isLoading}
        className={`flex-row items-center justify-center py-3 px-4 rounded-lg ${
          isLoading 
            ? 'bg-gray-300' 
            : 'bg-blue-600'
        }`}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={20} color="white" />
        <Text className="text-white font-semibold ml-2">
          {isLoading ? 'Adding...' : 'Add Question'}
        </Text>
      </TouchableOpacity>

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

          {/* Modal Footer */}
          <View className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <TouchableOpacity
              onPress={handleAddQuestion}
              disabled={isLoading}
              className={`flex-row items-center justify-center py-3 px-4 rounded-lg ${
                isLoading 
                  ? 'bg-gray-300' 
                  : 'bg-blue-600'
              }`}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">
                {isLoading ? 'Adding...' : `Add ${selectedTypeInfo?.label} Question`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
