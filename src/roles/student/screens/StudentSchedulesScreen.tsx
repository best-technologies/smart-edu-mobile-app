import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from './components/shared/TopBar';
import StudentTimetableGrid from './components/schedules/StudentTimetableGrid';
import { mockStudentDashboardData } from '@/mock/student';

interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
  order: number;
}

interface ScheduleSubject {
  id: string;
  name: string;
  code: string;
  color: string;
}

interface ScheduleTeacher {
  id: string;
  name: string;
}

interface ScheduleItem {
  timeSlotId: string;
  startTime: string;
  endTime: string;
  label: string;
  subject: ScheduleSubject | null;
  teacher: ScheduleTeacher | null;
  room: string | null;
}

export default function StudentSchedulesScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [schedule, setSchedule] = useState<{
    MONDAY: ScheduleItem[];
    TUESDAY: ScheduleItem[];
    WEDNESDAY: ScheduleItem[];
    THURSDAY: ScheduleItem[];
    FRIDAY: ScheduleItem[];
  }>({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: []
  });

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await fetchScheduleData();
    } catch (error) {
      console.error('Error refreshing schedule data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Fetch schedule data on component mount
  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = useCallback(async () => {
    try {
      // Transform mock data from student dashboard to match timetable format
      const classSchedule = mockStudentDashboardData.data.class_schedule;
      const subjectsEnrolled = mockStudentDashboardData.data.subjects_enrolled;
      
      // Create time slots from the schedule data
      const allTimeSlots = new Set<string>();
      const allSchedules = [
        ...classSchedule.today.schedule,
        ...classSchedule.tomorrow.schedule,
        ...classSchedule.day_after_tomorrow.schedule
      ];
      
      allSchedules.forEach(item => {
        allTimeSlots.add(`${item.time.from}-${item.time.to}-${item.time.label}`);
      });

      const formattedTimeSlots: TimeSlot[] = Array.from(allTimeSlots).map((timeSlot, index) => {
        const [startTime, endTime, label] = timeSlot.split('-');
        return {
          id: `timeslot-${index + 1}`,
          label: label,
          startTime: startTime,
          endTime: endTime,
          order: index + 1
        };
      });

      // Create schedule data for each day
      const createScheduleForDay = (daySchedule: any[]) => {
        return daySchedule.map((item, index) => {
          const subject = subjectsEnrolled.find(sub => sub.name === item.subject.name);
          return {
            timeSlotId: `timeslot-${index + 1}`,
            startTime: item.time.from,
            endTime: item.time.to,
            label: item.time.label,
            subject: subject ? {
              id: subject.id,
              name: subject.name,
              code: subject.code,
              color: subject.color
            } : null,
            teacher: {
              id: item.teacher.id,
              name: item.teacher.name
            },
            room: item.room
          };
        });
      };

      // Fill in empty periods for days with fewer classes
      const fillEmptyPeriods = (daySchedule: ScheduleItem[], totalPeriods: number) => {
        const filledSchedule = [...daySchedule];
        for (let i = daySchedule.length; i < totalPeriods; i++) {
          filledSchedule.push({
            timeSlotId: `timeslot-${i + 1}`,
            startTime: formattedTimeSlots[i]?.startTime || '00:00',
            endTime: formattedTimeSlots[i]?.endTime || '00:00',
            label: formattedTimeSlots[i]?.label || 'Period',
            subject: null,
            teacher: null,
            room: null
          });
        }
        return filledSchedule;
      };

      const mondaySchedule = createScheduleForDay(classSchedule.today.schedule);
      const tuesdaySchedule = createScheduleForDay(classSchedule.tomorrow.schedule);
      const wednesdaySchedule = createScheduleForDay(classSchedule.day_after_tomorrow.schedule);
      
      // Fill empty periods for Thursday and Friday (no data in mock)
      const thursdaySchedule = fillEmptyPeriods([], formattedTimeSlots.length);
      const fridaySchedule = fillEmptyPeriods([], formattedTimeSlots.length);

      setTimeSlots(formattedTimeSlots);
      setSchedule({
        MONDAY: mondaySchedule,
        TUESDAY: tuesdaySchedule,
        WEDNESDAY: wednesdaySchedule,
        THURSDAY: thursdaySchedule,
        FRIDAY: fridaySchedule
      });

    } catch (error) {
      console.error('Error fetching schedule data:', error);
    }
  }, []);

  const studentClass = mockStudentDashboardData.data.general_info.student_class.name;
  const hasSchedule = timeSlots.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar 
        name={mockStudentDashboardData.data.general_info.student.name}
        email={mockStudentDashboardData.data.general_info.student.email}
        displayPicture={mockStudentDashboardData.data.general_info.student.display_picture}
        classInfo={{
          name: mockStudentDashboardData.data.general_info.student_class.name,
          teacher: mockStudentDashboardData.data.general_info.class_teacher.name
        }}
        academicSession={{
          year: mockStudentDashboardData.data.general_info.current_session.academic_year,
          term: mockStudentDashboardData.data.general_info.current_session.term
        }}
        onNotificationPress={() => console.log('Notifications pressed')}
      />
      
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-4 pt-0"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        {/* Header Section */}
        <View className="bg-white dark:bg-black px-6 py-3 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                My Class Schedule
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                Weekly timetable for {studentClass}
              </Text>
            </View>
            <View className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Text className="text-blue-700 dark:text-blue-300 font-semibold text-xs">
                {studentClass}
              </Text>
            </View>
          </View>
        </View>

        {/* Timetable Section */}
        <View className="px-4 py-4">
          {hasSchedule ? (
            <StudentTimetableGrid
              studentClass={studentClass}
              timeSlots={timeSlots}
              schedule={schedule}
            />
          ) : (
            <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
              <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-3 mb-1">
                No Schedule Available
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Your class schedule is not available at the moment.
              </Text>
              <TouchableOpacity 
                onPress={handleRefresh}
                className="mt-4 px-6 py-3 bg-blue-600 rounded-xl flex-row items-center gap-2"
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={18} color="#ffffff" />
                <Text className="text-white font-semibold">Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
