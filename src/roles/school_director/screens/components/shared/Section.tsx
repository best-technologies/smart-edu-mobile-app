import { Text, View } from 'react-native';
import React from 'react';

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mt-8">
      <View className="flex-row items-center gap-3 mb-4">
        <View className="h-1 w-8 bg-blue-600 rounded-full" />
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          {title}
        </Text>
      </View>
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        {children}
      </View>
    </View>
  );
}

export default Section;


