import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pagination } from '@/services/api/directorService';

export function SubjectPagination({ pagination, onPageChange }: { 
  pagination: Pagination; 
  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  return (
    <View className="flex-row items-center justify-between mt-6">
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        Page {page} of {totalPages}
      </Text>
      
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() => onPageChange(page - 1)}
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

        <TouchableOpacity
          onPress={() => onPageChange(page + 1)}
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

export default SubjectPagination;
