import { ScrollView, Text, View } from 'react-native';
import { useState } from 'react';
import { schedulesDashboardData } from '@/mock';
import TopBar from './components/shared/TopBar';
import Section from './components/shared/Section';
import ScheduleStats from './components/schedules/ScheduleStats';
import ClassTabs from './components/schedules/ClassTabs';
import TimetableGrid from './components/schedules/TimetableGrid';
import EmptyState from './components/shared/EmptyState';

export default function SchedulesScreen() {
  const data = schedulesDashboardData.data;
  const [selectedClass, setSelectedClass] = useState(data?.class || 'grade10a');

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <EmptyState title="No data available" subtitle="Unable to load schedules data." />
      </View>
    );
  }

  // Mock available classes - in real app, this would come from API
  const availableClasses = ['grade10a', 'grade10b', 'grade11a', 'grade11b', 'grade12a', 'grade12b'];

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black" contentContainerClassName="px-4 pb-12 pt-6">
      <TopBar
        name="director"
        email="director@school.edu"
        schoolId="sch_1234567890"
        avatarUri={undefined}
      />

      <Section title="Overview">
        <ScheduleStats timetable={data} />
      </Section>

      <Section title="Class Timetables">
        <ClassTabs 
          classes={availableClasses}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
        />
        
        {selectedClass === data.class ? (
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <View className="p-4 border-b border-gray-200 dark:border-gray-800">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {data.class.toUpperCase()} Timetable
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Viewing timetable for {data.class.toUpperCase()}
              </Text>
            </View>
            
            <View className="h-96">
              <TimetableGrid timetable={data} />
            </View>
          </View>
        ) : (
          <EmptyState title="No timetable found" subtitle="Unable to load timetable for selected class." />
        )}
      </Section>
    </ScrollView>
  );
}
