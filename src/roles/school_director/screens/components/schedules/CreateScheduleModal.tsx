import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { directorService } from '@/services/api/directorService';
import { SuccessModal, ErrorModal } from '@/components';

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

interface CreateScheduleModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDay: string;
  selectedTimeSlot: string;
  selectedClass: string;
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

  return (
    <View className="mb-4 relative">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <Pressable
        onPress={() => !disabled && setIsOpen(!isOpen)}
        className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 flex-row items-center justify-between ${
          disabled ? 'opacity-50' : ''
        } ${isOpen ? 'border-blue-500 dark:border-blue-400' : ''}`}
      >
        <Text
          className={`flex-1 ${
            selectedOption
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {selectedOption ? selectedOption.name : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={isOpen ? '#3b82f6' : '#6b7280'}
        />
      </Pressable>
      
      {isOpen && (
        <View className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 shadow-lg">
          <ScrollView className="max-h-48">
            {options.length > 0 ? (
              options.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => {
                    onSelect(option.id);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Text className="text-gray-900 dark:text-gray-100">
                    {option.name}
                  </Text>
                </Pressable>
              ))
            ) : (
              <View className="px-4 py-3">
                <Text className="text-gray-500 dark:text-gray-400 text-center">
                  No options available
                </Text>
              </View>
            )}
          </ScrollView>
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
}: CreateScheduleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<TimetableOptions | null>(null);
  const [formData, setFormData] = useState({
    class_id: '',
    subject_id: '',
    teacher_id: '',
    room: '',
    notes: '',
  });

  // Modal states
  const [successModalVisible, setSuccessModalVisible] = useState(false);
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
      const response = await directorService.fetchTimetableOptions();
      setOptions(response.data);
      
      // Pre-select the current class if available
      if (response.data.classes) {
        const currentClass = response.data.classes.find(
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
        setSuccessModalVisible(true);
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

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
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
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <View className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">
              Create Schedule Entry
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
            >
              <Ionicons 
                name="close" 
                size={24} 
                color="#ffffff" 
              />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center mt-2">
            <View className="bg-white/20 rounded-lg px-3 py-1 mr-3">
              <Text className="text-white text-sm font-medium">
                {selectedDay}
              </Text>
            </View>
            <View className="bg-white/20 rounded-lg px-3 py-1">
              <Text className="text-white text-sm font-medium">
                {selectedTimeSlot}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6 py-4">
          {isLoading && !options ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-gray-600 dark:text-gray-400">
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
                onSelect={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}
                options={options?.subjects || []}
                placeholder="Select a subject"
                required
              />

              {/* Teacher Selection */}
              <Dropdown
                label="Teacher"
                value={formData.teacher_id}
                onSelect={(value) => setFormData(prev => ({ ...prev, teacher_id: value }))}
                options={options?.teachers || []}
                placeholder="Select a teacher"
                required
              />

              {/* Room Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Room
                </Text>
                <TextInput
                  value={formData.room}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, room: text }))}
                  placeholder="e.g., Room 101"
                  placeholderTextColor="#9ca3af"
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100"
                />
              </View>

              {/* Notes Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </Text>
                <TextInput
                  value={formData.notes}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
                  placeholder="Optional notes about this period..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100"
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="flex-1 py-3 px-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`flex-1 py-3 px-6 rounded-lg flex-row items-center justify-center ${
                isLoading
                  ? 'bg-gray-300 dark:bg-gray-600'
                  : 'bg-blue-600 dark:bg-blue-500'
              }`}
            >
              {isLoading ? (
                <Text className="text-white font-semibold">Creating...</Text>
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#ffffff" />
                  <Text className="text-white font-semibold ml-2">Create Schedule</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        title="Schedule Created!"
        message="The schedule has been successfully created and added to the timetable."
        icon="checkmark-circle"
        onClose={handleSuccessModalClose}
        confirmText="Continue"
        autoClose={false}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        title="Schedule Conflict"
        message={errorMessage}
        icon="alert-circle"
        onClose={handleErrorModalClose}
        closeText="OK"
        autoClose={false}
      />
    </Modal>
  );
}
