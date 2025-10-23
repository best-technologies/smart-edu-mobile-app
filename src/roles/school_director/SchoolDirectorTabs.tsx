import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DirectorDashboardScreen from './screens/dashboard/DirectorDashboardScreen';
import TeachersScreen from './screens/teachers/TeachersScreen';
import SubjectsScreen from './screens/subjects/SubjectsScreen';
import StudentsScreen from './screens/students/StudentsScreen';
import SchedulesScreen from './screens/schedules/SchedulesScreen';

function Screen({ label }: { label: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">{label}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function SchoolDirectorTabs() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          height: 80 + insets.bottom,
          paddingBottom: 16 + insets.bottom,
          paddingTop: 8,
          paddingHorizontal: 16,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIcon: ({ color, size }) => {
          const map: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home-outline',
            Teachers: 'people-outline',
            Students: 'school-outline',
            Subject: 'book-outline',
            Schedules: 'calendar-outline',
          };
          const name = map[route.name] ?? 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DirectorDashboardScreen} />
      <Tab.Screen name="Teachers" component={TeachersScreen} />
      <Tab.Screen name="Subject" options={{ tabBarLabel: 'Subject' }} component={SubjectsScreen} />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Schedules" component={SchedulesScreen} />
    </Tab.Navigator>
  );
}

