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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import BackButton from '@/components/BackButton';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const { showError, showSuccess } = useToast();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0)).current;

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

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSendEmail = async () => {
    setIsValidating(true);
    
    // Clear previous errors
    setEmailError('');
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email address is required');
      setIsValidating(false);
      return;
    }
    
    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      setIsValidating(false);
      return;
    }

    try {
      await forgotPassword(email.trim());
      setIsEmailSent(true);
      
      // Show success animation
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(successScale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
      
      showSuccess('Reset Code Sent', 'Please check your email for the password reset code');
      
      // Navigate to password reset OTP screen
      setTimeout(() => {
        navigation.navigate('PasswordResetOTP', { email: email.trim() });
      }, 1500);
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsValidating(false);
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

    handleSendEmail();
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
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            className="flex-1"
          >
            <Animated.View 
              style={{ 
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              className="px-6"
            >
              {/* Header */}
              <View className="flex-row items-center mb-8 mt-4">
                <BackButton />
                <Text className="text-2xl font-bold text-gray-900 ml-4">
                  Forgot Password
                </Text>
              </View>

              {/* Main Content */}
              <View className="items-center mb-12">
                <Animated.View 
                  style={{ transform: [{ scale: iconScale }] }}
                  className="mb-8"
                >
                  <View className="w-20 h-20 bg-blue-100 rounded-2xl items-center justify-center">
                    <Ionicons 
                      name={isEmailSent ? "checkmark-circle" : "lock-closed"} 
                      size={36} 
                      color={isEmailSent ? "#10b981" : "#3b82f6"} 
                    />
                  </View>
                </Animated.View>
                
                <Text className="text-2xl font-bold text-gray-900 mb-3 text-center w-full">
                  {isEmailSent ? 'Check Your Email' : 'Reset Your Password'}
                </Text>
                <Text className="text-gray-600 text-center text-base leading-6 w-full px-4">
                  {isEmailSent 
                    ? 'We\'ve sent a password reset code to your email address. Please check your inbox and follow the instructions.'
                    : 'Enter your email address below and we\'ll send you a secure code to reset your password.'
                  }
                </Text>
              </View>

              {/* Form */}
              {!isEmailSent && (
                <View className="space-y-8">
                  {/* Email Input */}
                  <View>
                    <Text className="text-gray-700 font-semibold text-sm mb-2">
                      Email Address
                    </Text>
                    <View className="relative">
                      <TextInput
                        value={email}
                        onChangeText={handleEmailChange}
                        placeholder="Enter your email address"
                        placeholderTextColor="#9ca3af"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        className={`w-full h-14 bg-white rounded-xl px-4 text-gray-900 text-base border ${
                          emailError ? 'border-red-500' : 'border-gray-200'
                        }`}
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.05,
                          shadowRadius: 2,
                          elevation: 2,
                        }}
                      />
                      <View className="absolute right-4 top-0 bottom-0 justify-center">
                        <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                      </View>
                    </View>
                    {emailError && (
                      <Text className="text-red-500 text-sm mt-2 ml-1">
                        {emailError}
                      </Text>
                    )}
                  </View>

                  {/* Send Email Button */}
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }} className="mt-8">
                    <TouchableOpacity
                      onPress={handleButtonPress}
                      disabled={isLoading || isValidating}
                      className={`w-full h-14 rounded-xl items-center justify-center ${
                        isLoading || isValidating ? 'opacity-60' : ''
                      }`}
                      style={{
                        shadowColor: '#3b82f6',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 8,
                      }}
                    >
                      <LinearGradient
                        colors={['#3b82f6', '#2563eb']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 12,
                        }}
                      >
                        {isLoading || isValidating ? (
                          <View className="flex-row items-center">
                            <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                            <Text className="text-white font-semibold text-base">
                              Sending...
                            </Text>
                          </View>
                        ) : (
                          <Text className="text-white font-semibold text-base">
                            Send Reset Code
                          </Text>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}

              {/* Success Message */}
              {isEmailSent && (
                <Animated.View 
                  style={{ transform: [{ scale: successScale }] }}
                  className="space-y-8"
                >
                  <View className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <View className="flex-row items-center">
                      <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                      <Text className="text-green-800 font-medium text-sm ml-2">
                        Reset code sent successfully to {email}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    onPress={handleBack}
                    className="w-full h-14 bg-gray-100 rounded-xl items-center justify-center border border-gray-200"
                  >
                    <Text className="text-gray-700 font-semibold text-base">
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* Footer */}
              <View className="items-center mt-12 w-full">
                <View className="flex-row justify-center items-center">
                  <Text className="text-gray-500 text-sm">
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
