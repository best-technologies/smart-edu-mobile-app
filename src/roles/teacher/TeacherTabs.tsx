import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function Screen({ label }: { label: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">{label}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function TeacherTabs() {
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
      <Tab.Screen name="Dashboard" children={() => <Screen label="Teacher Dashboard" />} />
      <Tab.Screen name="Students" children={() => <Screen label="Students" />} />
      <Tab.Screen name="Schedules" children={() => <Screen label="Schedules" />} />
      <Tab.Screen name="Subjects" children={() => <Screen label="Subjects" />} />
      <Tab.Screen name="Grading" children={() => <Screen label="Grading" />} />
    </Tab.Navigator>
  );
}

