import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
}

interface SubjectsTeachingProps {
  subjects: Subject[];
}

export function SubjectsTeaching({ subjects }: SubjectsTeachingProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Subjects Teaching
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerClassName="gap-3"
      >
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject.id}
            activeOpacity={0.7}
            className="min-w-[180px] px-4 py-3 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800"
          >
            <View className="flex-row items-center gap-3 mb-3">
              <View 
                className="h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: `${subject.color}15` }}
              >
                <Ionicons name="book-outline" size={20} color={subject.color} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {subject.name}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {subject.code}
                </Text>
              </View>
            </View>
            
            <Text className="text-xs text-gray-500 dark:text-gray-400 leading-4">
              {subject.description}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default SubjectsTeaching;
