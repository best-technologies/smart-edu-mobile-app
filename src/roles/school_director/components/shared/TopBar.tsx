import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from './Avatar';
import { IconButton } from './buttons/IconButton';
import { capitalize } from './utils';
import { useUserProfileContext } from '@/contexts/UserProfileContext';
import { useAuth } from '@/contexts/AuthContext';

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

export function TopBar({ 
  name, 
  email, 
  schoolId, 
  avatarUri,
  onNotificationPress 
}: { 
  name: string; 
  email: string; 
  schoolId?: string; 
  avatarUri?: string;
  onNotificationPress?: () => void;
}) {
  const navigation = useNavigation();
  const { userProfile, isLoading } = useUserProfileContext();
  const { logout } = useAuth();
  
  // Use profile data if available, otherwise fall back to props
  const displayName = userProfile ? `${userProfile.first_name}` : name;
  const displayEmail = userProfile?.email || email;
  const displaySchoolId = userProfile?.school_id || schoolId;
  const displayAvatar = userProfile?.display_picture || avatarUri;
  const schoolName = userProfile?.school?.name;
  
  // Check if user is a school director to show academic session info
  const isSchoolDirector = userProfile?.role === 'school_director';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleProfilePress = () => {
    (navigation as any).navigate('DirectorProfile');
  };

  return (
    <View className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-sm border border-gray-200 dark:border-gray-700">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Avatar name={displayName} uri={displayAvatar} onPress={handleProfilePress} />
          <View>
            <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {/* {displaySchoolId ? `School ID: ${displaySchoolId}` : 'School ID: —'} */}
            </Text>
            <Text className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              {`Welcome, ${capitalize(displayName)}`}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</Text>
            {schoolName && (
              <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {schoolName}
              </Text>
            )}
            {isSchoolDirector && userProfile?.current_academic_session && (
              <View className="flex-row items-center gap-2 mt-2">
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
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={onNotificationPress}
            activeOpacity={0.7}
            className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 relative"
            accessibilityLabel="Notifications"
          >
            <Ionicons name="notifications-outline" size={20} color="#3b82f6" />
            {/* Notification Badge */}
            <View className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </TouchableOpacity>
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
      <View className="mt-4">
        <View className="flex-row items-center rounded-2xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-3">
          <Ionicons name="search-outline" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search teachers, students, classes…"
            placeholderTextColor="#9ca3af"
            className="ml-2 flex-1 text-gray-800 dark:text-gray-200"
          />
          <TouchableOpacity activeOpacity={0.8} className="rounded-xl bg-blue-600 px-4 py-2 shadow-sm">
            <Text className="text-white text-xs font-semibold">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default TopBar;


