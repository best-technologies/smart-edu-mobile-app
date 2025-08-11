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

export default function DeveloperTabs() {
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
            Monitoring: 'pulse-outline',
            Users: 'people-outline',
            Logs: 'list-outline',
            Settings: 'settings-outline',
          };
          const name = map[route.name] ?? 'ellipse-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" children={() => <Screen label="Developer Dashboard" />} />
      <Tab.Screen name="Monitoring" children={() => <Screen label="Monitoring" />} />
      <Tab.Screen name="Users" children={() => <Screen label="Users" />} />
      <Tab.Screen name="Logs" children={() => <Screen label="Logs" />} />
      <Tab.Screen name="Settings" children={() => <Screen label="Settings" />} />
    </Tab.Navigator>
  );
}

