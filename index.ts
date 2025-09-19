import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

// Configure Reanimated and disable warnings
if (__DEV__) {
  // Disable Reanimated strict mode warnings in development
  LogBox.ignoreLogs([
    '[Reanimated] Writing to `value` during component render.',
    '[Reanimated] Strict mode is enabled.',
    '[Reanimated] You can disable strict mode by setting `strict: false` in the Reanimated config.',
  ]);
}

import App from './src/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
