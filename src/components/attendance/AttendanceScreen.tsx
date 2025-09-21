import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserRole } from '../quicklinks/QuickLinks';

interface Student {
  id: string;
  name: string;
  displayPicture?: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female';
  isPresent: boolean;
}

interface Class {
  id: string;
  name: string;
  code: string;
  students: Student[];
}

export default function AttendanceScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { role } = route.params as { role: UserRole };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});

  // Mock data
  const currentSession = '2024-2025';
  const currentTerm = 'Term 1';
  
  const classes: Class[] = [
    {
      id: '1',
      name: 'Grade 10A',
      code: 'G10A',
      students: [
        {
          id: '1',
          name: 'John Doe',
          displayPicture: 'https://via.placeholder.com/40',
          email: 'john.doe@school.com',
          phone: '+1234567890',
          gender: 'Male',
          isPresent: false,
        },
        {
          id: '2',
          name: 'Jane Smith',
          displayPicture: 'https://via.placeholder.com/40',
          email: 'jane.smith@school.com',
          phone: '+1234567891',
          gender: 'Female',
          isPresent: false,
        },
        {
          id: '3',
          name: 'Mike Johnson',
          displayPicture: 'https://via.placeholder.com/40',
          email: 'mike.johnson@school.com',
          phone: '+1234567892',
          gender: 'Male',
          isPresent: false,
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          displayPicture: 'https://via.placeholder.com/40',
          email: 'sarah.wilson@school.com',
          phone: '+1234567893',
          gender: 'Female',
          isPresent: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Grade 10B',
      code: 'G10B',
      students: [
        {
          id: '5',
          name: 'Alex Brown',
          displayPicture: 'https://via.placeholder.com/40',
          email: 'alex.brown@school.com',
          phone: '+1234567894',
          gender: 'Male',
          isPresent: false,
        },
        {
          id: '6',
          name: 'Emma Davis',
          displayPicture: 'https://via.placeholder.com/40',
          email: 'emma.davis@school.com',
          phone: '+1234567895',
          gender: 'Female',
          isPresent: false,
        },
      ],
    },
  ];

  // Auto-select first class
  React.useEffect(() => {
    if (classes.length > 0 && !selectedClass) {
      setSelectedClass(classes[0].id);
    }
  }, [classes, selectedClass]);

  const selectedClassData = classes.find(cls => cls.id === selectedClass);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date > today;
  };

  const canSelectDate = (date: Date) => {
    return !isWeekend(date) && !isFutureDate(date);
  };

  const handleStudentToggle = (studentId: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const handleSubmitAttendance = () => {
    const presentCount = Object.values(attendanceData).filter(Boolean).length;
    const totalCount = selectedClassData?.students.length || 0;
    
    Alert.alert(
      'Submit Attendance',
      `Mark ${presentCount} out of ${totalCount} students as present?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: () => console.log('Attendance submitted') },
      ]
    );
  };

  const renderStudentRow = ({ item }: { item: Student }) => (
    <View className="flex-row items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700">
      <View className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center mr-3">
        {item.displayPicture ? (
          <Image
            source={{ uri: item.displayPicture }}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <Ionicons name="person" size={20} color="#6B7280" />
        )}
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {item.email}
        </Text>
        <Text className="text-xs text-gray-400 dark:text-gray-500">
          {item.phone} • {item.gender}
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={() => handleStudentToggle(item.id)}
        className={`w-6 h-6 rounded border-2 items-center justify-center ${
          attendanceData[item.id]
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        {attendanceData[item.id] && (
          <Ionicons name="checkmark" size={16} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Attendance
          </Text>
          <View className="w-10" />
        </View>

        {/* Session Info */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {currentSession} • {currentTerm}
            </Text>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {formatDate(selectedDate)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCalendar(true)}
            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 items-center justify-center"
          >
            <Ionicons name="calendar" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {/* Class Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-3">
            {classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                onPress={() => setSelectedClass(cls.id)}
                className={`px-4 py-2 rounded-lg border ${
                  selectedClass === cls.id
                    ? 'bg-blue-500 border-blue-500'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedClass === cls.id
                      ? 'text-white'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {cls.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Submit Button - Only visible for director and teacher */}
        {(role === 'director' || role === 'teacher') && (
          <TouchableOpacity
            onPress={handleSubmitAttendance}
            className="bg-green-500 px-6 py-3 rounded-lg flex-row items-center justify-center"
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Submit Attendance</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Students List */}
      {selectedClassData && (
        <View className="flex-1">
          <View className="bg-white dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Students ({selectedClassData.students.length})
            </Text>
          </View>
          
          <FlatList
            data={selectedClassData.students}
            renderItem={renderStudentRow}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-end">
          <View className="bg-white dark:bg-gray-800 w-full rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row flex-wrap gap-3">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const isSelected = selectedDate.toDateString() === date.toDateString();
                const canSelect = canSelectDate(date);
                
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (canSelect) {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }
                    }}
                    disabled={!canSelect}
                    className={`w-12 h-12 rounded-lg items-center justify-center ${
                      isSelected
                        ? 'bg-blue-500'
                        : canSelect
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'bg-gray-50 dark:bg-gray-800 opacity-50'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isSelected
                          ? 'text-white'
                          : canSelect
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-400'
                      }`}
                    >
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
