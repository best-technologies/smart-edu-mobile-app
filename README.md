# SmartEdu Mobile App

A comprehensive educational mobile application built with Expo/React Native, featuring role-based access for students, teachers, and school directors.

## 📱 Project Overview

- **Framework**: Expo/React Native
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Query (TanStack Query)
- **Navigation**: React Navigation
- **Backend**: NestJS API
- **Deployment**: EAS (Expo Application Services)

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd smart-edu-mobile-app

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
src/
├── auth/                    # Authentication screens & logic
├── components/              # Reusable UI components
├── contexts/               # React contexts (Auth, Toast, etc.)
├── hooks/                  # Custom React hooks
├── navigation/             # Navigation configuration
├── roles/                  # Role-specific screens
│   ├── student/           # Student-specific screens
│   ├── teacher/           # Teacher-specific screens
│   └── school_director/   # Director-specific screens
├── screens/               # Shared screens
├── services/              # API services & configuration
└── utils/                 # Utility functions
```

## 🔧 Environment Configuration

### Environment Variables
The app uses environment-based configuration through `app.config.js`:

- **Development**: Uses ngrok URL for local development
- **Staging**: Uses staging server URL
- **Production**: Uses production server URL

### Setting Up Environments

#### 1. Create Environment Files
```bash
# .env.development
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.app/api/v1

# .env.staging
EXPO_PUBLIC_ENV=staging
EXPO_PUBLIC_API_URL=https://smart-edu-hub-staging.onrender.com/api/v1

# .env.production
EXPO_PUBLIC_ENV=production
EXPO_PUBLIC_API_URL=https://smart-edu-hub.onrender.com/api/v1
```

#### 2. Running Different Environments
```bash
# Development
npm run dev
npm run dev:ios
npm run dev:android

# Staging
npm run staging
npm run staging:ios
npm run staging:android

# Production
npm run prod
```

## 🚀 Deployment Guide

### Two Types of Updates

#### 1. Over-the-Air (OTA) Updates - INSTANT ⚡
For JavaScript/TypeScript changes only:
```bash
# Deploy instantly to users
npm run update:dev      # Development
npm run update:staging  # Staging
npm run update:prod     # Production
```

#### 2. App Store Updates - MANUAL 📦
For native changes, new dependencies, or permission changes:
```bash
# Build new app version
npm run build:dev       # Development build
npm run build:staging   # Staging build
npm run build:prod      # Production build
```

### GitHub Actions CI/CD

The project includes automated GitHub Actions for:
- **Development branch** → Builds development version
- **Staging branch** → Builds staging version
- **Main branch** → Builds production version

#### Setting Up GitHub Actions

1. **Get EXPO_TOKEN**:
   - Go to https://expo.dev/settings/access-tokens
   - Create a new token
   - Copy the token

2. **Add to GitHub Secrets**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add `EXPO_TOKEN` with your token

3. **Push to trigger builds**:
   ```bash
   git push origin staging  # Triggers staging build
   git push origin main     # Triggers production build
   ```

### Manual Deployment Process

#### For New App Versions:
1. **Make changes** to your code
2. **Commit and push**:
   ```bash
   git add .
   git commit -m "New feature"
   git push origin main
   ```
3. **GitHub Actions builds** the app automatically
4. **Download APK/AAB** from Expo dashboard
5. **Upload to Play Console** manually
6. **Wait for approval** (1-3 days)

#### For Instant Updates:
1. **Make JavaScript/TypeScript changes**
2. **Deploy instantly**:
   ```bash
   npm run update:prod
   ```
3. **Users get update** immediately when they open the app

## 📱 App Store Deployment

### Google Play Console Setup

#### Current Workflow (Manual Upload):
1. **Build app** via GitHub Actions
2. **Download APK/AAB** from Expo dashboard
3. **Upload to Play Console** manually
4. **Submit for review**

#### Future Setup (Automatic Upload):
Once your app is published, you can set up automatic uploads:

1. **Create Google Service Account**:
   - Go to Google Cloud Console
   - Create service account
   - Download JSON key

2. **Upload to Expo**:
   - Go to Expo dashboard → Credentials
   - Upload Google Service Account key

3. **Configure Play Console**:
   - Link Google Cloud project
   - Grant permissions to service account

### App Store Connect Setup

#### For iOS Deployment:
1. **Apple Developer Account** (paid)
2. **App Store Connect** setup
3. **iOS Distribution Certificate**
4. **Provisioning Profile**

#### Setting Up iOS Credentials:
```bash
# Configure iOS credentials
eas credentials

