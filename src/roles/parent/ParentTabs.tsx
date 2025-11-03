import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ParentDashboardScreen from './screens/ParentDashboardScreen';
import ParentChildrenScreen from './screens/ParentChildrenScreen';
import ParentReportsScreen from './screens/ParentReportsScreen';
import ParentCommunicationScreen from './screens/ParentCommunicationScreen';
import ParentProfileScreen from './screens/ParentProfileScreen';

function Screen({ label }: { label: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">{label}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function ParentTabs() {
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
            Children: 'people',
            Reports: 'bar-chart',
            Communication: 'chatbubbles',
            Profile: 'person',
          };
          const outlineMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Dashboard: 'home-outline',
            Children: 'people-outline',
            Reports: 'bar-chart-outline',
            Communication: 'chatbubbles-outline',
            Profile: 'person-outline',
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
      <Tab.Screen name="Dashboard" component={ParentDashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Children" component={ParentChildrenScreen} />
      <Tab.Screen name="Reports" component={ParentReportsScreen} />
      <Tab.Screen name="Communication" component={ParentCommunicationScreen} />
      <Tab.Screen name="Profile" component={ParentProfileScreen} />
    </Tab.Navigator>
  );
}

