import { ScrollView, Text, View } from 'react-native';
import TopBar from './components/shared/TopBar';
import Section from './components/shared/Section';
import EmptyState from './components/shared/EmptyState';
import { OverviewCard, SmallOverviewCard } from './components/dashboard/OverviewCard';
import FinanceCard from './components/dashboard/Finance';
import { directorDashboardData } from '@/mock';

export default function DirectorDashboardScreen() {
  const data = directorDashboardData.data;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black" contentContainerClassName="px-4 pb-12 pt-6">
      <TopBar
        name={data?.basic_details?.email?.split('@')?.[0] ?? 'Director'}
        email={data?.basic_details?.email ?? 'director@school.edu'}
        schoolId={data?.basic_details?.school_id}
        avatarUri={undefined}
      />

      <Section title="Overview">
        <View className="gap-3">
          <OverviewCard
            icon="people-outline"
            iconTint="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
            label="Teachers"
            value={data?.teachers?.totalTeachers}
            sublabel="Total on staff"
          />
          <View className="flex-row gap-3">
            <SmallOverviewCard
              icon="book-outline"
              label="Subjects"
              value={data?.teachers?.totalSubjects}
              tint="bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300"
            />
            <SmallOverviewCard
              icon="calendar-outline"
              label="Active Classes"
              value={data?.teachers?.activeClasses}
              tint="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
            />
          </View>
          <OverviewCard
            icon="school-outline"
            iconTint="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
            label="Students"
            value={data?.students?.totalStudents}
            sublabel={`Active ${data?.students?.activeStudents ?? 0} • Suspended ${data?.students?.suspendedStudents ?? 0}`}
          />
        </View>
      </Section>

      <Section title="Finance">
        <FinanceCard
          revenue={data?.finance?.totalRevenue ?? 0}
          expenses={data?.finance?.totalExpenses ?? 0}
          outstanding={data?.finance?.outstandingFees ?? 0}
          netBalance={data?.finance?.netBalance ?? 0}
        />
      </Section>

      <Section title="Ongoing Classes">
        {data?.ongoingClasses?.length ? (
          <View className="gap-3">
            {data.ongoingClasses.map((c, idx) => (
              <View key={`${c.className}-${idx}`} className="rounded-2xl p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold">
                    {c.className ?? '—'} • {c.subject ?? '—'}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {c.startTime ?? '—'} - {c.endTime ?? '—'}
                  </Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 mt-1">{c.teacher ?? '—'}</Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState title="No classes right now" subtitle="Scheduled sessions will appear here." />
        )}
      </Section>

      <Section title="Notifications">
        {data?.notifications?.length ? (
          <View className="gap-3">
            {data.notifications.map((n) => (
              <View key={n.id} className="rounded-2xl p-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold">{n.title ?? '—'}</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs">{n.createdAt ?? ''}</Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 mt-1">{n.description ?? ''}</Text>
                {n.comingUpOn ? (
                  <View className="mt-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 px-3 py-2 self-start">
                    <Text className="text-blue-700 dark:text-blue-300 text-xs">Coming up: {n.comingUpOn}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <EmptyState title="No notifications" subtitle="You're all caught up." />
        )}
      </Section>
    </ScrollView>
  );
}
 
