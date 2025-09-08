import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
  onAddQuestion: () => void;
  onAddImage: () => void;
  onAddVideo: () => void;
  isLoading: boolean;
}

export default function ActionButtons({
  onAddQuestion,
  onAddImage,
  onAddVideo,
  isLoading,
}: ActionButtonsProps) {
  const [showActions, setShowActions] = useState(false);

  const handleAddImage = () => {
    setShowActions(false);
    onAddImage();
  };

  const handleAddVideo = () => {
    setShowActions(false);
    onAddVideo();
  };

  const handleAddQuestion = () => {
    setShowActions(false);
    onAddQuestion();
  };

  return (
    <>
      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={() => setShowActions(true)}
          disabled={isLoading}
          className={`w-14 h-14 rounded-full items-center justify-center shadow-lg ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600'
          }`}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>

      {/* Action Sheet Modal */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View className="flex-1 justify-end">
            <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6">
              {/* Header */}
              <View className="items-center mb-6">
                <View className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-4" />
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Add Content
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="space-y-4">
                {/* Add Question */}
                <TouchableOpacity
                  onPress={handleAddQuestion}
                  disabled={isLoading}
                  className="flex-row items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                  activeOpacity={0.7}
                >
                  <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center">
                    <Ionicons name="help-circle" size={24} color="white" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Add Question
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      Create a new question for your quiz
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>

                {/* Add Image */}
                <TouchableOpacity
                  onPress={handleAddImage}
                  disabled={isLoading}
                  className="flex-row items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
                  activeOpacity={0.7}
                >
                  <View className="w-12 h-12 bg-green-600 rounded-full items-center justify-center">
                    <Ionicons name="image" size={24} color="white" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Add Image
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      Upload an image to your quiz
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>

                {/* Add Video */}
                <TouchableOpacity
                  onPress={handleAddVideo}
                  disabled={isLoading}
                  className="flex-row items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"
                  activeOpacity={0.7}
                >
                  <View className="w-12 h-12 bg-purple-600 rounded-full items-center justify-center">
                    <Ionicons name="videocam" size={24} color="white" />
                  </View>
                  <View className="flex-1 ml-4">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Add Video
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      Upload a video to your quiz
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => setShowActions(false)}
                className="mt-6 py-4 bg-gray-100 dark:bg-gray-700 rounded-xl"
                activeOpacity={0.7}
              >
                <Text className="text-center text-gray-700 dark:text-gray-300 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
