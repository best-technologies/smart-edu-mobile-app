import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Child } from '../../mock/parentMockData';

interface StudentSelectorProps {
  students: Child[];
  selectedStudentId: string;
  onSelectStudent: (studentId: string) => void;
}

export default function StudentSelector({
  students,
  selectedStudentId,
  onSelectStudent,
}: StudentSelectorProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-1">
        Select Child
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerClassName="gap-3"
      >
        {students.map((student) => {
          const isSelected = student.id === selectedStudentId;
          return (
            <TouchableOpacity
              key={student.id}
              onPress={() => onSelectStudent(student.id)}
              className={`flex-row items-center px-4 py-3 rounded-xl border ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
              activeOpacity={0.7}
            >
              {/* Avatar */}
              <View
                className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  isSelected ? 'bg-white/20' : 'bg-indigo-600'
                }`}
              >
                <Text
                  className={`text-base font-bold ${
                    isSelected ? 'text-white' : 'text-white'
                  }`}
                >
                  {student.firstName[0]}{student.lastName[0]}
                </Text>
              </View>

              {/* Info */}
              <View>
                <Text
                  className={`text-sm font-semibold ${
                    isSelected
                      ? 'text-white'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {student.firstName} {student.lastName}
                </Text>
                <Text
                  className={`text-xs ${
                    isSelected
                      ? 'text-white/80'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {student.grade}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

