import React from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import TopBar from '../../components/shared/TopBar';
import Section from '../../components/shared/Section';
import EmptyState from '../../components/shared/EmptyState';
import { OverviewCard, SmallOverviewCard } from '../../components/dashboard/OverviewCard';
import FinanceCard from '../../components/dashboard/Finance';
import { useDirectorDashboard, useRefreshDirectorDashboard } from '@/hooks/useDirectorDashboard';
import { CenteredLoader } from '@/components';
import { directorDashboardData } from '@/mock/director';

// Animated Action Component
const AnimatedAction = React.forwardRef<View, { action: any }>(({ action }, ref) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!action.isAnimated) return;

    const createBreathingAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.08,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.8,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    const animation = createBreathingAnimation();
    animation.start();

    return () => {
      animation.stop();
    };
  }, [action.isAnimated, scaleAnim, opacityAnim, glowAnim]);

  if (action.isAnimated) {
    return (
      <Animated.View
        ref={ref}
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <TouchableOpacity
          onPress={action.onPress}
          activeOpacity={0.7}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 items-center min-w-[100px]"
        >
          <Animated.View 
            className="w-12 h-12 rounded-full items-center justify-center mb-3"
            style={{ 
              backgroundColor: `${action.color}20`,
              shadowColor: action.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.6],
              }),
              shadowRadius: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 8],
              }),
              elevation: 5,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Ionicons name={action.icon} size={24} color={action.color} />
          </Animated.View>
          <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
            {action.title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      onPress={action.onPress}
      activeOpacity={0.8}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 items-center min-w-[100px]"
    >
      <View 
        className="w-12 h-12 rounded-full items-center justify-center mb-3"
        style={{ backgroundColor: `${action.color}20` }}
      >
        <Ionicons name={action.icon} size={24} color={action.color} />
      </View>
      <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
        {action.title}
      </Text>
    </TouchableOpacity>
  );
});

export default function DirectorDashboardScreen() {
  const navigation = useNavigation();
  const { data, isLoading, error, refetch } = useDirectorDashboard();
  const refreshMutation = useRefreshDirectorDashboard();

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const quickActions = [
    {
      id: 'ai-assistance',
      title: 'AI Assistance',
      icon: 'sparkles' as const,
      color: '#8B5CF6',
      onPress: () => (navigation as any).navigate('AIChatMain'),
      isAnimated: true,
    },
    {
      id: 'teachers',
      title: 'Teachers',
      icon: 'people-outline' as const,
      color: '#10B981',
      onPress: () => (navigation as any).navigate('AllTeachersList'),
    },
    {
      id: 'students',
      title: 'Students',
      icon: 'school-outline' as const,
      color: '#3B82F6',
      onPress: () => (navigation as any).navigate('AllStudentsList'),
    },
    {
      id: 'subjects',
      title: 'Subjects',
      icon: 'book-outline' as const,
      color: '#F59E0B',
      onPress: () => (navigation as any).navigate('AllSubjectsList'),
    },
  ];

  // Show loading state
  if (isLoading && !data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <CenteredLoader visible={true} text="Loading dashboard..." />
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load dashboard
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
            {error.message || 'Something went wrong while loading the dashboard data.'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-blue-500 px-6 py-3 rounded-lg"
          >
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
        contentContainerClassName="px-4 pb-24 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshMutation.isPending}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        <TopBar
          name={data?.basic_details?.email?.split('@')?.[0] ?? 'Director'}
          email={data?.basic_details?.email ?? 'director@school.edu'}
          schoolId={data?.basic_details?.school_id}
          avatarUri={undefined}
          onNotificationPress={() => (navigation as any).navigate('NotificationsList')}
        />

        {/* Quick Actions Section */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 px-1"
          >
            {quickActions.map((action) => (
              <AnimatedAction key={action.id} action={action} />
            ))}
          </ScrollView>
        </View>

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

      

      <Section title="Ongoing Classes">
        {data?.ongoingClasses?.length ? (
          <View className="gap-3">
            {data.ongoingClasses.map((c, idx) => (
              <View key={`${c.className}-${idx}`} className="rounded-xl p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold text-base">
                    {c.className ?? '—'} • {c.subject ?? '—'}
                  </Text>
                  <View className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                    <Text className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                      {c.startTime ?? '—'} - {c.endTime ?? '—'}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{c.teacher ?? '—'}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View className="gap-3">
            {directorDashboardData.data?.ongoingClasses?.map((c, idx) => (
              <View key={`${c.className}-${idx}`} className="rounded-xl p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold text-base">
                    {c.className ?? '—'} • {c.subject ?? '—'}
                  </Text>
                  <View className="bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                    <Text className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                      {c.startTime ?? '—'} - {c.endTime ?? '—'}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{c.teacher ?? '—'}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>

      <Section title="Notifications">
        {data?.notifications?.length ? (
          <View className="gap-3">
            {data.notifications.map((n) => (
              <View key={n.id} className="rounded-xl p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold text-base">{n.title ?? '—'}</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{n.createdAt ?? ''}</Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-5">{n.description ?? ''}</Text>
                {n.comingUpOn ? (
                  <View className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/40 px-3 py-2 self-start border border-amber-200 dark:border-amber-800">
                    <Text className="text-amber-700 dark:text-amber-300 text-xs font-medium">Coming up: {n.comingUpOn}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <View className="gap-3">
            {directorDashboardData.data?.notifications?.map((n) => (
              <View key={n.id} className="rounded-xl p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-900 dark:text-gray-100 font-semibold text-base">{n.title ?? '—'}</Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{n.createdAt ?? ''}</Text>
                </View>
                <Text className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-5">{n.description ?? ''}</Text>
                {n.comingUpOn ? (
                  <View className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/40 px-3 py-2 self-start border border-amber-200 dark:border-amber-800">
                    <Text className="text-amber-700 dark:text-amber-300 text-xs font-medium">Coming up: {n.comingUpOn}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </Section>

      <Section title="Finance">
        <FinanceCard
          revenue={data?.finance?.totalRevenue ?? 0}
          expenses={data?.finance?.totalExpenses ?? 0}
          outstanding={data?.finance?.outstandingFees ?? 0}
          netBalance={data?.finance?.netBalance ?? 0}
        />
      </Section>
      
      </ScrollView>
    </SafeAreaView>
  );
}
 
