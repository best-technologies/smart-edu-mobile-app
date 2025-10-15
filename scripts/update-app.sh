#!/bin/bash

# SmartEdu Mobile App - OTA Update Script
# Usage: ./scripts/update-app.sh [environment] [message]

ENVIRONMENT=${1:-development}
MESSAGE=${2:-"Update"}

echo "🚀 Publishing OTA update for $ENVIRONMENT environment..."

case $ENVIRONMENT in
  "development")
    echo "📱 Publishing to development channel"
    eas update --branch development --message "$MESSAGE"
    ;;
  "staging")
    echo "🧪 Publishing to staging channel"
    eas update --branch staging --message "$MESSAGE"
    ;;
  "production")
    echo "🏭 Publishing to production channel"
    eas update --branch production --message "$MESSAGE"
    ;;
  *)
    echo "❌ Invalid environment. Use: development, staging, or production"
    exit 1
    ;;
esac

echo "✅ Update published successfully!"
echo "📱 Users will receive the update automatically when they open the app"
