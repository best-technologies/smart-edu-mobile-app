import "../global.css";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View } from 'react-native';
import RootNavigator from '@/navigation/RootNavigator';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from './components/SplashScreen';

// Keep the native splash screen visible for a moment so it's noticeable
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op if already prevented
});

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const showThenHide = async () => {
      // Simulate some startup work, then hide the splash
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

  if (isSplashVisible) {
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
