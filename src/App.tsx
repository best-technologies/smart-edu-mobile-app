import "../global.css";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View } from 'react-native';
import Hello from '@/components/Hello';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Keep the native splash screen visible for a moment so it's noticeable
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op if already prevented
});

export default function App() {
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

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-black">
      <View className="w-full max-w-md px-4">
        <Hello />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
