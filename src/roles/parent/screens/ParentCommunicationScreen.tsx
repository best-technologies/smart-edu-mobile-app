import { ScrollView, View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { TopBar } from '../components/shared';
import { MessageCard } from '../components/communication';
import { mockCommunications, getUnreadCommunicationsCount } from '../mock/parentMockData';

export default function ParentCommunicationScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMessagePress = (message: any) => {
    // Navigate to message detail screen or mark as read
    console.log('Message pressed:', message);
  };

  // Filter messages based on selected filter
  const filteredMessages = mockCommunications.filter(msg => {
    if (filter === 'unread') return !msg.read;
    if (filter === 'high') return msg.priority === 'high';
    return true;
  });

  const unreadCount = getUnreadCommunicationsCount();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />

      {/* Filter Tabs */}
      <View className="bg-white dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all'
                ? 'bg-indigo-600 dark:bg-indigo-500'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                filter === 'all'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              All ({mockCommunications.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg flex-row items-center ${
              filter === 'unread'
                ? 'bg-indigo-600 dark:bg-indigo-500'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                filter === 'unread'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Unread ({unreadCount})
            </Text>
            {unreadCount > 0 && filter !== 'unread' && (
              <View className="ml-1 w-2 h-2 rounded-full bg-red-500" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('high')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'high'
                ? 'bg-indigo-600 dark:bg-indigo-500'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                filter === 'high'
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              Priority
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="p-6">
          {filteredMessages.length > 0 ? (
            <>
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {filter === 'all' && 'All Messages'}
                  {filter === 'unread' && 'Unread Messages'}
                  {filter === 'high' && 'Priority Messages'}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
                </Text>
              </View>

              {filteredMessages.map((message) => (
                <MessageCard key={message.id} message={message} onPress={handleMessagePress} />
              ))}
            </>
          ) : (
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-12 items-center justify-center border border-gray-200 dark:border-gray-700">
              <Ionicons name="mail-open-outline" size={64} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                No messages
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                {filter === 'unread' && "You're all caught up!"}
                {filter === 'high' && 'No priority messages at the moment'}
                {filter === 'all' && 'No messages to display'}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}

