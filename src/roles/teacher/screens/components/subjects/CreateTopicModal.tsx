import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

interface CreateTopicModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (topicData: TopicFormData) => void;
  subjectName: string;
  subjectId: string;
}

interface TopicFormData {
  subjectId: string;
  title: string;
  description: string;
  instructions: string;
}

export function CreateTopicModal({ 
  visible, 
  onClose, 
  onSubmit, 
  subjectName,
  subjectId 
}: CreateTopicModalProps) {
  const [formData, setFormData] = useState<TopicFormData>({
    subjectId: subjectId || '',
    title: '',
    description: '',
    instructions: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TopicFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setFormData({
      subjectId: subjectId || '',
      title: '',
      description: '',
      instructions: '',
    });
    setErrors({});
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TopicFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Topic title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Topic description is required';
    }





    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
        handleClose();
      } catch (error) {
        console.error('Error submitting topic:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View className="px-6 py-4 border-b border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xl font-bold text-gray-900">
                Create New Topic
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                className="h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-500">
              Adding topic to {subjectName}
            </Text>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
              {/* Topic Title */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Topic Title *
                </Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) => {
                    setFormData({ ...formData, title: text });
                    if (errors.title) setErrors({ ...errors, title: undefined });
                  }}
                  placeholder="e.g., Introduction to English Grammar"
                  placeholderTextColor="#9ca3af"
                  className={`border rounded-xl px-4 py-3 text-base ${
                    errors.title
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {errors.title && (
                  <Text className="text-red-500 text-sm mt-1">{errors.title}</Text>
                )}
              </View>

              {/* Topic Description */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => {
                    setFormData({ ...formData, description: text });
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                  placeholder="Brief description of what this topic covers..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className={`border rounded-xl px-4 py-3 text-base ${
                    errors.description
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  autoCapitalize="sentences"
                />
                {errors.description && (
                  <Text className="text-red-500 text-sm mt-1">{errors.description}</Text>
                )}
              </View>



              {/* Instructions for Students */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Instructions for Students *
                </Text>
                <Text className="text-xs text-gray-500 mb-3">
                  Clear instructions on what students should do for this topic
                </Text>
                <TextInput
                  value={formData.instructions}
                  onChangeText={(text) => {
                    setFormData({ ...formData, instructions: text });
                    if (errors.instructions) setErrors({ ...errors, instructions: undefined });
                  }}
                  placeholder="e.g., Watch the introduction video, complete the practice exercises, and take notes on key concepts..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className={`border rounded-xl px-4 py-3 text-base ${
                    errors.instructions
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                  autoCapitalize="sentences"
                />
                {errors.instructions && (
                  <Text className="text-red-500 text-sm mt-1">{errors.instructions}</Text>
                )}
              </View>

              {/* Info Section */}
              <View className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <View className="flex-row items-start gap-3">
                  <Ionicons name="information-circle" size={20} color="#3b82f6" />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-blue-800 mb-1">
                      What's Next?
                    </Text>
                    <Text className="text-xs text-blue-700 leading-4">
                      After creating this topic, you can add videos, materials, and assignments. 
                      The topic order will be automatically managed by the system.
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>

          {/* Action Buttons */}
          <View className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleClose}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-300"
                activeOpacity={0.7}
              >
                <Text className="text-center font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-4 rounded-xl ${
                  isSubmitting ? 'bg-purple-400' : 'bg-purple-600'
                }`}
                activeOpacity={0.8}
              >
                {isSubmitting ? (
                  <View className="flex-row items-center justify-center gap-2">
                    <View className=" rounded-full h-4 w-4 border-b-2 border-white" />
                    <Text className="text-center font-semibold text-white">Creating...</Text>
                  </View>
                ) : (
                  <Text className="text-center font-semibold text-white">Create Topic</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
}

export default CreateTopicModal;
