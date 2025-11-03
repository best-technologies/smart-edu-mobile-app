import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Child } from '../../mock/parentMockData';

interface ChildCardProps {
  child: Child;
  onPress?: (child: Child) => void;
}

export default function ChildCard({ child, onPress }: ChildCardProps) {
  const getStatusColor = (status: Child['status']) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'good':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'average':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'needs-attention':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
    if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(child)}
      className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        {/* Avatar */}
        <View className="w-16 h-16 rounded-full bg-indigo-600 items-center justify-center mr-4 shadow-md">
          <Text className="text-2xl font-bold text-white">
            {child.firstName[0]}{child.lastName[0]}
          </Text>
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {child.firstName} {child.lastName}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Student ID: {child.studentId}
              </Text>
            </View>
            <View className={`px-3 py-1 rounded-full border ${getStatusColor(child.status)}`}>
              <Text className="text-xs font-semibold capitalize">
                {child.status.replace('-', ' ')}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-4 mt-3">
            {/* Grade */}
            <View className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg flex-row items-center">
              <Ionicons name="school" size={16} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1.5">
                {child.grade} • {child.class}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-4 mt-3">
            {/* Overall Grade */}
            <View className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-lg">
              <Text className="text-xs text-gray-600 dark:text-gray-400">Overall Grade</Text>
              <Text className={`text-xl font-bold mt-0.5 ${getGradeColor(child.overallGrade)}`}>
                {child.overallGrade}
              </Text>
            </View>

            {/* Attendance */}
            <View className="flex-1 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <Text className="text-xs text-gray-600 dark:text-gray-400">Attendance</Text>
              <View className="flex-row items-center mt-0.5">
                <Ionicons name="checkmark-circle" size={18} color="#16a34a" />
                <Text className="text-xl font-bold text-green-600 dark:text-green-400 ml-1">
                  {child.attendance}%
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

