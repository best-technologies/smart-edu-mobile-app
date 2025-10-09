export default {
    expo: {
      "name": "SmartEdu",
      "slug": "smartedu",
      "version": "1.0.0",
      "orientation": "portrait",
      "icon": "./assets/icon.png",
      "userInterfaceStyle": "light",
      "newArchEnabled": true,
      "splash": {
        "image": "./assets/splash-icon.png",
        "resizeMode": "contain",
        "backgroundColor": "#1e293b"
      },
      "ios": {
        "supportsTablet": false,
        "bundleIdentifier": "com.besttechltd.smartedu"
      },
      "android": {
        "adaptiveIcon": {
          "foregroundImage": "./assets/icon.png",
          "backgroundColor": "#ffffff"
        },
        "edgeToEdgeEnabled": true,
        "permissions": [
          "android.permission.RECORD_AUDIO",
          "android.permission.MODIFY_AUDIO_SETTINGS"
        ],
        "package": "com.besttechltd.smartedu"
      },
      "web": {
        "bundler": "metro",
        "favicon": "./assets/icon.png"
      },
      "plugins": [
        [
          "expo-video",
          {
            "supportsBackgroundPlayback": true,
            "supportsPictureInPicture": true
          }
        ],
        "expo-audio",
        [
          "expo-notifications",
          {
            "icon": "./assets/icon.png",
            "color": "#ffffff",
            "sounds": [
              "./assets/notification1.mp3"
            ]
          }
        ],
        "expo-font"
      ],
      "extra": {
        "eas": {
          "projectId": "bbac449d-c7b3-4ede-85a3-39d3bca21622"
        },
        "apiBaseUrl": "https://smart-edu-hub.onrender.com/api/v1"
      },
      "owner": "besttechltd"
    }
  }
  