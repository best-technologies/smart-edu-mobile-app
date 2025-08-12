# Smart Edu Hub - Mobile App Folder Structure

## 📁 Project Overview

Smart Edu Hub is a comprehensive educational management mobile application built with React Native, Expo, and TypeScript. The app serves multiple user roles including School Directors, Teachers, Students, and Developers.

## 🏗️ Root Directory Structure

```
smart-edu-mobile-app/
├── 📁 src/                    # Main source code directory
├── 📁 assets/                 # Static assets (images, icons, etc.)
├── 📁 components/             # Global shared components
├── 📁 DOCS/                   # Project documentation
├── 📁 node_modules/           # Dependencies (auto-generated)
├── 📁 .expo/                  # Expo configuration (auto-generated)
├── 📁 .git/                   # Git repository (auto-generated)
├── 📄 app.json               # Expo app configuration
├── 📄 package.json           # Project dependencies and scripts
├── 📄 package-lock.json      # Locked dependency versions
├── 📄 tsconfig.json          # TypeScript configuration
├── 📄 tailwind.config.js     # Tailwind CSS configuration
├── 📄 babel.config.js        # Babel configuration
├── 📄 metro.config.js        # Metro bundler configuration
├── 📄 global.css             # Global CSS styles
├── 📄 index.ts               # App entry point
├── 📄 .gitignore             # Git ignore rules
├── 📄 .prettierrc            # Prettier code formatting rules
└── 📄 nativewind-env.d.ts    # NativeWind TypeScript definitions
```

## 📁 Source Code Structure (`src/`)

### 🎯 Core Application Files

```
src/
├── 📄 App.tsx                # Main application component
├── 📁 auth/                  # Authentication module
├── 📁 components/            # Global shared components
├── 📁 mock/                  # Mock data and services
├── 📁 navigation/            # Navigation configuration
├── 📁 roles/                 # Role-specific modules
└── 📁 screens/               # Global screens
```

## 🔐 Authentication Module (`src/auth/`)

```
src/auth/
├── 📄 index.ts               # Main auth exports
├── 📄 types.ts               # Authentication TypeScript types
├── 📄 utils.ts               # Authentication utility functions
├── 📁 login/                 # Login functionality
│   ├── 📄 index.ts           # Login exports
│   ├── 📄 LoginScreen.tsx    # Main login screen
│   └── 📁 components/        # Login-specific components
│       ├── 📄 LoginForm.tsx          # Reusable login form
│       ├── 📄 LoginHeader.tsx        # Login screen header
│       └── 📄 SocialLoginButtons.tsx # Social login options
└── 📁 forgot-password/       # Password reset functionality
    ├── 📄 index.ts           # Forgot password exports
    ├── 📄 ForgotPasswordScreen.tsx # Main forgot password screen
    └── 📁 components/        # Forgot password components
        └── 📄 ForgotPasswordHeader.tsx # Forgot password header
```

## 🎭 Role-Based Modules (`src/roles/`)

### 👨‍🏫 Teacher Module (`src/roles/teacher/`)

```
src/roles/teacher/
├── 📄 TeacherTabs.tsx        # Teacher tab navigation
└── 📁 screens/               # Teacher-specific screens
    ├── 📄 TeacherDashboardScreen.tsx # Teacher dashboard
    ├── 📄 SubjectsScreen.tsx         # Subjects management
    ├── 📄 SubjectDetailScreen.tsx    # Individual subject view
    ├── 📄 StudentsScreen.tsx         # Students management
    ├── 📄 SchedulesScreen.tsx        # Schedule management
    ├── 📄 VideoDemoScreen.tsx        # Video demonstration
    └── 📁 components/        # Teacher-specific components
        ├── 📁 dashboard/     # Dashboard components
        ├── 📁 schedules/     # Schedule components
        ├── 📁 students/      # Student management components
        ├── 📁 subjects/      # Subject management components
        └── 📁 shared/        # Shared teacher components
```

### 👨‍💼 School Director Module (`src/roles/school_director/`)

```
src/roles/school_director/
├── 📄 SchoolDirectorTabs.tsx # Director tab navigation
└── 📁 screens/               # Director-specific screens
    ├── 📄 DirectorDashboardScreen.tsx # Director dashboard
    ├── 📄 TeachersScreen.tsx         # Teachers management
    ├── 📄 StudentsScreen.tsx         # Students overview
    ├── 📄 SubjectsScreen.tsx         # Subjects overview
    ├── 📄 SchedulesScreen.tsx        # Schedule overview
    └── 📁 components/        # Director-specific components
        ├── 📁 dashboard/     # Dashboard components
        ├── 📁 schedules/     # Schedule components
        ├── 📁 students/      # Student components
        ├── 📁 subjects/      # Subject components
        ├── 📁 teachers/      # Teacher components
        └── 📁 shared/        # Shared director components
```

