import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Screen({ label }: { label: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">{label}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function DeveloperTabs() {
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
        tabBarItemStyle: {
          borderRadius: 100,
          marginHorizontal: 2,
          paddingHorizontal: 8,
          paddingVertical: 4,
          overflow: 'hidden',
        },
        tabBarActiveBackgroundColor: '#e0e7ff',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
          paddingBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarShowLabel: true,
        tabBarAllowFontScaling: false,
        tabBarIcon: ({ color, focused }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home',
            Monitoring: 'pulse',
            Users: 'people',
            Logs: 'list',
            Settings: 'settings',
          };
          const outlineMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home-outline',
            Monitoring: 'pulse-outline',
            Users: 'people-outline',
            Logs: 'list-outline',
            Settings: 'settings-outline',
          };
          const name = focused ? (iconMap[route.name] ?? 'ellipse') : (outlineMap[route.name] ?? 'ellipse-outline');
          return <Ionicons name={name} size={26} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" children={() => <Screen label="Developer Dashboard" />} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Monitoring" children={() => <Screen label="Monitoring" />} />
      <Tab.Screen name="Users" children={() => <Screen label="Users" />} />
      <Tab.Screen name="Logs" children={() => <Screen label="Logs" />} />
      <Tab.Screen name="Settings" children={() => <Screen label="Settings" />} />
    </Tab.Navigator>
  );
}

