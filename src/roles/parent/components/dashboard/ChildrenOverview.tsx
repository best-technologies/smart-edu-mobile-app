import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockChildren, Child } from '../../mock/parentMockData';

interface ChildrenOverviewProps {
  onViewAll?: () => void;
}

export default function ChildrenOverview({ onViewAll }: ChildrenOverviewProps) {
  const getStatusColor = (status: Child['status']) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'good':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'average':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'needs-attention':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
    if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          My Children
        </Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-indigo-600 dark:text-indigo-400 font-medium">
              View All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="space-y-3">
        {mockChildren.map((child) => (
          <TouchableOpacity
            key={child.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
            activeOpacity={0.7}
          >
              <View className="flex-row items-start justify-between">
              <View className="flex-row items-start flex-1">
                {/* Avatar */}
                <View className="w-12 h-12 rounded-full bg-indigo-600 items-center justify-center mr-3 shadow-sm">
                  <Text className="text-lg font-bold text-white">
                    {child.firstName[0]}{child.lastName[0]}
                  </Text>
                </View>

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {child.firstName} {child.lastName}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {child.grade} • {child.class}
                  </Text>
                  
                  {/* Stats */}
                  <View className="flex-row items-center mt-2 space-x-4">
                    <View className="flex-row items-center">
                      <Ionicons name="school" size={14} color="#6b7280" />
                      <Text className={`text-sm font-semibold ml-1 ${getGradeColor(child.overallGrade)}`}>
                        {child.overallGrade}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="checkmark-circle" size={14} color="#6b7280" />
                      <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {child.attendance}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Status Badge */}
              <View className={`px-2 py-1 rounded-full ${getStatusColor(child.status)}`}>
                <Text className="text-xs font-semibold capitalize">
                  {child.status.replace('-', ' ')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

