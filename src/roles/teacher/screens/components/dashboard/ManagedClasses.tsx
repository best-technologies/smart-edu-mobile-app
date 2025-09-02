import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { capitalizeWords } from '@/utils/textFormatter';

interface ManagedClass {
  id: string;
  name: string;
  students: {
    total: number;
    males: number;
    females: number;
  };
}

interface ManagedClassesProps {
  classes: ManagedClass[];
}

export function ManagedClasses({ classes }: ManagedClassesProps) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Managed Classes
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerClassName="gap-3"
      >
        {classes.map((classItem) => (
          <TouchableOpacity
            key={classItem.id}
            activeOpacity={0.7}
            className="min-w-[200px] px-4 py-3 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800"
          >
            <View className="flex-row items-center gap-3 mb-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Ionicons name="school-outline" size={20} color="#3B82F6" />
              </View>
              <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {capitalizeWords(classItem.name)}
              </Text>
            </View>
            
            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Total Students</Text>
                <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {classItem.students.total}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Male</Text>
                <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {classItem.students.males}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">Female</Text>
                <Text className="text-sm font-semibold text-pink-600 dark:text-pink-400">
                  {classItem.students.females}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default ManagedClasses;
