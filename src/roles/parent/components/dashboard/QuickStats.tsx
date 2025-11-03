import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mockChildren, getUnreadCommunicationsCount } from '../../mock/parentMockData';

export default function QuickStats() {
  const totalChildren = mockChildren.length;
  const unreadMessages = getUnreadCommunicationsCount();
  
  // Calculate average attendance
  const avgAttendance = Math.round(
    mockChildren.reduce((sum, child) => sum + child.attendance, 0) / totalChildren
  );

  // Count children by status
  const excellentCount = mockChildren.filter(c => c.status === 'excellent').length;

  return (
    <View>
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Quick Overview
      </Text>
      
      <View className="flex-row space-x-3">
        <View className="flex-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
          <Ionicons name="people" size={24} color="#4338ca" />
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {totalChildren}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">Children</Text>
        </View>
        
        <View className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
          <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {avgAttendance}%
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">Avg Attendance</Text>
        </View>
      </View>

      <View className="flex-row space-x-3 mt-3">
        <View className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
          <Ionicons name="mail" size={24} color="#2563eb" />
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {unreadMessages}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">Unread</Text>
        </View>
        
        <View className="flex-1 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-800">
          <Ionicons name="trophy" size={24} color="#d97706" />
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {excellentCount}
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">Excellent</Text>
        </View>
      </View>
    </View>
  );
}

