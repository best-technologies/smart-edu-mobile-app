import "../global.css";
import { StatusBar } from 'react-native';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from '@/navigation/RootNavigator';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { QueryProvider } from '@/contexts/QueryProvider';
import { ToastContainer } from '@/components';
import { pushNotificationService } from './services/pushNotificationService';

// Suppress known warnings at app level
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Suppress expo-notifications warnings
    if (message.includes('expo-notifications') || 
        message.includes('Android Push notifications') ||
        message.includes('functionality is not fully supported in Expo Go') ||
        message.includes('Use a development build instead of Expo Go') ||
        message.includes('We recommend you instead use a development build') ||
        message.includes('expo-notifications: Android Push notifications')) {
      return;
    }
    
    // Suppress Reanimated warnings
    if (message.includes('[Reanimated]') && 
        message.includes('react-native-reanimated/plugin')) {
      return;
    }
    
    // Suppress expo-av deprecation warnings
    if (message.includes('[expo-av]: Expo AV has been deprecated')) {
      return;
    }
    
    // Suppress SafeAreaView deprecation warnings
    if (message.includes('SafeAreaView has been deprecated')) {
      return;
    }
  }
  originalConsoleWarn.apply(console, args);
};

console.log = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Suppress Reanimated warnings that come through console.log
    if (message.includes('[Reanimated]') && 
        message.includes('react-native-reanimated/plugin')) {
      return;
    }
    
    // Suppress other unwanted logs
    if (message.includes('SafeAreaView has been deprecated')) {
      return;
    }
  }
  originalConsoleLog.apply(console, args);
};


// Keep the native splash screen visible for a moment so it's noticeable
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op if already prevented
});

function AppContent() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isInitialized, isAuthenticated } = useAuth();

  useEffect(() => {
    const showThenHide = async () => {
      // Show splash for at least 1.2 seconds
      await new Promise(resolve => setTimeout(resolve, 1200));
      try {
        await SplashScreen.hideAsync();
      } catch {
        // ignore
      }
    };
    showThenHide();
  }, []);

  // Initialize push notifications for authenticated users
  useEffect(() => {
    const initPushNotifications = async () => {
      try {
        await pushNotificationService.registerForPushNotifications();
      } catch (error) {
        console.error('Failed to initialize push notifications:', error);
      }
    };

    if (isInitialized && isAuthenticated) {
      initPushNotifications();
    }
  }, [isInitialized, isAuthenticated]);

  const handleSplashFinish = () => {
    setIsSplashVisible(false);
  };

  // Show custom splash screen only during app initialization
  // Don't show splash screen during login operations (isLoading)
  if (isSplashVisible || !isInitialized) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: 'transparent' }}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      <RootNavigator />
      <ToastContainer />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <ToastProvider>
          <AuthProvider>
            <UserProfileProvider>
              <AppContent />
            </UserProfileProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
