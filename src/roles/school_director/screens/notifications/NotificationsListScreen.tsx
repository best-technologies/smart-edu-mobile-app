import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { NotificationCard, Notification, CreateNotificationModal } from '../../components/notifications';
import { useNotifications } from '@/hooks/useNotifications';
import { CenteredLoader } from '@/components';

export default function NotificationsListScreen() {
  const navigation = useNavigation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const {
    notifications,
    stats,
    pagination,
    selectedFilter,
    isLoading,
    isCreating,
    error,
    createNotification,
    changeFilter,
    loadMore,
    refresh,
  } = useNotifications();

  const handleNotificationPress = (notification: Notification) => {
    (navigation as any).navigate('NotificationDetail', { notification });
  };

  const handleCreateNotification = async (newNotification: {
    title: string;
    description: string;
    type: string;
    comingUpOn: string;
  }) => {
    try {
      await createNotification(newNotification);
      setShowCreateModal(false);
    } catch (error) {
      // Error is already handled by the hook
    }
  };

  const filterOptions = [
    { 
      value: 'all', 
      label: 'All', 
      icon: 'apps-outline',
      count: stats.all
    },
    { 
      value: 'teachers', 
      label: 'Teachers', 
      icon: 'school-outline',
      count: stats.teachers
    },
    { 
      value: 'students', 
      label: 'Students', 
      icon: 'people-outline',
      count: stats.students
    },
    { 
      value: 'school_director', 
      label: 'Directors', 
      icon: 'business-outline',
      count: stats.school_director
    },
  ];

  // Show loading state
  if (isLoading && notifications.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <CenteredLoader visible={true} text="Loading notifications..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* <TopBar 
        name="Director"
        email="director@school.edu"
        onNotificationPress={undefined}
      /> */}
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-6 py-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Notifications
            </Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center gap-2"
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text className="text-white font-semibold">Create</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Filter Tabs */}
        <View className="mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            <View className="flex-row gap-2">
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => changeFilter(option.value)}
                  className={`flex-row items-center px-4 py-2 rounded-xl border ${
                    selectedFilter === option.value
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={16}
                    color={selectedFilter === option.value ? '#ffffff' : '#6B7280'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    className={`text-sm font-medium ${
                      selectedFilter === option.value
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.label}
                  </Text>
                  {option.count > 0 && (
                    <View
                      className={`ml-2 px-2 py-1 rounded-full ${
                        selectedFilter === option.value
                          ? 'bg-white/20'
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <Text
                        className={`text-xs font-bold ${
                          selectedFilter === option.value
                            ? 'text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {option.count}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Notifications List */}
        <View className="space-y-3">
          {notifications.map((notification: Notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={handleNotificationPress}
              variant="list"
            />
          ))}
        </View>

        {/* Empty State */}
        {notifications.length === 0 && (
          <View className="flex-1 items-center justify-center py-12">
            <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
              {selectedFilter === 'all' ? 'No Notifications' : `No ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Notifications`}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
              {selectedFilter === 'all' 
                ? "You're all caught up! No notifications at the moment."
                : `No notifications for ${selectedFilter} at the moment.`
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Create Notification Modal */}
      <CreateNotificationModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateNotification}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setShowCreateModal(true)}
        className="absolute bottom-6 right-6 h-14 w-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
