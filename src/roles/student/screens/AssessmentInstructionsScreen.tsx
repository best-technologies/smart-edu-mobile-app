import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Assessment } from '@/services/types/apiTypes';

const { width } = Dimensions.get('window');

interface AssessmentInstructionsScreenProps {
  route: {
    params: {
      assessment: Assessment;
    };
  };
  navigation: any;
}

export default function AssessmentInstructionsScreen({ route, navigation }: AssessmentInstructionsScreenProps) {
  const { assessment } = route.params;
  const [hasReadInstructions, setHasReadInstructions] = useState(false);

  const handleConfirmAndStart = () => {
    if (!hasReadInstructions) {
      Alert.alert(
        'Please Read Instructions',
        'Please read through all the instructions before starting the assessment.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Navigate to assessment taking screen
    navigation.navigate('AssessmentTaking', {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 
      ? `${hours}h ${remainingMinutes}m`
      : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={handleGoBack}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1 text-center">
            Assessment Instructions
          </Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Assessment Overview Card */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1 mr-4">
                <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {assessment.title}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {assessment.description}
                </Text>
                
                {/* Assessment Type Badge */}
                <View className="flex-row items-center gap-2 mb-3">
                  <View className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Text className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {assessment.assessment_type}
                    </Text>
                  </View>
                  <View 
                    className="px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: assessment.subject.color + '20',
                      borderColor: assessment.subject.color,
                      borderWidth: 1
                    }}
                  >
                    <Text 
                      className="text-sm font-semibold"
                      style={{ color: assessment.subject.color }}
                    >
                      {assessment.subject.code}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Assessment Details Grid */}
            <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <View className="grid grid-cols-2 gap-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={18} color="#3b82f6" />
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Duration</Text>
                    <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatDuration(assessment.duration)}
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center gap-2">
                  <Ionicons name="star-outline" size={18} color="#f59e0b" />
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Total Points</Text>
                    <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {assessment.total_points} pts
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center gap-2">
                  <Ionicons name="help-circle-outline" size={18} color="#10b981" />
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Questions</Text>
                    <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {assessment.questions_count} questions
                    </Text>
                  </View>
                </View>
                
                <View className="flex-row items-center gap-2">
                  <Ionicons name="refresh-outline" size={18} color="#8b5cf6" />
                  <View>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">Attempts</Text>
                    <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {assessment.student_attempts + 1} of {assessment.max_attempts}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Due Date */}
            <View className="mt-4 p-3 rounded-lg" style={{
              backgroundColor: isOverdue(assessment.due_date) 
                ? '#fef2f2' 
                : isDueSoon(assessment.due_date) 
                  ? '#fffbeb' 
                  : '#f0f9ff',
              borderColor: isOverdue(assessment.due_date)
                ? '#fecaca'
                : isDueSoon(assessment.due_date)
                  ? '#fed7aa'
                  : '#bae6fd',
              borderWidth: 1
            }}>
              <View className="flex-row items-center gap-2">
                <Ionicons 
                  name="calendar-outline" 
                  size={16} 
                  color={isOverdue(assessment.due_date) ? '#dc2626' : isDueSoon(assessment.due_date) ? '#d97706' : '#2563eb'} 
                />
                <Text className="text-sm font-medium" style={{
                  color: isOverdue(assessment.due_date) ? '#dc2626' : isDueSoon(assessment.due_date) ? '#d97706' : '#2563eb'
                }}>
                  Due: {formatDate(assessment.due_date)}
                </Text>
              </View>
            </View>
          </View>

          {/* Instructions Card */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <View className="flex-row items-center gap-3 mb-4">
              <Ionicons name="information-circle" size={24} color="#3b82f6" />
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Important Instructions
              </Text>
            </View>

            <View className="space-y-4">
              {/* Instruction 1 */}
              <View className="flex-row items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mt-0.5">
                  <Text className="text-red-600 dark:text-red-400 font-bold text-sm">1</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Do Not Leave This Page
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    Once you start the assessment, do not navigate away from this page or close the app. 
                    Leaving the page will automatically submit your assessment.
                  </Text>
                </View>
              </View>

              {/* Instruction 2 */}
              <View className="flex-row items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 items-center justify-center mt-0.5">
                  <Text className="text-orange-600 dark:text-orange-400 font-bold text-sm">2</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    No Minimizing or Background Apps
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    Do not minimize the app or switch to other applications. The assessment will be 
                    automatically submitted if the app goes to the background.
                  </Text>
                </View>
              </View>

              {/* Instruction 3 */}
              <View className="flex-row items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 items-center justify-center mt-0.5">
                  <Text className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">3</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Time Limit is Strict
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    You have {formatDuration(assessment.duration)} to complete this assessment. 
                    The timer will start immediately when you begin and cannot be paused.
                  </Text>
                </View>
              </View>

              {/* Instruction 4 */}
              <View className="flex-row items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mt-0.5">
                  <Text className="text-green-600 dark:text-green-400 font-bold text-sm">4</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Answer All Questions
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    Make sure to answer all questions before submitting. You can review and change 
                    your answers before the final submission.
                  </Text>
                </View>
              </View>

              {/* Instruction 5 */}
              <View className="flex-row items-start gap-3">
                <View className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mt-0.5">
                  <Text className="text-blue-600 dark:text-blue-400 font-bold text-sm">5</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Stable Internet Connection
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    Ensure you have a stable internet connection throughout the assessment. 
                    Connection issues may result in automatic submission.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Additional Guidelines */}
          {assessment.instructions && (
            <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <View className="flex-row items-center gap-3 mb-4">
                <Ionicons name="document-text" size={24} color="#8b5cf6" />
                <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Additional Guidelines
                </Text>
              </View>
              <Text className="text-sm text-gray-600 dark:text-gray-400 leading-6">
                {assessment.instructions}
              </Text>
            </View>
          )}

          {/* Confirmation Checkbox */}
          <View className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <TouchableOpacity
              onPress={() => setHasReadInstructions(!hasReadInstructions)}
              className="flex-row items-start gap-3"
              activeOpacity={0.7}
            >
              <View className={`w-6 h-6 rounded border-2 items-center justify-center mt-0.5 ${
                hasReadInstructions
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300 dark:border-gray-600'
              }`}>
                {hasReadInstructions && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  I have read and understood all instructions
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                  By checking this box, I confirm that I have read all the instructions and 
                  understand the assessment rules and requirements.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={handleGoBack}
            className="flex-1 bg-gray-200 dark:bg-gray-600 py-4 rounded-xl min-h-[56px]"
            style={{ minWidth: 0 }}
          >
            <Text className="text-center font-semibold text-gray-700 dark:text-gray-300 text-base">
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleConfirmAndStart}
            className={`flex-1 py-4 rounded-xl min-h-[56px] ${
              hasReadInstructions
                ? 'bg-blue-600'
                : 'bg-gray-400'
            }`}
            disabled={!hasReadInstructions}
            style={{ minWidth: 0 }}
          >
            <View className="flex-row items-center justify-center gap-2 px-2">
              <Ionicons 
                name="play-circle" 
                size={18} 
                color="white" 
              />
              <Text 
                className="text-center font-bold text-white text-sm flex-shrink"
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                Confirm & Start
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
