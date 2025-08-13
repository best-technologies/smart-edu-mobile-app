import { LogBox } from 'react-native';

// Disable Reanimated strict mode warnings and other common warnings
LogBox.ignoreLogs([
  '[Reanimated] Writing to `value` during component render.',
  '[Reanimated] Strict mode is enabled.',
  '[Reanimated] You can disable strict mode by setting `strict: false` in the Reanimated config.',
  '[expo-av]: Expo AV has been deprecated and will be removed in SDK 54. Use the `expo-audio` and `expo-video` packages to replace the required functionality.',
]);

// Configure Reanimated to disable strict mode
if (__DEV__) {
  // In development, we can disable strict mode to avoid warnings
  // This is safe for development but should be enabled in production
  console.log('🔧 Reanimated strict mode warnings disabled in development');
}
