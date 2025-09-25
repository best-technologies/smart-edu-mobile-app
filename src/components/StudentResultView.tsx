import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export interface StudentResultData {
  id: string;
  type: 'Class Work' | 'Assignment' | 'CA' | 'Exam';
  student: {
    id: string;
    name: string;
    avatar?: string | null;
    studentId: string;
    class: string;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  attached?: {
    type: 'document' | 'image' | 'video' | 'link';
    name: string;
    url: string;
  };
  status: 'pending' | 'graded';
  score?: number | null;
  maxScore: number;
  submittedAt: string;
  gradedAt?: string;
  gradedBy?: {
    id: string;
    name: string;
  };
  feedback?: string;
  comments?: string;
  rubric?: {
    criteria: string;
    points: number;
    maxPoints: number;
    feedback: string;
  }[];
}

interface StudentResultViewProps {
  result: StudentResultData;
  role: 'teacher' | 'student' | 'director';
  onClose: () => void;
  onEdit?: (result: StudentResultData) => void;
  onGrade?: (result: StudentResultData) => void;
}

export function StudentResultView({ 
  result, 
  role, 
  onClose, 
  onEdit, 
  onGrade 
}: StudentResultViewProps) {
  const [showFullFeedback, setShowFullFeedback] = useState(false);
  
//   console.log('StudentResultView rendered with result:', result);

  const getGradeTypeColor = (type: string) => {
    switch (type) {
      case 'Exam': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      case 'CA': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
      case 'Assignment': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'Class Work': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'graded' 
      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
      : 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
  };

  const getScoreColor = (score: number | null | undefined, maxScore: number) => {
    if (!score) return 'text-gray-600 dark:text-gray-400';
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'document': return 'document-text-outline';
      case 'image': return 'image-outline';
      case 'video': return 'videocam-outline';
      case 'link': return 'link-outline';
      default: return 'attach-outline';
    }
  };

  const handleAttachmentPress = async () => {
    if (!result.attached?.url) return;
    
    try {
      await Linking.openURL(result.attached.url);
    } catch (error) {
      Alert.alert('Error', 'Could not open attachment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = role === 'teacher' && result.status === 'pending';
  const canGrade = role === 'teacher';
  const canViewDetails = role === 'teacher' || role === 'director';

  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <View className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Student Result
            </Text>
            <View className="w-8" />
          </View>

          {/* Student Info */}
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center mr-3">
              {result.student.avatar ? (
                <Image
                  source={{ uri: result.student.avatar }}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={24} color="#6B7280" />
              )}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {result.student.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {result.student.studentId} • {result.student.class}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="p-6">
            {/* Grade Type and Status */}
            <View className="flex-row items-center gap-3 mb-6">
              <View className={`px-3 py-1 rounded-full ${getGradeTypeColor(result.type)}`}>
                <Text className="text-sm font-semibold">{result.type}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${getStatusColor(result.status)}`}>
                <Text className="text-sm font-semibold capitalize">{result.status}</Text>
              </View>
            </View>

            {/* Subject Info */}
            <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {result.subject.name}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {result.subject.code}
              </Text>
            </View>

            {/* Score Section */}
            {result.status === 'graded' && result.score !== null ? (
              <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <View className="items-center">
                  <Text className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {result.score}/{result.maxScore}
                  </Text>
                  <Text className={`text-2xl font-bold ${getScoreColor(result.score, result.maxScore)}`}>
                    {result.score ? Math.round((result.score / result.maxScore) * 100) : 0}%
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {result.score && result.score >= result.maxScore * 0.8 ? 'Excellent!' : 
                     result.score && result.score >= result.maxScore * 0.6 ? 'Good work!' : 
                     'Needs improvement'}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6 mb-6">
                <View className="items-center">
                  <Ionicons name="time-outline" size={32} color="#F59E0B" />
                  <Text className="text-lg font-semibold text-orange-800 dark:text-orange-200 mt-2">
                    Pending Review
                  </Text>
                  <Text className="text-sm text-orange-600 dark:text-orange-300 text-center mt-1">
                    This submission is waiting for grading
                  </Text>
                </View>
              </View>
            )}

            {/* Attachment Section */}
            {result.attached && (
              <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Submission
                </Text>
                <TouchableOpacity
                  onPress={handleAttachmentPress}
                  className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <Ionicons 
                    name={getAttachmentIcon(result.attached.type)} 
                    size={24} 
                    color="#6B7280" 
                  />
                  <View className="flex-1 ml-3">
                    <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {result.attached.name}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {result.attached.type}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}

            {/* Feedback Section */}
            {result.feedback && (
              <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Feedback
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                  {showFullFeedback ? result.feedback : `${result.feedback.substring(0, 100)}...`}
                </Text>
                {result.feedback.length > 100 && (
                  <TouchableOpacity
                    onPress={() => setShowFullFeedback(!showFullFeedback)}
                    className="mt-2"
                  >
                    <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                      {showFullFeedback ? 'Show less' : 'Show more'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Comments Section */}
            {result.comments && (
              <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Comments
                </Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                  {result.comments}
                </Text>
              </View>
            )}

            {/* Rubric Section */}
            {result.rubric && result.rubric.length > 0 && (
              <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Rubric Assessment
                </Text>
                {result.rubric.map((item, index) => (
                  <View key={index} className="mb-4 last:mb-0">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
                        {item.criteria}
                      </Text>
                      <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {item.points}/{item.maxPoints}
                      </Text>
                    </View>
                    <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <View 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.points / item.maxPoints) * 100}%` }}
                      />
                    </View>
                    {item.feedback && (
                      <Text className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {item.feedback}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Submission Details */}
            <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Submission Details
              </Text>
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-500 dark:text-gray-400">Submitted:</Text>
                  <Text className="text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(result.submittedAt)}
                  </Text>
                </View>
                {result.gradedAt && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">Graded:</Text>
                    <Text className="text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(result.gradedAt)}
                    </Text>
                  </View>
                )}
                {result.gradedBy && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-500 dark:text-gray-400">Graded by:</Text>
                    <Text className="text-sm text-gray-900 dark:text-gray-100">
                      {result.gradedBy.name}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        {role === 'teacher' && (
          <View className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <View className="flex-row gap-3">
              {canGrade && (
                <TouchableOpacity
                  onPress={() => onGrade?.(result)}
                  className="flex-1 bg-blue-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-semibold">
                    {result.status === 'graded' ? 'Regrade' : 'Grade'}
                  </Text>
                </TouchableOpacity>
              )}
              {canEdit && (
                <TouchableOpacity
                  onPress={() => onEdit?.(result)}
                  className="flex-1 bg-gray-500 py-3 rounded-xl items-center"
                >
                  <Text className="text-white font-semibold">Edit</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

export default StudentResultView;
