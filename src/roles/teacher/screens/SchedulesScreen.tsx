import React, { useState, useMemo } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TopBar from './components/shared/TopBar';
import ClassTabs from './components/schedules/ClassTabs';
import TimetableGrid from './components/schedules/TimetableGrid';
import DayScheduleView from './components/schedules/DayScheduleView';
import ScheduleStats from './components/schedules/ScheduleStats';
import FloatingActionButton from './components/shared/FloatingActionButton';

const { width } = Dimensions.get('window');

export default function SchedulesScreen() {
  const [selectedClass, setSelectedClass] = useState('JSS1');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [viewMode, setViewMode] = useState<'grid' | 'day'>('grid');

  const classes = ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = [
    '08:00 - 09:00',
    '09:00 - 10:00', 
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00'
  ];

  // Calculate stats for the selected class
  const stats = useMemo(() => {
    const timetableData = getTimetableData(selectedClass);
    let totalPeriods = 0;
    const teachers = new Set<string>();
    const subjects = new Set<string>();

    Object.values(timetableData).forEach(dayData => {
      Object.values(dayData).forEach(period => {
        if (period) {
          totalPeriods++;
          teachers.add(period.teacher);
          subjects.add(period.subject);
        }
      });
    });

    return {
      totalPeriods,
      totalTeachers: teachers.size,
      totalSubjects: subjects.size
    };
  }, [selectedClass]);

  // Mock data function (moved from TimetableGrid)
  function getTimetableData(classId: string): Record<string, Record<string, any>> {
    const data: Record<string, Record<string, any>> = {};
    
    // Initialize empty timetable
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
      data[day] = {};
      ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', 
       '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00'].forEach(time => {
        data[day][time] = null;
      });
    });

    // Add some sample data
    if (classId === 'JSS1') {
      data['Monday']['08:00 - 09:00'] = { subject: 'Mathematics', teacher: 'Mr. Johnson', color: 'purple' };
      data['Monday']['09:00 - 10:00'] = { subject: 'English Language', teacher: 'Mrs. Smith', color: 'green' };
      data['Tuesday']['08:00 - 09:00'] = { subject: 'Physics', teacher: 'Dr. Williams', color: 'purple' };
      data['Wednesday']['10:00 - 11:00'] = { subject: 'Chemistry', teacher: 'Prof. Brown', color: 'blue' };
      data['Thursday']['13:00 - 14:00'] = { subject: 'Biology', teacher: 'Ms. Davis', color: 'green' };
      data['Friday']['14:00 - 15:00'] = { subject: 'History', teacher: 'Mr. Wilson', color: 'orange' };
    } else if (classId === 'JSS2') {
      data['Monday']['08:00 - 09:00'] = { subject: 'Mathematics', teacher: 'Mr. Johnson', color: 'purple' };
      data['Tuesday']['09:00 - 10:00'] = { subject: 'Physics', teacher: 'Dr. Williams', color: 'purple' };
      data['Wednesday']['10:00 - 11:00'] = { subject: 'Chemistry', teacher: 'Prof. Brown', color: 'blue' };
    }

    return data;
  }

  const handleAddPeriod = () => {
    console.log('Add new period for class:', selectedClass);
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  const handlePeriodPress = (time: string, period: any) => {
    if (period) {
      console.log('Edit period:', period);
    } else {
      console.log('Add period for:', selectedDay, time);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <TopBar />
      
      <ScrollView className="flex-1" contentContainerClassName="pb-20">
        {/* Header Section */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Class Schedules
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Manage and view class timetables
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleAddPeriod}
              activeOpacity={0.7}
              className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-semibold text-sm">Add Period</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Class Selection Tabs */}
        <View className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
          <ClassTabs 
            classes={classes}
            selectedClass={selectedClass}
            onClassChange={handleClassChange}
          />
          <View className="px-6 py-2 flex-row items-center justify-between">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Viewing timetable for {selectedClass}
            </Text>
            <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => setViewMode('grid')}
                activeOpacity={0.7}
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : ''
                }`}
              >
                <Text className={`text-xs font-medium ${
                  viewMode === 'grid' 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Grid
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('day')}
                activeOpacity={0.7}
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'day' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : ''
                }`}
              >
                <Text className={`text-xs font-medium ${
                  viewMode === 'day' 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Day
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Schedule Stats */}
        <View className="px-6 py-2">
          <ScheduleStats 
            selectedClass={selectedClass}
            totalPeriods={stats.totalPeriods}
            totalTeachers={stats.totalTeachers}
            totalSubjects={stats.totalSubjects}
          />
        </View>

        {/* Timetable View */}
        <View className="px-6 py-2">
          {viewMode === 'grid' ? (
            <TimetableGrid 
              selectedClass={selectedClass}
              days={days}
              timeSlots={timeSlots}
              selectedDay={selectedDay}
              onDayChange={handleDayChange}
              timetableData={getTimetableData(selectedClass)}
            />
          ) : (
            <DayScheduleView 
              day={selectedDay}
              timeSlots={timeSlots}
              periods={getTimetableData(selectedClass)[selectedDay] || {}}
              onPeriodPress={handlePeriodPress}
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon="chatbubble-outline"
        text="Chat with Support"
        color="bg-green-500"
        onPress={() => console.log('Chat with support')}
      />
    </View>
  );
}
