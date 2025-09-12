import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStudentProfile } from '@/hooks/useStudentProfile';
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
        {userData?.name || ''}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        {userData?.email || ''}
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
            {userData?.name}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Email</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {userData?.email || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Phone</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {userData?.phone || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Student ID</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {userData?.student_id || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-gray-600 dark:text-gray-400">Date of Birth</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {userData?.date_of_birth ? new Date(userData.date_of_birth).toLocaleDateString() : ''}
          </Text>
        </View>
      </View>
    </View>

    {/* Address Information */}
    {userData?.address && (
      <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Address
        </Text>
        
        <View className="space-y-4">
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <Text className="text-gray-600 dark:text-gray-400">Street</Text>
            <Text className="font-semibold text-gray-900 dark:text-gray-100 text-right flex-1 ml-4">
              {userData.address.street}
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <Text className="text-gray-600 dark:text-gray-400">City</Text>
            <Text className="font-semibold text-gray-900 dark:text-gray-100">
              {userData.address.city}
            </Text>
          </View>
          
          <View className="flex-row items-center justify-between py-3">
            <Text className="text-gray-600 dark:text-gray-400">State</Text>
            <Text className="font-semibold text-gray-900 dark:text-gray-100">
              {userData.address.state}
            </Text>
          </View>
        </View>
      </View>
    )}

    {/* Emergency Contact */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Emergency Contact
      </Text>
      
      <View className="space-y-4">
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Contact Name</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {userData?.emergency_contact_name || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-gray-600 dark:text-gray-400">Contact Phone</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {userData?.emergency_contact_phone || ''}
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
            {academicData?.student_class?.name || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Level</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {academicData?.student_class?.level || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-gray-600 dark:text-gray-400">Academic Year</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {academicData?.current_session?.academic_year || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-3">
          <Text className="text-gray-600 dark:text-gray-400">Term</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {academicData?.current_session?.term || ''}
          </Text>
        </View>
      </View>
    </View>

    {/* Subjects Enrolled */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Subjects Enrolled ({academicData?.subjects_enrolled?.length || 0})
      </Text>
      
      <View className="space-y-3">
        {academicData?.subjects_enrolled?.map((subject: any, index: number) => (
          <View key={subject.id || index} className="flex-row items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <View className="flex-1">
              <Text className="text-gray-900 dark:text-gray-100 font-medium capitalize">
                {subject.name}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {subject.code} • {subject.teacher_name}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {subject.credits} credits
              </Text>
              <View className={`w-2 h-2 rounded-full ${
                subject.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </View>
          </View>
        )) || (
          <Text className="text-gray-500 dark:text-gray-400 text-center py-4">
            No subjects enrolled
          </Text>
        )}
      </View>
    </View>

    {/* Academic Performance Summary */}
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Performance Summary
      </Text>
      
      <View className="grid grid-cols-2 gap-4">
        <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {academicData?.performance_summary?.average_score?.toFixed(1) || '0.0'}%
          </Text>
          <Text className="text-sm text-blue-700 dark:text-blue-300">Average Score</Text>
        </View>
        
        <View className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <Text className="text-2xl font-bold text-green-600 dark:text-green-400">
            {academicData?.performance_summary?.total_assessments || 0}
          </Text>
          <Text className="text-sm text-green-700 dark:text-green-300">Total Assessments</Text>
        </View>
        
        <View className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <Text className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {academicData?.performance_summary?.passed_assessments || 0}
          </Text>
          <Text className="text-sm text-orange-700 dark:text-orange-300">Passed</Text>
        </View>
        
        <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <Text className="text-2xl font-bold text-red-600 dark:text-red-400">
            {academicData?.performance_summary?.failed_assessments || 0}
          </Text>
          <Text className="text-sm text-red-700 dark:text-red-300">Failed</Text>
        </View>
      </View>
    </View>

    {/* Recent Achievements */}
    {academicData?.recent_achievements?.length > 0 && (
      <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Recent Achievements
        </Text>
        
        <View className="space-y-3">
          {academicData.recent_achievements.map((achievement: any, index: number) => (
            <View key={achievement.id || index} className="flex-row items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <View className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
              <View className="flex-1">
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  {achievement.title}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {achievement.description}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(achievement.date_earned).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    )}
  </View>
);

// Settings Component
const SettingsTab = ({ settingsData }: { settingsData: any }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(settingsData?.notifications?.push_notifications ?? true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(settingsData?.app_preferences?.dark_mode ?? false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(settingsData?.app_preferences?.sound_effects ?? true);

  return (
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
              <Text className="text-gray-900 dark:text-gray-100">Push Notifications</Text>
            </View>
            <TouchableOpacity
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full ${
                notificationsEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <View
                className={`w-4 h-4 bg-white rounded-full mt-1 ${
                  notificationsEnabled ? 'ml-7' : 'ml-1'
                }`}
              />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <Ionicons name="moon-outline" size={20} color="#6B7280" />
              <Text className="text-gray-900 dark:text-gray-100">Dark Mode</Text>
            </View>
            <TouchableOpacity
              onPress={() => setDarkModeEnabled(!darkModeEnabled)}
              className={`w-12 h-6 rounded-full ${
                darkModeEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <View
                className={`w-4 h-4 bg-white rounded-full mt-1 ${
                  darkModeEnabled ? 'ml-7' : 'ml-1'
                }`}
              />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="volume-high-outline" size={20} color="#6B7280" />
              <Text className="text-gray-900 dark:text-gray-100">Sound Effects</Text>
            </View>
            <TouchableOpacity
              onPress={() => setSoundEffectsEnabled(!soundEffectsEnabled)}
              className={`w-12 h-6 rounded-full ${
                soundEffectsEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <View
                className={`w-4 h-4 bg-white rounded-full mt-1 ${
                  soundEffectsEnabled ? 'ml-7' : 'ml-1'
                }`}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Account Settings */}
      <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          Account Settings
        </Text>
        
        <View className="space-y-4">
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" />
              <Text className="text-gray-900 dark:text-gray-100">Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <View className="flex-row items-center gap-3">
              <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
              <Text className="text-gray-900 dark:text-gray-100">Privacy Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center justify-between py-3">
            <View className="flex-row items-center gap-3">
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text className="text-red-600 dark:text-red-400">Sign Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Help & Support Component
const HelpSupportTab = ({ supportData }: { supportData: any }) => (
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
            <Text className="text-gray-900 dark:text-gray-100">Frequently Asked Questions</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="book-outline" size={20} color="#6B7280" />
            <Text className="text-gray-900 dark:text-gray-100">User Guide</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="videocam-outline" size={20} color="#6B7280" />
            <Text className="text-gray-900 dark:text-gray-100">Video Tutorials</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
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
            <Text className="text-gray-900 dark:text-gray-100">Email Support</Text>
          </View>
          <Text className="text-sm text-blue-600 dark:text-blue-400">
            {supportData?.contact_options?.email_support || ''}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center gap-3">
            <Ionicons name="call-outline" size={20} color="#6B7280" />
            <Text className="text-gray-900 dark:text-gray-100">Phone Support</Text>
          </View>
          <Text className="text-sm text-blue-600 dark:text-blue-400">
            {supportData?.contact_options?.phone_support || ''}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="chatbubble-outline" size={20} color="#6B7280" />
            <Text className="text-gray-900 dark:text-gray-100">Live Chat</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
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
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {supportData?.app_info?.version || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-gray-600 dark:text-gray-400">Build</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {supportData?.app_info?.build_number || ''}
          </Text>
        </View>
        
        <View className="flex-row items-center justify-between py-2">
          <Text className="text-gray-600 dark:text-gray-400">Last Updated</Text>
          <Text className="font-semibold text-gray-900 dark:text-gray-100">
            {supportData?.app_info?.last_updated || ''}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

export default function StudentProfileScreen() {
  const [activeTab, setActiveTab] = useState('basic');
  const [refreshing, setRefreshing] = useState(false);
  const { data: profileData, isLoading, refetch } = useStudentProfile();

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoTab userData={profileData?.data?.general_info?.student} />;
      case 'academic':
        return <AcademicInfoTab academicData={profileData?.data?.academic_info} />;
      case 'settings':
        return <SettingsTab settingsData={profileData?.data?.settings} />;
      case 'help':
        return <HelpSupportTab supportData={profileData?.data?.support_info} />;
      default:
        return <BasicInfoTab userData={profileData?.data?.general_info?.student} />;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <CenteredLoader visible={true} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
      >
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              My Profile
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              Manage your account and preferences
            </Text>
          </View>

          {/* Tab Navigation */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            <View className="flex-row space-x-2">
              {PROFILE_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => handleTabPress(tab.id)}
                  className={`px-4 py-3 rounded-lg flex-row items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-600'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Ionicons 
                    name={tab.icon as any} 
                    size={18} 
                    color={activeTab === tab.id ? '#FFFFFF' : '#6B7280'} 
                  />
                  <Text 
                    className={`font-medium ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {tab.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Tab Content */}
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}