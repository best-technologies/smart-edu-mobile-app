import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ScheduleClass } from '@/services/api/directorService';

interface ClassSelectorProps {
  classes: Array<{ classId: string; name: string }>;
  selectedClassId: string | null;
  onClassSelect: (classId: string) => void;
  isLoading?: boolean;
}

export function ClassSelector({ 
  classes, 
  selectedClassId, 
  onClassSelect,
  isLoading = false
}: ClassSelectorProps) {
  const formatClassName = (name: string) => {
    return name.toUpperCase().replace('JSS', 'JSS ').replace('SS', 'SS ');
  };

  const groupClassesByType = (classes: Array<{ classId: string; name: string }>) => {
    const pryClasses = classes.filter(c => c.name.toLowerCase().startsWith('pry')).sort((a, b) => a.name.localeCompare(b.name));
    const jssClasses = classes.filter(c => c.name.toLowerCase().startsWith('jss')).sort((a, b) => a.name.localeCompare(b.name));
    const ssClasses = classes.filter(c => c.name.toLowerCase().startsWith('ss')).sort((a, b) => a.name.localeCompare(b.name));
    
    return { pryClasses, jssClasses, ssClasses };
  };

  if (isLoading) {
    return (
      <View className="mb-3">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Class:
        </Text>
        <View className="space-y-1">
          {[1, 2, 3].map((row) => (
            <View key={row} className="flex-row">
              {[1, 2, 3, 4].map((item) => (
                <View
                  key={item}
                  className="mr-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                >
                  <View className="w-10 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (classes.length === 0) {
    return (
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Class:
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          No classes available
        </Text>
      </View>
    );
  }

  const { pryClasses, jssClasses, ssClasses } = groupClassesByType(classes);

  const renderClassRow = (classList: Array<{ classId: string; name: string }>, title: string) => {
    if (classList.length === 0) return null;

    return (
      <View className="mb-2">
        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
          {title}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          className="flex-row"
        >
          {classList.map((classItem) => (
            <TouchableOpacity
              key={classItem.classId}
              onPress={() => onClassSelect(classItem.classId)}
              activeOpacity={0.7}
              className={`mr-2 px-3 py-1.5 rounded-full border ${
                selectedClassId === classItem.classId
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <Text className={`text-xs font-medium ${
                selectedClassId === classItem.classId
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}>
                {formatClassName(classItem.name)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View className="mb-3">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Select Class:
      </Text>
      <View className="space-y-0.5">
        {renderClassRow(pryClasses, 'Primary')}
        {renderClassRow(jssClasses, 'Junior Secondary')}
        {renderClassRow(ssClasses, 'Senior Secondary')}
      </View>
    </View>
  );
}

export default ClassSelector;
