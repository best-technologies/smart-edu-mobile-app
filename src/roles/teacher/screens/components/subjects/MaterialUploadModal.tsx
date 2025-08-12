import React, { useState } from 'react';
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

interface MaterialUploadModalProps {
  visible: boolean;
  topic: Topic | null;
  onClose: () => void;
}

export function MaterialUploadModal({ visible, topic, onClose }: MaterialUploadModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileType: 'pdf' as 'pdf' | 'doc' | 'ppt' | 'other',
    file: null as any
  });

  const handleUploadFile = () => {
    // Here you would typically open file picker
    console.log('Upload file');
    Alert.alert('Upload', 'File upload functionality would be implemented here');
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Material title is required');
      return;
    }
    if (!formData.file) {
      Alert.alert('Error', 'Please select a file');
      return;
    }

    console.log('Saving material:', formData);
    Alert.alert('Success', 'Material uploaded successfully!');
    onClose();
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return 'document-text-outline';
      case 'doc': return 'document-outline';
      case 'ppt': return 'easel-outline';
      default: return 'document-outline';
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'pdf': return '#ef4444';
      case 'doc': return '#3b82f6';
      case 'ppt': return '#f59e0b';
      default: return '#6b7280';
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
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Upload Material
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
          {/* File Upload Section */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              File Upload
            </Text>
            
            <TouchableOpacity
              onPress={handleUploadFile}
              activeOpacity={0.8}
              className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 items-center justify-center"
            >
              {formData.file ? (
                <View className="items-center">
                  <Ionicons 
                    name={getFileIcon(formData.fileType) as any} 
                    size={48} 
                    color={getFileColor(formData.fileType)} 
                  />
                  <Text className="text-green-600 dark:text-green-400 mt-2 text-center font-medium">
                    File Selected
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                    Tap to change
                  </Text>
                </View>
              ) : (
                <View className="items-center">
                  <Ionicons name="cloud-upload-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Tap to upload file
                  </Text>
                  <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                    PDF, DOC, PPT up to 50MB
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* File Type Selection */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              File Type
            </Text>
            
            <View className="flex-row gap-2">
              {(['pdf', 'doc', 'ppt', 'other'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setFormData({ ...formData, fileType: type })}
                  activeOpacity={0.7}
                  className={`flex-1 py-3 px-4 rounded-lg border ${
                    formData.fileType === type
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <View className="items-center">
                    <Ionicons 
                      name={getFileIcon(type) as any} 
                      size={24} 
                      color={formData.fileType === type ? getFileColor(type) : '#6b7280'} 
                    />
                    <Text
                      className={`text-sm font-medium mt-1 capitalize ${
                        formData.fileType === type
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {type}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Material Details */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Material Details
            </Text>

            {/* Material Title */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Material Title *
              </Text>
              <TextInput
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="Enter material title"
                placeholderTextColor="#9ca3af"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
              />
            </View>

            {/* Material Description */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Describe what this material contains"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
              />
            </View>
          </View>

          {/* Upload Tips */}
          <View className="bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              Upload Tips
            </Text>
            
            <View className="space-y-2">
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text className="text-sm text-green-800 dark:text-green-200 flex-1">
                  Use descriptive titles for easy identification
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text className="text-sm text-green-800 dark:text-green-200 flex-1">
                  Keep files under 50MB for faster uploads
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text className="text-sm text-green-800 dark:text-green-200 flex-1">
                  Use PDF format for better compatibility
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text className="text-sm text-green-800 dark:text-green-200 flex-1">
                  Add clear descriptions for student guidance
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
              className="flex-1 py-3 px-4 bg-green-600 rounded-lg"
            >
              <Text className="text-center font-medium text-white">
                Upload Material
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default MaterialUploadModal;
