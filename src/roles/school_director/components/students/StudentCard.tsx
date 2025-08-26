import { Image, Text, TouchableOpacity, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Student } from '@/services/api/directorService';
import { useState } from 'react';

interface StudentCardProps {
  student: Student;
  onEditStudent?: (student: Student) => void;
  onViewProfile?: (student: Student) => void;
}

export function StudentCard({ student, onEditStudent, onViewProfile }: StudentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const initials = `${student.first_name.charAt(0).toUpperCase()}${student.last_name.charAt(0).toUpperCase()}`;
  const fullName = `${student.first_name} ${student.last_name}`;
  
  const getPerformanceColor = (value: number) => {
    if (value >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (value >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceIcon = (value: number) => {
    if (value >= 80) return 'trending-up';
    if (value >= 60) return 'remove';
    return 'trending-down';
  };

  return (
    <TouchableOpacity activeOpacity={0.8} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <View className="flex-row items-start gap-3">
        {/* Avatar */}
        <View className="relative">
          {student.display_picture ? (
            <Image source={{ uri: student.display_picture }} className="h-14 w-14 rounded-full" />
          ) : (
            <View className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 items-center justify-center">
              <Text className="text-white font-bold text-lg">{initials}</Text>
            </View>
          )}
          <View className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white dark:border-black ${
            student.status === 'active' ? 'bg-emerald-500' : 
            student.status === 'inactive' ? 'bg-gray-400' : 'bg-red-500'
          }`} />
        </View>

        {/* Student Info */}
        <View className="flex-1 min-w-0">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100" numberOfLines={1}>{fullName}</Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 font-mono" numberOfLines={1}>{student.student_id}</Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${
              student.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
              student.status === 'inactive' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300' :
              'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
            }`}>
              <Text className="text-xs font-semibold capitalize">{student.status}</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View className="mt-2 space-y-1">
            <View className="flex-row items-center gap-1">
              <Ionicons name="mail-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300 flex-1" numberOfLines={1}>{student.email}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="call-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300 flex-1" numberOfLines={1}>{student.phone_number}</Text>
            </View>
          </View>

          {/* Class Info */}
          <View className="flex-row items-center gap-4 mt-2">
            <View className="flex-row items-center gap-1">
              <Ionicons name="school-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                {student.current_class === 'Not Enrolled' ? 'Not Enrolled' : `Class ${student.current_class}`}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-600 dark:text-gray-300">
                {student.next_class === 'No classes' ? 'No upcoming classes' : student.next_class}
              </Text>
            </View>
          </View>

          {/* Performance Metrics */}
          <View className="mt-3 space-y-2">
            <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">Performance:</Text>
            <View className="flex-row flex-wrap gap-3">
              <View className="flex-row items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                <Ionicons name="analytics-outline" size={12} color="#6b7280" />
                <Text className="text-xs text-gray-500 dark:text-gray-400">CGPA:</Text>
                <Text className={`text-xs font-bold ${getPerformanceColor(student.performance.cgpa)}`}>
                  {student.performance.cgpa > 0 ? student.performance.cgpa.toFixed(1) : 'N/A'}
                </Text>
              </View>
              
              <View className="flex-row items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                <Ionicons name="trending-up-outline" size={12} color="#6b7280" />
                <Text className="text-xs text-gray-500 dark:text-gray-400">Avg:</Text>
                <Text className={`text-xs font-bold ${getPerformanceColor(student.performance.term_average)}`}>
                  {student.performance.term_average > 0 ? `${student.performance.term_average.toFixed(1)}%` : 'N/A'}
                </Text>
              </View>
              
              <View className="flex-row items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                <Ionicons name="checkmark-circle-outline" size={12} color="#6b7280" />
                <Text className="text-xs text-gray-500 dark:text-gray-400">Att:</Text>
                <Text className={`text-xs font-bold ${getPerformanceColor(student.performance.attendance_rate)}`}>
                  {student.performance.attendance_rate > 0 ? `${student.performance.attendance_rate.toFixed(1)}%` : 'N/A'}
                </Text>
              </View>
              
              <View className="flex-row items-center gap-1 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-lg">
                <Ionicons name="trophy-outline" size={12} color="#6b7280" />
                <Text className="text-xs text-gray-500 dark:text-gray-400">Pos:</Text>
                <Text className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  {student.performance.position > 0 ? `${student.performance.position}${getOrdinalSuffix(student.performance.position)}` : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View className="relative ml-2">
          <TouchableOpacity 
            activeOpacity={0.7} 
            className="h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"
            onPress={() => setShowMenu(!showMenu)}
          >
            <Ionicons name="ellipsis-vertical" size={16} color="#6b7280" />
          </TouchableOpacity>
          
          {showMenu && (
            <>
              {/* Overlay to close menu when clicking outside */}
              <Pressable
                style={{
                  position: 'absolute',
                  top: -1000,
                  left: -1000,
                  right: -1000,
                  bottom: -1000,
                  zIndex: 10,
                }}
                onPress={() => setShowMenu(false)}
              />
              
              {/* Dropdown Menu */}
              <View 
                className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 min-w-40"
                style={{
                  top: 40,
                  right: 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    onEditStudent?.(student);
                  }}
                  className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700"
                >
                  <Ionicons name="pencil" size={16} color="#6b7280" />
                  <Text className="text-gray-700 dark:text-gray-300 ml-3">Edit Student</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {
                    setShowMenu(false);
                    onViewProfile?.(student);
                  }}
                  className="flex-row items-center px-4 py-3"
                >
                  <Ionicons name="person" size={16} color="#6b7280" />
                  <Text className="text-gray-700 dark:text-gray-300 ml-3">View Profile</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function getOrdinalSuffix(num: number): string {
  if (num >= 11 && num <= 13) return 'th';
  switch (num % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export default StudentCard;
