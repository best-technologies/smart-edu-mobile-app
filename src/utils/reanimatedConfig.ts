import { LogBox } from 'react-native';

// Disable Reanimated strict mode warnings
LogBox.ignoreLogs([
  '[Reanimated] Writing to `value` during component render.',
  '[expo-av]: Expo AV has been deprecated and will be removed in SDK 54. Use the `expo-audio` and `expo-video` packages to replace the required functionality.',
]);
