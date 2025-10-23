import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SystemSettingsTabProps {
  data: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: string;
      activityStatus: boolean;
    };
    preferences: {
      language: string;
      timezone: string;
      theme: string;
    };
    tokenLimits: { dailyLimit: number; monthlyLimit: number; currentUsage: number; resetDate: string; studentDailyTokens: number; teacherDailyTokens: number; resetTime: string; warningThreshold: number };
    uploadSettings: { allowedFileTypes: any[]; maxFileSize: number; maxFilesPerUpload: number; compressionEnabled: boolean; maxFilesPerStudent: number; maxFilesPerTeacher: number; autoDeleteAfter: number };
    schoolPolicies: { lateSubmissionPolicy: string; gradingScale: string; attendancePolicy: string; attendanceThreshold: number; gradePassingMark: number; lateSubmissionPenalty: number };
  };
}

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value: string | number;
  unit?: string;
  color: string;
  onPress?: () => void;
  editable?: boolean;
}

const SettingRow = ({ icon, title, subtitle, value, unit, color, onPress, editable = true }: SettingRowProps) => (
  <TouchableOpacity 
    className="flex-row items-center py-4 border-b border-gray-100 dark:border-gray-700"
    onPress={editable ? onPress : undefined}
    disabled={!editable}
  >
    <View 
      className="w-10 h-10 rounded-full items-center justify-center mr-4"
      style={{ backgroundColor: `${color}20` }}
    >
      <Ionicons name={icon} size={20} color={color} />
    </View>
    
    <View className="flex-1">
      <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {subtitle}
        </Text>
      )}
    </View>
    
    <View className="flex-row items-center">
      <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mr-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit && <Text className="text-xs text-gray-500"> {unit}</Text>}
      </Text>
      {editable && <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />}
    </View>
  </TouchableOpacity>
);

interface EditModalProps {
  visible: boolean;
  title: string;
  value: number | string;
  unit?: string;
  onSave: (value: number | string) => void;
  onClose: () => void;
  type?: 'number' | 'text';
  min?: number;
  max?: number;
}

