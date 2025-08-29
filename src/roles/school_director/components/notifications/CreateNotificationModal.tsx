import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CreateNotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (notification: {
    title: string;
    description: string;
    type: string;
    comingUpOn: string;
  }) => void;
}

const notificationTypes = [
  { value: 'all', label: 'All Staff', icon: 'megaphone-outline' },
  { value: 'teachers', label: 'Teachers Only', icon: 'school-outline' },
  { value: 'students', label: 'Students Only', icon: 'people-outline' },
  { value: 'school_director', label: 'Directors Only', icon: 'business-outline' },
];

export default function CreateNotificationModal({
  visible,
  onClose,
  onSubmit,
}: CreateNotificationModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a notification title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a notification description');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      type: selectedType,
      // Send ISO 8601 to backend (required)
      comingUpOn: selectedDate.toISOString(),
    });

    // Reset form
    setTitle('');
    setDescription('');
    setSelectedType('all');
    setSelectedDate(new Date());
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedType('all');
    setSelectedDate(new Date());
    onClose();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
        <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Create Notification
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6" showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Title *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter notification title"
              placeholderTextColor="#9CA3AF"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100"
              maxLength={100}
            />
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Description *
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter notification description"
              placeholderTextColor="#9CA3AF"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          {/* Notification Type */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Notification Type
            </Text>
            <View className="space-y-2">
              {notificationTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setSelectedType(type.value)}
                  className={`flex-row items-center p-4 rounded-xl border ${
                    selectedType === type.value
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                  activeOpacity={0.7}
                >
                  <View
                    className={`h-10 w-10 items-center justify-center rounded-full mr-3 ${
                      selectedType === type.value
                        ? 'bg-blue-100 dark:bg-blue-900/40'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <Ionicons
                      name={type.icon as any}
                      size={20}
                      color={selectedType === type.value ? '#3B82F6' : '#6B7280'}
                    />
                  </View>
                  <Text
                    className={`flex-1 text-base font-medium ${
                      selectedType === type.value
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {type.label}
                  </Text>
                  {selectedType === type.value && (
                    <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Date Picker */}
          <View className="mb-8">
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Event Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 flex-row items-center justify-between"
              activeOpacity={0.7}
            >
              <Text className="text-gray-900 dark:text-gray-100">
                {formatDate(selectedDate)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-xl"
              activeOpacity={0.7}
            >
              <Text className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 py-3 px-4 bg-blue-600 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-center text-white font-semibold">
                Create Notification
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            // Use spinner on iOS to ensure visibility in modal, default dialog on Android
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              // On iOS, event.type can be 'set' or 'dismissed' only in Android; close in both cases
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
              }
              if (date) {
                setSelectedDate(date);
              }
            }}
            onTouchCancel={() => setShowDatePicker(false)}
            minimumDate={new Date()}
            themeVariant="light"
          />
        )}
      </View>
    </Modal>
  );
}
