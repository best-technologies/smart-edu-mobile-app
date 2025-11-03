import { ScrollView, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { TopBar } from '../components/shared';
import { QuickStats, ChildrenOverview, RecentActivity, UpcomingEvents } from '../components/dashboard';

export default function ParentDashboardScreen() {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleViewAllChildren = () => {
    navigation.navigate('Children');
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
        {/* Content Container */}
        <View className="p-6">
          {/* Quick Stats */}
          <QuickStats />

          {/* Children Overview */}
          <ChildrenOverview onViewAll={handleViewAllChildren} />

          {/* Upcoming Events */}
          <UpcomingEvents />

          {/* Recent Activity */}
          <RecentActivity />
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}

