import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import StudentsScreen from './screens/StudentsScreen';
import SchedulesScreen from './screens/SchedulesScreen';
import SubjectsScreen from './screens/SubjectsScreen';
import SubjectDetailScreen from './screens/SubjectDetailScreen';
import VideoDemoScreen from './screens/VideoDemoScreen';
import NotificationDetailScreen from './screens/notifications/NotificationDetailScreen';
import NotificationsListScreen from './screens/notifications/NotificationsListScreen';
import GradingScreen from './screens/GradingScreen';
import AIChatScreen from './screens/AIChatScreen';
import { AIChatMainScreen, ChatWithExistingScreen, UploadNewMaterialScreen } from './screens/AI-Chat';
import CBTCreationScreen from './screens/CBTCreationScreen';
import CBTQuestionCreationScreen from './screens/CBTQuestionCreationScreen';
import CBTQuizDetailScreen from './screens/CBTQuizDetailScreen';
import AssessmentsListScreen from './screens/AssessmentsListScreen';

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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { 
          height: 80, 
          paddingBottom: 12, 
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home-outline',
            Students: 'school-outline',
            Schedules: 'calendar-outline',
            Subjects: 'book-outline',
            Grades: 'clipboard-outline',
          };
          const name = map[route.name] ?? 'ellipse-outline';
          return <Ionicons name={name} size={20} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherDashboardScreen} />
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
    </Stack.Navigator>
  );
}

