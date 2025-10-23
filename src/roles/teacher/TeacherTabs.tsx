import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import StudentsScreen from './screens/StudentsScreen';
import SchedulesScreen from './screens/SchedulesScreen';
import SubjectsScreen from './screens/SubjectsScreen';
import SubjectDetailScreen from './screens/SubjectDetailScreen';
import VideoDemoScreen from './screens/VideoDemoScreen';
import NotificationDetailScreen from './screens/notifications/NotificationDetailScreen';
import NotificationsListScreen from './screens/notifications/NotificationsListScreen';
import GradingScreen from './screens/GradingScreen';
import { AIChatScreen, AIChatMainScreen, ChatWithExistingScreen, UploadNewMaterialScreen, DocumentUploadModal } from '@/screens/ai-chat';
import CBTCreationScreen from './screens/CBTCreationScreen';
import CBTQuestionCreationScreen from './screens/CBTQuestionCreationScreen';
import CBTQuizDetailScreen from './screens/CBTQuizDetailScreen';
import AssessmentsListScreen from './screens/AssessmentsListScreen';
import { AttendanceScreen } from '@/components';
import StudentAttendanceHistoryScreen from '@/components/attendance/StudentAttendanceHistoryScreen';

function Screen({ label }: { label: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">{label}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TeacherTabNavigator() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4338ca',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { 
          height: 75,
          paddingBottom: insets.bottom > 0 ? 8 : 12,
          paddingTop: 8,
          paddingHorizontal: 12,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          position: 'absolute',
          bottom: insets.bottom > 0 ? 20 : 16,
          left: 20,
          right: 20,
          borderRadius: 28,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 16,
        },
        tabBarIcon: ({ color, focused }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home',
            Students: 'school',
            Schedules: 'calendar',
            Subjects: 'book',
            Grades: 'clipboard',
          };
          const outlineMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home-outline',
            Students: 'school-outline',
            Schedules: 'calendar-outline',
            Subjects: 'book-outline',
            Grades: 'clipboard-outline',
          };
          const name = focused ? (iconMap[route.name] ?? 'ellipse') : (outlineMap[route.name] ?? 'ellipse-outline');
          return <Ionicons name={name} size={26} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 8,
          fontWeight: '600',
          marginTop: 2,
          paddingBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: 100,
          marginHorizontal: 2,
          paddingHorizontal: 8,
          paddingVertical: 4,
          overflow: 'hidden',
        },
        tabBarActiveBackgroundColor: '#e0e7ff',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarShowLabel: true,
        tabBarAllowFontScaling: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherDashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Schedules" component={SchedulesScreen} />
      <Tab.Screen name="Subjects" component={SubjectsScreen} />
      <Tab.Screen name="Grades" component={GradingScreen} />
    </Tab.Navigator>
  );
}

export default function TeacherTabs() {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
      }}
    >
      <Stack.Screen name="TeacherTabs" component={TeacherTabNavigator} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      <Stack.Screen name="AssessmentsList" component={AssessmentsListScreen} />
      <Stack.Screen name="VideoDemo" component={VideoDemoScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="NotificationsList" component={NotificationsListScreen} />
      <Stack.Screen name="AIChatMain" component={AIChatMainScreen} />
      <Stack.Screen name="ChatWithExisting" component={ChatWithExistingScreen} />
      <Stack.Screen name="UploadNewMaterial" component={UploadNewMaterialScreen} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
      <Stack.Screen name="CBTCreation" component={CBTCreationScreen} />
      <Stack.Screen name="CBTQuizDetail" component={CBTQuizDetailScreen} />
      <Stack.Screen name="CBTQuestionCreation" component={CBTQuestionCreationScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="StudentAttendanceHistory" component={StudentAttendanceHistoryScreen} />
    </Stack.Navigator>
  );
}

