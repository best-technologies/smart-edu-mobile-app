# Smart Edu Hub - Mobile App Folder Structure

## 📁 Project Overview

Smart Edu Hub is a comprehensive educational management mobile application built with React Native, Expo, and TypeScript. The app serves multiple user roles including School Directors, Teachers, Students, and Developers, with a professional authentication system and modular API architecture.

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
├── 📄 App.tsx                # Main application component with AuthProvider
├── 📁 auth/                  # Authentication module
├── 📁 components/            # Global shared components
├── 📁 contexts/              # React Context providers
├── 📁 hooks/                 # Custom React hooks
├── 📁 mock/                  # Mock data and services
├── 📁 navigation/            # Navigation configuration
├── 📁 roles/                 # Role-based modules
├── 📁 screens/               # Global screens
└── 📁 services/              # API services and utilities
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
├── 📁 forgot-password/       # Password reset functionality
│   ├── 📄 index.ts           # Forgot password exports
│   ├── 📄 ForgotPasswordScreen.tsx # Main forgot password screen
│   └── 📁 components/        # Forgot password components
│       └── 📄 ForgotPasswordHeader.tsx # Forgot password header
└── 📁 otp-verification/      # OTP verification functionality
    ├── 📄 index.ts           # OTP verification exports
    ├── 📄 OTPVerificationScreen.tsx # Main OTP verification screen
    └── 📁 components/        # OTP verification components
```

## 🔧 Services Architecture (`src/services/`)

### 🏗️ Modular API Services

```
src/services/
├── 📄 index.ts               # Main services exports
├── 📁 api/                   # API service modules
│   ├── 📄 index.ts           # Unified API service interface
│   ├── 📄 authService.ts     # Authentication service
│   ├── 📄 httpClient.ts      # HTTP client with auth handling
│   ├── 📄 tokenManager.ts    # Token storage and management
│   └── 📄 roleServices.ts    # Role-specific services
├── 📁 config/                # Configuration files
│   ├── 📄 index.ts           # Config exports
│   └── 📄 apiConfig.ts       # API configuration & endpoints
└── 📁 types/                 # TypeScript type definitions
    ├── 📄 index.ts           # Type exports
    └── 📄 apiTypes.ts        # All API TypeScript types
```

### 🔑 Authentication Context (`src/contexts/`)

```
src/contexts/
└── 📄 AuthContext.tsx        # Authentication state management
```

### 🎣 Custom Hooks (`src/hooks/`)

```
src/hooks/
└── 📄 useAuthGuard.ts        # Authentication guards and route protection
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
5. **Modular Services**: API services are split into focused, maintainable modules

### 🔄 Import/Export Patterns

- **Index Files**: Each folder has an `index.ts` for clean imports
- **Barrel Exports**: Related components are exported together
- **Type Safety**: TypeScript interfaces are centralized in `types.ts` files
- **Service Modularity**: Each service has a single responsibility

### 🎯 Component Structure

- **Screens**: Main page components
- **Components**: Reusable UI components
- **Services**: API and business logic services
- **Contexts**: Global state management
- **Hooks**: Custom React hooks for shared logic
- **Types**: TypeScript type definitions

## 🔐 Authentication System

### 🏗️ Architecture Overview

The authentication system is built with a modular, scalable architecture that includes OTP verification for enhanced security:

```
Authentication Flow:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Splash Screen │───▶│  Auth Check     │───▶│  Login Screen   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Authenticated  │───▶│ Role Selection  │
                       └─────────────────┘    └─────────────────┘

OTP Verification Flow:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Login Screen  │───▶│  OTP Required   │───▶│ OTP Verification│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  OTP Verified   │───▶│ Role Selection  │
                       └─────────────────┘    └─────────────────┘
```

### 🔧 Service Architecture

#### **API Service Structure:**
- **HttpClient**: Handles network requests with authentication
- **TokenManager**: Manages token storage and refresh
- **AuthService**: Authentication-specific operations including OTP
- **RoleServices**: Role-specific API endpoints
- **Config**: Centralized API configuration

#### **Authentication Context:**
- **Global State**: Manages authentication state across the app
- **Reducer Pattern**: Predictable state updates
- **Error Handling**: Comprehensive error management
- **Persistence**: Automatic token and user data persistence
- **OTP Management**: Handles OTP verification flow

#### **Route Protection:**
- **Auth Guards**: Protect routes requiring authentication
- **Guest Guards**: Protect routes for non-authenticated users
- **Role Guards**: Role-based access control
- **Automatic Navigation**: Smart routing based on auth status

### 🔑 Security Features

