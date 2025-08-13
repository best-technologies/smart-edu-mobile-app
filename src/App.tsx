import "../global.css";
import { StatusBar } from 'react-native';
import { SafeAreaView, View } from 'react-native';
import RootNavigator from '@/navigation/RootNavigator';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { ToastContainer } from '@/components';
import './utils/reanimatedConfig'; // Disable Reanimated warnings


// Keep the native splash screen visible for a moment so it's noticeable
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op if already prevented
});

function AppContent() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isInitialized } = useAuth();

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
    <ToastProvider>
      <AuthProvider>
        <UserProfileProvider>
          <AppContent />
        </UserProfileProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
