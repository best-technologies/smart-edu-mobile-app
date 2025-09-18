import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import BackButton from '@/components/BackButton';
import OTPInput from '@/components/OTPInput';

type PasswordResetOTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PasswordResetOTP'>;
type PasswordResetOTPScreenRouteProp = RouteProp<RootStackParamList, 'PasswordResetOTP'>;

interface PasswordResetOTPScreenProps {
  navigation: PasswordResetOTPScreenNavigationProp;
  route: PasswordResetOTPScreenRouteProp;
}

export default function PasswordResetOTPScreen({ navigation, route }: PasswordResetOTPScreenProps) {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const { verifyOTPAndResetPassword, isLoading, error, clearError } = useAuth();
  const { showError, showSuccess } = useToast();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Input refs for password fields
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  React.useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle errors from auth context
  useEffect(() => {
    if (error) {
      showError('Reset Failed', error);
      clearError();
    }
  }, [error, clearError, showError]);


  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters with at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    setPasswordError('');
    
    // Clear confirm password error if passwords now match
    if (confirmPassword && text === confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError('');
  };

  const handleResetPassword = async () => {
    // Clear previous errors
    setOtpError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate OTP
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    // Validate password
    if (!newPassword.trim()) {
      setPasswordError('Password is required');
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, and number');
      return;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      showError('Password Mismatch', 'The passwords you entered do not match. Please try again.');
      return;
    }

    try {
      await verifyOTPAndResetPassword({
        email,
        otp: otpString,
        new_password: newPassword
      });
      
      // Show success message and navigate back to login
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    handleResetPassword();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#f9fafb" 
        translucent={false}
      />
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView 
            contentContainerStyle={{ 
              flexGrow: 1,
              paddingBottom: 120, // Increased padding to ensure submit button is visible
              minHeight: '100%'
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            bounces={false}
            style={{ flex: 1 }}
          >
            <Animated.View 
              style={{ 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                flex: 1,
                justifyContent: 'space-between',
                minHeight: '100%'
              }}
              className="px-6 py-4"
            >
              {/* Header */}
              <View className="flex-row items-center mb-6 mt-2">
                <BackButton />
                <Text className="text-2xl font-bold text-gray-900 ml-4">
                  Reset Password
                </Text>
              </View>

              {/* Main Content */}
              <View className="flex-1">
                <View className="items-center mb-8">
                <Animated.View 
                  style={{ transform: [{ scale: iconScale }] }}
                  className="mb-6"
                >
                  <Animated.View className="w-20 h-20 bg-blue-100 rounded-2xl items-center justify-center">
                    <Ionicons name="key" size={36} color="#3b82f6" />
                  </Animated.View>
                </Animated.View>
                
                <Text className="text-2xl font-bold text-gray-900 mb-3 text-center w-full">
                  Set New Password
                </Text>
                <Text className="text-gray-600 text-center text-base leading-6 w-full px-4">
                  Enter the 6-digit code sent to {email} and create a new password
                </Text>
              </View>

              {/* OTP Input */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold text-sm mb-6">
                  Verification Code
                </Text>
                
                {/* OTP Input */}
                <OTPInput
                  value={otp}
                  onChange={(newOtp) => {
                    setOtp(newOtp);
                    setOtpError('');
                    // Check if OTP is complete and trigger validation
                    if (newOtp.join('').length === 6) {
                      setTimeout(() => {
                        const otpString = newOtp.join('');
                        if (otpString.length === 6) {
                          // Auto-submit when OTP is complete
                          handleResetPassword();
                        }
                      }, 100); // Small delay to ensure state is updated
                    }
                  }}
                  length={6}
                  autoFocus={true}
                  keyboardType="number-pad"
                  containerStyle={{ marginBottom: 16 }}
                  inputStyle={{
                    backgroundColor: '#f3f4f6',
                    borderColor: otpError ? '#ef4444' : '#d1d5db',
                    borderWidth: 2,
                    color: '#111827',
                    fontSize: 20,
                    fontWeight: 'bold',
                    letterSpacing: 4,
                  }}
                />
                
                {otpError && (
                  <Text className="text-red-500 text-sm mt-4 text-center">
                    {otpError}
                  </Text>
                )}
              </View>

              {/* New Password Input */}
              <View className="mb-4">
                <Text className="text-gray-700 font-semibold text-sm mb-2">
                  New Password
                </Text>
                <View className="relative">
                  <TextInput
                    ref={passwordRef}
                    value={newPassword}
                    onChangeText={handlePasswordChange}
                    placeholder="Enter new password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`w-full h-14 bg-white rounded-xl px-4 text-gray-900 text-base border ${
                      passwordError ? 'border-red-500' : 'border-gray-200'
                    }`}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-0 bottom-0 justify-center"
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </TouchableOpacity>
                </View>
                {passwordError && (
                  <Text className="text-red-500 text-sm mt-2 ml-1">
                    {passwordError}
                  </Text>
                )}
              </View>

              {/* Confirm Password Input */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold text-sm mb-2">
                  Confirm Password
                </Text>
                <View className="relative">
                  <TextInput
                    ref={confirmPasswordRef}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    placeholder="Confirm new password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className={`w-full h-14 bg-white rounded-xl px-4 text-gray-900 text-base border ${
                      confirmPasswordError ? 'border-red-500' : 'border-gray-200'
                    }`}
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-0 bottom-0 justify-center"
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#9ca3af" 
                    />
                  </TouchableOpacity>
                </View>
                {confirmPasswordError && (
                  <Text className="text-red-500 text-sm mt-2 ml-1">
                    {confirmPasswordError}
                  </Text>
                )}
                </View>
              </View>

              {/* Reset Password Button */}
              <Animated.View style={{ transform: [{ scale: buttonScale }] }} className="mt-8 mb-6">
                <TouchableOpacity
                  onPress={handleButtonPress}
                  disabled={isLoading}
                  className={`w-full h-16 rounded-xl items-center justify-center ${
                    isLoading ? 'opacity-60' : ''
                  }`}
                  style={{
                    shadowColor: '#3b82f6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  <Animated.View className="w-full h-full bg-blue-600 rounded-xl items-center justify-center">
                    {isLoading ? (
                      <Animated.View className="flex-row items-center">
                        <Animated.View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3" />
                        <Text className="text-white font-bold text-base">
                          Resetting Password...
                        </Text>
                      </Animated.View>
                    ) : (
                      <Text className="text-white font-bold text-base">
                        Reset Password
                      </Text>
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>

              {/* Footer */}
              <View className="items-center mt-6">
                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-sm text-center">
                    Remember your password?{' '}
                  </Text>
                  <TouchableOpacity onPress={handleBack}>
                    <Text className="text-blue-600 font-semibold text-sm">
                      Sign in here
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
