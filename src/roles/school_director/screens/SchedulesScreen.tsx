import React, { useCallback, useState, useEffect } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Section from './components/shared/Section';
import ClassSelector from './components/schedules/ClassSelector';
import TimetableGrid from './components/schedules/TimetableGrid';
import AddClassButton from './components/schedules/AddClassButton';
import AddClassModal from './components/schedules/AddClassModal';
import EmptyState from './components/shared/EmptyState';
import CenteredLoader from '@/components/CenteredLoader';
import { useScheduleData } from '@/hooks/useDirectorData';
import { directorService } from '@/services/api/directorService';

export default function SchedulesScreen() {
  const [selectedClassId, setSelectedClassId] = useState<string>('jss1'); // Default to jss1
  const [addClassModalVisible, setAddClassModalVisible] = useState(false);
  const [classes, setClasses] = useState<Array<{ classId: string; name: string }>>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  const {
    scheduleData,
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

  const fetchClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const response = await directorService.fetchAllClasses();
      
      if (response.success && response.data) {
        const formattedClasses = response.data.map((classItem: any) => ({
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
  };

  const handleAddClassSuccess = () => {
    // Refresh both schedule data and classes
    refetch();
    fetchClasses();
  };

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
        <Section 
          title="Class Schedules"
          action={
            <AddClassButton
              onPress={() => setAddClassModalVisible(true)}
              size="small"
              variant="primary"
            />
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

      {/* Add Class Modal */}
      <AddClassModal
        visible={addClassModalVisible}
        onClose={() => setAddClassModalVisible(false)}
        onSuccess={handleAddClassSuccess}
      />
    </SafeAreaView>
  );
}
