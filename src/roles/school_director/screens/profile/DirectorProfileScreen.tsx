import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { mockDirectorProfile } from '@/mock/directorProfile';

// Import tab components
import BasicInfoTab from './tabs/BasicInfoTab';
import AcademicInfoTab from './tabs/AcademicInfoTab';
import ResultsAnalyticsTab from './tabs/ResultsAnalyticsTab';
import SubscriptionTab from './tabs/SubscriptionTab';
import SystemSettingsTab from './tabs/SystemSettingsTab';

type TabKey = 'basic' | 'academic' | 'results' | 'subscription' | 'settings';

interface Tab {
  key: TabKey;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const tabs: Tab[] = [
  { key: 'basic', title: 'Basic Info', icon: 'person-outline', color: '#3B82F6' },
  { key: 'academic', title: 'Academic', icon: 'school-outline', color: '#10B981' },
  { key: 'results', title: 'Analytics', icon: 'bar-chart-outline', color: '#F59E0B' },
  { key: 'subscription', title: 'Subscription', icon: 'card-outline', color: '#8B5CF6' },
  { key: 'settings', title: 'Settings', icon: 'settings-outline', color: '#6B7280' },
];

export default function DirectorProfileScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabKey>('basic');
  const profile = mockDirectorProfile;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoTab data={profile.basicInfo} />;
      case 'academic':
        return <AcademicInfoTab data={profile.academicInfo} />;
      case 'results':
        return <ResultsAnalyticsTab data={profile.resultsAnalytics} />;
      case 'subscription':
        return <SubscriptionTab data={profile.subscription} />;
      case 'settings':
        return <SystemSettingsTab data={profile.systemSettings} />;
      default:
        return <BasicInfoTab data={profile.basicInfo} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mr-3"
          >
            <Ionicons name="arrow-back" size={20} color="#6B7280" />
          </TouchableOpacity>
          
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 mr-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              {profile.basicInfo.profileImage ? (
                <Image
                  source={{ uri: profile.basicInfo.profileImage }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Ionicons name="person" size={24} color="#9CA3AF" />
                </View>
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {profile.basicInfo.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {profile.basicInfo.position} • {profile.basicInfo.schoolName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="px-4 pt-4 bg-white dark:bg-gray-900">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                className={`mr-6 pb-3 ${isActive ? 'border-b-2' : ''}`}
                style={{ borderBottomColor: isActive ? tab.color : 'transparent' }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-8 h-8 rounded-full items-center justify-center mr-2"
                    style={{ backgroundColor: `${tab.color}20` }}
                  >
                    <Ionicons 
                      name={tab.icon} 
                      size={18} 
                      color={tab.color}
                      style={{ opacity: isActive ? 1 : 0.6 }}
                    />
                  </View>
                  <Text 
                    className={`text-sm font-medium ${
                      isActive 
                        ? 'text-gray-900 dark:text-gray-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {tab.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <View className="flex-1 bg-gray-50 dark:bg-gray-900">
        {renderTabContent()}
      </View>
    </SafeAreaView>
  );
}
