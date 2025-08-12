import "../global.css";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View } from 'react-native';
import RootNavigator from '@/navigation/RootNavigator';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from './components/SplashScreen';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Keep the native splash screen visible for a moment so it's noticeable
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op if already prevented
});

function AppContent() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isInitialized, isLoading } = useAuth();

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

  // Show custom splash screen until auth is initialized and splash time is complete
  if (isSplashVisible || !isInitialized || isLoading) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1">
        <RootNavigator />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
