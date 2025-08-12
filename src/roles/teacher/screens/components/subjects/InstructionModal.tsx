import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Topic {
  id: string;
  title: string;
  description: string;
  videos: any[];
  materials: any[];
  instructions: string;
  order: number;
}

interface InstructionModalProps {
  visible: boolean;
  topic: Topic | null;
  onClose: () => void;
}

export function InstructionModal({ visible, topic, onClose }: InstructionModalProps) {
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (topic) {
      setInstructions(topic.instructions || '');
    } else {
      setInstructions('');
    }
  }, [topic]);

  const handleSave = () => {
    if (!instructions.trim()) {
      Alert.alert('Error', 'Instructions cannot be empty');
      return;
    }

    console.log('Saving instructions:', instructions);
    Alert.alert('Success', 'Instructions saved successfully!');
    onClose();
  };

  const insertTemplate = (template: string) => {
    setInstructions(prev => prev + '\n\n' + template);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Edit Instructions
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {topic && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Writing instructions for: {topic.title}
            </Text>
          )}
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Instructions Editor */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Instructions for Students
            </Text>

            <TextInput
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Write detailed instructions for your students..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={12}
              textAlignVertical="top"
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black min-h-[200px]"
            />
          </View>

          {/* Quick Templates */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Quick Templates
            </Text>
            
            <View className="space-y-2">
              <TouchableOpacity
                onPress={() => insertTemplate('📚 **Learning Objectives:**\n• \n• \n• \n\n🎯 **What you will learn:**\n• \n• \n•')}
                activeOpacity={0.7}
                className="flex-row items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <Ionicons name="book-outline" size={20} color="#3b82f6" />
                <Text className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Learning Objectives Template
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => insertTemplate('📋 **Assignment Instructions:**\n\n**Task:** \n**Requirements:**\n• \n• \n• \n\n**Submission:** \n**Due Date:** ')}
                activeOpacity={0.7}
                className="flex-row items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <Ionicons name="clipboard-outline" size={20} color="#10b981" />
                <Text className="text-sm font-medium text-green-700 dark:text-green-300">
                  Assignment Template
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => insertTemplate('🔍 **Study Guide:**\n\n**Key Concepts:**\n• \n• \n• \n\n**Important Points:**\n• \n• \n• \n\n**Practice Questions:**\n1. \n2. \n3.')}
                activeOpacity={0.7}
                className="flex-row items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
              >
                <Ionicons name="search-outline" size={20} color="#8b5cf6" />
                <Text className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Study Guide Template
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => insertTemplate('⚠️ **Important Notes:**\n\n• \n• \n• \n\n💡 **Tips:**\n• \n• \n• \n\n❓ **Common Mistakes to Avoid:**\n• \n• \n•')}
                activeOpacity={0.7}
                className="flex-row items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
              >
                <Ionicons name="warning-outline" size={20} color="#f59e0b" />
                <Text className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Important Notes Template
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Writing Tips */}
          <View className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">
              Writing Tips
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#f59e0b" />
                <Text className="text-sm text-orange-800 dark:text-orange-200 flex-1">
                  Be clear and concise in your instructions
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#f59e0b" />
                <Text className="text-sm text-orange-800 dark:text-orange-200 flex-1">
                  Use bullet points for better readability
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#f59e0b" />
                <Text className="text-sm text-orange-800 dark:text-orange-200 flex-1">
                  Include step-by-step guidance when needed
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#f59e0b" />
                <Text className="text-sm text-orange-800 dark:text-orange-200 flex-1">
                  Mention any prerequisites or requirements
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#f59e0b" />
                <Text className="text-sm text-orange-800 dark:text-orange-200 flex-1">
                  Provide examples or references when helpful
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View className="bg-white dark:bg-black px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg"
            >
              <Text className="text-center font-medium text-gray-700 dark:text-gray-300">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.7}
              className="flex-1 py-3 px-4 bg-orange-600 rounded-lg"
            >
              <Text className="text-center font-medium text-white">
                Save Instructions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default InstructionModal;
