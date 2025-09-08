import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTeacherSubjects } from '@/hooks/useTeacherSubjects';
import { CenteredLoader } from '@/components';

const { width } = Dimensions.get('window');

export default function AssessmentsListScreen() {
  const {
    subjects,
    isLoading,
    error,
    refetch,
  } = useTeacherSubjects();

  const handleSubjectPress = (subject: any) => {
    console.log('Subject pressed:', subject.name);
    // TODO: Navigate to subject assessments or implement subject selection
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <View className="px-4 py-6">
        <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Assessment
        </Text>
        
        {isLoading ? (
          <CenteredLoader visible={true} text="Loading subjects..." />
        ) : error ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Error loading subjects
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
              {error}
            </Text>
            <TouchableOpacity
              onPress={refetch}
              className="bg-blue-600 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : subjects.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No subjects found
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
              You don't have any subjects assigned yet.
            </Text>
          </View>
        ) : (
          <View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Select Subject
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              className="mb-6"
            >
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject.id}
                  onPress={() => handleSubjectPress(subject)}
                  className="mr-4"
                  style={{ width: width * 0.4 }}
                >
                  <View
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4"
                    style={{ borderLeftColor: subject.color }}
                  >
                    <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {subject.code}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400" numberOfLines={2}>
                      {subject.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
