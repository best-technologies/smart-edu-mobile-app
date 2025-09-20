import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextInput, Alert, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Subject, directorService } from '@/services/api/directorService';
import { useToast } from '@/contexts/ToastContext';

interface SubjectCardProps {
  subject: Subject;
  onUpdate?: (updatedSubject: Subject) => void;
  onPress?: (subject: Subject) => void;
}

export function SubjectCard({ subject, onUpdate, onPress }: SubjectCardProps) {
  console.log('SubjectCard props received:', { subject: subject.name, onUpdate: !!onUpdate, onPress: !!onPress });
  
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { showSuccess, showError } = useToast();
  
  // Form state
  const [subjectName, setSubjectName] = useState(subject.name);
  const [subjectCode, setSubjectCode] = useState(subject.code);
  const [description, setDescription] = useState(subject.description);
  const [color, setColor] = useState(subject.color);
  const [selectedClassId, setSelectedClassId] = useState(subject.class?.id || '');
  const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>(subject.teachers.map(t => t.id));
  
  // Available data
  const [availableTeachers, setAvailableTeachers] = useState<Array<{ id: string; name: string; display_picture: string | null }>>([]);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const formatSubjectName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Reset modal state when subject changes
  useEffect(() => {
    setUpdateModalVisible(false);
    setIsUpdating(false);
  }, [subject.id]);

  // Fetch available teachers and classes
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

  const handleUpdateClick = () => {
    // Reset any previous states
    setIsUpdating(false);
    
    // Reset form to current values
    setSubjectName(subject.name);
    setSubjectCode(subject.code);
    setDescription(subject.description);
    setColor(subject.color);
    setSelectedClassId(subject.class?.id || '');
    setSelectedTeacherIds(subject.teachers.map(t => t.id));
    
    // Fetch fresh data
    fetchAvailableData();
    setUpdateModalVisible(true);
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      
      const payload: any = {
        subject_name: subjectName.trim(),
        code: subjectCode.trim().toLowerCase(),
        description: description.trim(),
        color: color.trim(),
        class_taking_it: selectedClassId || null,
        teachers_taking_it: selectedTeacherIds,
      };

      const response = await directorService.updateSubject(subject.id, payload);

      if (response.success) {
        // Update the local subject data
        const updatedSubject = { ...subject };
        updatedSubject.name = subjectName.trim();
        updatedSubject.code = subjectCode.trim().toLowerCase();
        updatedSubject.description = description.trim();
        updatedSubject.color = color.trim();
        
        if (selectedClassId) {
          const selectedClass = availableClasses.find(c => c.id === selectedClassId);
          updatedSubject.class = selectedClass ? { id: selectedClass.id, name: selectedClass.name } : null;
        } else {
          updatedSubject.class = null;
        }
        
        const selectedTeachers = availableTeachers.filter(teacher => selectedTeacherIds.includes(teacher.id));
        updatedSubject.teachers = selectedTeachers.map(teacher => ({
          id: teacher.id,
          name: teacher.name,
          email: '' // We don't have email in the available teachers response
        }));

        // Call the onUpdate callback if provided
        if (onUpdate) {
          onUpdate(updatedSubject);
        }

        showSuccess('Subject Updated', 'Subject updated successfully');
        setUpdateModalVisible(false);
      } else {
        const errorMsg = response.message || 'Failed to update subject';
        showError('Update Failed', errorMsg);
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to update subject';
      showError('Update Failed', errorMsg);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setUpdateModalVisible(false);
    setIsUpdating(false);
  };

  const toggleTeacherSelection = (teacherId: string) => {
    setSelectedTeacherIds(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleCardPress = () => {
    console.log('SubjectCard pressed for:', subject.name);
    console.log('onPress function exists:', !!onPress);
    if (onPress) {
      onPress(subject);
    } else {
      console.log('No onPress function provided');
    }
  };

  const handleEditPress = (e: any) => {
    e.stopPropagation();
    handleUpdateClick();
  };

  return (
    <>
      <View className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 mb-2">
        <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={handleCardPress}
          className="flex-row items-center gap-3"
        >
          {/* Subject Icon with Color */}
          <View 
            className="h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${subject.color}15` }}
          >
            <Ionicons 
              name="book-outline" 
              size={20} 
              color={subject.color} 
            />
          </View>

          {/* Subject Info */}
          <View className="flex-1">
            {/* Header with Update Button */}
            <View className="flex-row items-center justify-between mb-1">
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-gray-100" numberOfLines={1}>
                  {formatSubjectName(subject.name)}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {subject.code.toUpperCase()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleEditPress}
                className="bg-blue-500 px-2.5 py-1 rounded-md"
                activeOpacity={0.7}
              >
                <Text className="text-white text-xs font-medium">Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Description - Compact */}
            <Text className="text-xs text-gray-600 dark:text-gray-300 mb-2" numberOfLines={2}>
              {subject.description}
            </Text>

            {/* Info Row - Class and Teachers */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                {/* Class Info */}
                <View className="flex-row items-center gap-1">
                  <Ionicons name="school-outline" size={12} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-300">
                    {subject.class ? subject.class.name : 'No class'}
                  </Text>
                </View>

                {/* Teachers Count */}
                <View className="flex-row items-center gap-1">
                  <Ionicons name="people-outline" size={12} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-300">
                    {subject.teachers.length} teacher{subject.teachers.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>

              {/* Teachers Preview - Show first 2 teachers */}
              {subject.teachers.length > 0 && (
                <View className="flex-row items-center gap-1">
                  {subject.teachers.slice(0, 2).map((teacher, index) => (
                    <View key={teacher.id} className="flex-row items-center">
                      <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: subject.color }} />
                      <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        {teacher.name.split(' ')[0]}
                      </Text>
                      {index < Math.min(subject.teachers.length, 2) - 1 && (
                        <Text className="text-gray-400 text-xs mx-1">•</Text>
                      )}
                    </View>
                  ))}
                  {subject.teachers.length > 2 && (
                    <Text className="text-xs text-gray-400 ml-1">
                      +{subject.teachers.length - 2}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Update Modal */}
      <Modal
        visible={updateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90%]">
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Update Subject
              </Text>
              <TouchableOpacity onPress={handleCancel} disabled={isUpdating}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              {/* Subject Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject Name *
                </Text>
                <TextInput
                  value={subjectName}
                  onChangeText={setSubjectName}
                  placeholder="Enter subject name"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={50}
                />
              </View>

              {/* Subject Code */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject Code *
                </Text>
                <TextInput
                  value={subjectCode}
                  onChangeText={setSubjectCode}
                  placeholder="Enter subject code"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={10}
                />
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter description"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100"
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>

              {/* Color */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </Text>
                <TextInput
                  value={color}
                  onChangeText={setColor}
                  placeholder="#3B34F6"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={7}
                />
              </View>

              {/* Class Selection */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign to Class
                </Text>
                <TouchableOpacity
                  onPress={() => {
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
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 flex-row items-center justify-between"
                >
                  <Text className="text-gray-900 dark:text-gray-100">
                    {selectedClassId 
                      ? availableClasses.find(c => c.id === selectedClassId)?.name || 'Select a class'
                      : 'No class assigned'
                    }
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Teachers Selection */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign Teachers
                </Text>
                <View className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 max-h-32">
                  <ScrollView showsVerticalScrollIndicator={true}>
                    {availableTeachers.map((teacher) => {
                      const isSelected = selectedTeacherIds.includes(teacher.id);
                      return (
                        <TouchableOpacity
                          key={teacher.id}
                          onPress={() => toggleTeacherSelection(teacher.id)}
                          className="flex-row items-center py-2"
                        >
                          <View className={`w-5 h-5 border rounded mr-3 items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                            {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                          </View>
                          <Text className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                            {teacher.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View className="flex-row space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={handleCancel}
                disabled={isUpdating}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg items-center"
              >
                <Text className="text-gray-700 dark:text-gray-300 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSave}
                disabled={isUpdating}
                className={`flex-1 py-3 px-4 rounded-lg items-center ${
                  isUpdating ? 'bg-gray-400' : 'bg-blue-600'
                }`}
              >
                {isUpdating ? (
                  <Text className="text-white font-medium">Updating...</Text>
                ) : (
                  <Text className="text-white font-medium">Update Subject</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </>
  );
}

export default SubjectCard;
