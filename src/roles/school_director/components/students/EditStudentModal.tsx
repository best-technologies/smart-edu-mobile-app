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
import InlineSpinner from '@/components/InlineSpinner';
import { Student } from '@/services/api/directorService';

interface EditStudentModalProps {
  visible: boolean;
  student: Student | null;
  onClose: () => void;
  onSuccess: () => void;
  onShowSuccess: (message: string) => void;
  onShowError: (message: string) => void;
}

export default function EditStudentModal({ 
  visible, 
  student,
  onClose, 
  onSuccess, 
  onShowSuccess, 
  onShowError 
}: EditStudentModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showClassDropdown, setShowClassDropdown] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<Array<{
    id: string;
    name: string;
    classTeacher: {
      id: string;
      first_name: string;
      last_name: string;
      display_picture: string | null;
    } | null;
  }>>([]);

  // Populate form when student data changes
  useEffect(() => {
    if (student) {
      setFirstName(student.first_name);
      setLastName(student.last_name);
      setEmail(student.email);
      setPhoneNumber(student.phone_number);
      setGender(student.gender as 'male' | 'female');
      
      // Find the class ID from classesEnrolled array or current_class
      if (student.classesEnrolled && student.classesEnrolled.length > 0) {
        // Use the first enrolled class
        setSelectedClassId(student.classesEnrolled[0].id);
      } else if (student.current_class && student.current_class !== 'Not Enrolled') {
        // If current_class is not "Not Enrolled", we need to find the class by name
        // This will be handled when classes are loaded
        setSelectedClassId('');
      } else {
        setSelectedClassId('');
      }
    }
  }, [student]);

  // Fetch classes when modal opens
  useEffect(() => {
    if (visible) {
      fetchClasses();
    }
  }, [visible, student]);

  const fetchClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const response = await directorService.fetchAllClasses();
      
      if (response.success && response.data?.classes) {
        setAvailableClasses(response.data.classes);
        
        // If we have a student with current_class but no class_id, find the class by name
        if (student && student.current_class && student.current_class !== 'Not Enrolled' && !selectedClassId) {
          const classByName = response.data.classes.find((cls: any) => 
            cls.name.toLowerCase() === student.current_class.toLowerCase()
          );
          if (classByName) {
            setSelectedClassId(classByName.id);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      onShowError('Failed to load classes');
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const handleSubmit = async () => {
    if (!student) return;

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
      console.log('🔄 Starting student update process...');
      setIsLoading(true);
      
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phoneNumber.trim(),
        gender: gender,
        class_id: selectedClassId || undefined,
      };

      const response = await directorService.updateStudent(student.id, payload);
      console.log('📧 Update student response:', response);

      if (response.success === true) {
        const successMessage = `Student "${firstName} ${lastName}" updated successfully!`;
        console.log('✅ Success message:', successMessage);
        onShowSuccess(successMessage);
        
        // Close modal and refresh data
        onSuccess();
      } else {
        console.log('❌ Student update failed, showing error modal');
        onShowError(response.message || 'Failed to update student');
      }
    } catch (error) {
      console.error('❌ Error updating student:', error);
      
      // Handle ApiError specifically
      if (error instanceof Error) {
        onShowError(error.message || 'Failed to update student');
      } else {
        onShowError('Failed to update student');
      }
    } finally {
      console.log('🏁 Student update process finished, setting loading to false');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Close dropdowns when modal visibility changes
  React.useEffect(() => {
    if (!visible) {
      setShowGenderDropdown(false);
      setShowClassDropdown(false);
    }
  }, [visible]);

  if (!student) return null;

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
                Edit Student
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
              {/* Overlay to close dropdowns when clicking outside */}
              {(showGenderDropdown || showClassDropdown) && (
                <Pressable
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 5,
                  }}
                  onPress={() => {
                    setShowGenderDropdown(false);
                    setShowClassDropdown(false);
                  }}
                />
              )}

              {/* First Name */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Enter first name"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={50}
                />
              </View>

              {/* Last Name */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Enter last name"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  autoCapitalize="words"
                  autoCorrect={false}
                  maxLength={50}
                />
              </View>

              {/* Email */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email address"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  maxLength={100}
                />
              </View>

              {/* Phone Number */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>

              {/* Gender */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </Text>
                <View className="relative">
                  <TouchableOpacity
                    onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between"
                  >
                    <Text className="text-gray-900 capitalize">
                      {gender}
                    </Text>
                    <Ionicons 
                      name={showGenderDropdown ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {showGenderDropdown && (
                    <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
                      <TouchableOpacity
                        onPress={() => {
                          setGender('male');
                          setShowGenderDropdown(false);
                        }}
                        className="px-3 py-3 border-b border-gray-100"
                      >
                        <Text className="text-gray-900">Male</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setGender('female');
                          setShowGenderDropdown(false);
                        }}
                        className="px-3 py-3"
                      >
                        <Text className="text-gray-900">Female</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Class Selection */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Assign to Class (Optional)
                </Text>
                {isLoadingClasses ? (
                  <View className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3">
                    <InlineSpinner 
                      size="small" 
                      color="#6b7280" 
                      text="Loading classes..." 
                      textColor="#6b7280"
                    />
                  </View>
                ) : (
                  <View className="relative">
                    <TouchableOpacity
                      onPress={() => setShowClassDropdown(!showClassDropdown)}
                      className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between"
                    >
                      <View className="flex-1">
                        <Text className="text-gray-900">
                          {selectedClassId 
                            ? (() => {
                                const selectedClass = availableClasses.find(c => c.id === selectedClassId);
                                return selectedClass 
                                  ? selectedClass.name.charAt(0).toUpperCase() + selectedClass.name.slice(1).toLowerCase()
                                  : 'Select a class';
                              })()
                            : 'No class assigned'
                          }
                        </Text>
                        {selectedClassId && availableClasses.find(c => c.id === selectedClassId)?.classTeacher && (
                          <Text className="text-xs text-gray-500 mt-1">
                            Teacher: {availableClasses.find(c => c.id === selectedClassId)?.classTeacher?.first_name} {availableClasses.find(c => c.id === selectedClassId)?.classTeacher?.last_name}
                          </Text>
                        )}
                      </View>
                      <Ionicons 
                        name={showClassDropdown ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="#6b7280" 
                      />
                    </TouchableOpacity>
                    
                    {showClassDropdown && (
                      <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg" style={{ maxHeight: 200 }}>
                        <ScrollView 
                          nestedScrollEnabled={true}
                          showsVerticalScrollIndicator={true}
                          bounces={false}
                          keyboardShouldPersistTaps="handled"
                        >
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedClassId('');
                              setShowClassDropdown(false);
                            }}
                            className="px-3 py-3 border-b border-gray-100"
                          >
                            <Text className="text-gray-900">No class assigned</Text>
                          </TouchableOpacity>
                          {availableClasses.map((classItem) => (
                            <TouchableOpacity
                              key={classItem.id}
                              onPress={() => {
                                setSelectedClassId(classItem.id);
                                setShowClassDropdown(false);
                              }}
                              className="px-3 py-3 border-b border-gray-100"
                            >
                              <Text className="text-gray-900 font-medium capitalize">
                                {classItem.name.charAt(0).toUpperCase() + classItem.name.slice(1).toLowerCase()}
                              </Text>
                              {classItem.classTeacher && (
                                <Text className="text-xs text-gray-500 mt-1">
                                  Teacher: {classItem.classTeacher.first_name} {classItem.classTeacher.last_name}
                                </Text>
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}
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
                  isLoading ? 'bg-gray-400' : 'bg-blue-600'
                }`}
              >
                {isLoading ? (
                  <Text className="text-white font-medium">Updating...</Text>
                ) : (
                  <Text className="text-white font-medium">Update Student</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
