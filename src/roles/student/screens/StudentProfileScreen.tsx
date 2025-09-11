import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStudentDashboard } from '@/hooks/useStudentDashboard';
import { CenteredLoader } from '@/components';

// Profile Sub-tabs
const PROFILE_TABS = [
  { id: 'basic', title: 'Basic Info', icon: 'person-outline' },
  { id: 'academic', title: 'Academic', icon: 'school-outline' },
  { id: 'settings', title: 'Settings', icon: 'settings-outline' },
  { id: 'help', title: 'Help & Support', icon: 'help-circle-outline' }
];

// Basic Info Component
const BasicInfoTab = ({ userData }: { userData: any }) => (
  <View className="space-y-6">
    {/* Profile Picture Section */}
    <View className="items-center py-6">
      <View className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center mb-4">
        <Ionicons name="person" size={40} color="#3B82F6" />
      </View>
      <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {userData?.name || 'Student Name'}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        {userData?.email || 'student@school.com'}
      </Text>
    </View>

    {/* Personal Information */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Personal Information
      </Text>
      
      <View className="space-y-4">
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Full Name</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {userData?.name || 'John Doe'}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Email</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {userData?.email || 'john.doe@school.com'}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Phone</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            +234 801 234 5678
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-gray-600 dark:text-gray-400">Date of Birth</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            January 15, 2005
          </Text>
        </View>
      </View>
    </View>

    {/* Emergency Contact */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Emergency Contact
      </Text>
      
      <View className="space-y-4">
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Guardian Name</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            Mrs. Jane Doe
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-gray-600 dark:text-gray-400">Guardian Phone</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            +234 802 345 6789
          </Text>
        </View>
      </View>
    </View>
  </View>
);

// Academic Info Component
const AcademicInfoTab = ({ academicData }: { academicData: any }) => (
  <View className="space-y-6">
    {/* Current Academic Status */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Current Academic Status
      </Text>
      
      <View className="space-y-4">
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Class</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {academicData?.class || 'SS 3A'}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Student ID</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {academicData?.studentId || 'STU/2024/001'}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Academic Year</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {academicData?.academicYear || '2024/2025'}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-gray-600 dark:text-gray-400">Term</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {academicData?.term || 'First Term'}
          </Text>
        </View>
      </View>
    </View>

    {/* Subjects Enrolled */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Subjects Enrolled
      </Text>
      
      <View className="space-y-3">
        {['Mathematics', 'English Language', 'Physics', 'Chemistry', 'Biology', 'Economics'].map((subject, index) => (
          <View key={index} className="flex-row items-center justify-between py-2">
            <Text className="text-gray-700 dark:text-gray-300">{subject}</Text>
            <View className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              <Text className="text-xs font-semibold text-green-700 dark:text-green-300">
                Active
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>

    {/* Academic Performance Summary */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Performance Summary
      </Text>
      
      <View className="grid grid-cols-2 gap-4">
        <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">78%</Text>
          <Text className="text-sm text-blue-700 dark:text-blue-300">Average Score</Text>
        </View>
        
        <View className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <Text className="text-2xl font-bold text-green-600 dark:text-green-400">12</Text>
          <Text className="text-sm text-green-700 dark:text-green-300">Assessments</Text>
        </View>
      </View>
    </View>
  </View>
);

// Settings Component
const SettingsTab = () => (
  <View className="space-y-6">
    {/* App Settings */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        App Settings
      </Text>
      
      <View className="space-y-4">
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="notifications-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Push Notifications</Text>
          </View>
          <View className="w-12 h-6 bg-blue-600 rounded-full items-center justify-end px-1">
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="moon-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Dark Mode</Text>
          </View>
          <View className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full items-start justify-start px-1">
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        </View>
        
        <View className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="volume-high-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Sound Effects</Text>
          </View>
          <View className="w-12 h-6 bg-blue-600 rounded-full items-center justify-end px-1">
            <View className="w-4 h-4 bg-white rounded-full" />
          </View>
        </View>
      </View>
    </View>

    {/* Account Settings */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Account
      </Text>
      
      <View className="space-y-4">
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="key-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Privacy Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-600 dark:text-red-400">Sign Out</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// Help & Support Component
const HelpSupportTab = () => (
  <View className="space-y-6">
    {/* Help Center */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Help Center
      </Text>
      
      <View className="space-y-4">
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">FAQ</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="book-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">User Guide</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="videocam-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Video Tutorials</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>

    {/* Contact Support */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Contact Support
      </Text>
      
      <View className="space-y-4">
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="mail-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Email Support</Text>
          </View>
          <Text className="text-blue-600 dark:text-blue-400">support@school.com</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="call-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Phone Support</Text>
          </View>
          <Text className="text-blue-600 dark:text-blue-400">+234 800 123 4567</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
            <Text className="text-gray-700 dark:text-gray-300">Live Chat</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>

    {/* App Information */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        App Information
      </Text>
      
      <View className="space-y-3">
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-gray-600 dark:text-gray-400">Version</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">1.0.0</Text>
        </View>
        
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-gray-600 dark:text-gray-400">Build</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">2024.01.15</Text>
        </View>
        
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-gray-600 dark:text-gray-400">Last Updated</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">2 days ago</Text>
        </View>
      </View>
    </View>
  </View>
);

export default function StudentProfileScreen() {
  const [activeTab, setActiveTab] = useState('basic');
  const [refreshing, setRefreshing] = useState(false);
  const { data: dashboardData, isLoading, refetch } = useStudentDashboard();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoTab userData={dashboardData?.data?.general_info?.student} />;
      case 'academic':
        return <AcademicInfoTab academicData={dashboardData?.data?.general_info} />;
      case 'settings':
        return <SettingsTab />;
      case 'help':
        return <HelpSupportTab />;
      default:
        return <BasicInfoTab userData={dashboardData?.data?.general_info?.student} />;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        <CenteredLoader visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Profile
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your account and preferences
            </Text>
          </View>

          {/* Tab Navigation */}
          <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
            {PROFILE_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-md ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : ''
                }`}
              >
                <Ionicons 
                  name={tab.icon as any} 
                  size={16} 
                  color={activeTab === tab.id ? '#3B82F6' : '#6B7280'} 
                />
                <Text className={`text-xs font-semibold ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
