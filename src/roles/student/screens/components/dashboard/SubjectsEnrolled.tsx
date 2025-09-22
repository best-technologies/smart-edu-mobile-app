import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  teacher?: {
    id: string;
    name: string;
    display_picture: any;
  } | null;
}

interface SubjectsEnrolledProps {
  subjects?: Subject[];
  totalSubjects?: number;
}

export default function SubjectsEnrolled({ subjects, totalSubjects }: SubjectsEnrolledProps) {
  const subjectList = subjects ?? [];
  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Subjects Enrolled
          </Text>
          {totalSubjects && (
            <View className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                {totalSubjects} Total
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => console.log('View All Subjects')}
        >
          <Text className="text-sm text-blue-600 dark:text-blue-400 mr-1">View All</Text>
          <Ionicons name="chevron-forward" size={16} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-1"
      >
        {subjectList.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            activeOpacity={0.8}
            onPress={() => console.log('Subject clicked:', subject.name)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 min-w-[160px]"
          >
            {/* Subject Color Indicator */}
            <View 
              className="w-full h-2 rounded-full mb-3"
              style={{ backgroundColor: subject.color }}
            />
            
            {/* Subject Code */}
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              {subject.code}
            </Text>
            
            {/* Subject Name */}
            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {subject.name}
            </Text>
            
            {/* Teacher Info */}
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-600 dark:text-gray-300 ml-1 flex-1" numberOfLines={1}>
                {subject.teacher?.name ?? 'Unknown teacher'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
