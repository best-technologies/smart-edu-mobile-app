import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
  Dimensions,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { directorService } from '@/services/api/directorService';
import { SuccessModal, ErrorModal } from '@/components';

const { width: screenWidth } = Dimensions.get('window');

interface ClassData {
  id: string;
  name: string;
  classTeacher: {
    id: string;
    first_name: string;
    last_name: string;
    display_picture: string | null;
  } | null;
}

interface AddClassModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddClassModal({
  visible,
  onClose,
  onSuccess,
}: AddClassModalProps) {
  const [className, setClassName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [existingClasses, setExistingClasses] = useState<ClassData[]>([]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (!className.trim()) {
      setErrorMessage('Please enter a class name');
      setErrorModalVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const payload = {
        name: className.trim().toLowerCase(),
      };

      const response = await directorService.createClass(payload);

      if (response.success) {
        setSuccessModalVisible(true);
      } else {
        const errorMsg = response.message || 'Failed to create class';
        setErrorMessage(errorMsg);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error creating class:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create class';
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setClassName('');
      onClose();
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    setClassName('');
    onSuccess();
    onClose();
  };

  // Fetch existing classes when modal opens
  useEffect(() => {
    if (visible) {
      fetchExistingClasses();
    }
  }, [visible]);

  const fetchExistingClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const response = await directorService.fetchAllClasses();
      
      if (response.success && response.data) {
        setExistingClasses(response.data);
      }
    } catch (error) {
      console.error('Error fetching existing classes:', error);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };

  const getTeacherDisplayName = (teacher: any) => {
    if (!teacher) return 'No teacher assigned';
    return `${teacher.first_name} ${teacher.last_name}`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pressable onPress={handleClose} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        <View
          style={{
            width: Math.min(screenWidth - 40, 400),
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Add New Class
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Class Name
              </Text>
              <TextInput
                value={className}
                onChangeText={setClassName}
                placeholder="e.g., jss1, ss1"
                placeholderTextColor="#9ca3af"
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={8}
              />
            </View>

            {/* Existing Classes Section */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-3">
                Existing Classes ({existingClasses.length})
              </Text>
              
              {isLoadingClasses ? (
                <View className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <View key={item} className="flex-row items-center p-3 bg-gray-50 rounded-lg">
                      <View className="w-8 h-8 bg-gray-200 rounded-full mr-3" />
                      <View className="flex-1">
                        <View className="w-16 h-4 bg-gray-200 rounded mb-1" />
                        <View className="w-24 h-3 bg-gray-200 rounded" />
                      </View>
                    </View>
                  ))}
                </View>
              ) : existingClasses.length > 0 ? (
                <View style={{ height: 128 }}>
                  <FlatList
                    data={existingClasses}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                    renderItem={({ item: classItem }) => (
                      <View className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-2">
                        {/* Teacher Avatar */}
                        <View className="w-8 h-8 rounded-full mr-3 overflow-hidden bg-gray-200 items-center justify-center">
                          {classItem.classTeacher?.display_picture ? (
                            <Image
                              source={{ uri: classItem.classTeacher.display_picture }}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <Ionicons name="person" size={16} color="#6b7280" />
                          )}
                        </View>
                        
                        {/* Class Info */}
                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-gray-900">
                            {classItem.name.toUpperCase()}
                          </Text>
                          <Text className="text-xs text-gray-500">
                            {getTeacherDisplayName(classItem.classTeacher)}
                          </Text>
                        </View>
                        
                        {/* Status Indicator */}
                        <View className={`w-2 h-2 rounded-full ${
                          classItem.classTeacher ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                      </View>
                    )}
                  />
                </View>
              ) : (
                <Text className="text-sm text-gray-500 text-center py-4">
                  No classes found
                </Text>
              )}
            </View>

            {/* Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg items-center"
              >
                <Text className="text-gray-700 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                className={`flex-1 py-3 px-4 rounded-lg items-center ${
                  isLoading ? 'bg-gray-400' : 'bg-blue-600'
                }`}
              >
                {isLoading ? (
                  <Text className="text-white font-medium">Creating...</Text>
                ) : (
                  <Text className="text-white font-medium">Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        title="Success!"
        message="Class created successfully"
        onClose={handleSuccessModalClose}
        confirmText="OK"
        autoClose={false}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        title="Error"
        message={errorMessage}
        onClose={handleErrorModalClose}
        closeText="OK"
        autoClose={false}
      />
    </Modal>
  );
}