# Build for iOS
eas build --platform ios --profile production
```

## 🔧 Development Workflow

### Daily Development
```bash
# Start development server
npm run dev

# Make changes to your code
# Test on device/simulator

# For instant updates to users
npm run update:dev
```

### Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create pull request
# Merge to staging after review
```

### Production Release
```bash
# Merge to main
git checkout main
git merge staging
git push origin main

# GitHub Actions builds production app
# Download and upload to stores
# Deploy instant updates
npm run update:prod
```

## 🛠️ Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run dev:ios` - Start development server for iOS
- `npm run dev:android` - Start development server for Android
- `npm run staging` - Start staging server
- `npm run prod` - Start production server

### Updates (OTA)
- `npm run update:dev` - Deploy to development
- `npm run update:staging` - Deploy to staging
- `npm run update:prod` - Deploy to production

### Builds
- `npm run build:dev` - Build development version
- `npm run build:staging` - Build staging version
- `npm run build:prod` - Build production version

## 📊 Monitoring & Debugging

### Expo Dashboard
- **Builds**: https://expo.dev/accounts/besttechltd/projects/smartedu
- **Updates**: Monitor OTA updates
- **Analytics**: App performance metrics

### GitHub Actions
- **Workflow Runs**: https://github.com/your-username/smart-edu-mobile-app/actions
- **Build Logs**: Click on any workflow run
- **Status**: Green ✅ = Success, Red ❌ = Failed

### EAS CLI Commands
```bash
# Check authentication
eas whoami

# List builds
eas build:list

# View build details
eas build:view [BUILD_ID]

# List updates
eas update:list
```

## 🔐 Security & Credentials

### Environment Variables
- **EXPO_PUBLIC_*** variables are bundled into the app
- **Never put sensitive data** in EXPO_PUBLIC_ variables
- **Use GitHub Secrets** for sensitive configuration

### API Configuration
- **Base URL**: Configured in `src/services/config/apiConfig.ts`
- **Environment-based**: Automatically switches based on environment
- **Fallback URLs**: Provided for each environment

## 🚨 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Check EAS status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

#### Update Not Working
```bash
# Check update status
eas update:list

# Force update
eas update --branch production --message "Force update"
```

#### GitHub Actions Fails
1. Check GitHub Actions tab
2. Verify EXPO_TOKEN is set
3. Check build logs for specific errors

### Getting Help
- **Expo Docs**: https://docs.expo.dev/
- **EAS Docs**: https://docs.expo.dev/eas/
- **GitHub Issues**: Check repository issues
- **Expo Discord**: Community support

## 📈 Performance Optimization

### Bundle Size
- **Monitor bundle size** in Expo dashboard
- **Use dynamic imports** for large components
- **Optimize images** and assets

### Update Strategy
- **Use OTA updates** for quick fixes
- **Use app store updates** for major changes
- **Test updates** on staging first

## 🔄 Maintenance

### Regular Tasks
1. **Update dependencies** monthly
2. **Monitor build status** weekly
3. **Check for security updates**
4. **Review app performance** metrics

### Before Major Releases
1. **Test on staging** environment
2. **Verify all features** work correctly
3. **Check app store** guidelines
4. **Prepare release notes**

## 📞 Support

- **Project Owner**: besttechltd
- **Expo Project ID**: bbac449d-c7b3-4ede-85a3-39d3bca21622
- **Repository**: https://github.com/maxi-musz/smart-edu-mobile-app

---

## 🎯 Quick Reference

### Start Development
```bash
npm run dev
```

### Deploy Update
```bash
npm run update:prod
```

### Build New Version
```bash
npm run build:prod
```

### Check Status
```bash
eas whoami
eas build:list
```

**This README contains everything you need to know about the SmartEdu mobile app project. Bookmark it for future reference!** 🚀
