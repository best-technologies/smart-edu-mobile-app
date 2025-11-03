import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { TopBar } from '../components/shared';
import { ChildCard } from '../components/children';
import { mockChildren } from '../mock/parentMockData';

export default function ParentChildrenScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleChildPress = (child: any) => {
    // Navigate to child detail screen
    console.log('Child pressed:', child);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="p-6">
          <View className="mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              My Children ({mockChildren.length})
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View detailed information about each child
            </Text>
          </View>

          {mockChildren.map((child) => (
            <ChildCard key={child.id} child={child} onPress={handleChildPress} />
          ))}
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}

