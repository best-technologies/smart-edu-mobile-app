import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Section from './components/shared/Section';
import ClassSelector from './components/schedules/ClassSelector';
import TimetableGrid from './components/schedules/TimetableGrid';
import EmptyState from './components/shared/EmptyState';
import CenteredLoader from '@/components/CenteredLoader';
import { useScheduleData } from '@/hooks/useDirectorData';

// Predefined list of classes that all schools have
const DEFAULT_CLASSES = [
  { classId: 'jss1', name: 'jss1' },
  { classId: 'jss2', name: 'jss2' },
  { classId: 'jss3', name: 'jss3' },
  { classId: 'ss1', name: 'ss1' },
  { classId: 'ss2', name: 'ss2' },
  { classId: 'ss3', name: 'ss3' },
];

export default function SchedulesScreen() {
  const [selectedClassId, setSelectedClassId] = useState<string>('jss1'); // Default to jss1

  const {
    scheduleData,
    classes,
    timeSlots,
    schedule,
    isLoading,
    error,
    refetch,
    filterByClass,
  } = useScheduleData({ class: 'jss1' }); // Initialize with jss1

  const handleRefresh = () => {
    refetch();
  };

  const handleClassSelect = useCallback((classId: string) => {
    setSelectedClassId(classId);
    filterByClass(classId);
  }, [filterByClass]);

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <EmptyState 
            title="Error loading schedules" 
            subtitle="Unable to load schedule data. Please try again." 
          />
          <TouchableOpacity 
            onPress={handleRefresh}
            className="mt-4 px-6 py-3 bg-blue-600 rounded-xl flex-row items-center gap-2"
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#ffffff" />
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-4 pb-24 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <Section title="Class Schedules">
          {/* Class Selector */}
          <ClassSelector
            classes={DEFAULT_CLASSES}
            selectedClassId={selectedClassId}
            onClassSelect={handleClassSelect}
          />

          {isLoading ? (
            <CenteredLoader visible={true} text="Loading schedule..." />
          ) : schedule && timeSlots.length > 0 ? (
            <TimetableGrid
              selectedClass={selectedClassId}
              timeSlots={timeSlots}
              schedule={schedule}
              onScheduleCreated={refetch}
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
