import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StudentTabStudent } from '@/services/types/apiTypes';

interface StudentCardNewProps {
  student: StudentTabStudent;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function StudentCardNew({ student, isSelected = false, onSelect }: StudentCardNewProps) {
  const initials = student.name.split(' ').map(n => n.charAt(0).toUpperCase()).join('').slice(0, 2);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'inactive': return 'bg-gray-400';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
      case 'suspended': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onSelect}
      className={`rounded-2xl border-2 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black'
      } p-4`}
    >
      <View className="flex-row items-start gap-3">
        {/* Selection Checkbox */}
        <TouchableOpacity 
          onPress={onSelect}
          className={`h-6 w-6 rounded-md border-2 items-center justify-center mt-1 ${
            isSelected 
              ? 'border-blue-500 bg-blue-500' 
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          {isSelected && (
            <Ionicons name="checkmark" size={14} color="white" />
          )}
        </TouchableOpacity>

        {/* Avatar */}
        <View className="relative">
          {student.display_picture?.secure_url ? (
            <Image source={{ uri: student.display_picture.secure_url }} className="h-14 w-14 rounded-full" />
          ) : (
            <View className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 items-center justify-center">
              <Text className="text-white font-bold text-lg">{initials}</Text>
            </View>
          )}
          <View className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-black ${getStatusColor(student.status)}`} />
        </View>

        {/* Student Info */}
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center justify-between mb-1">
            <View className="flex-1 min-w-0">
              <Text className="text-base font-bold text-gray-900 dark:text-gray-100" numberOfLines={1}>{student.name}</Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 font-mono" numberOfLines={1}>{student.student_id}</Text>
            </View>
            <View className={`px-2 py-1 rounded-full ml-2 ${getStatusTextColor(student.status)}`}>
              <Text className="text-xs font-semibold capitalize">{student.status}</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View className="mt-2">
            <View className="flex-row items-center gap-1 mb-1">
              <Ionicons name="mail-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300 flex-1" numberOfLines={1}>
                {student.email}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="person-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300 flex-1" numberOfLines={1}>
                {student.gender}
              </Text>
            </View>
          </View>

          {/* Class Info */}
          <View className="mt-2">
            <View className="flex-row items-center gap-1 mb-1">
              <Ionicons name="school-outline" size={14} color="#6b7280" />
              <Text className="text-sm font-semibold text-blue-600 dark:text-blue-400">{student.class.name}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="id-card-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300 flex-1" numberOfLines={1}>
                ID: {student.user_id}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-col gap-1">
          <TouchableOpacity 
            activeOpacity={0.7} 
            className="h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40"
            onPress={() => console.log('Message student:', student.id)}
          >
            <Ionicons name="chatbubble-outline" size={14} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity 
            activeOpacity={0.7} 
            className="h-7 w-7 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
            onPress={() => console.log('View student details:', student.id)}
          >
            <Ionicons name="ellipsis-vertical" size={14} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default StudentCardNew;
