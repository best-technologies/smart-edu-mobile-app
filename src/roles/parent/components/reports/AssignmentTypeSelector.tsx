import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AssignmentType } from '../../mock/assignmentMockData';

interface AssignmentTypeSelectorProps {
  selectedType: AssignmentType;
  onSelectType: (type: AssignmentType) => void;
}

const assignmentTypes: { type: AssignmentType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'assignment', label: 'Assignments', icon: 'document-text' },
  { type: 'classwork', label: 'Classwork', icon: 'create' },
  { type: 'ca_test', label: 'CA Tests', icon: 'clipboard' },
  { type: 'exam', label: 'Exams', icon: 'school' },
];

export default function AssignmentTypeSelector({
  selectedType,
  onSelectType,
}: AssignmentTypeSelectorProps) {
  return (
    <View className="mb-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerClassName="gap-2"
      >
        {assignmentTypes.map(({ type, label, icon }) => {
          const isSelected = type === selectedType;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => onSelectType(type)}
              className={`flex-row items-center px-4 py-3 rounded-xl ${
                isSelected
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-600'
                  : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
              }`}
              activeOpacity={0.7}
            >
              <Ionicons
                name={icon}
                size={18}
                color={isSelected ? '#4f46e5' : '#6b7280'}
              />
              <Text
                className={`ml-2 text-sm font-semibold ${
                  isSelected
                    ? 'text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

