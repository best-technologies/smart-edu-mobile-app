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
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
          paddingBottom: 6,
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
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarShowLabel: true,
        tabBarAllowFontScaling: false,
        tabBarIcon: ({ color, focused }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home',
            Teachers: 'people',
            Students: 'school',
            Subject: 'book',
            Schedules: 'calendar',
          };
          const outlineMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home-outline',
            Teachers: 'people-outline',
            Students: 'school-outline',
            Subject: 'book-outline',
            Schedules: 'calendar-outline',
          };
          const name = focused ? (iconMap[route.name] ?? 'ellipse') : (outlineMap[route.name] ?? 'ellipse-outline');
          return <Ionicons name={name} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DirectorDashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Teachers" component={TeachersScreen} />
      <Tab.Screen name="Subject" options={{ tabBarLabel: 'Subject' }} component={SubjectsScreen} />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Schedules" component={SchedulesScreen} />
    </Tab.Navigator>
  );
}

