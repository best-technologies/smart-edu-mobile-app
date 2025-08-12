import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export function ClassTabs({ 
  classes, 
  selectedClass, 
  onClassChange 
}: { 
  classes: string[];
  selectedClass: string;
  onClassChange: (classId: string) => void;
}) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      className="mb-4"
      contentContainerClassName="px-4"
    >
      <View className="flex-row gap-2">
        {classes.map((className) => (
          <TouchableOpacity
            key={className}
            onPress={() => onClassChange(className)}
            activeOpacity={0.7}
            className={`px-4 py-2 rounded-lg border ${
              selectedClass === className
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedClass === className
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {className.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

export default ClassTabs;