const EditModal = ({ visible, title, value, unit, onSave, onClose, type = 'number', min, max }: EditModalProps) => {
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    if (type === 'number') {
      const numValue = parseInt(editValue);
      if (!isNaN(numValue) && (!min || numValue >= min) && (!max || numValue <= max)) {
        onSave(numValue);
        onClose();
      }
    } else {
      onSave(editValue);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 mx-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Edit {title}
          </Text>
          
          <View className="mb-6">
            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${title.toLowerCase()}`}
              keyboardType={type === 'number' ? 'numeric' : 'default'}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
              placeholderTextColor="#9CA3AF"
            />
            {unit && (
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Unit: {unit}
              </Text>
            )}
            {min !== undefined && max !== undefined && (
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Range: {min} - {max}
              </Text>
            )}
          </View>
          
          <View className="flex-row" style={{ gap: 12 }}>
            <TouchableOpacity 
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 items-center"
              onPress={onClose}
            >
              <Text className="text-gray-700 dark:text-gray-300 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-blue-600 rounded-lg p-3 items-center"
              onPress={handleSave}
            >
              <Text className="text-white font-medium">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function SystemSettingsTab({ data }: SystemSettingsTabProps) {
  const [settings, setSettings] = useState(data);
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    key: string;
    title: string;
    value: number | string;
    unit?: string;
    type?: 'number' | 'text';
    min?: number;
    max?: number;
  }>({
    visible: false,
    key: '',
    title: '',
    value: '',
  });

  const openEditModal = (key: string, title: string, value: number | string, unit?: string, type: 'number' | 'text' = 'number', min?: number, max?: number) => {
    setEditModal({
      visible: true,
      key,
      title,
      value,
      unit,
      type,
      min,
      max,
    });
  };

  const handleSave = (value: number | string) => {
    const keys = editModal.key.split('.');
    if (keys.length === 2) {
      setSettings(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0] as keyof typeof prev],
          [keys[1]]: value
        }
      }));
    }
  };

  return (
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Token Management */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Token Management
          </Text>
          <View className="bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
            <Text className="text-xs font-medium text-purple-700 dark:text-purple-300">
              AI Usage Control
            </Text>
          </View>
        </View>
        
        <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <SettingRow
            icon="school-outline"
            title="Student Daily Tokens"
            subtitle="Maximum AI tokens per student per day"
            value={settings.tokenLimits.studentDailyTokens}
            unit="tokens"
            color="#3B82F6"
            onPress={() => openEditModal('tokenLimits.studentDailyTokens', 'Student Daily Tokens', settings.tokenLimits.studentDailyTokens, 'tokens', 'number', 100, 5000)}
          />
          <SettingRow
            icon="person-outline"
            title="Teacher Daily Tokens"
            subtitle="Maximum AI tokens per teacher per day"
            value={settings.tokenLimits.teacherDailyTokens}
            unit="tokens"
            color="#10B981"
            onPress={() => openEditModal('tokenLimits.teacherDailyTokens', 'Teacher Daily Tokens', settings.tokenLimits.teacherDailyTokens, 'tokens', 'number', 500, 10000)}
          />
          <SettingRow
            icon="time-outline"
            title="Reset Time"
            subtitle="Daily token limit reset time"
            value={settings.tokenLimits.resetTime}
            color="#F59E0B"
            onPress={() => openEditModal('tokenLimits.resetTime', 'Reset Time', settings.tokenLimits.resetTime, '', 'text')}
          />
          <SettingRow
            icon="warning-outline"
            title="Warning Threshold"
            subtitle="Show warning when tokens usage exceeds this percentage"
            value={settings.tokenLimits.warningThreshold}
            unit="%"
            color="#EF4444"
            onPress={() => openEditModal('tokenLimits.warningThreshold', 'Warning Threshold', settings.tokenLimits.warningThreshold, '%', 'number', 50, 95)}
          />
        </View>
      </View>

      {/* File Upload Settings */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          File Upload Settings
        </Text>
        
        <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <SettingRow
            icon="cloud-upload-outline"
            title="Maximum File Size"
            subtitle="Maximum size per file upload"
            value={settings.uploadSettings.maxFileSize}
            unit="MB"
            color="#8B5CF6"
            onPress={() => openEditModal('uploadSettings.maxFileSize', 'Maximum File Size', settings.uploadSettings.maxFileSize, 'MB', 'number', 1, 100)}
          />
          <SettingRow
            icon="document-outline"
            title="Max Files per Student"
            subtitle="Maximum files each student can upload"
            value={settings.uploadSettings.maxFilesPerStudent}
            unit="files"
            color="#3B82F6"
            onPress={() => openEditModal('uploadSettings.maxFilesPerStudent', 'Max Files per Student', settings.uploadSettings.maxFilesPerStudent, 'files', 'number', 1, 200)}
          />
          <SettingRow
            icon="documents-outline"
            title="Max Files per Teacher"
            subtitle="Maximum files each teacher can upload"
            value={settings.uploadSettings.maxFilesPerTeacher}
            unit="files"
            color="#10B981"
            onPress={() => openEditModal('uploadSettings.maxFilesPerTeacher', 'Max Files per Teacher', settings.uploadSettings.maxFilesPerTeacher, 'files', 'number', 1, 500)}
          />
          <SettingRow
            icon="trash-outline"
            title="Auto-delete After"
            subtitle="Automatically delete files after specified days"
            value={settings.uploadSettings.autoDeleteAfter}
            unit="days"
            color="#F59E0B"
            onPress={() => openEditModal('uploadSettings.autoDeleteAfter', 'Auto-delete After', settings.uploadSettings.autoDeleteAfter, 'days', 'number', 30, 1095)}
          />
        </View>
      </View>

      {/* Allowed File Types */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Allowed File Types
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <View className="flex-row flex-wrap gap-2">
            {settings.uploadSettings.allowedFileTypes.map((type, index) => (
              <View key={index} className="bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded-full">
                <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  .{type}
                </Text>
              </View>
            ))}
          </View>
          <TouchableOpacity className="mt-3 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center">
            <Text className="text-sm text-gray-500 dark:text-gray-400">+ Add File Type</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* School Policies */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          School Policies
        </Text>
        
        <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <SettingRow
            icon="people-outline"
            title="Attendance Threshold"
            subtitle="Minimum attendance percentage required"
            value={settings.schoolPolicies.attendanceThreshold}
            unit="%"
            color="#10B981"
            onPress={() => openEditModal('schoolPolicies.attendanceThreshold', 'Attendance Threshold', settings.schoolPolicies.attendanceThreshold, '%', 'number', 0, 100)}
          />
          <SettingRow
            icon="checkmark-circle-outline"
            title="Grade Passing Mark"
            subtitle="Minimum score to pass a subject"
            value={settings.schoolPolicies.gradePassingMark}
            unit="%"
            color="#3B82F6"
            onPress={() => openEditModal('schoolPolicies.gradePassingMark', 'Grade Passing Mark', settings.schoolPolicies.gradePassingMark, '%', 'number', 0, 100)}
          />
          <SettingRow
            icon="time-outline"
            title="Late Submission Penalty"
            subtitle="Percentage deduction for late submissions"
            value={settings.schoolPolicies.lateSubmissionPenalty}
            unit="%"
            color="#F59E0B"
            onPress={() => openEditModal('schoolPolicies.lateSubmissionPenalty', 'Late Submission Penalty', settings.schoolPolicies.lateSubmissionPenalty, '%', 'number', 0, 50)}
          />
        </View>
      </View>

      {/* Disciplinary Actions */}
      {/* <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Disciplinary Actions
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <View className="space-y-2">
            {settings.schoolPolicies.disciplinaryActions.map((action, index) => (
              <View key={index} className="flex-row items-center justify-between py-2">
                <Text className="text-sm text-gray-900 dark:text-gray-100">{action}</Text>
                <TouchableOpacity className="p-1">
                  <Ionicons name="close-circle" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <TouchableOpacity className="mt-3 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center">
            <Text className="text-sm text-gray-500 dark:text-gray-400">+ Add Action</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      {/* System Integrations */}
      {/* <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          System Integrations
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {settings.integrations.map((integration, index) => (
            <View key={index} className={`flex-row items-center justify-between py-4 px-4 ${
              index !== settings.integrations.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
            }`}>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {integration.name}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {integration.description}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Last sync: {new Date(integration.lastSync).toLocaleString()}
                </Text>
              </View>
              <View className="items-end">
                <Switch
                  value={integration.status === 'Active'}
                  onValueChange={(value) => {
                    const newIntegrations = [...settings.integrations];
                    newIntegrations[index] = {
                      ...integration,
                      status: value ? 'Active' : 'Inactive'
                    };
                    setSettings(prev => ({
                      ...prev,
                      integrations: newIntegrations
                    }));
                  }}
                />
                <View className={`px-2 py-1 rounded-full mt-1 ${
                  integration.status === 'Active' 
                    ? 'bg-green-100 dark:bg-green-900/30' 
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Text className={`text-xs font-medium ${
                    integration.status === 'Active'
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {integration.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View> */}

      {/* Action Buttons */}
      <View className="space-y-3">
        <TouchableOpacity className="bg-blue-600 rounded-xl p-4 items-center">
          <View className="flex-row items-center">
            <Ionicons name="save-outline" size={24} color="white" />
            <Text className="text-white font-semibold ml-2">Save All Settings</Text>
          </View>
        </TouchableOpacity>
        
        <View className="flex-row" style={{ gap: 12 }}>
          <TouchableOpacity className="flex-1 bg-gray-600 rounded-xl p-4 items-center">
            <Ionicons name="refresh-outline" size={20} color="white" />
            <Text className="text-white font-medium mt-1">Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-green-600 rounded-xl p-4 items-center">
            <Ionicons name="download-outline" size={20} color="white" />
            <Text className="text-white font-medium mt-1">Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Modal */}
      <EditModal
        visible={editModal.visible}
        title={editModal.title}
        value={editModal.value}
        unit={editModal.unit}
        type={editModal.type}
        min={editModal.min}
        max={editModal.max}
        onSave={handleSave}
        onClose={() => setEditModal(prev => ({ ...prev, visible: false }))}
      />
    </ScrollView>
  );
}
