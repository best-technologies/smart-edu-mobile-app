import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import BackButton from '@/components/BackButton';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
  route: ForgotPasswordScreenRouteProp;
}

export default function ForgotPasswordScreen({ navigation, route }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('omayowagold@gmail.com');
  const [emailError, setEmailError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const { showError, showSuccess } = useToast();

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
      
      // Show success toast
      showSuccess('Reset Code Sent', `Reset code sent successfully to ${email.trim()}`);
      
      // Navigate immediately - toast will show during navigation
      navigation.navigate('PasswordResetOTP', { email: email.trim() });
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsValidating(false);
    }
  };

  const handleButtonPress = () => {
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
            <View 
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
                <View className="mb-8">
                  <View className="w-20 h-20 bg-blue-100 rounded-2xl items-center justify-center">
                    <Ionicons 
                      name="lock-closed" 
                      size={36} 
                      color="#3b82f6" 
                    />
                  </View>
                </View>
                
                <Text className="text-2xl font-bold text-gray-900 mb-3 text-center w-full">
                  Reset Your Password
                </Text>
                <Text className="text-gray-600 text-center text-base leading-6 w-full px-4">
                  Enter your email address below and we'll send you a secure code to reset your password.
                </Text>
              </View>

              {/* Form */}
              {!isLoading && !isValidating ? (
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
                  <View className="mt-8">
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
                        <Text className="text-white font-semibold text-base">
                          Send Reset Code
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                /* Loading State */
                <View className="space-y-8">
                  <View className="items-center py-8">
                    <View className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4" />
                    <Text className="text-gray-600 text-center text-base">
                      Sending reset code...
                    </Text>
                  </View>
                </View>
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
