import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import VideoPlayer from './components/subjects/VideoPlayer';

export default function VideoDemoScreen() {
  const navigation = useNavigation();
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | undefined>();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleVideoSelected = (uri: string) => {
    setSelectedVideoUri(uri);
    Alert.alert('Success', 'Video selected successfully! You can now play it.');
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={handleBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Video Player Demo
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Upload and preview videos with YouTube-like controls
            </Text>
          </View>
        </View>
      </View>

      {/* Video Player */}
      <View className="flex-1">
        <VideoPlayer
          videoUri={selectedVideoUri}
          onVideoSelected={handleVideoSelected}
          onClose={handleBack}
        />
      </View>

      {/* Features Info */}
      <View className="bg-white dark:bg-black p-6 border-t border-gray-200 dark:border-gray-800">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Features
        </Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="space-y-3">
            <View className="flex-row items-start gap-3">
              <Ionicons name="cloud-upload-outline" size={20} color="#8b5cf6" />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  Video Upload
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Choose videos from gallery or files. Supports multiple formats.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <Ionicons name="play-circle-outline" size={20} color="#8b5cf6" />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  Playback Controls
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Play, pause, seek, and skip forward/backward with intuitive controls.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <Ionicons name="expand-outline" size={20} color="#8b5cf6" />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  Fullscreen Mode
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Switch between normal and fullscreen viewing modes.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <Ionicons name="time-outline" size={20} color="#8b5cf6" />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  Progress Tracking
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Visual progress bar with current time and duration display.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <Ionicons name="eye-outline" size={20} color="#8b5cf6" />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  Auto-Hide Controls
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Controls automatically hide during playback and show on tap.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <Ionicons name="volume-high-outline" size={20} color="#8b5cf6" />
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-gray-100">
                  Audio Support
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Full audio playback with system volume controls.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
