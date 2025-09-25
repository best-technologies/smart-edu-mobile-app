import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentAssessments } from '@/hooks/useStudentAssessments';
import { AssessmentsTab, ResultsTab } from './tabs';

interface StudentResultsScreenProps {
  navigation: any;
}

export default function StudentResultsScreen({ navigation }: StudentResultsScreenProps) {
  const [activeTab, setActiveTab] = useState<'assessments' | 'results'>('assessments');
  
  // API call to get general info for session and term
  const { data: assessmentsData } = useStudentAssessments();
  const generalInfo = assessmentsData?.data?.general_info;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 py-6">
          <View className="mb-6">
            <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              My Assessments
            </Text>
            <View className="flex-row items-center gap-3 flex-wrap mb-6">
              <View className="bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Session: {generalInfo?.current_session?.academic_year || 'N/A'}
                </Text>
              </View>
              <View className="bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium text-green-700 dark:text-green-300">
                  Term: {generalInfo?.current_session?.term || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Tab Navigation */}
            <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setActiveTab('assessments')}
                  className={`flex-1 py-3 px-4 rounded-l-lg ${
                    activeTab === 'assessments'
                      ? 'bg-blue-600'
                      : 'bg-transparent'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-center font-semibold ${
                    activeTab === 'assessments'
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Assessments
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setActiveTab('results')}
                  className={`flex-1 py-3 px-4 rounded-r-lg ${
                    activeTab === 'results'
                      ? 'bg-blue-600'
                      : 'bg-transparent'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-center font-semibold ${
                    activeTab === 'results'
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Results
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Tab Content */}
          {activeTab === 'assessments' && (
            <AssessmentsTab navigation={navigation} />
          )}

          {activeTab === 'results' && (
            <ResultsTab navigation={navigation} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
