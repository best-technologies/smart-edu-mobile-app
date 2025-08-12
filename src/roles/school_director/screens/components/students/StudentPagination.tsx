import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudentsPagination } from '@/mock';

export function StudentPagination({ pagination, onPageChange }: { 
  pagination: StudentsPagination; 
  onPageChange: (page: number) => void;
}) {
  const { current_page, total_pages, total_results, results_per_page } = pagination;
  const hasNext = current_page < total_pages;
  const hasPrev = current_page > 1;

  return (
    <View className="flex-row items-center justify-between mt-6">
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        Showing {((current_page - 1) * results_per_page) + 1} - {Math.min(current_page * results_per_page, total_results)} of {total_results} students
      </Text>
      
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => onPageChange(current_page - 1)}
          disabled={!hasPrev}
          activeOpacity={0.7}
          className={`h-8 w-8 items-center justify-center rounded-lg ${
            hasPrev 
              ? 'bg-blue-600' 
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <Ionicons 
            name="chevron-back" 
            size={16} 
            color={hasPrev ? '#ffffff' : '#9ca3af'} 
          />
        </TouchableOpacity>

        <Text className="text-sm text-gray-700 dark:text-gray-300 px-3">
          {current_page} / {total_pages}
        </Text>

        <TouchableOpacity
          onPress={() => onPageChange(current_page + 1)}
          disabled={!hasNext}
          activeOpacity={0.7}
          className={`h-8 w-8 items-center justify-center rounded-lg ${
            hasNext 
              ? 'bg-blue-600' 
              : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={hasNext ? '#ffffff' : '#9ca3af'} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default StudentPagination;
