## Real-Device Testing While Continuing Active Development

This guide shows how to let users install and test the app on their phones while you continue building. You’ll use EAS (Expo Application Services) to create installable binaries (Dev Client or Production) instead of Expo Go.

### 1) Prerequisites
- Expo account (login: `eas login`)
- Project linked to EAS (`eas init`)
- Real devices for iOS and Android

### 2) Choose Your Build Type
- Dev Client (recommended during development)
  - Faster iteration, supports native modules, installable like a real app
  - Build: `eas build -p ios --profile development` and `eas build -p android --profile development`
- Production/Release build (for external testers)
  - iOS via TestFlight, Android via Internal Testing/Closed track
  - Build: `eas build -p ios --profile production` and `eas build -p android --profile production`

After building, EAS provides install links/QR codes you can share with testers.

### 3) Notifications: App Icon & Custom Sound
1) Add a small, monochrome, transparent PNG for Android status bar (example):
   - `assets/notification-icon.png` (white glyph, no background)

2) Use a .wav (or .aiff/.caf for iOS) for custom sound:
   - Place `assets/notification-1.wav`

3) Configure the expo-notifications plugin in `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff",
          "sounds": ["./assets/notification-1.wav"]
        }
      ]
    ],
    "extra": {
      "eas": { "projectId": "YOUR-EAS-PROJECT-UUID" }
    }
  }
}
```

4) Set Android notification channel (on app start):
```ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function configureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'notification-1.wav',
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}
```
Call this once during app initialization.

### 4) Push Payload Sound Reference
- iOS (Expo push message JSON): include `"sound": "notification-1"`
- Android: use the channel defined above; if specifying a channel, send with `"channelId": "default"`.

### 5) Installing on Testers’ Devices
- Dev Client
  - iOS: EAS will produce an install link/TestFlight invite for the dev build profile
  - Android: EAS produces an APK/AAB; share the link or upload to Play Console Internal testing
- Production build
  - iOS: Upload to App Store Connect → TestFlight → invite testers
  - Android: Upload to Play Console → Internal/Closed testing track → invite testers

### 6) Updating While Users Test
- Small JS-only updates: use EAS Update (optional) to push over-the-air JS updates without rebuilding
- Native/plugin/config changes: rebuild with EAS

### 7) Common Notes
- Expo Go cannot display your custom notification icon/sound; use a dev client or production build
- Any changes in `app.json` plugin options (icons/sounds) require a new native build
- Use absolute backend URLs on device (e.g., ngrok) and ensure the tunnel is reachable on mobile data/Wi‑Fi

### 8) Quick Commands Recap
```bash
# Login & initialize once
eas login
eas init

# Dev builds (recommended for active development)
eas build -p ios --profile development
eas build -p android --profile development

# Production builds (TestFlight / Play Console)
eas build -p ios --profile production
eas build -p android --profile production
```


