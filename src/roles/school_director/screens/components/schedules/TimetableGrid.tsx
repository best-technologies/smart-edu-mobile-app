import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClassTimetable, SchedulePeriod } from '@/mock';

export function TimetableGrid({ timetable }: { timetable: ClassTimetable }) {
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

  const renderPeriodCell = (period: SchedulePeriod | null, index: number) => {
    if (!period) {
      return (
        <View key={`empty-${index}`} className="h-16 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900" />
      );
    }

    // Handle break periods
    if (!period.subject && (period.label.toLowerCase().includes('break') || period.label.toLowerCase().includes('lunch'))) {
      const isLunch = period.label.toLowerCase().includes('lunch');
      return (
        <View 
          key={period.timeSlotId} 
          className={`h-16 border border-gray-200 dark:border-gray-800 items-center justify-center ${
            isLunch ? 'bg-amber-50 dark:bg-amber-950/40' : 'bg-orange-50 dark:bg-orange-950/40'
          }`}
        >
          <Text className={`text-xs font-semibold text-center ${
            isLunch ? 'text-amber-700 dark:text-amber-300' : 'text-orange-700 dark:text-orange-300'
          }`}>
            {period.label}
          </Text>
        </View>
      );
    }

    // Handle empty periods
    if (!period.subject) {
      return (
        <View key={`empty-${index}`} className="h-16 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900" />
      );
    }

    return (
      <TouchableOpacity 
        key={period.timeSlotId} 
        activeOpacity={0.8}
        className="h-16 border border-gray-200 dark:border-gray-800 items-center justify-center p-1"
        style={{ backgroundColor: `${period.subject.color}15` }}
      >
        <Text className="text-xs font-bold text-gray-900 dark:text-gray-100 text-center leading-tight">
          {period.subject.name.charAt(0).toUpperCase() + period.subject.name.slice(1)}
        </Text>
        <Text className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
          {period.teacher?.name || 'TBD'}
        </Text>
        {period.room && (
          <Text className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
            {period.room}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
      <View className="min-w-full">
        {/* Header Row - Time Slots */}
        <View className="flex-row">
          {/* Day Column Header */}
          <View className="w-20 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 items-center justify-center">
            <Ionicons name="time-outline" size={16} color="#6b7280" />
          </View>
          
          {/* Time Slot Headers */}
          {timetable.timeSlots.map((timeSlot) => (
            <View 
              key={timeSlot.id} 
              className="flex-1 h-12 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 items-center justify-center px-1"
            >
              <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight">
                {timeSlot.startTime} - {timeSlot.endTime}
              </Text>
            </View>
          ))}
        </View>

        {/* Day Rows */}
        {days.map((day) => {
          const daySchedule = timetable.schedule[day];
          if (!daySchedule) return null;

          return (
            <View key={day} className="flex-row">
              {/* Day Name */}
              <View className="w-20 bg-blue-50 dark:bg-blue-950/40 border border-gray-200 dark:border-gray-700 items-center justify-center">
                <Text className="text-xs font-bold text-blue-700 dark:text-blue-300 text-center">
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </Text>
              </View>
              
              {/* Periods for this day */}
              {daySchedule.map((period, index) => 
                renderPeriodCell(period, index)
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default TimetableGrid;
