import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Assignment } from '../../mock/assignmentMockData';

interface AssignmentCardProps {
  assignment: Assignment;
  onPress?: (assignment: Assignment) => void;
}

export default function AssignmentCard({ assignment, onPress }: AssignmentCardProps) {
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'graded':
        return { bg: '#10b98120', text: '#10b981', border: '#10b98140' };
      case 'pending_submission':
        return { bg: '#ef444420', text: '#ef4444', border: '#ef444440' };
      case 'pending_grading':
        return { bg: '#f59e0b20', text: '#f59e0b', border: '#f59e0b40' };
      case 'submitted':
        return { bg: '#3b82f620', text: '#3b82f6', border: '#3b82f640' };
      default:
        return { bg: '#6b728020', text: '#6b7280', border: '#6b728040' };
    }
  };

  const getStatusLabel = (status: Assignment['status']) => {
    switch (status) {
      case 'graded':
        return 'Graded';
      case 'pending_submission':
        return 'Not Submitted';
      case 'pending_grading':
        return 'Pending Grading';
      case 'submitted':
        return 'Submitted';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = assignment.status === 'pending_submission' && new Date(assignment.dueDate) < new Date();

  const colors = getStatusColor(assignment.status);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(assignment)}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700"
      activeOpacity={0.7}
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {assignment.title}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {assignment.subject}
          </Text>
        </View>
        
        {/* Status Badge */}
        <View 
          className="px-3 py-1 rounded-full border"
          style={{ backgroundColor: colors.bg, borderColor: colors.border }}
        >
          <Text className="text-xs font-semibold" style={{ color: colors.text }}>
            {getStatusLabel(assignment.status)}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {assignment.description}
      </Text>

      {/* Score Section (if graded) */}
      {assignment.status === 'graded' && assignment.score !== undefined && (
        <View className="flex-row items-center mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Ionicons name="trophy" size={20} color="#10b981" />
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 ml-2">
            Score: {assignment.score}/{assignment.maxScore} ({assignment.grade})
          </Text>
        </View>
      )}

      {/* Feedback (if available) */}
      {assignment.feedback && (
        <View className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Text className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
            Teacher's Feedback:
          </Text>
          <Text className="text-sm text-gray-700 dark:text-gray-300 italic">
            "{assignment.feedback}"
          </Text>
        </View>
      )}

      {/* Footer Info */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center flex-1">
          <Ionicons name="person-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {assignment.teacher}
          </Text>
        </View>
        
        <View className="flex-row items-center">
          <Ionicons 
            name={isOverdue ? 'alert-circle' : 'calendar-outline'} 
            size={14} 
            color={isOverdue ? '#ef4444' : '#6b7280'} 
          />
          <Text className={`text-xs ml-1 ${isOverdue ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
            Due: {formatDate(assignment.dueDate)}
            {isOverdue && ' (Overdue)'}
          </Text>
        </View>
      </View>

      {/* Submitted Date (if applicable) */}
      {assignment.submittedDate && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="checkmark-circle" size={14} color="#10b981" />
          <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            Submitted: {formatDate(assignment.submittedDate)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

