import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TeachersBasicDetails {
  totalTeachers: number;
  totalSubjects: number;
  activeClasses: number;
}

export function TeacherStats({ stats }: { stats: TeachersBasicDetails }) {
  return (
    <View className="gap-3">
      {/* Main Stats Row */}
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                <Ionicons name="people-outline" size={20} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Total Teachers</Text>
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{stats.totalTeachers}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Ionicons name="checkmark-circle-outline" size={20} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Active</Text>
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{stats.activeTeachers}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Gender Distribution */}
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                <Ionicons name="male-outline" size={18} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Male</Text>
                <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.maleTeachers}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                <Ionicons name="female-outline" size={18} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Female</Text>
                <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.femaleTeachers}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default TeacherStats;
