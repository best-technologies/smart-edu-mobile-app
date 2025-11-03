import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getUnreadCommunicationsCount } from '../../mock/parentMockData';

// Helper function to format term name
const formatTerm = (term: string) => {
  switch (term?.toLowerCase()) {
    case 'first':
      return '1st Term';
    case 'second':
      return '2nd Term';
    case 'third':
      return '3rd Term';
    default:
      return term || 'N/A';
  }
};

export default function TopBar() {
  const { user, logout } = useAuth();
  const { userProfile } = useUserProfile();
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const unreadCount = getUnreadCommunicationsCount();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          {/* Avatar - Can be replaced with actual image when available */}
          {user?.display_picture ? (
            <Image
              source={{ uri: user.display_picture }}
              className="h-10 w-10 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="h-10 w-10 rounded-full bg-indigo-600 items-center justify-center">
              <Text className="text-lg font-bold text-white">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </Text>
            </View>
          )}
          
          <View className="flex-1 max-w-[220px]">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100" numberOfLines={1} ellipsizeMode="tail">
              Welcome back, {user?.first_name}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400" numberOfLines={1} ellipsizeMode="tail">
              {truncateText(user?.email || 'parent@example.com', 25)}
            </Text>
            {userProfile?.current_academic_session && (
              <View className="flex-row items-center gap-2 mt-1">
                <View className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {userProfile.current_academic_session}
                  </Text>
                </View>
                <View className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                  <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                    {formatTerm(userProfile.current_term || '')}
                  </Text>
                </View>
              </View>
            )}
            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {formattedDate}
            </Text>
          </View>
        </View>
        
        <View className="flex-row items-center gap-3">
          {/* Notification Icon */}
          <TouchableOpacity 
            activeOpacity={0.7}
            className="relative"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Ionicons name="notifications-outline" size={20} color="#6B7280" />
            </View>
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-xs text-white font-bold">{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            className="p-2 rounded-full bg-red-50 dark:bg-red-900/20"
            accessibilityLabel="Logout"
          >
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