#### **Token Management:**
- **Access Tokens**: Short-lived tokens for API requests
- **Refresh Tokens**: Long-lived tokens for session renewal
- **Automatic Refresh**: Seamless token renewal
- **Secure Storage**: AsyncStorage with encryption

#### **OTP Verification:**
- **Role-Based OTP**: Admin, School Director, and Teacher roles require OTP
- **Email Verification**: OTP sent to user's email address
- **6-Digit Code**: Secure 6-digit verification code
- **Auto-Focus**: Seamless input experience with auto-focus
- **Resend Functionality**: Option to resend OTP if needed

#### **Route Protection:**
- **Protected Routes**: All pages except splash and auth require authentication
- **Role-Based Access**: Different features for different user types
- **Session Persistence**: Maintains login state across app restarts
- **Automatic Logout**: Handles expired sessions gracefully

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

### 🏗️ Service Architecture

- **Single Responsibility**: Each service has one clear purpose
- **Dependency Injection**: Services are injected where needed
- **Error Handling**: Comprehensive error handling at each layer
- **Type Safety**: Full TypeScript support throughout

## 📱 App Features by Module

### 🔐 Authentication
- User login with email/phone
- OTP verification for admin, director, and teacher roles
- Password reset functionality
- Social login integration (Google, Apple)
- Secure authentication flow
- Session management
- Role-based access control

### 👨‍🏫 Teacher Features
- Dashboard with quick stats
- Subject management
- Student management
- Schedule management
- Video content creation
- Grade management

### 👨‍💼 Director Features
- Comprehensive dashboard
- Teacher management
- Student overview
- Subject overview
- Schedule overview
- School analytics

### 👨‍🎓 Student Features
- Learning dashboard
- Subject access
- Schedule viewing
- Assignment tracking
- Grade viewing

### 👨‍💻 Developer Features
- Development tools
- Testing utilities
- Debug information
- Performance monitoring

## 🔄 Navigation Flow

```
Splash Screen → Auth Check → Login (if not authenticated)
                ↓
            OTP Verification (if role requires OTP)
                ↓
            Role Selection (if authenticated)
                ↓
            Role-Specific Dashboard
                ↓
            Forgot Password → Email Reset → Back to Login
```

## 🛠️ API Service Usage

### 🔐 Authentication
```typescript
import { ApiService } from '@/services';

// Login (may require OTP for certain roles)
const response = await ApiService.auth.signIn({ email, password });

// Check if OTP is required
const requiresOTP = await ApiService.requiresOTP();

// Verify OTP
const otpResponse = await ApiService.auth.verifyOTP({ email, otp });

// Check authentication
const isAuth = await ApiService.isAuthenticated();

// Get user data
const userData = await ApiService.getUserData();
```

### 👨‍🏫 Teacher Services
```typescript
// Get teacher dashboard
const dashboard = await ApiService.teacher.getDashboard();

// Get subjects
const subjects = await ApiService.teacher.getSubjects();

// Get students
const students = await ApiService.teacher.getStudents();
```

### 👨‍💼 Director Services
```typescript
// Get director dashboard
const dashboard = await ApiService.director.getDashboard();

// Get teachers list
const teachers = await ApiService.director.getTeachers();

// Get students overview
const students = await ApiService.director.getStudents();
```

### 👨‍🎓 Student Services
```typescript
// Get student dashboard
const dashboard = await ApiService.student.getDashboard();

// Get subjects
const subjects = await ApiService.student.getSubjects();

// Get schedules
const schedules = await ApiService.student.getSchedules();
```

## 🔧 Configuration

### API Configuration
```typescript
// API Base URL
API_CONFIG.BASE_URL = 'http://localhost:1000/api/v1'

// Request Timeout
API_CONFIG.TIMEOUT = 10000 // 10 seconds

// Endpoints
API_ENDPOINTS.AUTH.SIGN_IN = '/auth/sign-in'
API_ENDPOINTS.AUTH.VERIFY_OTP = '/auth/verify-otp'
API_ENDPOINTS.TEACHER.DASHBOARD = '/teacher/dashboard'

// Roles requiring OTP
ROLES_REQUIRING_OTP = ['admin', 'school_director', 'teacher']
```

### OTP Configuration
```typescript
// OTP verification settings
OTP_LENGTH = 6 // 6-digit OTP
OTP_TIMEOUT = 300000 // 5 minutes timeout
OTP_RESEND_DELAY = 60000 // 1 minute resend delay
```

This structure provides a scalable, maintainable, and well-organized codebase for the Smart Edu Hub mobile application with professional authentication, OTP verification, modular services, and comprehensive documentation.
