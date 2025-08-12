import React, { useState, useEffect } from 'react';
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

interface Subject {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  totalStudents: number;
  progress: number;
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
}

interface CourseModalProps {
  visible: boolean;
  subject: Subject | null;
  onClose: () => void;
  onSubjectCreated?: (subject: Subject) => void;
}

export function CourseModal({ visible, subject, onClose, onSubjectCreated }: CourseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnail: '',
    status: 'draft' as 'active' | 'draft' | 'archived',
    selectedClass: ''
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        description: subject.description,
        thumbnail: subject.thumbnail,
        status: subject.status,
        selectedClass: ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        thumbnail: '',
        status: 'draft',
        selectedClass: ''
      });
    }
  }, [subject]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Subject name is required');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Subject description is required');
      return;
    }
    if (!formData.selectedClass.trim()) {
      Alert.alert('Error', 'Please select a class');
      return;
    }

    console.log('Saving subject:', formData);
    
    // Create the new subject object
    const newSubject: Subject = {
      id: subject?.id || Date.now().toString(),
      name: `${formData.name} ${formData.selectedClass}`,
      description: formData.description,
      thumbnail: formData.thumbnail,
      status: formData.status,
      totalTopics: 0,
      totalVideos: 0,
      totalMaterials: 0,
      totalStudents: 0,
      progress: 0,
      lastUpdated: new Date().toISOString()
    };

    // Here you would typically save to API
    if (onSubjectCreated && !subject) {
      // If creating new subject, call the callback
      onSubjectCreated(newSubject);
    } else {
      Alert.alert('Success', subject ? 'Subject updated successfully!' : 'Subject created successfully!');
      onClose();
    }
  };

  const handleUploadThumbnail = () => {
    // Here you would typically open image picker
    console.log('Upload thumbnail');
    Alert.alert('Upload', 'Thumbnail upload functionality would be implemented here');
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
              {subject ? 'Edit Subject' : 'Create New Subject'}
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          {/* Thumbnail Section */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Subject Thumbnail
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

          {/* Course Details */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Subject Details
            </Text>

            {/* Subject Name */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject Name *
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter course name"
                placeholderTextColor="#9ca3af"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
              />
            </View>

            {/* Subject Description */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </Text>
              <TextInput
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Describe what students will learn in this subject"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-black"
              />
            </View>

            {/* Class Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Class *
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Select the class for this subject
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'].map((classItem) => (
                  <TouchableOpacity
                    key={classItem}
                    onPress={() => {
                      setFormData({
                        ...formData,
                        selectedClass: classItem
                      });
                    }}
                    activeOpacity={0.7}
                    className={`px-3 py-2 rounded-lg border ${
                      formData.selectedClass === classItem
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        formData.selectedClass === classItem
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {classItem}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Subject Status */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </Text>
              <View className="flex-row gap-2">
                {(['draft', 'active', 'archived'] as const).map((status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => setFormData({ ...formData, status })}
                    activeOpacity={0.7}
                    className={`flex-1 py-2 px-3 rounded-lg border ${
                      formData.status === status
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium text-center capitalize ${
                        formData.status === status
                          ? 'text-purple-600 dark:text-purple-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Course Structure Preview */}
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Subject Structure
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Ionicons name="folder-outline" size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Topics & Lessons
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Organize your content into topics and lessons
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </View>

              <View className="flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Ionicons name="play-circle-outline" size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Video Content
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Upload and manage video lessons
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </View>

              <View className="flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Ionicons name="document-outline" size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Materials & Resources
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Add PDFs, documents, and other resources
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
              </View>

              <View className="flex-row items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Ionicons name="create-outline" size={20} color="#6b7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Instructions & Notes
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    Write detailed instructions for students
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#6b7280" />
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
              className="flex-1 py-3 px-4 bg-purple-600 rounded-lg"
            >
              <Text className="text-center font-medium text-white">
                {subject ? 'Update Subject' : 'Create Subject'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default CourseModal;
