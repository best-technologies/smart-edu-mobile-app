import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Image,
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

interface VideoUploadModalProps {
  visible: boolean;
  topic: Topic | null;
  onClose: () => void;
}

export function VideoUploadModal({ visible, topic, onClose }: VideoUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoFile: null as any,
    selectedClass: '',
    selectedTopic: '',
    subject: topic?.title || ''
  });

  const handleUploadVideo = () => {
    // Here you would typically open video picker
    console.log('Upload video file');
    Alert.alert('Upload', 'Video upload functionality would be implemented here');
  };

  const handleUploadThumbnail = () => {
    // Here you would typically open image picker
    console.log('Upload thumbnail');
    Alert.alert('Upload', 'Thumbnail upload functionality would be implemented here');
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Video title is required');
      return;
    }
    if (!formData.videoFile) {
      Alert.alert('Error', 'Please select a video file');
      return;
    }
    if (!formData.selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }
    if (!formData.selectedTopic) {
      Alert.alert('Error', 'Please select or create a topic');
      return;
    }

    console.log('Saving video:', formData);
    Alert.alert('Success', 'Video uploaded successfully!');
    onClose();
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
              Upload Video
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {topic && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Adding to: {topic.title}
            </Text>
          )}
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Video Upload Section */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Video File
            </Text>
            
            <TouchableOpacity
              onPress={handleUploadVideo}
              activeOpacity={0.8}
              className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center"
            >
              {formData.videoFile ? (
                <View className="items-center">
                  <Ionicons name="play-circle" size={48} color="#3b82f6" />
                  <Text className="text-blue-600 dark:text-blue-400 mt-2 text-center font-medium">
                    Video Selected
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                    Tap to change
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="videocam-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Tap to upload video
                  </Text>
                  <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                    MP4, MOV, AVI up to 500MB
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Thumbnail Section */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Video Thumbnail
            </Text>
            
            <TouchableOpacity
              onPress={handleUploadThumbnail}
              activeOpacity={0.8}
              className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center"
            >
              {formData.thumbnail ? (
                <Image 
                  source={{ uri: formData.thumbnail }} 
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Tap to upload thumbnail
                  </Text>
                  <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                    Recommended: 1280x720px
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

                      {/* Video Details */}
            <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Video Details
              </Text>

              {/* Subject */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </Text>
                <View className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-800">
                  <Text className="text-gray-900 dark:text-gray-100">
                    {formData.subject}
                  </Text>
                </View>
              </View>

              {/* Class Selection */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class *
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'].map((classItem) => (
                    <TouchableOpacity
                      key={classItem}
                      onPress={() => setFormData({ ...formData, selectedClass: classItem })}
                      activeOpacity={0.7}
                      className={`px-3 py-2 rounded-lg border ${
                        formData.selectedClass === classItem
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          formData.selectedClass === classItem
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {classItem}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Topic Selection */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic *
                </Text>
                <View className="flex-row gap-2">
                  <TextInput
                    value={formData.selectedTopic}
                    onChangeText={(text) => setFormData({ ...formData, selectedTopic: text })}
                    placeholder="Enter or select topic"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
                  />
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600"
                  >
                    <Ionicons name="list" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Video Title */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video Title *
                </Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                  placeholder="Enter video title"
                  placeholderTextColor="#9ca3af"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
                />
              </View>

              {/* Video Description */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Describe what this video covers"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
                />
              </View>
            </View>

          {/* Upload Tips */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Upload Tips
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                  Keep videos under 30 minutes for better engagement
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                  Use clear, descriptive titles
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                  Add captions for better accessibility
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#3b82f6" />
                <Text className="text-sm text-blue-800 dark:text-blue-200 flex-1">
                  Ensure good audio quality
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
              className="flex-1 py-3 px-4 bg-blue-600 rounded-lg"
            >
              <Text className="text-center font-medium text-white">
                Upload Video
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default VideoUploadModal;
