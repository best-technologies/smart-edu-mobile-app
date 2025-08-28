import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { NotificationCard, Notification, CreateNotificationModal } from '../../components/notifications';

export default function NotificationsListScreen() {
  const navigation = useNavigation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'mock-1',
      title: 'Staff Meeting',
      description: 'Monthly staff meeting scheduled for tomorrow at 10:00 AM in the conference room.',
      type: 'all',
      comingUpOn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      title: 'Board Meeting',
      description: 'Quarterly board meeting to discuss school performance and upcoming initiatives.',
      type: 'directors',
      comingUpOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-3',
      title: 'Parent-Teacher Conference',
      description: 'Annual parent-teacher conference scheduled for next month.',
      type: 'all',
      comingUpOn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-4',
      title: 'School Holiday',
      description: 'School will be closed for the upcoming holiday break.',
      type: 'all',
      comingUpOn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-5',
      title: 'Budget Review',
      description: 'Monthly budget review meeting with the finance committee.',
      type: 'directors',
      comingUpOn: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-6',
      title: 'New Teacher Orientation',
      description: 'Orientation session for newly hired teachers next week.',
      type: 'directors',
      comingUpOn: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);

  const handleNotificationPress = (notification: Notification) => {
    (navigation as any).navigate('NotificationDetail', { notification });
  };

  const handleCreateNotification = (newNotification: {
    title: string;
    description: string;
    type: string;
    comingUpOn: string;
  }) => {
    const notification: Notification = {
      id: `new-${Date.now()}`,
      title: newNotification.title,
      description: newNotification.description,
      type: newNotification.type,
      comingUpOn: newNotification.comingUpOn,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotifications(prev => [notification, ...prev]);
    setShowCreateModal(false);
    Alert.alert('Success', 'Notification created successfully!');
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    return notification.type === selectedFilter;
  });

  const filterOptions = [
    { 
      value: 'all', 
      label: 'All', 
      icon: 'apps-outline',
      count: notifications.length
    },
    { 
      value: 'teachers', 
      label: 'Teachers', 
      icon: 'school-outline',
      count: notifications.filter(n => n.type === 'teachers').length
    },
    { 
      value: 'students', 
      label: 'Students', 
      icon: 'people-outline',
      count: notifications.filter(n => n.type === 'students').length
    },
    { 
      value: 'directors', 
      label: 'Directors', 
      icon: 'business-outline',
      count: notifications.filter(n => n.type === 'directors').length
    },
  ];

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
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
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
                  onPress={() => setSelectedFilter(option.value)}
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
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={handleNotificationPress}
              variant="list"
            />
          ))}
        </View>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
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
