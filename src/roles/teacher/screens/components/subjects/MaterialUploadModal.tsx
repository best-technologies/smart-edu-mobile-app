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
import * as DocumentPicker from 'expo-document-picker';
import { useToast } from '@/contexts/ToastContext';
import { HttpClient } from '@/services/api/httpClient';

interface Topic {
  id: string;
  title: string;
  description: string;
  videos: any[];
  materials: any[];
  instructions: string;
  order: number;
}

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  uri: string;
}

interface MaterialUploadModalProps {
  visible: boolean;
  topic: Topic | null;
  subjectId: string;
  topicId: string;
  onClose: () => void;
}

export function MaterialUploadModal({ visible, topic, subjectId, topicId, onClose }: MaterialUploadModalProps) {
  const { showToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const httpClient = new HttpClient();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fileType: null as 'pdf' | 'doc' | 'ppt' | 'other' | null,
    file: null as UploadedFile | null
  });

  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ],
        copyToCacheDirectory: true,
        multiple: false
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        
        // Check file size (300MB limit)
        const maxSize = 300 * 1024 * 1024; // 300MB in bytes
        if (selectedFile.size && selectedFile.size > maxSize) {
          Alert.alert('File Too Large', 'Please select a file smaller than 300MB.');
          return;
        }
        
        // Create file object with proper structure
        const file: UploadedFile = {
          name: selectedFile.name || 'Unknown File',
          type: selectedFile.mimeType || 'application/octet-stream',
          size: selectedFile.size || 0,
          uri: selectedFile.uri
        };

        // Auto-detect file type
        const detectedType = detectFileType(file);
        
        setFormData({
          ...formData,
          file,
          fileType: detectedType
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  const detectFileType = (file: any): 'pdf' | 'doc' | 'ppt' | 'other' => {
    const fileName = file.name.toLowerCase();
    const mimeType = file.type.toLowerCase();
    
    // Check file extension first
    if (fileName.endsWith('.pdf') || mimeType.includes('pdf')) {
      return 'pdf';
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || mimeType.includes('word') || mimeType.includes('document')) {
      return 'doc';
    } else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx') || mimeType.includes('powerpoint') || mimeType.includes('presentation')) {
      return 'ppt';
    } else {
      return 'other';
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showToast('error', 'Material title is required');
      return;
    }
    if (!formData.file) {
      showToast('error', 'Please select a file');
      return;
    }
    if (!formData.fileType) {
      showToast('error', 'Could not detect file type. Please try uploading a different file.');
      return;
    }

    setIsUploading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('subject_id', subjectId);
      formDataToSend.append('topic_id', topicId);
      
      // Append the file
      formDataToSend.append('material', {
        uri: formData.file.uri,
        type: formData.file.type,
        name: formData.file.name,
      } as any);

      const response = await httpClient.makeRequest('/teachers/topics/upload-material', 'POST', formDataToSend, true);

      if (response.success) {
        showToast('success', response.message || 'Material uploaded successfully!');
        onClose();
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          fileType: null,
          file: null
        });
      } else {
        showToast('error', response.message || 'Failed to upload material');
      }
    } catch (error: any) {
      console.error('Error uploading material:', error);
      const errorMessage = error.message || 'Failed to upload material';
      showToast('error', errorMessage);
    } finally {
      setIsUploading(false);
    }
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                    name={getFileIcon(formData.fileType || 'other') as any} 
                    size={48} 
                    color={getFileColor(formData.fileType || 'other')} 
                  />
                  <Text className="text-green-600 dark:text-green-400 mt-2 text-center font-medium">
                    {formData.file.name}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                    {formData.fileType ? `${formData.fileType.toUpperCase()}` : 'File'} • {formatFileSize(formData.file.size)}
                  </Text>
                  <Text className="text-xs text-blue-500 dark:text-blue-400 text-center mt-1">
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
                    PDF, DOC, PPT up to 300MB
                  </Text>
                </View>
              )}
            </TouchableOpacity>
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
                  Keep files under 300MB for optimal performance
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
              disabled={isUploading}
              className={`flex-1 py-3 px-4 border rounded-lg ${
                isUploading 
                  ? 'border-gray-200 dark:border-gray-700' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <Text className={`text-center font-medium ${
                isUploading 
                  ? 'text-gray-400 dark:text-gray-500' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.7}
              disabled={isUploading}
              className={`flex-1 py-3 px-4 rounded-lg ${
                isUploading ? 'bg-green-400' : 'bg-green-600'
              }`}
            >
              <View className="flex-row items-center justify-center">
                {isUploading && (
                  <Ionicons name="hourglass-outline" size={16} color="white" className="mr-2" />
                )}
                <Text className="text-center font-medium text-white">
                  {isUploading ? 'Uploading...' : 'Upload Material'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default MaterialUploadModal;
