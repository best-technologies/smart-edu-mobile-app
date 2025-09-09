import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  name?: string;
  email?: string;
  displayPicture?: string | null;
  classInfo?: {
    name: string;
    teacher: string;
  };
  academicSession?: {
    year: string;
    term: string;
  };
  onNotificationPress?: () => void;
}

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

export default function TopBar({ 
  name = 'Student', 
  email = 'student@school.edu',
  displayPicture = null,
  classInfo,
  academicSession,
  onNotificationPress 
}: TopBarProps) {
  const { logout } = useAuth();

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Get initials from name
  const getInitials = (fullName: string) => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase();
    }
    return fullName.charAt(0).toUpperCase();
  };

  return (
    <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          {/* Avatar */}
          <View className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
            {displayPicture ? (
              <Image 
                source={{ uri: displayPicture }} 
                className="h-12 w-12 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Image 
                source={require('../../../../../../assets/splash.png')} 
                className="h-12 w-12 rounded-full"
                resizeMode="cover"
              />
            )}
          </View>
          
          {/* User Info */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Welcome back, {name}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {email}
            </Text>
            
            {/* Class and Academic Info */}
            {classInfo && (
              <View className="flex-row items-center gap-2 mt-1">
                <View className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {classInfo.name}
                  </Text>
                </View>
                {academicSession && (
                  <View className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                      {academicSession.year} • {formatTerm(academicSession.term)}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {/* Class Teacher Info */}
            {classInfo && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="person-outline" size={12} color="#6B7280" />
                <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  Class Teacher: {classInfo.teacher}
                </Text>
              </View>
            )}
            
            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {formattedDate}
            </Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row items-center gap-3">
          {/* Notifications with badge */}
          <TouchableOpacity
            onPress={onNotificationPress}
            activeOpacity={0.7}
            className="relative"
            accessibilityLabel="Notifications"
          >
            <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <Ionicons name="notifications-outline" size={20} color="#6B7280" />
            </View>
            <View className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-xs text-white font-bold">2</Text>
            </View>
          </TouchableOpacity>
          
          {/* Logout */}
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
