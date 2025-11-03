import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AcademicReport } from '../../mock/parentMockData';

interface ReportCardProps {
  report: AcademicReport;
  onPress?: (report: AcademicReport) => void;
}

export default function ReportCard({ report, onPress }: ReportCardProps) {
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return { bg: '#10b98120', text: '#10b981', border: '#10b98140' };
    if (grade.startsWith('B')) return { bg: '#3b82f620', text: '#3b82f6', border: '#3b82f640' };
    if (grade.startsWith('C')) return { bg: '#f59e0b20', text: '#f59e0b', border: '#f59e0b40' };
    return { bg: '#ef444420', text: '#ef4444', border: '#ef444440' };
  };

  const colors = getGradeColor(report.grade);

  return (
    <TouchableOpacity
      onPress={() => onPress?.(report)}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700"
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {report.subject}
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {report.childName}
          </Text>
        </View>
        
        {/* Grade Badge */}
        <View 
          className="px-4 py-2 rounded-lg border"
          style={{ backgroundColor: colors.bg, borderColor: colors.border }}
        >
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            {report.grade}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-xs text-gray-600 dark:text-gray-400">Score</Text>
          <Text className="text-xs font-semibold text-gray-900 dark:text-gray-100">
            {report.percentage}%
          </Text>
        </View>
        <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <View 
            className="h-full rounded-full"
            style={{ 
              width: `${report.percentage}%`,
              backgroundColor: colors.text
            }}
          />
        </View>
      </View>

      {/* Details */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Ionicons name="person-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {report.teacher}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {report.term}
          </Text>
        </View>
      </View>

      {report.comment && (
        <View className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-xs text-gray-600 dark:text-gray-400 italic">
            "{report.comment}"
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