### 👨‍🎓 Student Module (`src/roles/student/`)

```
src/roles/student/
├── 📄 StudentTabs.tsx        # Student tab navigation
└── 📁 screens/               # Student-specific screens
    └── 📁 components/        # Student-specific components
```

### 👨‍💻 Developer Module (`src/roles/developer/`)

```
src/roles/developer/
├── 📄 DeveloperTabs.tsx      # Developer tab navigation
└── 📁 screens/               # Developer-specific screens
    └── 📁 components/        # Developer-specific components
```

## 🧩 Global Components (`src/components/`)

```
src/components/
├── 📄 SplashScreen.tsx       # Custom splash screen
├── 📄 BackButton.tsx         # Reusable back button
└── 📄 Hello.tsx              # Hello component
```

## 🧭 Navigation (`src/navigation/`)

```
src/navigation/
└── 📄 RootNavigator.tsx      # Main navigation configuration
```

## 🎭 Mock Data (`src/mock/`)

```
src/mock/
├── 📄 index.ts               # Mock data exports
├── 📄 director.ts            # Director mock data
├── 📄 teacher.ts             # Teacher mock data
├── 📄 teachers.ts            # Teachers list mock data
├── 📄 student.ts             # Student mock data
├── 📄 students.ts            # Students list mock data
├── 📄 subjects.ts            # Subjects mock data
└── 📄 schedules.ts           # Schedules mock data
```

## 🖼️ Assets (`assets/`)

```
assets/
├── 📄 accessstudy-logo.png   # App logo
├── 📄 adaptive-icon.png      # Adaptive app icon
├── 📄 favicon.png            # Favicon
├── 📄 icon.png               # App icon
├── 📄 splash-icon.png        # Splash screen icon
└── 📄 splash.png             # Splash screen image
```

## 📚 Documentation (`DOCS/`)

```
DOCS/
└── 📄 folder-struture.md     # This documentation file
```

## 🏗️ Architecture Principles

### 📁 Folder Organization

1. **Feature-Based Structure**: Each major feature has its own folder
2. **Role-Based Separation**: Different user roles are completely separated
3. **Component Reusability**: Shared components are organized for maximum reuse
4. **Clear Hierarchy**: Logical folder nesting for easy navigation

### 🔄 Import/Export Patterns

- **Index Files**: Each folder has an `index.ts` for clean imports
- **Barrel Exports**: Related components are exported together
- **Type Safety**: TypeScript interfaces are centralized in `types.ts` files

### 🎯 Component Structure

- **Screens**: Main page components
- **Components**: Reusable UI components
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions

## 🚀 Development Guidelines

### 📝 File Naming Conventions

- **PascalCase**: React components (e.g., `LoginScreen.tsx`)
- **camelCase**: Utilities and functions (e.g., `utils.ts`)
- **kebab-case**: Folders (e.g., `forgot-password/`)

### 🎨 Component Organization

- **One component per file**: Each component has its own file
- **Props interfaces**: Defined at the top of each component file
- **Consistent structure**: Similar components follow the same pattern

### 🔧 Configuration Files

- **TypeScript**: Strict configuration for type safety
- **Tailwind**: Utility-first CSS framework
- **Expo**: React Native development platform
- **Babel**: JavaScript transpilation

## 📱 App Features by Module

### 🔐 Authentication
- User login with email/phone
- Password reset functionality
- Social login integration (Google, Apple)
- Secure authentication flow

### 👨‍🏫 Teacher Features
- Dashboard with quick stats
- Subject management
- Student management
- Schedule management
- Video content creation

### 👨‍💼 Director Features
- Comprehensive dashboard
- Teacher management
- Student overview
- Subject overview
- Schedule overview

### 👨‍🎓 Student Features
- Learning dashboard
- Subject access
- Schedule viewing

### 👨‍💻 Developer Features
- Development tools
- Testing utilities

## 🔄 Navigation Flow

```
Splash Screen → Login → Role Selection → Role-Specific Dashboard
                ↓
            Forgot Password → Email Reset → Back to Login
```

This structure provides a scalable, maintainable, and well-organized codebase for the Smart Edu Hub mobile application.
