import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Pressable,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { directorService } from '@/services/api/directorService';
import { SuccessModal, ErrorModal } from '@/components';

const { width: screenWidth } = Dimensions.get('window');

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  label: string;
  order: number;
  schoolId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TimeSlotModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TimeSlotModal({
  visible,
  onClose,
  onSuccess,
}: TimeSlotModalProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    label: '',
    order: 0,
  });
  
  // Inline editing states
  const [editingField, setEditingField] = useState<{ id: string; field: string; value: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Modal states
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch time slots when modal opens
  useEffect(() => {
    if (visible) {
      fetchTimeSlots();
    }
  }, [visible]);

  const fetchTimeSlots = async () => {
    try {
      setIsLoadingSlots(true);
      const response = await directorService.fetchTimeSlots();
      
      if (response.success && response.data) {
        setTimeSlots(response.data);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setErrorMessage('Failed to load time slots');
      setErrorModalVisible(true);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.startTime || !formData.endTime || !formData.label) {
      setErrorMessage('Please fill in all required fields');
      setErrorModalVisible(true);
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.startTime) || !timeRegex.test(formData.endTime)) {
      setErrorMessage('Please enter valid time format (HH:MM)');
      setErrorModalVisible(true);
      return;
    }

    // Validate that end time is after start time
    const startTime = new Date(`2000-01-01T${formData.startTime}:00`);
    const endTime = new Date(`2000-01-01T${formData.endTime}:00`);
    if (endTime <= startTime) {
      setErrorMessage('End time must be after start time');
      setErrorModalVisible(true);
      return;
    }

    try {
      setIsLoading(true);
      
      const payload = {
        startTime: formData.startTime,
        endTime: formData.endTime,
        label: formData.label.trim(),
        order: formData.order,
      };

      const response = await directorService.createTimeSlot(payload);

      if (response.success) {
        setSuccessMessage('Time slot created successfully');
        setSuccessModalVisible(true);
        resetForm();
        fetchTimeSlots(); // Refresh the list
      } else {
        const errorMsg = response.message || 'Failed to create time slot';
        setErrorMessage(errorMsg);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error creating time slot:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create time slot';
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (timeSlot: TimeSlot) => {
    Alert.alert(
      'Delete Time Slot',
      `Are you sure you want to delete "${timeSlot.label}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTimeSlot(timeSlot.id)
        },
      ]
    );
  };

  const deleteTimeSlot = async (id: string) => {
    try {
      // TODO: Add delete API call when endpoint is provided
      console.log('Delete time slot with ID:', id);
      setSuccessMessage('Time slot deleted successfully');
      setSuccessModalVisible(true);
      fetchTimeSlots(); // Refresh the list
    } catch (error) {
      console.error('Error deleting time slot:', error);
      setErrorMessage('Failed to delete time slot');
      setErrorModalVisible(true);
    }
  };

  const resetForm = () => {
    setFormData({
      startTime: '',
      endTime: '',
      label: '',
      order: 0,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
    onSuccess();
  };

  const handleErrorModalClose = () => {
    setErrorModalVisible(false);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getNextOrder = () => {
    if (timeSlots.length === 0) return 1;
    const maxOrder = Math.max(...timeSlots.map(slot => slot.order));
    return maxOrder + 1;
  };

  // Time input formatting functions
  const formatTimeInput = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Apply mask: HH:MM
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}:${cleaned.slice(2)}`;
    }
    return `${cleaned.slice(0, 2)}:${cleaned.slice(2, 4)}`;
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', text: string) => {
    const formatted = formatTimeInput(text);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const getTimeDisplayValue = (value: string) => {
    if (!value) return '';
    return value.replace(/\D/g, '').padEnd(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2');
  };

  // Inline editing functions
  const startEditing = (timeSlot: TimeSlot, field: string) => {
    setEditingField({ id: timeSlot.id, field, value: timeSlot[field as keyof TimeSlot]?.toString() || '' });
    setEditValue(timeSlot[field as keyof TimeSlot]?.toString() || '');
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleEditChange = (text: string) => {
    if (editingField?.field === 'startTime' || editingField?.field === 'endTime') {
      setEditValue(formatTimeInput(text));
    } else {
      setEditValue(text);
    }
  };

  const saveEdit = async () => {
    if (!editingField || !editValue.trim()) return;

    try {
      setIsUpdating(true);
      
      const payload: any = {};
      payload[editingField.field] = editingField.field === 'order' ? parseInt(editValue) : editValue.trim();

      const response = await directorService.updateTimeSlot(editingField.id, payload);

      if (response.success) {
        // Update the local state
        setTimeSlots(prev => prev.map(slot => 
          slot.id === editingField.id 
            ? { ...slot, [editingField.field]: payload[editingField.field] }
            : slot
        ));
        
        setSuccessMessage(`${editingField.field} updated successfully`);
        setSuccessModalVisible(true);
        cancelEditing();
      } else {
        const errorMsg = response.message || 'Failed to update time slot';
        setErrorMessage(errorMsg);
        setErrorModalVisible(true);
      }
    } catch (error) {
      console.error('Error updating time slot:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to update time slot';
      setErrorMessage(errorMsg);
      setErrorModalVisible(true);
    } finally {
      setIsUpdating(false);
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
            width: Math.min(screenWidth - 40, 500),
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
              Manage Time Slots
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Create New Time Slot Section */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Create New Time Slot
            </Text>
            
            <View className="space-y-4">
              {/* Label Input */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Label <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                  value={formData.label}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, label: text }))}
                  placeholder="e.g., First Period, Break, Lunch"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  maxLength={20}
                />
              </View>

              {/* Time Inputs */}
              <View className="flex-row space-x-3">
                <View className="flex-1 mr-2 mb-2">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Start Time <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    value={formData.startTime}
                    onChangeText={(text) => handleTimeChange('startTime', text)}
                    placeholder="00:00"
                    placeholderTextColor="#9ca3af"
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900 text-center font-mono"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    End Time <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    value={formData.endTime}
                    onChangeText={(text) => handleTimeChange('endTime', text)}
                    placeholder="00:00"
                    placeholderTextColor="#9ca3af"
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900 text-center font-mono"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
              
              {/* Time Format Hint */}
              <View className="flex-row items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                <Ionicons name="information-circle-outline" size={16} color="#3b82f6" />
                <Text className="text-xs text-blue-700">
                  Time format: 24-hour (e.g., 08:00 for 8 AM, 14:30 for 2:30 PM)
                </Text>
              </View>

              {/* Order Input */}
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Order
                </Text>
                <TextInput
                  value={formData.order.toString()}
                  onChangeText={(text) => {
                    const order = parseInt(text) || 0;
                    setFormData(prev => ({ ...prev, order }));
                  }}
                  placeholder="1"
                  placeholderTextColor="#9ca3af"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-3 text-gray-900"
                  keyboardType="numeric"
                />
              </View>

              {/* Create Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                className={`py-3 px-4 rounded-lg items-center mt-2 ${
                  isLoading ? 'bg-gray-400' : 'bg-blue-600'
                }`}
              >
                {isLoading ? (
                  <Text className="text-white font-medium">Creating...</Text>
                ) : (
                  <Text className="text-white font-medium">Create Time Slot</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Existing Time Slots Section */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-3">
              Existing Time Slots ({timeSlots.length})
            </Text>
            
            {isLoadingSlots ? (
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
            ) : timeSlots.length > 0 ? (
              <View style={{ maxHeight: 200 }}>
                <FlatList
                  data={timeSlots.sort((a, b) => a.order - b.order)}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                  renderItem={({ item: timeSlot }) => (
                    <View className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-2">
                      {/* Time Icon */}
                      <View className="w-8 h-8 rounded-full mr-3 bg-blue-100 items-center justify-center">
                        <Ionicons name="time-outline" size={16} color="#3b82f6" />
                      </View>
                      
                      {/* Time Slot Info */}
                      <View className="flex-1">
                        <View className="flex-row items-center mb-3">
                          <Text className="text-sm font-semibold text-gray-900 mr-3">
                            #{timeSlot.order} {timeSlot.label}
                          </Text>
                          {editingField?.id === timeSlot.id && editingField?.field === 'label' ? (
                            <View className="flex-row items-center space-x-2">
                              <TouchableOpacity
                                onPress={saveEdit}
                                disabled={isUpdating}
                                className="w-8 h-8 bg-green-100 rounded-full items-center justify-center"
                              >
                                <Ionicons name="checkmark" size={16} color="#10b981" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={cancelEditing}
                                className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                              >
                                <Ionicons name="close" size={16} color="#ef4444" />
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => startEditing(timeSlot, 'label')}
                              className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center"
                            >
                              <Ionicons name="pencil" size={16} color="#3b82f6" />
                            </TouchableOpacity>
                          )}
                        </View>
                        
                        {editingField?.id === timeSlot.id && editingField?.field === 'label' ? (
                          <TextInput
                            value={editValue}
                            onChangeText={handleEditChange}
                            className="bg-white border border-blue-300 rounded px-2 py-1 text-xs mb-1"
                            autoFocus
                            maxLength={20}
                          />
                        ) : null}

                        <View className="flex-row items-center mb-3">
                          <View className="flex-row items-center mr-4">
                            {editingField?.id === timeSlot.id && editingField?.field === 'startTime' ? (
                              <View className="flex-row items-center">
                                <TextInput
                                  value={editValue}
                                  onChangeText={handleEditChange}
                                  placeholder="00:00"
                                  placeholderTextColor="#9ca3af"
                                  className="bg-white border border-blue-300 rounded px-3 py-2 text-sm text-center font-mono"
                                  keyboardType="numeric"
                                  maxLength={5}
                                  autoFocus
                                />
                                <View className="flex-row items-center space-x-2 ml-2">
                                  <TouchableOpacity
                                    onPress={saveEdit}
                                    disabled={isUpdating}
                                    className="w-8 h-8 bg-green-100 rounded-full items-center justify-center"
                                  >
                                    <Ionicons name="checkmark" size={16} color="#10b981" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={cancelEditing}
                                    className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                                  >
                                    <Ionicons name="close" size={16} color="#ef4444" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <View className="flex-row items-center">
                                <Text className="text-sm text-gray-500 mr-2">
                                  {formatTime(timeSlot.startTime)}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => startEditing(timeSlot, 'startTime')}
                                  className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center"
                                >
                                  <Ionicons name="pencil" size={16} color="#3b82f6" />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                          
                          <Text className="text-sm text-gray-500 mr-4">-</Text>
                          
                          <View className="flex-row items-center">
                            {editingField?.id === timeSlot.id && editingField?.field === 'endTime' ? (
                              <View className="flex-row items-center">
                                <TextInput
                                  value={editValue}
                                  onChangeText={handleEditChange}
                                  placeholder="00:00"
                                  placeholderTextColor="#9ca3af"
                                  className="bg-white border border-blue-300 rounded px-3 py-2 text-sm text-center font-mono"
                                  keyboardType="numeric"
                                  maxLength={5}
                                  autoFocus
                                />
                                <View className="flex-row items-center space-x-2 ml-2">
                                  <TouchableOpacity
                                    onPress={saveEdit}
                                    disabled={isUpdating}
                                    className="w-8 h-8 bg-green-100 rounded-full items-center justify-center"
                                  >
                                    <Ionicons name="checkmark" size={16} color="#10b981" />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={cancelEditing}
                                    className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                                  >
                                    <Ionicons name="close" size={16} color="#ef4444" />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            ) : (
                              <View className="flex-row items-center">
                                <Text className="text-sm text-gray-500 mr-2">
                                  {formatTime(timeSlot.endTime)}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => startEditing(timeSlot, 'endTime')}
                                  className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center"
                                >
                                  <Ionicons name="pencil" size={16} color="#3b82f6" />
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>

                        <View className="flex-row items-center">
                          {editingField?.id === timeSlot.id && editingField?.field === 'order' ? (
                            <View className="flex-row items-center">
                              <TextInput
                                value={editValue}
                                onChangeText={handleEditChange}
                                className="bg-white border border-blue-300 rounded px-3 py-2 text-sm"
                                keyboardType="numeric"
                                autoFocus
                              />
                              <View className="flex-row items-center space-x-2 ml-2">
                                <TouchableOpacity
                                  onPress={saveEdit}
                                  disabled={isUpdating}
                                  className="w-8 h-8 bg-green-100 rounded-full items-center justify-center"
                                >
                                  <Ionicons name="checkmark" size={16} color="#10b981" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={cancelEditing}
                                  className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                                >
                                  <Ionicons name="close" size={16} color="#ef4444" />
                                </TouchableOpacity>
                              </View>
                            </View>
                          ) : (
                            <View className="flex-row items-center">
                              <Text className="text-sm text-gray-400 mr-2">
                                Order: {timeSlot.order}
                              </Text>
                              <TouchableOpacity
                                onPress={() => startEditing(timeSlot, 'order')}
                                className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center"
                              >
                                <Ionicons name="pencil" size={16} color="#3b82f6" />
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                      
                      {/* Delete Button */}
                      <TouchableOpacity
                        onPress={() => handleDelete(timeSlot)}
                        className="w-8 h-8 bg-red-100 rounded-full items-center justify-center"
                      >
                        <Ionicons name="trash" size={14} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            ) : (
              <Text className="text-sm text-gray-500 text-center py-4">
                No time slots found
              </Text>
            )}
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
