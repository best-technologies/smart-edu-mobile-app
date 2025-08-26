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

  // Input refs for OTP fields
  const otpRefs = useRef<TextInput[]>([]);
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

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError(''); // Clear OTP error when user types

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

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

    const otpString = otp.join('');
    
    // Validate OTP
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
        >
          <ScrollView 
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            className="flex-1"
          >
            <Animated.View 
              style={{ 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              className="px-6 py-6"
            >
              {/* Header */}
              <View className="flex-row items-center mb-8 mt-4">
                <BackButton />
                <Text className="text-2xl font-bold text-gray-900 ml-4">
                  Reset Password
                </Text>
              </View>

              {/* Main Content */}
              <View className="items-center mb-12">
                <Animated.View 
                  style={{ transform: [{ scale: iconScale }] }}
                  className="mb-8"
                >
                  <View className="w-20 h-20 bg-blue-100 rounded-2xl items-center justify-center">
                    <Ionicons name="key" size={36} color="#3b82f6" />
                  </View>
                </Animated.View>
                
                <Text className="text-2xl font-bold text-gray-900 mb-3 text-center w-full">
                  Set New Password
                </Text>
                <Text className="text-gray-600 text-center text-base leading-6 w-full px-4">
                  Enter the 6-digit code sent to {email} and create a new password
                </Text>
              </View>

              {/* OTP Input */}
              <View className="mb-8">
                <Text className="text-gray-700 font-semibold text-sm mb-3">
                  Verification Code
                </Text>
                <View className="flex-row justify-between space-x-3">
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        if (ref) otpRefs.current[index] = ref;
                      }}
                      style={{
                        width: 45,
                        height: 55,
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: digit ? '#3b82f6' : otpError ? '#ef4444' : '#e5e7eb',
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: '#111827',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      autoFocus={index === 0}
                    />
                  ))}
                </View>
                {otpError && (
                  <Text className="text-red-500 text-sm mt-2 ml-1">
                    {otpError}
                  </Text>
                )}
              </View>

              {/* New Password Input */}
              <View className="mb-6">
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
              <View className="mb-8">
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
                  <View className="w-full h-full bg-blue-600 rounded-xl items-center justify-center">
                    {isLoading ? (
                      <View className="flex-row items-center">
                        <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        <Text className="text-white font-bold text-base">
                          Resetting Password...
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-white font-bold text-base">
                        Reset Password
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {/* Footer */}
              <View className="items-center mt-6">
                <Text className="text-gray-500 text-sm text-center">
                  Remember your password?{' '}
                  <TouchableOpacity onPress={handleBack}>
                    <Text className="text-blue-600 font-semibold">
                      Sign in here
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
