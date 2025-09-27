import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DirectorProfileData } from '@/mock/directorProfile';

interface BasicInfoTabProps {
  data: DirectorProfileData['basicInfo'];
}

interface InfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  color?: string;
}

const InfoCard = ({ icon, title, value, color = '#6B7280' }: InfoCardProps) => (
  <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
    <View className="flex-row items-center mb-3">
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {title}
      </Text>
    </View>
    <Text className="text-base text-gray-900 dark:text-gray-100 leading-relaxed">
      {value}
    </Text>
  </View>
);

export default function BasicInfoTab({ data }: BasicInfoTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >

      {/* Personal Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Personal Information
        </Text>
        <View className="space-y-4">
          <InfoCard
            icon="mail-outline"
            title="Email Address"
            value={data.email}
            color="#3B82F6"
          />
          <InfoCard
            icon="call-outline"
            title="Phone Number"
            value={data.phone}
            color="#10B981"
          />
          <InfoCard
            icon="location-outline"
            title="Address"
            value={data.address}
            color="#F59E0B"
          />
          <InfoCard
            icon="calendar-outline"
            title="Join Date"
            value={formatDate(data.joinDate)}
            color="#8B5CF6"
          />
        </View>
      </View>

      {/* Professional Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Professional Details
        </Text>
        <View className="space-y-4">
          <InfoCard
            icon="school-outline"
            title="Department"
            value={data.department}
            color="#EF4444"
          />
          <InfoCard
            icon="ribbon-outline"
            title="Qualification"
            value={data.qualification}
            color="#EC4899"
          />
          <InfoCard
            icon="briefcase-outline"
            title="Experience"
            value={data.experience}
            color="#14B8A6"
          />
        </View>
      </View>

      {/* Emergency Contact */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Emergency Contact
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full items-center justify-center mr-3">
              <Ionicons name="people-outline" size={20} color="#EF4444" />
            </View>
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Emergency Contact
            </Text>
          </View>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Name:</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {data.emergencyContact.name}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Relationship:</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {data.emergencyContact.relationship}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Phone:</Text>
              <TouchableOpacity>
                <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {data.emergencyContact.phone}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row" style={{ gap: 12 }}>
          <TouchableOpacity className="flex-1 bg-blue-600 rounded-xl p-4 items-center">
            <Ionicons name="create-outline" size={24} color="white" />
            <Text className="text-white font-medium mt-2">Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-green-600 rounded-xl p-4 items-center">
            <Ionicons name="download-outline" size={24} color="white" />
            <Text className="text-white font-medium mt-2">Export Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
