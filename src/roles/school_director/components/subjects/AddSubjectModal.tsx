import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { directorService } from '@/services/api/directorService';
import { SuccessModal, ErrorModal } from '@/components';

interface AddSubjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onShowSuccess: (message: string) => void;
  onShowError: (message: string) => void;
}

export default function AddSubjectModal({ 
  visible, 
  onClose, 
  onSuccess, 
  onShowSuccess, 
  onShowError 
}: AddSubjectModalProps) {
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Available data
  const [availableTeachers, setAvailableTeachers] = useState<Array<{ id: string; name: string; display_picture: string | null }>>([]);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch available teachers and classes when modal opens
  useEffect(() => {
    if (visible) {
      fetchAvailableData();
    }
  }, [visible]);

  const fetchAvailableData = async () => {
    try {
      setIsLoadingData(true);
      const response = await directorService.fetchAvailableTeachersAndClasses();
      
      if (response.success && response.data) {
        setAvailableTeachers(response.data.teachers);
        setAvailableClasses(response.data.classes);
      }
    } catch (error) {
      console.error('Error fetching available data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!subjectName.trim() || !subjectCode.trim() || !description.trim()) {
      onShowError('Please fill in all required fields');
      return;
    }

    // Validate subject code format (basic validation)
    if (subjectCode.trim().length < 2) {
      onShowError('Subject code must be at least 2 characters long');
      return;
    }

    // Validate color format
    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (!colorRegex.test(color.trim())) {
      onShowError('Please enter a valid color code (e.g., #3B82F6)');
      return;
    }

    try {
      console.log('🔄 Starting subject creation process...');
      setIsLoading(true);
      
      const payload: any = {
        subject_name: subjectName.trim(),
        code: subjectCode.trim().toUpperCase(),
        description: description.trim(),
        color: color.trim(),
      };

      // Add optional fields if selected
      if (selectedClassId) {
        payload.class_taking_it = selectedClassId;
      }

      if (selectedTeacherId) {
        payload.teacher_taking_it = selectedTeacherId;
      }

      const response = await directorService.createSubject(payload);
      console.log('📧 Create subject response:', response);

      if (response.success === true) {
        const successMessage = `Subject "${subjectName}" created successfully!`;
        console.log('✅ Success message:', successMessage);
        onShowSuccess(successMessage);
        
        // Reset form
        setSubjectName('');
        setSubjectCode('');
        setDescription('');
        setColor('#3B82F6');
        setSelectedClassId('');
        setSelectedTeacherId('');
        
        // Close modal and refresh data
        onSuccess();
      } else {
        console.log('❌ Subject creation failed, showing error modal');
        onShowError(response.message || 'Failed to create subject');
      }
    } catch (error) {
      console.error('❌ Error creating subject:', error);
      
      // Handle ApiError specifically
      if (error instanceof Error) {
        onShowError(error.message || 'Failed to create subject');
      } else {
        onShowError('Failed to create subject');
      }
    } finally {
      console.log('🏁 Subject creation process finished, setting loading to false');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSubjectName('');
      setSubjectCode('');
      setDescription('');
      setColor('#3B82F6');
      setSelectedClassId('');
      setSelectedTeacherId('');
      onClose();
    }
  };

  return (
    <>
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
              width: Math.min(400, 400),
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
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Add New Subject
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className="w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Subject Name */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Subject Name *
                </Text>
                <TextInput
                  value={subjectName}
                  onChangeText={setSubjectName}
                  placeholder="Enter subject name"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={50}
                />
              </View>

              {/* Subject Code */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Subject Code *
                </Text>
                <TextInput
                  value={subjectCode}
                  onChangeText={setSubjectCode}
                  placeholder="Enter subject code (e.g., ENG101)"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={10}
                />
              </View>

              {/* Description */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Description *
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter subject description"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>

              {/* Color */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Color *
                </Text>
                <TextInput
                  value={color}
                  onChangeText={setColor}
                  placeholder="#3B82F6"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={7}
                />
              </View>

              {/* Class Selection */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Assign to Class (Optional)
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (isLoadingData) return;
                    
                    Alert.alert(
                      'Select Class',
                      'Choose a class for this subject:',
                      [
                        { text: 'No Class', onPress: () => setSelectedClassId('') },
                        ...availableClasses.map(classItem => ({
                          text: classItem.name,
                          onPress: () => setSelectedClassId(classItem.id)
                        }))
                      ]
                    );
                  }}
                  disabled={isLoadingData}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between"
                >
                  <Text className="text-gray-900">
                    {selectedClassId 
                      ? availableClasses.find(c => c.id === selectedClassId)?.name || 'Select a class'
                      : 'No class assigned'
                    }
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Teacher Selection */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Assign Teacher (Optional)
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (isLoadingData) return;
                    
                    Alert.alert(
                      'Select Teacher',
                      'Choose a teacher for this subject:',
                      [
                        { text: 'No Teacher', onPress: () => setSelectedTeacherId('') },
                        ...availableTeachers.map(teacher => ({
                          text: teacher.name,
                          onPress: () => setSelectedTeacherId(teacher.id)
                        }))
                      ]
                    );
                  }}
                  disabled={isLoadingData}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between"
                >
                  <Text className="text-gray-900">
                    {selectedTeacherId 
                      ? availableTeachers.find(t => t.id === selectedTeacherId)?.name || 'Select a teacher'
                      : 'No teacher assigned'
                    }
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row space-x-3 mt-6">
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
                  isLoading ? 'bg-gray-400' : 'bg-emerald-600'
                }`}
              >
                {isLoading ? (
                  <Text className="text-white font-medium">Creating...</Text>
                ) : (
                  <Text className="text-white font-medium">Create Subject</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
