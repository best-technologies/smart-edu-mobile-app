import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClassTimetable } from '@/mock';

export function ScheduleStats({ timetable }: { timetable: ClassTimetable }) {
  // Calculate stats from the timetable data
  const totalPeriods = timetable.timeSlots.length;
  const totalScheduledPeriods = Object.values(timetable.schedule).reduce((acc, day) => {
    return acc + day.filter(period => period.subject !== null).length;
  }, 0);
  const uniqueTeachers = new Set(
    Object.values(timetable.schedule)
      .flat()
      .filter(period => period.teacher)
      .map(period => period.teacher!.id)
  ).size;
  const uniqueSubjects = new Set(
    Object.values(timetable.schedule)
      .flat()
      .filter(period => period.subject)
      .map(period => period.subject!.id)
  ).size;

  return (
    <View className="gap-3">
      {/* Main Stats Row */}
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                <Ionicons name="school-outline" size={20} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Class</Text>
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{timetable.class.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <Ionicons name="time-outline" size={20} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Scheduled</Text>
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{totalScheduledPeriods}/{totalPeriods}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Secondary Stats Row */}
      <View className="flex-row gap-3">
        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                <Ionicons name="people-outline" size={18} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Teachers</Text>
                <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{uniqueTeachers}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                <Ionicons name="book-outline" size={18} color="currentColor" />
              </View>
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs">Subjects</Text>
                <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">{uniqueSubjects}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ScheduleStats;
