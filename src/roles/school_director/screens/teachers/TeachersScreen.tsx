import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity, Modal, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SchoolDirectorStackParamList } from '../../SchoolDirectorNavigator';
import { useDirectorTeachers, useRefreshDirectorTeachers } from '@/hooks/useDirectorTeachers';
import { directorService } from '@/services/api/directorService';
import { ApiError } from '@/services/types/apiTypes';
import Section from '../../components/shared/Section';
import TeacherStats from '../../components/teachers/TeacherStats';
import TeacherCard from '../../components/teachers/TeacherCard';
import EmptyState from '../../components/shared/EmptyState';
import { CenteredLoader } from '@/components';
import { useToast } from '@/contexts/ToastContext';
import UpdateTeacherModal from '../../components/teachers/UpdateTeacherModal';

export default function TeachersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SchoolDirectorStackParamList>>();
  const { data, isLoading, error, refetch } = useDirectorTeachers();
  const refreshMutation = useRefreshDirectorTeachers();
  const { showSuccess, showError } = useToast();
  const [enrollModalVisible, setEnrollModalVisible] = useState(false);
  const [updateTeacherModalVisible, setUpdateTeacherModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  // Reset modal state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset modal states when screen is focused
      setEnrollModalVisible(false);
      setUpdateTeacherModalVisible(false);
      setSelectedTeacher(null);
    }, [])
  );

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const handleViewAllTeachers = () => {
    navigation.navigate('AllTeachersList');
  };

  const handleUpdateTeacher = (teacher: any) => {
    setSelectedTeacher(teacher);
    setUpdateTeacherModalVisible(true);
  };

  // Show loading state
  if (isLoading && !data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <CenteredLoader visible={true} text="Loading teachers..." />
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load teachers
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            {error.message || 'Something went wrong while loading teachers data.'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-4 pb-24 pt-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshMutation.isPending}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        <Section 
          title="Overview"
          action={
            <TouchableOpacity
              onPress={() => setEnrollModalVisible(true)}
              className="flex-row items-center bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg"
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={16} color="#10b981" />
              <Text className="text-emerald-600 dark:text-emerald-400 text-sm font-medium ml-1">
                Enroll Teacher
              </Text>
            </TouchableOpacity>
          }
        >
          {data?.basic_details && <TeacherStats stats={data.basic_details} />}
        </Section>

        <Section 
          title="All Teachers"
          action={
            <TouchableOpacity
              onPress={handleViewAllTeachers}
              className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium mr-1">
                View All
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#2563eb" />
            </TouchableOpacity>
          }
        >
          {data?.teachers && data.teachers.length > 0 ? (
            <View className="gap-4">
              {data.teachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} onUpdate={handleUpdateTeacher} />
              ))}
            </View>
          ) : (
            <EmptyState title="No teachers found" subtitle="No teachers are currently registered." />
          )}
        </Section>
      </ScrollView>

      {/* Enroll Teacher Modal */}
      <EnrollTeacherModal
        visible={enrollModalVisible}
        onClose={() => setEnrollModalVisible(false)}
        onSuccess={() => {
          setEnrollModalVisible(false);
          refetch();
        }}
      />



      {/* Update Teacher Modal */}
      <UpdateTeacherModal
        visible={updateTeacherModalVisible}
        teacher={selectedTeacher}
        onClose={() => {
          setUpdateTeacherModalVisible(false);
          setSelectedTeacher(null);
        }}
        onSuccess={() => {
          setUpdateTeacherModalVisible(false);
          setSelectedTeacher(null);
          refetch();
        }}
        onShowSuccess={(message) => {
          showSuccess('Teacher Updated', message);
        }}
        onShowError={(message) => {
          showError('Update Failed', message);
        }}
      />
    </SafeAreaView>
  );
}

