import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Section from '../../school_director/components/shared/Section';
import ClassSelector from '../../school_director/components/schedules/ClassSelector';
import TeacherTimetableGrid from './components/schedules/TeacherTimetableGrid';
import EmptyState from '../../school_director/components/shared/EmptyState';
import CenteredLoader from '@/components/CenteredLoader';
import TopBar from './components/shared/TopBar';
import { ApiService } from '@/services/api';
import { TeacherService } from '@/services/api/roleServices';

export default function SchedulesScreen() {
  const [selectedClassId, setSelectedClassId] = useState<string>(''); // Will be set from API
  const [classes, setClasses] = useState<Array<{ classId: string; name: string }>>([]);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string; code: string; color: string }>>([]);
  const [timeSlots, setTimeSlots] = useState<Array<{ id: string; label: string; startTime: string; endTime: string; order: number }>>([]);
  const [schedule, setSchedule] = useState<{
    MONDAY: any[];
    TUESDAY: any[];
    WEDNESDAY: any[];
    THURSDAY: any[];
    FRIDAY: any[];
  }>({
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: []
  });
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleClassSelect = useCallback((classId: string) => {
    setSelectedClassId(classId);
    console.log('Selected class:', classId);
    // The schedule data is already loaded, just update the selected class
  }, []);

  // Fetch schedule data on component mount
  useEffect(() => {
    fetchScheduleData();
  }, []);

  const fetchScheduleData = useCallback(async () => {
    try {
      setIsLoadingClasses(true);
      
      // Check if the method exists
      if (!ApiService.teacher.getScheduleTab) {
        console.error('getScheduleTab method not found on ApiService.teacher');
        console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(ApiService.teacher)));
        
        // Fallback to mock data for now
        const mockResponse = {
          success: true,
          message: "Schedules tab fetched successfully",
          data: {
            subjects: [
              {
                id: "subject-uuid-1",
                name: "Mathematics",
                code: "MATH101",
                color: "#FF5733"
              }
            ],
            classes: [
              {
                id: "class-uuid-1",
                name: "Class 10A"
              },
              {
                id: "class-uuid-2", 
                name: "Class 10B"
              }
            ],
            timetable_data: {
              timeSlots: [
                {
                  id: "timeslot-uuid-1",
                  startTime: "08:45",
                  endTime: "09:45",
                  label: "Period-1",
                  order: 1
                },
                {
                  id: "timeslot-uuid-2",
                  startTime: "09:45",
                  endTime: "10:45",
                  label: "Period-2",
                  order: 2
                }
              ],
              schedule: {
                MONDAY: [
                  {
                    timeSlotId: "timeslot-uuid-1",
                    startTime: "08:45",
                    endTime: "09:45",
                    label: "Period-1",
                    subject: {
                      id: "subject-uuid-1",
                      name: "Mathematics",
                      code: "MATH101",
                      color: "#FF5733"
                    },
                    teacher: {
                      id: "teacher-uuid-1",
                      name: "John Doe"
                    },
                    room: "Room 101"
                  },
                  {
                    timeSlotId: "timeslot-uuid-2",
                    startTime: "09:45",
                    endTime: "10:45",
                    label: "Period-2",
                    subject: null,
                    teacher: null,
                    room: null
                  }
                ],
                TUESDAY: [],
                WEDNESDAY: [],
                THURSDAY: [],
                FRIDAY: []
              }
            }
          }
        };
        
        const { classes, subjects, timetable_data } = mockResponse.data;
        const formattedClasses = classes.map((classItem: any) => ({
          classId: classItem.id,
          name: classItem.name,
        }));
        
        setClasses(formattedClasses);
        setSubjects(subjects);
        setTimeSlots(timetable_data.timeSlots);
        setSchedule(timetable_data.schedule);
        
        if (!selectedClassId && formattedClasses.length > 0) {
          setSelectedClassId(formattedClasses[0].classId);
        }
        
        return;
      }
      
      // Real API call to fetch schedule data
      const teacherService = new TeacherService();
      const response = await teacherService.getScheduleTab();
      
      if (response.success && response.data) {
        // Extract data from response
        const { classes, subjects, timetable_data } = response.data;
        
        // Format classes for ClassSelector
        const formattedClasses = classes.map((classItem: any) => ({
          classId: classItem.id,
          name: classItem.name,
        }));
        
        setClasses(formattedClasses);
        setSubjects(subjects);
        setTimeSlots(timetable_data.timeSlots);
        setSchedule(timetable_data.schedule);
        
        // Set first class as selected if none selected
        if (!selectedClassId && formattedClasses.length > 0) {
          setSelectedClassId(formattedClasses[0].classId);
        }
      }
      
    } catch (error) {
      console.error('Error fetching schedule data:', error);
    } finally {
      setIsLoadingClasses(false);
    }
  }, [selectedClassId]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />
      
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
        <Section 
          title="My Teaching Schedule"
        >
          {/* Class Selector */}
          <ClassSelector
            classes={classes}
            selectedClassId={selectedClassId}
            onClassSelect={handleClassSelect}
            isLoading={isLoadingClasses}
          />

          {/* Subjects Section */}
          {subjects.length > 0 && (
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subjects You Teach:
              </Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerClassName="gap-2 pr-4"
              >
                {subjects.map((subject) => (
                  <View 
                    key={subject.id} 
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2 min-w-[140px]"
                    style={{ borderLeftColor: subject.color, borderLeftWidth: 4 }}
                  >
                    <Text className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
                      {subject.name}
                    </Text>
                    <Text className="text-xs text-green-600 dark:text-green-400">
                      {subject.code}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {isLoadingClasses ? (
            <CenteredLoader visible={true} text="Loading schedule..." />
          ) : schedule && timeSlots.length > 0 ? (
            <TeacherTimetableGrid
              selectedClass={classes.find(c => c.classId === selectedClassId)?.name || selectedClassId}
              timeSlots={timeSlots}
              schedule={schedule}
            />
          ) : (
            <EmptyState 
              title="No schedule found" 
              subtitle={
                selectedClassId 
                  ? "No schedule available for the selected class."
                  : "Please select a class to view its schedule."
              }
            />
          )}
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
