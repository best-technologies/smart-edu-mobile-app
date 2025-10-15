# SmartEdu Mobile App - Professional Deployment Guide

## 🚀 Overview

This guide explains how to professionally deploy and update your mobile app, similar to how you deploy web apps to Render/Vercel.

## 📱 Mobile App Deployment vs Web Apps

| Web Apps (NestJS/NextJS) | Mobile Apps (Expo/React Native) |
|---------------------------|----------------------------------|
| Push to GitHub → Auto deploy | Push to GitHub → Build → Manual store upload |
| Users get updates instantly | Users must download from store |
| No approval process | App Store/Play Store approval (1-3 days) |

## 🔄 Two Types of Mobile App Updates

### 1. **Over-the-Air (OTA) Updates** ⚡
- **What**: JavaScript/TypeScript changes only
- **Speed**: Instant (like web apps)
- **Limitations**: Cannot change native code, dependencies, or permissions
- **Use for**: Bug fixes, UI changes, feature updates

### 2. **App Store Updates** 📦
- **What**: Native changes, new dependencies, permission changes
- **Speed**: 1-3 days (store approval)
- **Use for**: New features requiring native code, dependency updates

## 🛠️ Professional Workflow

### **Development Workflow**
```bash
# 1. Make changes to your code
git add .
git commit -m "Add new feature"
git push origin development

# 2. For OTA updates (instant)
npm run update:dev

# 3. For native changes (requires new build)
npm run build:dev
```

### **Staging Workflow**
```bash
# 1. Merge to staging branch
git checkout staging
git merge development
git push origin staging

# 2. Deploy to staging
npm run update:staging  # For OTA updates
# OR
npm run build:staging   # For native changes
```

### **Production Workflow**
```bash
# 1. Merge to main branch
git checkout main
git merge staging
git push origin main

# 2. Deploy to production
npm run update:prod     # For OTA updates
# OR
npm run build:prod      # For native changes + store submission
```

## 🔧 Setup Instructions

### **1. GitHub Actions Setup**
1. Go to your GitHub repository
2. Go to Settings → Secrets and variables → Actions
3. Add `EXPO_TOKEN` secret:
   - Get token from: https://expo.dev/settings/access-tokens
   - Add as repository secret

### **2. EAS Setup**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure
```

### **3. App Store Connect Setup**
1. Create app in App Store Connect
2. Configure app metadata
3. Set up TestFlight for testing

### **4. Google Play Console Setup**
1. Create app in Google Play Console
2. Upload signing key
3. Configure app metadata

## 📋 Deployment Commands

### **Development**
```bash
npm run dev              # Start development server
npm run update:dev       # Publish OTA update
npm run build:dev        # Build for testing
```

### **Staging**
```bash
npm run staging          # Start staging server
npm run update:staging   # Publish OTA update
npm run build:staging    # Build for staging
```

### **Production**
```bash
npm run prod             # Start production server
npm run update:prod      # Publish OTA update
npm run build:prod       # Build and submit to stores
```

## 🔄 Automated Deployment

### **GitHub Actions**
- **Triggers**: Push to main/staging/development branches
- **Actions**: 
  - Development: Builds development version
  - Staging: Builds staging version
  - Main: Builds production version + submits to stores

### **Manual Deployment**
```bash
# OTA Update (instant)
./scripts/update-app.sh production "Bug fixes and improvements"

# New Build (requires store approval)
eas build --profile production --platform all
eas submit --platform all --profile production
```

## 📱 User Experience

### **OTA Updates**
- Users open app → Update downloads automatically
- No app store interaction needed
- Works like web app updates

### **App Store Updates**
- Users get notification about new version
- Must go to App Store/Play Store to update
- Takes 1-3 days for approval

## 🚨 Important Notes

1. **Always test on staging first**
2. **OTA updates are instant but limited**
3. **App store updates require approval**
4. **Keep version numbers in sync**
5. **Monitor crash reports and user feedback**

## 🔍 Monitoring

- **Expo Dashboard**: Monitor builds and updates
- **App Store Connect**: Monitor app performance
- **Google Play Console**: Monitor app performance
- **Crashlytics**: Monitor crashes and errors

## 🆘 Troubleshooting

### **Build Fails**
```bash
# Check EAS status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

### **Update Not Working**
```bash
# Check update status
eas update:list

# Force update
eas update --channel production --message "Force update"
```

### **Store Rejection**
- Check App Store Connect for rejection reasons
- Fix issues and resubmit
- Contact support if needed

## 📞 Support

- **Expo Docs**: https://docs.expo.dev/
- **EAS Docs**: https://docs.expo.dev/eas/
- **App Store Connect**: https://developer.apple.com/app-store-connect/
- **Google Play Console**: https://play.google.com/console/
