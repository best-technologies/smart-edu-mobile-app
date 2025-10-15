// Environment configuration
const getEnvironmentConfig = () => {
  const environment = process.env.EXPO_PUBLIC_ENV || 'development';

  const ngrok_url = "https://86226b38f657.ngrok-free.app/api/v1";
  const local_url = "http://localhost:1000/api/v1";
  const render_staging = "https://smart-edu-hub-staging.onrender.com/api/v1";
  const render_production = "https://smart-edu-hub.onrender.com/api/v1";
  
  const configs = {
    development: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || local_url,
      environment: 'development'
    },
    staging: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || render_staging,
      environment: 'staging'
    },
    production: {
      apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || render_production,
      environment: 'production'
    }
  };
  
  return configs[environment] || configs.development;
};

const envConfig = getEnvironmentConfig();

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
      "updates": {
        "url": "https://u.expo.dev/bbac449d-c7b3-4ede-85a3-39d3bca21622"
      },
      "ios": {
        "supportsTablet": false,
        "bundleIdentifier": "com.besttechltd.smartedu",
        "runtimeVersion": "1.0.0"
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
        "package": "com.besttechltd.smartedu",
        "runtimeVersion": {
          "policy": "appVersion"
        }
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
        ...envConfig
      },
      "owner": "besttechltd"
    }
  }
  