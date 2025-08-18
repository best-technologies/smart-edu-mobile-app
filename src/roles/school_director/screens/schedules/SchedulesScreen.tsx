import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Section from '../../components/shared/Section';
import ClassSelector from '../../components/schedules/ClassSelector';
import TimetableGrid from '../../components/schedules/TimetableGrid';
import AddClassButton from '../../components/schedules/AddClassButton';
import AddClassModal from '../../components/schedules/AddClassModal';
import TimeSlotModal from '../../components/schedules/TimeSlotModal';
import EmptyState from '../../components/shared/EmptyState';
import CenteredLoader from '@/components/CenteredLoader';
import { useScheduleData } from '@/hooks/useDirectorData';
import { directorService } from '@/services/api/directorService';

export default function SchedulesScreen() {
  const [selectedClassId, setSelectedClassId] = useState<string>('jss1'); // Default to jss1
  const [addClassModalVisible, setAddClassModalVisible] = useState(false);
  const [timeSlotModalVisible, setTimeSlotModalVisible] = useState(false);
  const [classes, setClasses] = useState<Array<{ classId: string; name: string }>>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    scheduleData,
    timeSlots,
    schedule,
    isLoading,
    error,
    refetch,
    filterByClass,
  } = useScheduleData({ class: 'jss1' }); // Initialize with jss1

  const handleRefresh = useCallback(async () => {
    try {
      setIsRefreshing(true);
      await refetch();
    } catch (error) {
      console.error('Error refreshing schedule data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleClassSelect = useCallback((classId: string) => {
    setSelectedClassId(classId);
    // Find the class name from the classId
    const selectedClass = classes.find(c => c.classId === classId);
    if (selectedClass) {
      filterByClass(selectedClass.name); // Send class name instead of ID
    }
  }, [filterByClass, classes]);

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      setIsLoadingClasses(true);
      const response = await directorService.fetchAllClasses();
      
      if (response.success && response.data) {
        const formattedClasses = response.data.classes.map((classItem: any) => ({
          classId: classItem.id,
          name: classItem.name,
        }));
        setClasses(formattedClasses);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setIsLoadingClasses(false);
    }
  }, []);

  const handleAddClassSuccess = useCallback(async () => {
    try {
      console.log('🔄 Starting handleAddClassSuccess...');
      // Add a small delay to ensure modal is fully closed
      setTimeout(async () => {
        // Refresh both schedule data and classes with proper error handling
        await Promise.all([
          refetch().catch(error => {
            console.error('Error refetching schedule data:', error);
          }),
          fetchClasses().catch(error => {
            console.error('Error fetching classes:', error);
          })
        ]);
        console.log('✅ handleAddClassSuccess completed successfully');
      }, 100);
    } catch (error) {
      console.error('❌ Error in handleAddClassSuccess:', error);
    }
  }, [refetch, fetchClasses]);

  const handleTimeSlotSuccess = useCallback(async () => {
    try {
      // Add a small delay to ensure modal is fully closed
      setTimeout(async () => {
        // Refresh schedule data to get updated time slots
        await refetch();
      }, 100);
    } catch (error) {
      console.error('Error refreshing time slots:', error);
    }
  }, [refetch]);

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
            refreshing={isLoading || isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <Section 
          title="Class Schedules"
          action={
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setTimeSlotModalVisible(true)}
                className="px-4 py-2 bg-purple-600 rounded-lg flex-row items-center space-x-2"
                activeOpacity={0.8}
              >
                <Ionicons name="time-outline" size={16} color="#ffffff" />
                <Text className="text-white font-medium text-sm">Time Slots</Text>
              </TouchableOpacity>
              <AddClassButton
                onPress={() => setAddClassModalVisible(true)}
                size="small"
                variant="primary"
              />
            </View>
          }
        >
          {/* Class Selector */}
          <ClassSelector
            classes={classes}
            selectedClassId={selectedClassId}
            onClassSelect={handleClassSelect}
            isLoading={isLoadingClasses}
          />

          {isLoading ? (
            <CenteredLoader visible={true} text="Loading schedule..." />
          ) : schedule && timeSlots.length > 0 ? (
            <TimetableGrid
              selectedClass={classes.find(c => c.classId === selectedClassId)?.name || selectedClassId}
              timeSlots={timeSlots}
              schedule={schedule}
              onScheduleCreated={handleRefresh}
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

      {/* Add Class Modal */}
      <AddClassModal
        visible={addClassModalVisible}
        onClose={() => setAddClassModalVisible(false)}
        onSuccess={handleAddClassSuccess}
      />

      {/* Time Slot Modal */}
      <TimeSlotModal
        visible={timeSlotModalVisible}
        onClose={() => setTimeSlotModalVisible(false)}
        onSuccess={handleTimeSlotSuccess}
      />
    </SafeAreaView>
  );
}
