import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TeacherDashboardScreen from './screens/TeacherDashboardScreen';
import StudentsScreen from './screens/StudentsScreen';
import SchedulesScreen from './screens/SchedulesScreen';
import SubjectsScreen from './screens/SubjectsScreen';
import SubjectDetailScreen from './screens/SubjectDetailScreen';

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
        tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home-outline',
            Students: 'school-outline',
            Schedules: 'calendar-outline',
            Subjects: 'book-outline',
            Grading: 'clipboard-outline',
          };
          const name = map[route.name] ?? 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherDashboardScreen} />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Schedules" component={SchedulesScreen} />
      <Tab.Screen name="Subjects" component={SubjectsScreen} />
      <Tab.Screen name="Grading" children={() => <Screen label="Grading" />} />
    </Tab.Navigator>
  );
}

export default function TeacherTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TeacherTabs" component={TeacherTabNavigator} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
    </Stack.Navigator>
  );
}

