import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Teacher } from '@/mock';

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  const initials = teacher.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase?.())
    .join('') || 'T';

  return (
    <TouchableOpacity activeOpacity={0.8} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <View className="flex-row items-start gap-3">
        {/* Avatar */}
        <View className="relative">
          {teacher.display_picture ? (
            <Image source={{ uri: teacher.display_picture }} className="h-14 w-14 rounded-full" />
          ) : (
            <View className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
              <Text className="text-white font-bold text-lg">{initials}</Text>
            </View>
          )}
          <View className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-black ${
            teacher.status === 'active' ? 'bg-emerald-500' : 
            teacher.status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
          }`} />
        </View>

        {/* Teacher Info */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{teacher.name}</Text>
            <View className={`px-2 py-1 rounded-full ${
              teacher.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
              teacher.status === 'inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300' :
              'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}>
              <Text className="text-xs font-semibold capitalize">{teacher.status}</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View className="flex-row items-center gap-4 mt-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="mail-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">{teacher.contact.email}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="call-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">{teacher.contact.phone}</Text>
            </View>
          </View>

          {/* Subjects and Class Teacher */}
          <View className="flex-row items-center gap-4 mt-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="book-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">{teacher.totalSubjects} subjects</Text>
            </View>
            {teacher.classTeacher !== 'None' && (
              <View className="flex-row items-center gap-1">
                <Ionicons name="school-outline" size={14} color="#6b7280" />
                <Text className="text-sm text-gray-600 dark:text-gray-300">Class {teacher.classTeacher}</Text>
              </View>
            )}
          </View>

          {/* Next Class */}
          {teacher.nextClass && (
            <View className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={16} color="#3b82f6" />
                  <Text className="text-sm font-semibold text-blue-700 dark:text-blue-300">Next Class</Text>
                </View>
                <Text className="text-sm text-blue-600 dark:text-blue-400">
                  {teacher.nextClass.startTime} - {teacher.nextClass.endTime}
                </Text>
              </View>
              <Text className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {teacher.nextClass.className} • {teacher.nextClass.subject.replace('_', ' ')}
              </Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity activeOpacity={0.7} className="h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <Ionicons name="ellipsis-vertical" size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default TeacherCard;
