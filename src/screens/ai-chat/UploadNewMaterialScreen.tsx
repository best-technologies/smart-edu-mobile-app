import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';

export default function UploadNewMaterialScreen() {
  const navigation = useNavigation<any>();
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const supportedFormats = [
    { type: 'PDF', icon: 'document-text', color: '#EF4444', description: 'Portable Document Format' },
    { type: 'DOC', icon: 'document', color: '#3B82F6', description: 'Microsoft Word Document' },
    { type: 'DOCX', icon: 'document', color: '#3B82F6', description: 'Microsoft Word Document' },
    { type: 'TXT', icon: 'document-text', color: '#6B7280', description: 'Plain Text File' },
    { type: 'PPT', icon: 'easel', color: '#F59E0B', description: 'PowerPoint Presentation' },
    { type: 'PPTX', icon: 'easel', color: '#F59E0B', description: 'PowerPoint Presentation' },
  ];

  const handleSelectFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setSelectedFiles(prev => [...prev, ...result.assets]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select files. Please try again.');
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('No Files', 'Please select at least one file to upload.');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      Alert.alert(
        'Upload Successful', 
        `${selectedFiles.length} file(s) uploaded successfully. You can now chat with these materials.`,
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toUpperCase();
    const format = supportedFormats.find(f => f.type === extension);
    return format || { icon: 'document', color: '#6B7280' };
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Upload Material
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 py-4">
        {/* Upload Area */}
        <TouchableOpacity
          onPress={handleSelectFiles}
          activeOpacity={0.8}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 mb-6"
        >
          <View className="items-center">
            <View className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full items-center justify-center mb-4">
              <Ionicons name="cloud-upload" size={32} color="#8B5CF6" />
            </View>
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              Select Files to Upload
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Choose documents from your device to chat with AI
            </Text>
            <View className="bg-purple-600 px-6 py-3 rounded-full">
              <Text className="text-white font-semibold">Choose Files</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Selected Files ({selectedFiles.length})
            </Text>
            {selectedFiles.map((file, index) => {
              const fileIcon = getFileIcon(file.name);
              return (
                <View
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 border border-gray-200 dark:border-gray-700"
                >
                  <View className="flex-row items-center">
                    <View 
                      className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: `${fileIcon.color}15` }}
                    >
                      <Ionicons name={fileIcon.icon as any} size={24} color={fileIcon.color} />
                    </View>
                    
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {file.name}
                      </Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-500">
                        {formatFileSize(file.size || 0)}
                      </Text>
                    </View>
                    
                    <TouchableOpacity
                      onPress={() => handleRemoveFile(index)}
                      className="w-8 h-8 rounded-full items-center justify-center"
                    >
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Supported Formats */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Supported Formats
          </Text>
          <View className="space-y-2">
            {supportedFormats.map((format, index) => (
              <View
                key={index}
                className="flex-row items-center bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
              >
                <View 
                  className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                  style={{ backgroundColor: `${format.color}15` }}
                >
                  <Ionicons name={format.icon as any} size={20} color={format.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    .{format.type.toLowerCase()}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-500">
                    {format.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upload Guidelines */}
        <View className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-700 mb-6">
          <View className="flex-row items-start">
            <View className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mr-3 mt-1">
              <Ionicons name="information-circle" size={16} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Upload Guidelines
              </Text>
              <View className="space-y-1">
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  • Maximum file size: 10MB per file
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  • Supported formats: PDF, DOC, DOCX, TXT, PPT, PPTX
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  • Files are processed securely and privately
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  • Processing may take a few minutes for large files
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          onPress={handleUpload}
          disabled={selectedFiles.length === 0 || isUploading}
          className={`rounded-2xl p-4 ${
            selectedFiles.length === 0 || isUploading
              ? 'bg-gray-300 dark:bg-gray-700'
              : 'bg-purple-600'
          }`}
          activeOpacity={0.8}
        >
          <View className="flex-row items-center justify-center">
            {isUploading ? (
              <>
                <Ionicons name="hourglass" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-2">Uploading...</Text>
              </>
            ) : (
              <>
                <Ionicons name="cloud-upload" size={20} color="#ffffff" />
                <Text className="text-white font-semibold ml-2">
                  Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
