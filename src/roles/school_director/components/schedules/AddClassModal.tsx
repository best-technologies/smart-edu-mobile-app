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
import { useToast } from '@/contexts/ToastContext';

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
  const { showSuccess, showError } = useToast();
  const [className, setClassName] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [existingClasses, setExistingClasses] = useState<ClassData[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<TeacherData[]>([]);
  
  // Dropdown states
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false);
  
  // Inline editing states
  const [editingField, setEditingField] = useState<{ id: string; field: string; value: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!className.trim()) {
      showError('Please enter a class name');
      return;
    }

    // Validate class name format
    if (!/^[a-z0-9]+$/.test(className.trim())) {
      showError('Class name must contain only lowercase letters and numbers (e.g., jss1, pry3, kg1)');
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
        showSuccess('Class created successfully!');
        onSuccess();
        onClose();
        // Reset form
        setClassName('');
        setSelectedTeacherId('');
      } else {
        const errorMsg = response.message || 'Failed to create class';
        showError(errorMsg);
      }
    } catch (error) {
      console.error('Error creating class:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create class';
      showError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setClassName('');
      setSelectedTeacherId('');
      setShowTeacherDropdown(false);
      onClose();
    }
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
          
          showSuccess(`${editingField.field} updated successfully`);
          cancelEditing();
        } else {
          const errorMsg = response.message || 'Failed to update class';
          showError(errorMsg);
        }
      } catch (error) {
        console.error('Error updating class:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to update class';
        showError(errorMsg);
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
      console.log('Class deleted successfully');
      fetchExistingClasses(); // Refresh the list
    } catch (error) {
      console.error('Error deleting class:', error);
      showError('Failed to delete class');
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
        <Pressable 
          onPress={() => {
            handleClose();
            setShowTeacherDropdown(false);
          }} 
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} 
        />
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
              
              {/* Instructions */}
              <View className="mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <View className="flex-row items-start">
                  <Ionicons name="information-circle" size={16} color="#3B82F6" style={{ marginTop: 1, marginRight: 8 }} />
                  <View className="flex-1">
                    <Text className="text-xs font-medium text-blue-800 mb-1">
                      Class Name Format
                    </Text>
                    <Text className="text-xs text-blue-700 leading-4">
                      Use lowercase letters and numbers only. Examples: jss1, pry3, kg1, ss2
                    </Text>
                  </View>
                </View>
              </View>
              
              <TextInput
                value={className}
                onChangeText={(text) => {
                  // Convert to lowercase and remove spaces
                  const formattedText = text.toLowerCase().replace(/\s/g, '');
                  setClassName(formattedText);
                }}
                placeholder="e.g., jss1, pry3, kg1"
                placeholderTextColor="#9ca3af"
                className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={8}
              />
              
              {/* Validation message */}
              {className && !/^[a-z0-9]+$/.test(className) && (
                <Text className="text-xs text-red-600 mt-1">
                  Only lowercase letters and numbers are allowed
                </Text>
              )}
            </View>

            {/* Teacher Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Class Teacher (Optional)
              </Text>
              <View className="relative">
                <TouchableOpacity
                  onPress={() => setShowTeacherDropdown(!showTeacherDropdown)}
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
                  <Ionicons 
                    name={showTeacherDropdown ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#6b7280" 
                  />
                </TouchableOpacity>
                
                {/* Dropdown */}
                {showTeacherDropdown && (
                  <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10 max-h-48">
                    <ScrollView 
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}
                      keyboardShouldPersistTaps="handled"
                    >
                      {/* No Teacher Option */}
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedTeacherId('');
                          setShowTeacherDropdown(false);
                        }}
                        className="flex-row items-center px-3 py-3 border-b border-gray-100"
                      >
                        <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center mr-3">
                          <Ionicons name="person-outline" size={16} color="#6b7280" />
                        </View>
                        <Text className="text-gray-700">No Teacher</Text>
                      </TouchableOpacity>
                      
                      {/* Teacher Options */}
                      {availableTeachers.map((teacher) => (
                        <TouchableOpacity
                          key={teacher.id}
                          onPress={() => {
                            setSelectedTeacherId(teacher.id);
                            setShowTeacherDropdown(false);
                          }}
                          className="flex-row items-center px-3 py-3 border-b border-gray-100 last:border-b-0"
                        >
                          {teacher.display_picture ? (
                            <Image
                              source={{ uri: teacher.display_picture }}
                              className="w-6 h-6 rounded-full mr-3"
                            />
                          ) : (
                            <View className="w-6 h-6 rounded-full bg-gray-200 items-center justify-center mr-3">
                              <Ionicons name="person" size={16} color="#6b7280" />
                            </View>
                          )}
                          <Text className="text-gray-900">
                            {teacher.first_name} {teacher.last_name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
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

    </Modal>
  );
}
