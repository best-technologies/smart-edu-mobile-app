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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { directorService, ClassData, TeacherData } from '@/services/api/directorService';
import { SuccessModal, ErrorModal } from '@/components';

const { width: screenWidth } = Dimensions.get('window');



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
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [existingClasses, setExistingClasses] = useState<ClassData[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<TeacherData[]>([]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Inline editing states
  const [editingField, setEditingField] = useState<{ id: string; field: string; value: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!className.trim()) {
      setErrorMessage('Please enter a class name');
      setErrorModalVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const payload: { name: string; classTeacherId?: string } = {
        name: className.trim().toLowerCase(),
      };

      // Add teacher ID if selected
      if (selectedTeacherId) {
        payload.classTeacherId = selectedTeacherId;
      }

      const response = await directorService.createClass(payload);

      if (response.success) {
        setSuccessMessage('Class created successfully');
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
      setSelectedTeacherId('');
      onClose();
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    setClassName('');
    setSelectedTeacherId('');
    // Only call onSuccess when creating a new class, not when editing
    if (!editingField) {
      onSuccess();
    }
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
        setExistingClasses(response.data.classes);
        setAvailableTeachers(response.data.teachers);
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

  // Inline editing functions
  const startEditing = (classItem: ClassData, field: string) => {
    setEditingField({ id: classItem.id, field, value: classItem[field as keyof ClassData]?.toString() || '' });
    setEditValue(classItem[field as keyof ClassData]?.toString() || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleEditChange = (text: string) => {
    setEditValue(text);
  };

  const saveEdit = async () => {
    if (!editingField || !editValue.trim()) return;

    try {
      setIsUpdating(true);
      
      const payload: any = {};
      payload[editingField.field] = editingField.field === 'name' ? editValue.trim() : editValue;

      const response = await directorService.editClass(editingField.id, payload);

      if (response.success) {
        // Update the local state
        setExistingClasses(prev => prev.map(classItem => 
          classItem.id === editingField.id 
            ? { ...classItem, [editingField.field]: payload[editingField.field] }
            : classItem
        ));
        
        setSuccessMessage(`${editingField.field} updated successfully`);
        setSuccessModalVisible(true);
        cancelEditing();
      } else {
        const errorMsg = response.message || 'Failed to update class';
        setErrorMessage(errorMsg);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error updating class:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to update class';
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (classItem: ClassData) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete "${classItem.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteClass(classItem.id)
        },
      ]
    );
  };

  const deleteClass = async (id: string) => {
    try {
      // TODO: Add delete API call when endpoint is provided
      console.log('Delete class with ID:', id);
      setSuccessMessage('Class deleted successfully');
      setSuccessModalVisible(true);
      fetchExistingClasses(); // Refresh the list
    } catch (error) {
      console.error('Error deleting class:', error);
      setErrorMessage('Failed to delete class');
      setErrorModalVisible(true);
    }
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

            {/* Teacher Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Class Teacher (Optional)
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (availableTeachers.length > 0) {
                    Alert.alert(
                      'Select Teacher',
                      'Choose a teacher for this class:',
                      [
                        { text: 'No Teacher', onPress: () => setSelectedTeacherId('') },
                        ...availableTeachers.map(teacher => ({
                          text: `${teacher.first_name} ${teacher.last_name}`,
                          onPress: () => setSelectedTeacherId(teacher.id)
                        }))
                      ]
                    );
                  }
                }}
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  {selectedTeacherId && availableTeachers.find(t => t.id === selectedTeacherId)?.display_picture ? (
                    <Image
                      source={{ uri: availableTeachers.find(t => t.id === selectedTeacherId)?.display_picture! }}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                  ) : null}
                  <Text className="text-gray-900 flex-1">
                    {selectedTeacherId 
                      ? `${availableTeachers.find(t => t.id === selectedTeacherId)?.first_name} ${availableTeachers.find(t => t.id === selectedTeacherId)?.last_name}`
                      : 'Select a teacher (optional)'
                    }
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
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
                        <View className="w-10 h-10 rounded-full mr-3 overflow-hidden bg-gray-200 items-center justify-center">
                          {classItem.classTeacher?.display_picture ? (
                            <Image
                              source={{ uri: classItem.classTeacher.display_picture }}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <Ionicons name="person" size={20} color="#6b7280" />
                          )}
                        </View>
                        
                        {/* Class Info */}
                        <View className="flex-1">
                          <View className="flex-row items-center mb-1">
                            {editingField?.id === classItem.id && editingField?.field === 'name' ? (
                              <View className="flex-row items-center flex-1">
                                <TextInput
                                  value={editValue}
                                  onChangeText={handleEditChange}
                                  className="bg-white border border-blue-300 rounded px-2 py-1 text-sm font-semibold text-gray-900 flex-1"
                                  autoFocus
                                  maxLength={20}
                                />
                                <View className="flex-row items-center space-x-2 ml-2">
                                  <TouchableOpacity
                                    onPress={saveEdit}
                                    disabled={isUpdating}
                                    className="w-6 h-6 bg-green-100 rounded-full items-center justify-center"
                                  >
                                    <Ionicons name="checkmark" size={14} color="#10b981" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={cancelEditing}
                                    className="w-6 h-6 bg-red-100 rounded-full items-center justify-center"
                                  >
                                    <Ionicons name="close" size={14} color="#ef4444" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <View className="flex-row items-center flex-1">
                                <Text className="text-sm font-semibold text-gray-900">
                                  {classItem.name.toUpperCase()}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => startEditing(classItem, 'name')}
                                  className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center ml-2"
                                >
                                  <Ionicons name="pencil" size={14} color="#3b82f6" />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                          
                          <View className="flex-row items-center">
                            {editingField?.id === classItem.id && editingField?.field === 'classTeacher' ? (
                              <View className="flex-row items-center flex-1">
                                <TouchableOpacity
                                  onPress={() => {
                                    if (availableTeachers.length > 0) {
                                      Alert.alert(
                                        'Select Teacher',
                                        'Choose a teacher for this class:',
                                        [
                                          { text: 'No Teacher', onPress: () => setEditValue('') },
                                          ...availableTeachers.map(teacher => ({
                                            text: `${teacher.first_name} ${teacher.last_name}`,
                                            onPress: () => setEditValue(teacher.id)
                                          }))
                                        ]
                                      );
                                    }
                                  }}
                                  className="bg-white border border-blue-300 rounded px-2 py-1 text-xs text-gray-500 flex-1"
                                >
                                  <Text>
                                    {editValue 
                                      ? availableTeachers.find(t => t.id === editValue)?.first_name + ' ' + 
                                        availableTeachers.find(t => t.id === editValue)?.last_name
                                      : 'Select a teacher'
                                    }
                                  </Text>
                                </TouchableOpacity>
                                <View className="flex-row items-center space-x-2 ml-2">
                                  <TouchableOpacity
                                    onPress={saveEdit}
                                    disabled={isUpdating}
                                    className="w-6 h-6 bg-green-100 rounded-full items-center justify-center"
                                  >
                                    <Ionicons name="checkmark" size={14} color="#10b981" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={cancelEditing}
                                    className="w-6 h-6 bg-red-100 rounded-full items-center justify-center"
                                  >
                                    <Ionicons name="close" size={14} color="#ef4444" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <View className="flex-row items-center flex-1">
                                <Text className="text-xs text-gray-500">
                                  {getTeacherDisplayName(classItem.classTeacher)}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => startEditing(classItem, 'classTeacher')}
                                  className="w-6 h-6 bg-blue-100 rounded-full items-center justify-center ml-2"
                                >
                                  <Ionicons name="pencil" size={14} color="#3b82f6" />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                        
                        {/* Status Indicator */}
                        <View className={`w-3 h-3 rounded-full mr-2 ${
                          classItem.classTeacher ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        
                        {/* Delete Button */}
                        <TouchableOpacity
                          onPress={() => handleDelete(classItem)}
                          className="w-6 h-6 bg-red-100 rounded-full items-center justify-center"
                        >
                          <Ionicons name="trash" size={12} color="#ef4444" />
                        </TouchableOpacity>
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
        message={successMessage}
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