// Enroll Teacher Modal Component
interface EnrollTeacherModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function EnrollTeacherModal({ visible, onClose, onSuccess }: EnrollTeacherModalProps) {
  const { showSuccess, showError } = useToast();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');
  const [isLoading, setIsLoading] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Classes and Subjects state
  const [classes, setClasses] = useState<Array<{ id: string; name: string; hasClassTeacher: boolean }>>([]);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showClassesDropdown, setShowClassesDropdown] = useState(false);
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);



  const handleSubmit = async () => {
    
    // Validate required fields
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phoneNumber.trim()) {
      showError('Validation Error', 'Please fill in all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showError('Validation Error', 'Please enter a valid email address');
      return;
    }

    // Validate phone number (basic validation)
    if (phoneNumber.trim().length < 10) {
      showError('Validation Error', 'Please enter a valid phone number');
      return;
    }

    try {
      console.log('🔄 Starting enrollment process...');
      setIsLoading(true);
      
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone_number: phoneNumber.trim(),
        gender: gender,
        status: status,
        classesManaging: selectedClasses,
        subjectsTeaching: selectedSubjects,
      };

      const response = await directorService.enrollTeacher(payload);
      // console.log('📧 Enroll teacher response:', response);
      // console.log('📧 Response success value:', response.success);
      // console.log('📧 Response type:', typeof response.success);
      // console.log('📧 Full response object:', JSON.stringify(response, null, 2));

      if (response.success === true) {
        const password = response.data?.generatedPassword || 'N/A';
        const successMessage = `Teacher enrolled successfully!`;
        console.log('✅ Success message:', successMessage);
        showSuccess('Teacher Enrolled', successMessage);
        
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setGender('male');
        setStatus('active');
        setShowGenderDropdown(false);
        setShowStatusDropdown(false);
        
        // Close modal and refresh data
        onSuccess();
      } else {
        console.log('❌ Enrollment failed, showing error toast');
        showError('Enrollment Failed', response.message || 'Failed to enroll teacher');
      }
    } catch (error) {
      console.error('❌ Error enrolling teacher:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error constructor:', error?.constructor?.name);
      console.error('❌ Error instanceof ApiError:', error instanceof ApiError);
      console.error('❌ Error instanceof Error:', error instanceof Error);
      
      // Handle ApiError specifically
      if (error instanceof ApiError) {
        console.log('📧 API Error details:', error);
        console.log('📧 API Error message:', error.message);
        console.log('📧 API Error statusCode:', error.statusCode);
        console.log('📧 API Error data:', error.data);
        showError('Enrollment Failed', error.message || 'Failed to enroll teacher');
      } else {
        const errorMsg = error instanceof Error ? error.message : 'Failed to enroll teacher';
        console.log('📧 Generic error message:', errorMsg);
        showError('Enrollment Failed', errorMsg);
      }
    } finally {
      console.log('🏁 Enrollment process finished, setting loading to false');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setGender('male');
      setStatus('active');
      setShowGenderDropdown(false);
      setShowStatusDropdown(false);
      setSelectedClasses([]);
      setSelectedSubjects([]);
      setShowClassesDropdown(false);
      setShowSubjectsDropdown(false);
      onClose();
    }
  };

  // Fetch classes and subjects when modal opens
  useEffect(() => {
    if (visible) {
      fetchClassesAndSubjects();
    }
  }, [visible]);

  // Close dropdowns when modal visibility changes
  useEffect(() => {
    if (!visible) {
      setShowGenderDropdown(false);
      setShowStatusDropdown(false);
      setShowClassesDropdown(false);
      setShowSubjectsDropdown(false);
    }
  }, [visible]);

  const fetchClassesAndSubjects = async () => {
    try {
      setIsLoadingData(true);
      const response = await directorService.fetchClassesAndSubjects();
      
      if (response.success && response.data) {
        setClasses(response.data.classes || []);
        setSubjects(response.data.subjects || []);
        console.log('✅ Fetched classes and subjects:', {
          classes: response.data.classes?.length || 0,
          subjects: response.data.subjects?.length || 0
        });
      } else {
        console.error('❌ Failed to fetch classes and subjects:', response.message);
      }
    } catch (error) {
      console.error('❌ Error fetching classes and subjects:', error);
    } finally {
      setIsLoadingData(false);
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
                Enroll New Teacher
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
              {(showGenderDropdown || showStatusDropdown || showClassesDropdown || showSubjectsDropdown) && (
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
                    setShowStatusDropdown(false);
                    setShowClassesDropdown(false);
                    setShowSubjectsDropdown(false);
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

              {/* Status */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Status *
                </Text>
                <View className="relative">
                  <TouchableOpacity
                    onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between"
                  >
                    <Text className="text-gray-900 capitalize">
                      {status}
                    </Text>
                    <Ionicons 
                      name={showStatusDropdown ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {showStatusDropdown && (
                    <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
                      <TouchableOpacity
                        onPress={() => {
                          setStatus('active');
                          setShowStatusDropdown(false);
                        }}
                        className="px-3 py-3 border-b border-gray-100"
                      >
                        <Text className="text-gray-900">Active</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setStatus('suspended');
                          setShowStatusDropdown(false);
                        }}
                        className="px-3 py-3"
                      >
                        <Text className="text-gray-900">Suspended</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {/* Classes Assignment */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Classes to Manage (Optional)
                </Text>
                <View className="relative">
                  <TouchableOpacity
                    onPress={() => setShowClassesDropdown(!showClassesDropdown)}
                    disabled={isLoadingData}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between"
                  >
                    <Text className="text-gray-900">
                      {selectedClasses.length > 0 
                        ? `${selectedClasses.length} class${selectedClasses.length > 1 ? 'es' : ''} selected`
                        : isLoadingData 
                          ? 'Loading classes...' 
                          : 'Select classes to manage'
                      }
                    </Text>
                    <Ionicons 
                      name={showClassesDropdown ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {showClassesDropdown && (
                    <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg max-h-40">
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {classes.map((cls) => (
                          <TouchableOpacity
                            key={cls.id}
                            onPress={() => {
                              if (selectedClasses.includes(cls.id)) {
                                setSelectedClasses(selectedClasses.filter(id => id !== cls.id));
                              } else {
                                setSelectedClasses([...selectedClasses, cls.id]);
                              }
                            }}
                            className="px-3 py-3 border-b border-gray-100 flex-row items-center justify-between"
                          >
                            <Text className="text-gray-900">{cls.name}</Text>
                            {selectedClasses.includes(cls.id) && (
                              <Ionicons name="checkmark" size={16} color="#10B981" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {selectedClasses.length > 0 && (
                  <View className="mt-2 flex-row flex-wrap gap-2">
                    {selectedClasses.map((classId) => {
                      const cls = classes.find(c => c.id === classId);
                      return (
                        <View key={classId} className="bg-blue-100 px-2 py-1 rounded-full flex-row items-center">
                          <Text className="text-blue-700 text-xs">{cls?.name}</Text>
                          <TouchableOpacity
                            onPress={() => setSelectedClasses(selectedClasses.filter(id => id !== classId))}
                            className="ml-1"
                          >
                            <Ionicons name="close" size={12} color="#1D4ED8" />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>

              {/* Subjects Assignment */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Subjects to Teach (Optional)
                </Text>
                <View className="relative">
                  <TouchableOpacity
                    onPress={() => setShowSubjectsDropdown(!showSubjectsDropdown)}
                    disabled={isLoadingData}
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between"
                  >
                    <Text className="text-gray-900">
                      {selectedSubjects.length > 0 
                        ? `${selectedSubjects.length} subject${selectedSubjects.length > 1 ? 's' : ''} selected`
                        : isLoadingData 
                          ? 'Loading subjects...' 
                          : 'Select subjects to teach'
                      }
                    </Text>
                    <Ionicons 
                      name={showSubjectsDropdown ? "chevron-up" : "chevron-down"} 
                      size={16} 
                      color="#6b7280" 
                    />
                  </TouchableOpacity>
                  
                  {showSubjectsDropdown && (
                    <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg max-h-40">
                      <ScrollView showsVerticalScrollIndicator={false}>
                        {subjects.map((subject) => (
                          <TouchableOpacity
                            key={subject.id}
                            onPress={() => {
                              if (selectedSubjects.includes(subject.id)) {
                                setSelectedSubjects(selectedSubjects.filter(id => id !== subject.id));
                              } else {
                                setSelectedSubjects([...selectedSubjects, subject.id]);
                              }
                            }}
                            className="px-3 py-3 border-b border-gray-100 flex-row items-center justify-between"
                          >
                            <Text className="text-gray-900">{subject.name}</Text>
                            {selectedSubjects.includes(subject.id) && (
                              <Ionicons name="checkmark" size={16} color="#10B981" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {selectedSubjects.length > 0 && (
                  <View className="mt-2 flex-row flex-wrap gap-2">
                    {selectedSubjects.map((subjectId) => {
                      const subject = subjects.find(s => s.id === subjectId);
                      return (
                        <View key={subjectId} className="bg-green-100 px-2 py-1 rounded-full flex-row items-center">
                          <Text className="text-green-700 text-xs">{subject?.name}</Text>
                          <TouchableOpacity
                            onPress={() => setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId))}
                            className="ml-1"
                          >
                            <Ionicons name="close" size={12} color="#059669" />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>

            {/* Buttons */}
            <View className="flex-row space-x-3 mt-6">
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg items-center mr-4"
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
                  <Text className="text-white font-medium">Enrolling...</Text>
                ) : (
                  <Text className="text-white font-medium">Enroll Teacher</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
