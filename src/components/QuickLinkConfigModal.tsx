import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ConfigField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text';
  placeholder?: string;
  options?: { label: string; value: string }[];
  defaultValue?: string | number;
  min?: number;
  max?: number;
  required?: boolean;
}

export interface QuickLinkConfig {
  id: string;
  display_title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
  fields: ConfigField[];
  generateMessage: (values: Record<string, any>) => string;
}

interface QuickLinkConfigModalProps {
  visible: boolean;
  config: QuickLinkConfig | null;
  onClose: () => void;
  onSubmit: (message: string, displayTitle: string) => void;
}

export default function QuickLinkConfigModal({ 
  visible, 
  config, 
  onClose, 
  onSubmit 
}: QuickLinkConfigModalProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with default values when config changes
  useEffect(() => {
    if (config && visible) {
      const defaultValues: Record<string, any> = {};
      config.fields.forEach(field => {
        if (field.defaultValue !== undefined) {
          defaultValues[field.id] = field.defaultValue;
        }
      });
      setValues(defaultValues);
      setErrors({});
    }
  }, [config, visible]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
    
    // Real-time validation for the specific field
    if (!config) return;
    
    const field = config.fields.find(f => f.id === fieldId);
    if (!field) return;
    
    const newErrors = { ...errors };
    
    // Validate the field
    if (field.required && (!value || value === '')) {
      newErrors[fieldId] = `${field.label} is required`;
    } else if (field.type === 'number' && value !== '' && value !== undefined) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        newErrors[fieldId] = 'Must be a valid number';
      } else if (field.min !== undefined && numValue < field.min) {
        newErrors[fieldId] = `Must be at least ${field.min}`;
      } else if (field.max !== undefined && numValue > field.max) {
        newErrors[fieldId] = `Must be at most ${field.max}`;
      } else {
        // Clear error if validation passes
        delete newErrors[fieldId];
      }
    } else {
      // Clear error for non-number fields or valid values
      delete newErrors[fieldId];
    }
    
    setErrors(newErrors);
  };

  const validateFields = (): boolean => {
    if (!config) return false;
    
    const newErrors: Record<string, string> = {};
    
    config.fields.forEach(field => {
      const value = values[field.id];
      
      if (field.required && (!value || value === '')) {
        newErrors[field.id] = `${field.label} is required`;
        return;
      }
      
      if (field.type === 'number' && value !== '' && value !== undefined) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          newErrors[field.id] = 'Must be a valid number';
        } else if (field.min !== undefined && numValue < field.min) {
          newErrors[field.id] = `Must be at least ${field.min}`;
        } else if (field.max !== undefined && numValue > field.max) {
          newErrors[field.id] = `Must be at most ${field.max}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if form is valid (for enabling/disabling submit button)
  const isFormValid = (): boolean => {
    if (!config) return false;
    
    return config.fields.every(field => {
      const value = values[field.id];
      
      // Check required fields
      if (field.required && (!value || value === '')) {
        return false;
      }
      
      // Check number field constraints
      if (field.type === 'number' && value !== '' && value !== undefined) {
        const numValue = Number(value);
        if (isNaN(numValue)) return false;
        if (field.min !== undefined && numValue < field.min) return false;
        if (field.max !== undefined && numValue > field.max) return false;
      }
      
      return true;
    });
  };

  const handleSubmit = () => {
    if (!config || !validateFields()) return;
    
    // Prepare final values with defaults for any missing values
    const finalValues: Record<string, any> = {};
    config.fields.forEach(field => {
      finalValues[field.id] = values[field.id] !== undefined ? values[field.id] : field.defaultValue;
    });
    
    // Generate the message using the configuration function
    const message = config.generateMessage(finalValues);
    onSubmit(message, config.display_title);
    
    // Reset form
    setValues({});
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setValues({});
    setErrors({});
    onClose();
  };

  const renderField = (field: ConfigField) => {
    const value = values[field.id] !== undefined ? values[field.id] : '';
    const hasError = !!errors[field.id];

    switch (field.type) {
      case 'number':
        return (
          <View key={field.id} className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
              {field.required && <Text className="text-red-500"> *</Text>}
            </Text>
            <TextInput
              value={String(value)}
              onChangeText={(text) => handleFieldChange(field.id, text)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              keyboardType="numeric"
              className={`px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 ${
                hasError 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholderTextColor="#9CA3AF"
            />
            {hasError && (
              <Text className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors[field.id]}
              </Text>
            )}
          </View>
        );

      case 'select':
        return (
          <View key={field.id} className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
              {field.required && <Text className="text-red-500"> *</Text>}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {field.options?.map((option) => {
                const isSelected = value === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleFieldChange(field.id, option.value)}
                    className={`px-3 py-2 rounded-lg border ${
                      isSelected
                        ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-400'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <Text className={`text-sm ${
                      isSelected
                        ? 'text-purple-700 dark:text-purple-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {hasError && (
              <Text className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors[field.id]}
              </Text>
            )}
          </View>
        );

      case 'text':
        return (
          <View key={field.id} className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
              {field.required && <Text className="text-red-500"> *</Text>}
            </Text>
            <TextInput
              value={String(value)}
              onChangeText={(text) => handleFieldChange(field.id, text)}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              className={`px-3 py-2 border rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 ${
                hasError 
                  ? 'border-red-500 dark:border-red-400' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholderTextColor="#9CA3AF"
              multiline={field.id === 'additional_notes'}
              numberOfLines={field.id === 'additional_notes' ? 3 : 1}
            />
            {hasError && (
              <Text className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors[field.id]}
              </Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  if (!config) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 bg-white dark:bg-gray-900 mt-20 rounded-t-3xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center flex-1">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${config.color}20` }}
              >
                <Ionicons name={config.icon} size={20} color={config.color} />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {config.display_title}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {config.description}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <ScrollView 
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
          >
            {config.fields.map(renderField)}
          </ScrollView>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={handleClose}
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg items-center"
              >
                <Text className="text-gray-700 dark:text-gray-300 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isFormValid()}
                className={`flex-1 py-3 rounded-lg items-center ${
                  isFormValid() 
                    ? 'bg-purple-600 dark:bg-purple-700' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <Text className={`font-medium ${
                  isFormValid() ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Generate {config.display_title}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export { QuickLinkConfigModal };
