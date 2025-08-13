import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectScreen from '@/screens/RoleSelectScreen';
import { LoginScreen, ForgotPasswordScreen, OTPVerificationScreen } from '@/auth';
import EmailVerificationScreen from '@/auth/email-verification/EmailVerificationScreen';
import SchoolDirectorTabs from '@/roles/school_director/SchoolDirectorTabs';
import TeacherTabs from '@/roles/teacher/TeacherTabs';
import StudentTabs from '@/roles/student/StudentTabs';
import DeveloperTabs from '@/roles/developer/DeveloperTabs';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import React, { useState } from 'react';

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: undefined;
  EmailVerification: { email: string };
  RoleSelect: undefined;
  SchoolDirector: undefined;
  Teacher: undefined;
  Student: undefined;
  Developer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    card: 'transparent',
    primary: 'transparent',
    text: '#ffffff',
    border: 'transparent',
    notification: 'transparent',
  },
};

// Component to handle auth navigation logic inside NavigationContainer
function AuthNavigationHandler() {
  // Always call the hook to maintain consistent hook order
  useAuthNavigation();
  return null;
}

export default function RootNavigator() {
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  const handleNavigationReady = () => {
    console.log('🚀 NavigationContainer is ready');
    setIsNavigationReady(true);
  };

  return (
    <NavigationContainer 
      theme={AppTheme}
      onReady={handleNavigationReady}
    >
      {isNavigationReady && <AuthNavigationHandler />}
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="SchoolDirector" component={SchoolDirectorTabs} />
        <Stack.Screen name="Teacher" component={TeacherTabs} />
        <Stack.Screen name="Student" component={StudentTabs} />
        <Stack.Screen name="Developer" component={DeveloperTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

