import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Pressable,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { directorService, TimeSlot } from '@/services/api/directorService';
import { SuccessModal, ErrorModal } from '@/components';
import { formatSubjectName, formatClassName, formatRoomName, formatTeacherName } from '@/utils/textFormatter';

const { width: screenWidth } = Dimensions.get('window');

interface TimetableOption {
  id: string;
  name: string;
  code?: string;
  color?: string;
  label?: string;
  startTime?: string;
  endTime?: string;
}

interface TimetableOptions {
  classes: TimetableOption[];
  teachers: TimetableOption[];
  subjects: TimetableOption[];
  timeSlots: TimetableOption[];
}

interface SubjectWithTeachers {
  id: string;
  name: string;
  code: string;
  color: string;
  teachers: Array<{
    id: string;
    name: string;
    display_picture: string | null;
  }>;
}

interface CreateScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDay: string;
  selectedTimeSlot: string;
  selectedClass: string;
  timeSlots?: TimeSlot[];
}

// Dropdown Component
function Dropdown({
  label,
  value,
  onSelect,
  options,
  placeholder,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  options: TimetableOption[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.id === value);

  // Format display text based on the type of data
  const formatDisplayText = (option: TimetableOption) => {
    if (label.toLowerCase().includes('subject')) {
      return formatSubjectName(option.name);
    } else if (label.toLowerCase().includes('class')) {
      return formatClassName(option.name);
    } else if (label.toLowerCase().includes('teacher')) {
      return formatTeacherName(option.name);
    }
    return option.name;
  };

  return (
    <View className="mb-4 relative">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <Pressable
        onPress={() => !disabled && setIsOpen(!isOpen)}
        className={`bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between ${
          disabled ? 'opacity-50' : ''
        } ${isOpen ? 'border-blue-500' : ''}`}
      >
        <Text
          className={`flex-1 ${
            selectedOption
              ? 'text-gray-900'
              : 'text-gray-500'
          }`}
        >
          {selectedOption ? formatDisplayText(selectedOption) : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={isOpen ? '#3b82f6' : '#6b7280'}
        />
      </Pressable>
      
      {isOpen && (
        <View className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
          <View style={{ maxHeight: 150 }}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              renderItem={({ item: option }) => (
                <Pressable
                  onPress={() => {
                    onSelect(option.id);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 border-b border-gray-200 active:bg-gray-50"
                >
                  <Text className="text-gray-900">
                    {formatDisplayText(option)}
                  </Text>
                </Pressable>
              )}
              ListEmptyComponent={
                <View className="px-4 py-3">
                  <Text className="text-gray-500 text-center">
                    No options available
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default function CreateScheduleModal({
  visible,
  onClose,
  onSuccess,
  selectedDay,
  selectedTimeSlot,
  selectedClass,
  timeSlots,
}: CreateScheduleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<TimetableOptions | null>(null);
  const [subjectsWithTeachers, setSubjectsWithTeachers] = useState<SubjectWithTeachers[]>([]);
  const [formData, setFormData] = useState({
    class_id: '',
    subject_id: '',
    teacher_id: '',
    room: '',
    notes: '',
  });

  // Modal states
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch timetable options when modal opens
  useEffect(() => {
    if (visible && !options) {
      fetchTimetableOptions();
    }
  }, [visible]);

  const fetchTimetableOptions = async () => {
    try {
      setIsLoading(true);
      
      // Fetch both timetable options and subjects with teachers
      const [timetableResponse, subjectsResponse] = await Promise.all([
        directorService.fetchTimetableOptions(),
        directorService.fetchSubjectsWithTeachers()
      ]);
      
      setOptions(timetableResponse.data);
      setSubjectsWithTeachers(subjectsResponse.data?.subjects || []);
      
      // Pre-select the current class if available
      if (timetableResponse.data.classes) {
        const currentClass = timetableResponse.data.classes.find(
          (cls: TimetableOption) => cls.name === selectedClass
        );
        if (currentClass) {
          setFormData(prev => ({ ...prev, class_id: currentClass.id }));
        }
      }
    } catch (error) {
      console.error('Error fetching timetable options:', error);
      setErrorMessage('Failed to load timetable options');
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.class_id || !formData.subject_id || !formData.teacher_id) {
      setErrorMessage('Please fill in all required fields');
      setErrorModalVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const payload = {
        ...formData,
        timeSlotId: selectedTimeSlot,
        day_of_week: selectedDay,
      };

      console.log('🚀 Submitting schedule creation with payload:', payload);

      const response = await directorService.createTimetableEntry(payload);
      
      // Check if the response indicates success
      if (response.success === true) {
        // Close modal directly without showing success modal
        console.log('✅ Schedule created successfully, closing modal...');
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          class_id: '',
          subject_id: '',
          teacher_id: '',
          room: '',
          notes: '',
        });
      } else {
        // Handle case where backend returns 201 but with error message
        const errorMessage = response.message || response.data?.message || 'Failed to create schedule';
        console.log('❌ Schedule creation failed:', errorMessage);
        setErrorMessage(errorMessage);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('💥 Error creating timetable entry:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to create schedule';
      setErrorMessage(errorMessage);
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      // Reset form
      setFormData({
        class_id: '',
        subject_id: '',
        teacher_id: '',
        room: '',
        notes: '',
      });
    }
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };

  // Helper function to format time from 24-hour to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get the selected time slot details
  const getSelectedTimeSlotDetails = () => {
    if (!timeSlots) return null;
    return timeSlots.find((slot: TimeSlot) => slot.id === selectedTimeSlot);
  };

  const selectedTimeSlotDetails = getSelectedTimeSlotDetails();
  const timeDisplay = selectedTimeSlotDetails && selectedTimeSlotDetails.startTime && selectedTimeSlotDetails.endTime
    ? `${formatTime(selectedTimeSlotDetails.startTime)} - ${formatTime(selectedTimeSlotDetails.endTime)}`
    : selectedTimeSlotDetails?.label || selectedTimeSlot;

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
              Create Schedule Entry
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Day and Time Info */}
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 rounded-lg px-3 py-1 mr-3">
              <Text className="text-blue-800 text-sm font-medium">
                {selectedDay}
              </Text>
            </View>
            <View className="bg-purple-100 rounded-lg px-3 py-1">
              <Text className="text-purple-800 text-sm font-medium">
                {timeDisplay}
              </Text>
            </View>
          </View>

          {/* Content */}
          {isLoading && !options ? (
            <View className="items-center justify-center py-8">
              <Text className="text-gray-600">
                Loading options...
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {/* Class Selection */}
              <Dropdown
                label="Class"
                value={formData.class_id}
                onSelect={(value) => setFormData(prev => ({ ...prev, class_id: value }))}
                options={options?.classes || []}
                placeholder="Select a class"
                required
              />

              {/* Subject Selection */}
              <Dropdown
                label="Subject"
                value={formData.subject_id}
                onSelect={(value) => {
                  console.log('📚 Subject selected:', value);
                  setFormData(prev => ({ ...prev, subject_id: value }));
                  
                  // Try to auto-populate teacher based on subject
                  let teacherId = '';
                  
                  // Find the selected subject in subjectsWithTeachers
                  const selectedSubjectWithTeachers = subjectsWithTeachers.find(subject => subject.id === value);
                  if (selectedSubjectWithTeachers && selectedSubjectWithTeachers.teachers.length > 0) {
                    teacherId = selectedSubjectWithTeachers.teachers[0].id; // Use the first teacher as default
                    console.log('👨‍🏫 Auto-populating teacher:', selectedSubjectWithTeachers.teachers[0].name, '(', teacherId, ')');
                    if (selectedSubjectWithTeachers.teachers.length > 1) {
                      console.log(`ℹ️ ${selectedSubjectWithTeachers.teachers.length} teachers available for this subject`);
                    }
                    setFormData(prev => ({ ...prev, teacher_id: teacherId }));
                  } else {
                    console.log('⚠️ No teachers found for this subject, clearing teacher selection');
                    setFormData(prev => ({ ...prev, teacher_id: '' }));
                  }
                }}
                options={options?.subjects || []}
                placeholder="Select a subject"
                required
              />

              {/* Teacher Selection */}
              <Dropdown
                label="Teacher"
                value={formData.teacher_id}
                onSelect={(value) => setFormData(prev => ({ ...prev, teacher_id: value }))}
                options={
                  formData.subject_id 
                    ? subjectsWithTeachers
                        .find(subject => subject.id === formData.subject_id)
                        ?.teachers.map(teacher => ({
                          id: teacher.id,
                          name: teacher.name
                        })) || []
                    : options?.teachers || []
                }
                placeholder={
                  formData.subject_id 
                    ? "Select a teacher for this subject"
                    : "Select a subject first"
                }
                required
                disabled={!formData.subject_id}
              />

              {/* Room Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Room
                </Text>
                <TextInput
                  value={formData.room}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, room: text }))}
                  placeholder="e.g., Room 101"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                />
                {formData.room && (
                  <Text className="text-xs text-gray-500 mt-1">
                    Will be displayed as: {formatRoomName(formData.room)}
                  </Text>
                )}
              </View>

              {/* Notes Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Notes
                </Text>
                <TextInput
                  value={formData.notes}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                  placeholder="Optional notes about this period..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}

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
                <Text className="text-white font-medium">Creating...</Text>
              ) : (
                <Text className="text-white font-medium">Create</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
