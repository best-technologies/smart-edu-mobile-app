import React, { useState, useEffect } from 'react';
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
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { UserRole } from '../quicklinks/QuickLinks';
import { useAttendanceSession } from '@/hooks/useAttendanceSession';
import { useClassStudents } from '@/hooks/useClassStudents';
import { useAttendanceForDate } from '@/hooks/useAttendanceForDate';
import { useSubmitAttendance } from '@/hooks/useSubmitAttendance';
import { useUpdateAttendance } from '@/hooks/useUpdateAttendance';
import { useToast } from '@/contexts/ToastContext';
import CenteredLoader from '../CenteredLoader';

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
  const [showSessionDropdown, setShowSessionDropdown] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, boolean>>({});
  const [originalAttendanceData, setOriginalAttendanceData] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [hasShownSuccessToast, setHasShownSuccessToast] = useState(false);

  // Fetch session details and classes
  const { 
    data: sessionData, 
    isLoading, 
    error, 
    refetch 
  } = useAttendanceSession();

  // Fetch students for selected class
  const { 
    data: studentsData, 
    isLoading: isLoadingStudents, 
    error: studentsError,
    refetch: refetchStudents 
  } = useClassStudents({ 
    classId: selectedClass, 
    enabled: !!selectedClass 
  });

  // Submit attendance mutation
  const submitAttendanceMutation = useSubmitAttendance();
  const updateAttendanceMutation = useUpdateAttendance();
  
  // Toast notifications
  const { showSuccess, showError } = useToast();

  // Get attendance for selected date
  const { 
    data: attendanceForDate, 
    isLoading: isLoadingAttendance,
    refetch: refetchAttendance 
  } = useAttendanceForDate(selectedClass, selectedDate.toISOString().split('T')[0], !!selectedClass);

  // Handle submission success/error
  useEffect(() => {
    if (submitAttendanceMutation.isSuccess && submitAttendanceMutation.data?.success && !hasShownSuccessToast) {
      setHasShownSuccessToast(true);
      showSuccess(
        'Attendance Submitted Successfully!',
        'Attendance has been successfully submitted!',
        4000,
        () => {
          // Update original attendance data to current state for future change detection
          setOriginalAttendanceData({ ...attendanceData });
          setIsAllSelected(false);
          // Refresh both attendance data and students data to get updated info from DB
          refetchAttendance();
          refetchStudents();
        }
      );
    } else if (submitAttendanceMutation.isSuccess && !submitAttendanceMutation.data?.success) {
      showError(
        'Submission Failed',
        submitAttendanceMutation.data?.message || 'Failed to submit attendance. Please try again.',
        5000
      );
    }
  }, [submitAttendanceMutation.isSuccess, submitAttendanceMutation.data?.success, submitAttendanceMutation.data?.message, hasShownSuccessToast]);

  // Handle update success/error
  useEffect(() => {
    if (updateAttendanceMutation.isSuccess && updateAttendanceMutation.data?.success && !hasShownSuccessToast) {
      setHasShownSuccessToast(true);
      showSuccess(
        'Attendance Updated Successfully!',
        'Attendance has been successfully updated!',
        4000,
        () => {
          // Update original attendance data to current state for future change detection
          setOriginalAttendanceData({ ...attendanceData });
          setIsAllSelected(false);
          // Refresh both attendance data and students data to get updated info from DB
          refetchAttendance();
          refetchStudents();
        }
      );
    } else if (updateAttendanceMutation.isSuccess && !updateAttendanceMutation.data?.success) {
      showError(
        'Update Failed',
        updateAttendanceMutation.data?.message || 'Failed to update attendance. Please try again.',
        5000
      );
    }
  }, [updateAttendanceMutation.isSuccess, updateAttendanceMutation.data?.success, updateAttendanceMutation.data?.message, hasShownSuccessToast]);

  useEffect(() => {
    if (submitAttendanceMutation.isError) {
      showError(
        'Network Error',
        'Failed to submit attendance. Please check your connection and try again.',
        5000
      );
    }
  }, [submitAttendanceMutation.isError]);

  useEffect(() => {
    if (updateAttendanceMutation.isError) {
      showError(
        'Network Error',
        'Failed to update attendance. Please check your connection and try again.',
        5000
      );
    }
  }, [updateAttendanceMutation.isError]);

  // Auto-select first class and current session
  React.useEffect(() => {
    if (sessionData?.classes_managing && sessionData.classes_managing.length > 0 && !selectedClass) {
      setSelectedClass(sessionData.classes_managing[0].id);
    }
    if (sessionData?.academic_sessions && sessionData.academic_sessions.length > 0 && !selectedSession) {
      const current = sessionData.academic_sessions.find((session: any) => session.is_current);
      if (current) {
        setSelectedSession(current.academic_year + ' - ' + current.term);
      } else {
        setSelectedSession(sessionData.academic_sessions[0].academic_year + ' - ' + sessionData.academic_sessions[0].term);
      }
    }
  }, [sessionData, selectedClass, selectedSession]);

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
    setAttendanceData(prev => {
      const newData = {
        ...prev,
        [studentId]: !prev[studentId],
      };
      return newData;
    });
  };

  const handleSelectAll = () => {
    if (!studentsData?.students) return;
    
    if (isAllSelected) {
      // Deselect all
      setAttendanceData({});
      setIsAllSelected(false);
    } else {
      // Select all
      const allSelected: Record<string, boolean> = {};
      studentsData.students.forEach((student: any) => {
        const studentId = student.student_id || student.id;
        allSelected[studentId] = true;
      });
      setAttendanceData(allSelected);
      setIsAllSelected(true);
    }
  };

  // Update select all state when individual students are toggled
  useEffect(() => {
    if (!studentsData?.students) {
      setIsAllSelected(false);
      return;
    }

    const totalStudents = studentsData.students.length;
    const selectedCount = Object.values(attendanceData).filter(Boolean).length;
    
    if (selectedCount === 0) {
      setIsAllSelected(false);
    } else if (selectedCount === totalStudents) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [attendanceData, studentsData?.students]);

  // Load existing attendance data when available
  useEffect(() => {
    if (attendanceForDate?.data?.attendance_records && studentsData?.students) {
      const existingAttendance: Record<string, boolean> = {};
      
      // The attendance records already contain frontend student IDs in record.student_id
      // We can directly use them without mapping
      attendanceForDate.data.attendance_records.forEach((record: any) => {
        // record.student_id is already the frontend student ID (e.g., "STU0001")
        existingAttendance[record.student_id] = record.is_present;
      });
      
      setAttendanceData(existingAttendance);
      setOriginalAttendanceData({ ...existingAttendance }); // Store original state for comparison
    } else if (attendanceForDate?.data && !attendanceForDate.data.is_marked) {
      // No attendance marked for this date, clear data
      setAttendanceData({});
      setOriginalAttendanceData({});
      setIsAllSelected(false);
    }
  }, [attendanceForDate, studentsData?.students]);

  // All calculations and early returns must come after ALL hooks
  const currentSession = sessionData?.academic_sessions?.find((session: any) => session.is_current);
  const classes = sessionData?.classes_managing || [];
  const academicSessions = sessionData?.academic_sessions || [];
  const selectedSessionData = academicSessions.find((session: any) => 
    selectedSession === session.academic_year + ' - ' + session.term
  );
  const selectedClassData = classes.find((cls: any) => cls.id === selectedClass);


  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <CenteredLoader visible={true} text="Loading attendance data..." />
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Error loading attendance
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            {error.message || 'Unable to load attendance data. Please try again.'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmitAttendance = () => {
    if (!selectedClass || !studentsData?.students) {
      return;
    }
    
    const presentCount = Object.values(attendanceData).filter(Boolean).length;
    const totalCount = studentsData.students.length;
    const isAlreadyMarked = attendanceForDate?.data?.is_marked;
    
    if (isAlreadyMarked) {
      // For updates, only send changed students
      const changedStudents = studentsData.students.filter((student: any) => {
        const studentId = student.student_id;
        const currentStatus = attendanceData[studentId];
        const originalStatus = originalAttendanceData[studentId];
        return currentStatus !== originalStatus;
      });
      
      if (changedStudents.length === 0) {
        // No changes made, don't submit
        return;
      }
      
      // Prepare update payload with only changed students
      const attendanceRecords = changedStudents.map((student: any) => ({
        student_id: student.id, // Use backend student ID for API
        status: attendanceData[student.student_id] ? 'PRESENT' : 'ABSENT' as 'PRESENT' | 'ABSENT',
      }));
      
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const payload = {
        class_id: selectedClass,
        date: formattedDate,
        attendance_records: attendanceRecords,
        notes: `Updated attendance for ${changedStudents.length} student(s) on ${selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`
      };
      
      console.log('=== UPDATE ATTENDANCE PAYLOAD ===');
      console.log('Changed students count:', changedStudents.length);
      console.log('Changed students:', changedStudents.map(s => ({ name: s.name, student_id: s.student_id, id: s.id })));
      console.log('Full update payload:', JSON.stringify(payload, null, 2));
      console.log('=== END UPDATE ATTENDANCE PAYLOAD ===');
      
      // Reset success toast flag
      setHasShownSuccessToast(false);
      
      // Don't show toast for updates, let the button loading state handle it
      
      // Submit update
      updateAttendanceMutation.mutate(payload);
    } else {
      // Initial submission - send all students
      const attendanceRecords = studentsData.students.map((student: any) => ({
        student_id: student.id, // Use backend student ID for API
        status: attendanceData[student.student_id] ? 'PRESENT' : 'ABSENT' as 'PRESENT' | 'ABSENT',
      }));

      const formattedDate = selectedDate.toISOString().split('T')[0];

      const payload = {
        class_id: selectedClass,
        date: formattedDate,
        session_type: 'DAILY',
        attendance_records: attendanceRecords,
        notes: `Marked attendance for ${selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}`
      };
      
      console.log('=== SUBMIT ATTENDANCE PAYLOAD ===');
      console.log('Full submit payload:', JSON.stringify(payload, null, 2));
      console.log('=== END SUBMIT ATTENDANCE PAYLOAD ===');

      // Reset success toast flag
      setHasShownSuccessToast(false);

      // Show confirmation toast
      showSuccess(
        'Submitting Attendance',
        `Submitting attendance for ${presentCount} out of ${totalCount} students...`,
        2000
      );

      // Submit attendance
      submitAttendanceMutation.mutate(payload);
    }
  };

  // Check if there are any changes made to attendance
  const hasChanges = () => {
    if (!attendanceForDate?.data?.is_marked) {
      // For new attendance, check if any students are marked
      return Object.keys(attendanceData).length > 0;
    }
    
    // For existing attendance, check if any changes were made
    return studentsData?.students?.some((student: any) => {
      const studentId = student.student_id;
      const currentStatus = attendanceData[studentId];
      const originalStatus = originalAttendanceData[studentId];
      return currentStatus !== originalStatus;
    }) || false;
  };

  // Check if submit button should be enabled
  const canSubmitAttendance = () => {
    // Must have a selected class
    if (!selectedClass) return false;
    
    // Must have students in the class
    if (!studentsData?.students || studentsData.students.length === 0) return false;
    
    // Must have changes to submit
    return hasChanges();
  };

  // Handle pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetch(),
        selectedClass ? refetchStudents() : Promise.resolve()
      ]);
    } catch (error) {
      console.error('Error refreshing attendance data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderStudentRow = ({ item }: { item: any }) => {
    // Use student_id for matching with attendance data
    const studentId = item.student_id || item.id;
    return (
      <View className="flex-row items-center py-3 px-4 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          onPress={() => {
            // Navigate to student attendance history
            (navigation as any).navigate('StudentAttendanceHistory', {
              student: {
                id: item.id,
                name: item.name,
                displayPicture: item.display_picture,
                email: item.email,
                phone: item.phone,
                gender: item.gender,
                student_id: item.student_id,
                class_name: selectedClassData?.name || 'Unknown Class',
                class_id: selectedClass,
              },
              role: role,
            });
          }}
          className="flex-1 flex-row items-center"
          activeOpacity={0.7}
        >
          <View className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center mr-3">
            {item.display_picture ? (
              <Image
                source={{ uri: item.display_picture }}
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
              {item.phone} • {item.gender} • {item.student_id}
            </Text>
          </View>
          
          <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleStudentToggle(studentId)}
          className={`w-6 h-6 rounded border-2 items-center justify-center ml-3 ${
            attendanceData[studentId]
              ? 'bg-green-500 border-green-500'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
          }`}
          activeOpacity={0.7}
          style={{
            backgroundColor: attendanceData[studentId] ? '#10B981' : undefined,
            borderColor: attendanceData[studentId] ? '#10B981' : undefined,
          }}
        >
          {attendanceData[studentId] && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header - Fixed */}
      <View className="bg-white dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={18} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Attendance
          </Text>
          {/* Submit Button - Top Right */}
          {(role === 'director' || role === 'teacher') && (
            <TouchableOpacity
              onPress={handleSubmitAttendance}
              disabled={!canSubmitAttendance() || submitAttendanceMutation.isPending || updateAttendanceMutation.isPending}
              className={`px-3 py-1.5 rounded-lg flex-row items-center ${
                canSubmitAttendance() && !submitAttendanceMutation.isPending && !updateAttendanceMutation.isPending
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              {(submitAttendanceMutation.isPending || updateAttendanceMutation.isPending) ? (
                <Ionicons
                  name="hourglass"
                  size={14}
                  color="#9CA3AF"
                />
              ) : (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={canSubmitAttendance() ? "white" : "#9CA3AF"}
                />
              )}
              <Text className={`font-semibold ml-1 text-xs ${
                canSubmitAttendance() && !submitAttendanceMutation.isPending && !updateAttendanceMutation.isPending ? 'text-white' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {(submitAttendanceMutation.isPending || updateAttendanceMutation.isPending) 
                  ? (submitAttendanceMutation.isPending ? 'Submitting...' : 'Updating...')
                  : attendanceForDate?.data?.is_marked 
                    ? (hasChanges() ? 'Update' : 'Submitted')
                    : 'Submit'
                }
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Session Info - Compact */}
        <View className="mb-3">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Session & Date
              </Text>
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={() => setShowSessionDropdown(true)}
                  className="flex-1 flex-row items-center justify-between bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5"
                >
                  <Text className="text-xs text-gray-900 dark:text-gray-100 font-medium">
                    {selectedSession || 'Select Session'}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowCalendar(true)}
                  className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 items-center justify-center"
                >
                  <Ionicons name="calendar" size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatDate(selectedDate)}
            </Text>
            {attendanceForDate?.data?.is_marked && (
              <View className="flex-row items-center bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                <Text className="text-xs font-medium text-green-800 dark:text-green-200 ml-1">
                  Marked
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Class Selection - Compact */}
        {classes.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            <View className="flex-row gap-2">
              {classes.map((cls: any) => (
                <TouchableOpacity
                  key={cls.id}
                  onPress={() => setSelectedClass(cls.id)}
                  className={`px-3 py-1.5 rounded-lg border ${
                    selectedClass === cls.id
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
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
        ) : (
          <View className="mb-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <Text className="text-yellow-800 dark:text-yellow-200 text-center text-sm">
              No classes assigned to you
            </Text>
          </View>
        )}

        {/* Submit Button - Only visible for director and teacher */}
      </View>

      {/* Students List */}
      {selectedClassData ? (
        <View className="flex-1">
          {/* Class Statistics - Compact */}
          <View className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            {/* Main Stats Row - Compact */}
            <View className="flex-row justify-between mb-2">
              <View className="flex-1 items-center">
                <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {attendanceForDate?.data?.total_students || studentsData?.pagination?.total || selectedClassData.total_students || 0}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Total
                </Text>
              </View>
              
              <View className="flex-1 items-center">
                <Text className="text-xl font-bold text-green-600 dark:text-green-400">
                  {attendanceForDate?.data?.present_count ?? Object.values(attendanceData).filter(Boolean).length}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Present
                </Text>
              </View>
              
              <View className="flex-1 items-center">
                <Text className="text-xl font-bold text-orange-600 dark:text-orange-400">
                  {attendanceForDate?.data?.absent_count ?? 
                    ((attendanceForDate?.data?.total_students || studentsData?.pagination?.total || selectedClassData.total_students || 0) - 
                     (attendanceForDate?.data?.present_count ?? Object.values(attendanceData).filter(Boolean).length))
                  }
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  Absent
                </Text>
              </View>
              
              {/* Gender Stats - Inline */}
              {studentsData?.students && studentsData.students.length > 0 && (
                <>
                  <View className="flex-1 items-center">
                    <Text className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {studentsData.students.filter((student: any) => student.gender === 'male').length}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Male
                    </Text>
                  </View>
                  
                  <View className="flex-1 items-center">
                    <Text className="text-lg font-semibold text-pink-600 dark:text-pink-400">
                      {studentsData.students.filter((student: any) => student.gender === 'female').length}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      Female
                    </Text>
                  </View>
                </>
              )}
            </View>
            
            {/* Progress Bar - Compact */}
            {(() => {
              const totalStudents = attendanceForDate?.data?.total_students || studentsData?.pagination?.total || 0;
              const presentCount = attendanceForDate?.data?.present_count ?? Object.values(attendanceData).filter(Boolean).length;
              const attendanceRate = attendanceForDate?.data?.attendance_rate ?? (totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0);
              
              return totalStudents > 0 && (
                <View className="mt-2">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Progress
                    </Text>
                    <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {attendanceRate}%
                    </Text>
                  </View>
                  <View className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <View 
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{
                        width: `${attendanceRate}%`
                      }}
                    />
                  </View>
                </View>
              );
            })()}
          </View>

          {/* Select All Header */}
          {studentsData?.students && studentsData.students.length > 0 && (role === 'director' || role === 'teacher') && (
            <View className="bg-white dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <TouchableOpacity
                onPress={handleSelectAll}
                className="flex-row items-center justify-between"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={handleSelectAll}
                    className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
                      isAllSelected
                        ? 'bg-green-500 border-green-500'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    }`}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: isAllSelected ? '#10B981' : undefined,
                      borderColor: isAllSelected ? '#10B981' : undefined,
                    }}
                  >
                    {isAllSelected && (
                      <Ionicons name="checkmark" size={16} color="white" />
                    )}
                  </TouchableOpacity>
                  <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    Select All Students
                  </Text>
                </View>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {Object.values(attendanceData).filter(Boolean).length} / {studentsData.students.length}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {isLoadingStudents ? (
            <View className="flex-1 items-center justify-center p-6">
              <CenteredLoader visible={true} text="Loading students..." />
            </View>
          ) : studentsError ? (
            <View className="flex-1 items-center justify-center p-6">
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                Error Loading Students
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                {studentsError.message || 'Unable to load students. Please try again.'}
              </Text>
              <TouchableOpacity
                onPress={() => refetchStudents()}
                className="bg-blue-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : studentsData?.students && studentsData.students.length > 0 ? (
            <FlatList
              data={studentsData.students}
              renderItem={renderStudentRow}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              extraData={attendanceData}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor="#3b82f6"
                  colors={["#3b82f6"]}
                  progressBackgroundColor="#ffffff"
                />
              }
            />
          ) : (
            <View className="flex-1 items-center justify-center p-6">
              <Ionicons name="people-outline" size={48} color="#9CA3AF" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
                No Students Found
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                This class doesn't have any students assigned
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="school-outline" size={48} color="#9CA3AF" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4 mb-2">
            Select a Class
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Choose a class from the list above to view students
          </Text>
        </View>
      )}

      {/* Session Dropdown Modal */}
      <Modal
        visible={showSessionDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSessionDropdown(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-end">
          <View className="bg-white dark:bg-gray-800 w-full rounded-t-3xl p-6">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select Academic Session
              </Text>
              <TouchableOpacity
                onPress={() => setShowSessionDropdown(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <ScrollView className="max-h-80">
              {academicSessions.map((session: any, index: number) => {
                const sessionLabel = `${session.academic_year} - ${session.term}`;
                const isSelected = selectedSession === sessionLabel;
                const isCurrent = session.is_current;
                
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedSession(sessionLabel);
                      setShowSessionDropdown(false);
                    }}
                    className={`p-4 rounded-lg mb-2 border ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-1">
                        <Text className={`font-medium ${
                          isSelected
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {sessionLabel}
                        </Text>
                        <Text className={`text-sm ${
                          isSelected
                            ? 'text-blue-600 dark:text-blue-300'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {session.term_start_date} - {session.term_end_date}
                        </Text>
                      </View>
                      {isCurrent && (
                        <View className="bg-green-100 dark:bg-green-900/40 px-2 py-1 rounded-full">
                          <Text className="text-green-700 dark:text-green-300 text-xs font-medium">
                            Current
                          </Text>
                        </View>
                      )}
                      {isSelected && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={20} 
                          color={isSelected ? '#3B82F6' : '#9CA3AF'} 
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
