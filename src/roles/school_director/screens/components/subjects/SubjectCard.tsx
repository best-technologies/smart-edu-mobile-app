import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Subject } from '@/mock';

export function SubjectCard({ subject }: { subject: Subject }) {
  const formatSubjectName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <TouchableOpacity activeOpacity={0.8} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <View className="flex-row items-start gap-3">
        {/* Subject Icon with Color */}
        <View 
          className="h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${subject.color}20` }}
        >
          <Ionicons 
            name="book-outline" 
            size={24} 
            color={subject.color} 
          />
        </View>

        {/* Subject Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatSubjectName(subject.name)}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {subject.code}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} className="h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
              <Ionicons name="ellipsis-vertical" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            {subject.description}
          </Text>

          {/* Class Info */}
          <View className="flex-row items-center gap-4 mt-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="school-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                Class {subject.class.name}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="people-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                {subject.teachers.length} teacher{subject.teachers.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* Teachers List */}
          {subject.teachers.length > 0 && (
            <View className="mt-3">
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-2">Assigned Teachers:</Text>
              <View className="gap-1">
                {subject.teachers.map((teacher, index) => (
                  <View key={teacher.id} className="flex-row items-center gap-2">
                    <View className="h-2 w-2 rounded-full" style={{ backgroundColor: subject.color }} />
                    <Text className="text-sm text-gray-700 dark:text-gray-300">
                      {teacher.name}
                    </Text>
                    {index < subject.teachers.length - 1 && (
                      <Text className="text-gray-400">•</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default SubjectCard;
