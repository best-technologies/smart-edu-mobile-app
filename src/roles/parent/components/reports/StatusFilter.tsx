import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AssignmentStatus } from '../../mock/assignmentMockData';

interface StatusFilterProps {
  selectedStatus: 'all' | AssignmentStatus;
  onSelectStatus: (status: 'all' | AssignmentStatus) => void;
  counts: {
    all: number;
    graded: number;
    pending_submission: number;
    pending_grading: number;
  };
}

const statusOptions: { value: 'all' | AssignmentStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'graded', label: 'Graded' },
  { value: 'pending_submission', label: 'Pending Submission' },
  { value: 'pending_grading', label: 'Pending Grading' },
];

export default function StatusFilter({
  selectedStatus,
  onSelectStatus,
  counts,
}: StatusFilterProps) {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerClassName="gap-2"
      >
        {statusOptions.map(({ value, label }) => {
          const isSelected = value === selectedStatus;
          const count = counts[value as keyof typeof counts] || 0;
          
          return (
            <TouchableOpacity
              key={value}
              onPress={() => onSelectStatus(value)}
              className={`px-4 py-2 rounded-full flex-row items-center ${
                isSelected
                  ? 'bg-indigo-600'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-semibold ${
                  isSelected
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {label}
              </Text>
              <View
                className={`ml-2 px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-white/20'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

