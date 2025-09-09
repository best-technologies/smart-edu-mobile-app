import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Linking,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudentTopic, StudentTopicVideo, StudentTopicMaterial } from './studentTopicTypes';

interface StudentTopicDetailModalProps {
  visible: boolean;
  topic: StudentTopic | null;
  subjectColor: string;
  onClose: () => void;
}

export default function StudentTopicDetailModal({ 
  visible, 
  topic, 
  subjectColor, 
  onClose 
}: StudentTopicDetailModalProps) {
  if (!topic) return null;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleVideoPress = async (video: StudentTopicVideo) => {
    try {
      const supported = await Linking.canOpenURL(video.url);
      if (supported) {
        await Linking.openURL(video.url);
      } else {
        Alert.alert('Error', 'Cannot open video link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open video');
    }
  };

  const handleMaterialPress = async (material: StudentTopicMaterial) => {
    try {
      const supported = await Linking.canOpenURL(material.fileUrl);
      if (supported) {
        await Linking.openURL(material.fileUrl);
      } else {
        Alert.alert('Error', 'Cannot open material file');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open material');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <View className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {topic.title}
              </Text>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {topic.videoCount} videos • {topic.materialCount} materials
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="p-2"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Description */}
          {topic.description && (
            <View className="bg-white dark:bg-gray-800 mx-6 mt-6 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
                {topic.description}
              </Text>
            </View>
          )}

          {/* Instructions */}
          {topic.instructions && (
            <View className="bg-white dark:bg-gray-800 mx-6 mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="information-circle-outline" size={20} color="#F59E0B" />
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Instructions
                </Text>
              </View>
              <Text className="text-base text-gray-700 dark:text-gray-300 leading-6">
                {topic.instructions}
              </Text>
            </View>
          )}

          {/* Videos Section */}
          {topic.videos.length > 0 && (
            <View className="bg-white dark:bg-gray-800 mx-6 mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="play-circle-outline" size={20} color="#3B82F6" />
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Videos ({topic.videos.length})
                </Text>
              </View>
              
              {topic.videos.map((video, index) => (
                <TouchableOpacity
                  key={video.id}
                  onPress={() => handleVideoPress(video)}
                  className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3"
                  activeOpacity={0.7}
                >
                  <View 
                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: `${subjectColor}20` }}
                  >
                    <Ionicons name="play" size={16} color={subjectColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {video.title}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDuration(video.duration)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Materials Section */}
          {topic.materials.length > 0 && (
            <View className="bg-white dark:bg-gray-800 mx-6 mt-4 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="document-outline" size={20} color="#10B981" />
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Materials ({topic.materials.length})
                </Text>
              </View>
              
              {topic.materials.map((material, index) => (
                <TouchableOpacity
                  key={material.id}
                  onPress={() => handleMaterialPress(material)}
                  className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-3"
                  activeOpacity={0.7}
                >
                  <View 
                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: `${subjectColor}20` }}
                  >
                    <Ionicons name="document-text" size={16} color={subjectColor} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {material.title}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {material.fileName} • {formatFileSize(material.fileSize)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Empty State */}
          {topic.videos.length === 0 && topic.materials.length === 0 && (
            <View className="bg-white dark:bg-gray-800 mx-6 mt-4 p-8 rounded-xl border border-gray-200 dark:border-gray-700 items-center">
              <Ionicons name="folder-open-outline" size={64} color="#9CA3AF" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                No Content Yet
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                This topic doesn't have any videos or materials yet.
              </Text>
            </View>
          )}

          <View className="h-6" />
        </ScrollView>
      </View>
    </Modal>
  );
}
