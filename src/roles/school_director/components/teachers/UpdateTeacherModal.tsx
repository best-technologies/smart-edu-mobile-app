import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { directorService } from '@/services/api/directorService';
import { SuccessModal, ErrorModal } from '@/components';

interface Teacher {
  id: string;
  name: string;
  display_picture: string | null;
  contact: {
    phone: string;
    email: string;
  };
  totalSubjects: number;
  classTeacher: string;
  nextClass: any | null;
  status: 'active' | 'suspended';
  // Add optional fields for current assignments
  subjectsTeaching?: Array<{ id: string; name: string }>;
  classesManaging?: Array<{ id: string; name: string }>;
}

interface UpdateTeacherModalProps {
  visible: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onSuccess: () => void;
  onShowSuccess: (message: string) => void;
  onShowError: (message: string) => void;
}

export default function UpdateTeacherModal({ 
  visible, 
  teacher,
  onClose, 
  onSuccess, 
  onShowSuccess, 
  onShowError 
}: UpdateTeacherModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  // Available data
  const [availableSubjects, setAvailableSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);

  // Reset form when teacher changes
  useEffect(() => {
    if (teacher && visible) {
      const nameParts = teacher.name.split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(teacher.contact.email);
      setPhoneNumber(teacher.contact.phone);
      setStatus(teacher.status);
      
      // Reset selections
      setSelectedSubjectIds([]);
      setSelectedClassIds([]);
      
      // Fetch available data (classes will be pre-selected based on classTeacher info)
      fetchAvailableData();
    }
  }, [teacher, visible]);



  const fetchAvailableData = async () => {
    if (!teacher) return;
    
    try {
      setIsLoadingData(true);
      const response = await directorService.fetchTeacherClassesAndSubjects(teacher.id);
      
      if (response.success && response.data) {
        // Combine assigned and available subjects
        const allSubjects = [
          ...response.data.assigned_subjects,
          ...response.data.available_subjects
        ];
        
        // Combine managed and available classes
        const allClasses = [
          ...response.data.managed_classes,
          ...response.data.available_classes
        ];
        
        setAvailableSubjects(allSubjects);
        setAvailableClasses(allClasses);
        
        // Pre-select assigned subjects
        const assignedSubjectIds = response.data.assigned_subjects.map(subject => subject.id);
        setSelectedSubjectIds(assignedSubjectIds);
        
        // Pre-select managed classes
        const managedClassIds = response.data.managed_classes.map(classItem => classItem.id);
        setSelectedClassIds(managedClassIds);
        
        console.log('📚 Assigned subjects:', response.data.assigned_subjects);
        console.log('📚 Available subjects:', response.data.available_subjects);
        console.log('🏫 Managed classes:', response.data.managed_classes);
        console.log('🏫 Available classes:', response.data.available_classes);
        console.log('✅ Pre-selected subject IDs:', assignedSubjectIds);
        console.log('✅ Pre-selected class IDs:', managedClassIds);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async () => {
    if (!teacher) return;

    // Validate required fields
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim()) {
      onShowError('Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      onShowError('Please enter a valid email address');
      return;
    }

    // Validate phone number (basic validation)
    if (phoneNumber.trim().length < 10) {
      onShowError('Please enter a valid phone number');
      return;
    }

    try {
      console.log('🔄 Starting teacher update process...');
      setIsLoading(true);
      
      const payload: any = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phoneNumber.trim(),
        status: status,
      };

      // Add optional fields if selected
      if (selectedSubjectIds.length > 0) {
        payload.subjectsTeaching = selectedSubjectIds;
      }

      if (selectedClassIds.length > 0) {
        payload.classesManaging = selectedClassIds;
      }

      const response = await directorService.updateTeacher(teacher.id, payload);

      if (response.success === true) {
        const successMessage = `Teacher "${firstName} ${lastName}" updated successfully!`;
        onShowSuccess(successMessage);
        
        // Close modal and refresh data
        onSuccess();
      } else {
        console.log('❌ Teacher update failed, showing error modal');
        onShowError(response.message || 'Failed to update teacher');
      }
    } catch (error) {
      console.error('❌ Error updating teacher:', error);
      
      // Handle ApiError specifically
      if (error instanceof Error) {
        onShowError(error.message || 'Failed to update teacher');
      } else {
        onShowError('Failed to update teacher');
      }
    } finally {
      console.log('🏁 Teacher update process finished, setting loading to false');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setStatus('active');
      setSelectedSubjectIds([]);
      setSelectedClassIds([]);
      onClose();
    }
  };

  const toggleSubjectSelection = (subjectId: string) => {
    setSelectedSubjectIds(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const toggleClassSelection = (classId: string) => {
    setSelectedClassIds(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  // Sort subjects to show selected ones first
  const sortedSubjects = availableSubjects.sort((a, b) => {
    const aSelected = selectedSubjectIds.includes(a.id);
    const bSelected = selectedSubjectIds.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.name.localeCompare(b.name);
  });

  // Sort classes to show selected ones first
  const sortedClasses = availableClasses.sort((a, b) => {
    const aSelected = selectedClassIds.includes(a.id);
    const bSelected = selectedClassIds.includes(b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return a.name.localeCompare(b.name);
  });

  if (!teacher) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md max-h-[90%]">
            {/* Header */}
            <View className="flex-row items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Update Teacher
              </Text>
              <TouchableOpacity onPress={handleClose} disabled={isLoading}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
              {/* First Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name *
                </Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={50}
                />
              </View>

              {/* Last Name */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name *
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={50}
                />
              </View>

              {/* Email */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  maxLength={100}
                />
              </View>

              {/* Phone Number */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 text-gray-900 dark:text-gray-100"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>

              {/* Status */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Select Status',
                      'Choose the teacher status:',
                      [
                        { text: 'Active', onPress: () => setStatus('active') },
                        { text: 'Suspended', onPress: () => setStatus('suspended') },
                      ]
                    );
                  }}
                  className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-3 flex-row items-center justify-between"
                >
                  <Text className="text-gray-900 dark:text-gray-100 capitalize">
                    {status}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Subjects Selection */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign Subjects (Optional)
                </Text>
                <View className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 max-h-32">
                  <ScrollView showsVerticalScrollIndicator={true}>
                    {sortedSubjects.length > 0 ? (
                      sortedSubjects.map((subject) => {
                        const isSelected = selectedSubjectIds.includes(subject.id);
                        return (
                          <TouchableOpacity
                            key={subject.id}
                            onPress={() => toggleSubjectSelection(subject.id)}
                            className="flex-row items-center py-2"
                          >
                            <View className={`w-5 h-5 border rounded mr-3 items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                              {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                            </View>
                            <Text className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                              {subject.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <View className="py-4">
                        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          No subjects available in the system
                        </Text>
                        <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                          Subjects will appear here once they are created
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>

              {/* Classes Selection */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign Classes (Optional)
                </Text>
                <View className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 max-h-32">
                  <ScrollView showsVerticalScrollIndicator={true}>
                    {sortedClasses.length > 0 ? (
                      sortedClasses.map((classItem) => {
                        const isSelected = selectedClassIds.includes(classItem.id);
                        return (
                          <TouchableOpacity
                            key={classItem.id}
                            onPress={() => toggleClassSelection(classItem.id)}
                            className="flex-row items-center py-2"
                          >
                            <View className={`w-5 h-5 border rounded mr-3 items-center justify-center ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                              {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                            </View>
                            <Text className={`text-sm ${isSelected ? 'text-blue-700 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                              {classItem.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <View className="py-4">
                        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                          No classes available in the system
                        </Text>
                        <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                          Classes will appear here once they are created
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View className="flex-row space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg items-center"
              >
                <Text className="text-gray-700 dark:text-gray-300 font-medium">
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
                  <Text className="text-white font-medium">Updating...</Text>
                ) : (
                  <Text className="text-white font-medium">Update Teacher</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
