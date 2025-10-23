import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function GradingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-8 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Grading</Text>
        <Text className="text-sm text-gray-600">Manage student submissions and grades</Text>
      </View>

      {/* Coming Soon Content */}
      <View className="flex-1 items-center justify-center px-6">
        <View className="items-center">
          {/* Icon */}
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="clipboard-outline" size={48} color="#3B82F6" />
          </View>
          
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-3 text-center">
            Grading System
          </Text>
          
          {/* Description */}
          <Text className="text-lg text-gray-600 mb-8 text-center leading-relaxed">
            Advanced grading and assessment tools are coming soon
          </Text>
          
          {/* Features List */}
          <View className="w-full max-w-sm">
            <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <Text className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Upcoming Features
              </Text>
              
              <View>
                <View className="flex-row items-center mb-4">
                  <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="checkmark" size={14} color="#10B981" />
                  </View>
                  <Text className="text-gray-700 flex-1 text-sm">Student submission management</Text>
                </View>
                
                <View className="flex-row items-center mb-4">
                  <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="checkmark" size={14} color="#10B981" />
                  </View>
                  <Text className="text-gray-700 flex-1 text-sm">Automated grading system</Text>
                </View>
                
                <View className="flex-row items-center mb-4">
                  <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="checkmark" size={14} color="#10B981" />
                  </View>
                  <Text className="text-gray-700 flex-1 text-sm">Grade analytics & reports</Text>
                </View>
                
                <View className="flex-row items-center mb-4">
                  <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="checkmark" size={14} color="#10B981" />
                  </View>
                  <Text className="text-gray-700 flex-1 text-sm">Rubric-based assessment</Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="checkmark" size={14} color="#10B981" />
                  </View>
                  <Text className="text-gray-700 flex-1 text-sm">Real-time feedback system</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Status Badge */}
          <View className="mt-8 mb-8 px-4 py-2 bg-blue-50 rounded-full">
            <Text className="text-sm font-medium text-blue-700">
              🚀 Coming Soon - Q1 2026
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
