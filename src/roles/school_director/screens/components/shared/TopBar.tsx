import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from './Avatar';
import { IconButton } from './buttons/IconButton';
import { capitalize } from './utils';

export function TopBar({ name, email, schoolId, avatarUri }: { name: string; email: string; schoolId?: string; avatarUri?: string }) {
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Avatar name={name} uri={avatarUri} />
          <View>
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {schoolId ? `School ID: ${schoolId}` : 'School ID: —'}
            </Text>
            <Text className="text-xl font-extrabold text-gray-900 dark:text-gray-100">
              {`Welcome, ${capitalize(name)}`}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">{email}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <IconButton icon="notifications-outline" accessibilityLabel="Notifications" />
          <IconButton icon="person-circle-outline" accessibilityLabel="Profile" />
        </View>
      </View>
      <View className="mt-4">
        <View className="flex-row items-center rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-3 py-2">
          <Ionicons name="search-outline" size={18} color="#6b7280" />
          <TextInput
            placeholder="Search teachers, students, classes…"
            placeholderTextColor="#9ca3af"
            className="ml-2 flex-1 text-gray-800 dark:text-gray-200"
          />
          <TouchableOpacity activeOpacity={0.8} className="rounded-xl bg-blue-600 px-3 py-2">
            <Text className="text-white text-xs font-semibold">Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default TopBar;


