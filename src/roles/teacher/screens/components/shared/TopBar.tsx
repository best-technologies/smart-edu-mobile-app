import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatTeacherName } from '@/utils/textFormatter';

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

export function TopBar() {
  const { logout } = useAuth();
  const { userProfile, isLoading } = useUserProfile();
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  // Get the teacher's first name from profile, fallback to "Professor" if loading or not available
  const teacherName = userProfile?.first_name || (isLoading ? '...' : 'Professor');
  
  // Check if user is a school director to show academic session info
  const isSchoolDirector = userProfile?.role === 'school_director';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
            <Text className="text-white font-bold text-sm">
              {userProfile ? `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}` : 'JD'}
            </Text>
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Welcome back, {formatTeacherName(teacherName)}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {userProfile?.email || 'Loading...'}
            </Text>
            {isSchoolDirector && userProfile?.current_academic_session && (
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
          <TouchableOpacity 
            activeOpacity={0.7}
            className="relative"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Ionicons name="notifications-outline" size={20} color="#6B7280" />
            </View>
            <View className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-xs text-white font-bold">3</Text>
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
    </View>
  );
}

export default TopBar;
