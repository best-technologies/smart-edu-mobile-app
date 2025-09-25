import { NavigationContainer, DefaultTheme, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectScreen from '@/screens/RoleSelectScreen';
import { LoginScreen, ForgotPasswordScreen, OTPVerificationScreen, PasswordResetOTPScreen } from '@/auth';
import EmailVerificationScreen from '@/auth/email-verification/EmailVerificationScreen';
import SchoolDirectorNavigator from '@/roles/school_director/SchoolDirectorNavigator';
import TeacherTabs from '@/roles/teacher/TeacherTabs';
import StudentNavigator from '@/roles/student/StudentNavigator';
import DeveloperTabs from '@/roles/developer/DeveloperTabs';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';
import { navigationRef } from './RootNavigation';
import React from 'react';

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: undefined;
  PasswordResetOTP: { email: string };
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

export default function RootNavigator() {
  // Use the auth navigation hook to handle authentication-based navigation
  useAuthNavigation();

  return (
    <NavigationContainer 
      ref={navigationRef}
      theme={AppTheme}
      onReady={() => {
        console.log('🚀 Navigation container is ready');
      }}
    >
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
        <Stack.Screen name="PasswordResetOTP" component={PasswordResetOTPScreen} />
        <Stack.Screen name="EmailVerification" component={EmailVerificationScreen} />
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="SchoolDirector" component={SchoolDirectorNavigator} />
        <Stack.Screen name="Teacher" component={TeacherTabs} />
        <Stack.Screen name="Student" component={StudentNavigator} />
        <Stack.Screen name="Developer" component={DeveloperTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

