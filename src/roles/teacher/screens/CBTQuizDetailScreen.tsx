import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TeacherStackParamList = {
  TeacherTabs: undefined;
  SubjectDetail: { subject: any };
  VideoDemo: any;
  CBTCreation: { subjectId?: string; subjectName?: string };
  CBTQuizDetail: { quizId: string };
  CBTQuestionCreation: { quizId: string; quizTitle: string; subjectId: string };
};

type TeacherNavigationProp = NativeStackNavigationProp<TeacherStackParamList>;

interface RouteParams {
  quizId: string;
}

export default function CBTQuizDetailScreen() {
  const navigation = useNavigation<TeacherNavigationProp>();
  const route = useRoute();
  const { quizId } = (route.params as RouteParams) || {};

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 -ml-2 mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Quiz Preview
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Quiz ID: {quizId}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quiz Details
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            This is a placeholder for the CBT Quiz Detail screen. 
            The quiz with ID "{quizId}" will be displayed here.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
