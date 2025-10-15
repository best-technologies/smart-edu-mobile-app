# Environment Variables Setup for SmartEdu Mobile App

## Overview
This app now supports environment-based configuration using Expo's built-in environment variable system.

## How it works

### 1. Environment Variables
- **EXPO_PUBLIC_ENV**: Controls which environment config to use (`development`, `staging`, `production`)
- **EXPO_PUBLIC_API_URL**: Overrides the default API URL for the current environment

### 2. Configuration Files
The app uses `app.config.js` to dynamically configure based on environment variables.

## Setup Instructions

### For Development
Create a `.env.development` file in the project root:
```bash
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_URL=https://86226b38f657.ngrok-free.app/api/v1
```

### For Staging
Create a `.env.staging` file:
```bash
EXPO_PUBLIC_ENV=staging
EXPO_PUBLIC_API_URL=https://smart-edu-hub-staging.onrender.com/api/v1
```

### For Production
Create a `.env.production` file:
```bash
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_API_URL=https://smart-edu-hub.onrender.com/api/v1
```

## Running the App

### Development
```bash
# Load .env.development
EXPO_PUBLIC_ENV=development npx expo start

# Or with custom API URL
EXPO_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.app/api/v1 npx expo start
```

### Staging
```bash
EXPO_PUBLIC_ENV=staging npx expo start
```

### Production
```bash
EXPO_PUBLIC_ENV=production npx expo start
```

## EAS Build Configuration

### For EAS Build, update your `eas.json`:
```json
{
  "build": {
    "development": {
      "env": {
        "EXPO_PUBLIC_ENV": "development",
        "EXPO_PUBLIC_API_URL": "https://86226b38f657.ngrok-free.app/api/v1"
      }
    },
    "staging": {
      "env": {
        "EXPO_PUBLIC_ENV": "staging",
        "EXPO_PUBLIC_API_URL": "https://smart-edu-hub-staging.onrender.com/api/v1"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_ENV": "production",
        "EXPO_PUBLIC_API_URL": "https://smart-edu-hub.onrender.com/api/v1"
      }
    }
  }
}
```

## Important Notes

1. **EXPO_PUBLIC_ prefix**: Only variables with this prefix are available in the app
2. **Security**: Never put sensitive data in EXPO_PUBLIC_ variables as they're bundled into the app
3. **Fallbacks**: The app has fallback URLs if environment variables aren't set
4. **Platform-specific**: The same environment variables work across iOS, Android, and Web

## Current Configuration

- **Development**: Uses ngrok URL for local development
- **Staging**: Uses staging server URL
- **Production**: Uses production server URL

The API configuration is automatically resolved based on the environment at build time.
