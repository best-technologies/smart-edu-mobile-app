#!/bin/bash

# SmartEdu Mobile App - Environment Startup Script
# Usage: ./scripts/start-env.sh [environment] [platform]

ENVIRONMENT=${1:-development}
PLATFORM=${2:-ios}

echo "🚀 Starting SmartEdu app in $ENVIRONMENT mode for $PLATFORM..."

case $ENVIRONMENT in
  "development")
    echo "📱 Development mode - Using ngrok URL"
    EXPO_PUBLIC_ENV=development EXPO_PUBLIC_API_URL=https://86226b38f657.ngrok-free.app/api/v1 npx expo start --$PLATFORM
    ;;
  "staging")
    echo "🧪 Staging mode - Using staging server"
    EXPO_PUBLIC_ENV=staging EXPO_PUBLIC_API_URL=https://smart-edu-hub-staging.onrender.com/api/v1 npx expo start --$PLATFORM
    ;;
  "production")
    echo "🏭 Production mode - Using production server"
    EXPO_PUBLIC_ENV=production EXPO_PUBLIC_API_URL=https://smart-edu-hub.onrender.com/api/v1 npx expo start --$PLATFORM
    ;;
  *)
    echo "❌ Invalid environment. Use: development, staging, or production"
    exit 1
    ;;
esac
