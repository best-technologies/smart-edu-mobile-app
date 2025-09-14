const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Suppress known warnings
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Suppress expo-notifications warnings
    if (message.includes('expo-notifications') || 
        message.includes('Android Push notifications') ||
        message.includes('functionality is not fully supported in Expo Go')) {
      return;
    }
    
    // Suppress Reanimated warnings
    if (message.includes('[Reanimated]') && 
        message.includes('react-native-reanimated/plugin')) {
      return;
    }
    
    // Suppress SafeAreaView deprecation warnings
    if (message.includes('SafeAreaView has been deprecated')) {
      return;
    }
    
    // Suppress expo-av deprecation warnings
    if (message.includes('[expo-av]: Expo AV has been deprecated')) {
      return;
    }
  }
  originalConsoleWarn.apply(console, args);
};

module.exports = withNativeWind(config, { input: "./global.css" });

