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
import { CenteredLoader } from '@/components';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
type ForgotPasswordScreenRouteProp = RouteProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
  route: ForgotPasswordScreenRouteProp;
}

export default function ForgotPasswordScreen({ navigation, route }: ForgotPasswordScreenProps) {
  // const [email, setEmail] = useState('');
  const [email, setEmail] = useState('tope.rasheedat1@bestacademy.edu.ng');
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
    <View className="flex-1">
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      
      <LinearGradient
        colors={['#0f172a', '#1a1a1a', '#32CD32']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Background decorative elements */}
        <View className="absolute inset-0 opacity-5">
          <View className="absolute top-20 left-8 w-32 h-32 border border-white/20 rounded-full" />
          <View className="absolute top-40 right-12 w-24 h-24 border border-white/20 rotate-45" />
          <View className="absolute bottom-40 left-16 w-20 h-20 border border-white/20 rounded-full" />
          <View className="absolute bottom-32 right-8 w-28 h-28 border border-white/20 rotate-12" />
        </View>

        <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView 
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-1 px-8 justify-center">
                {/* Header */}
                <View className="items-center mb-12">
                  <View className="w-24 h-24 bg-white/10 rounded-3xl items-center justify-center backdrop-blur-sm border border-white/20 mb-6">
                    <Ionicons name="lock-closed" size={48} color="#14b8a6" />
                  </View>
                  
                  <Text className="text-3xl font-bold text-white mb-2 text-center" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                    Forgot Password
                  </Text>
                  <Text className="text-white/90 text-center text-base font-medium" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Enter your email address below and we'll send you a secure code to reset your password
                  </Text>
                </View>

                {/* Email Input */}
                <View className="space-y-6 mb-4">
                  <View>
                    <Text className="text-white font-semibold text-sm mb-1 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      Email Address
                    </Text>
                    <View className="relative">
                      <TextInput
                        value={email}
                        onChangeText={handleEmailChange}
                        placeholder="Enter your email address"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="email"
                        textContentType="emailAddress"
                        className={`w-full h-14 bg-white/15 rounded-xl px-4 pr-12 text-white text-base border ${
                          emailError ? 'border-red-500' : 'border-white/25'
                        }`}
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.15,
                          shadowRadius: 4,
                          elevation: 4,
                          fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
                        }}
                      />
                      <View className="absolute right-4 top-0 bottom-0 justify-center">
                        <Ionicons name="mail-outline" size={20} color="rgba(255, 255, 255, 0.8)" />
                      </View>
                    </View>
                    {emailError && (
                      <Text className="text-red-300 text-sm mt-2 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        {emailError}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Send Email Button */}
                <TouchableOpacity
                  onPress={handleButtonPress}
                  disabled={isLoading || isValidating}
                  className="w-full h-14 rounded-xl items-center justify-center overflow-hidden"
                  style={{
                    shadowColor: '#32CD32',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.4,
                    shadowRadius: 12,
                    elevation: 12,
                  }}
                >
                  <LinearGradient
                    colors={isLoading || isValidating ? ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'] : ['#32CD32', '#28a745', '#20c997']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    {isLoading || isValidating ? (
                      <View className="flex-row items-center">
                        <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3" />
                        <Text className="text-white font-bold text-base" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                          Sending Reset Code...
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-white font-bold text-base" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        Send Reset Code
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Footer */}
                <View className="items-center bg-white/5 rounded-2xl p-6 border border-white/10 mt-8">
                  <Text className="text-white/90 text-sm text-center font-medium mb-2" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Remember your password?
                  </Text>
                  <TouchableOpacity 
                    onPress={handleBack}
                    className="bg-lime-500/20 px-6 py-3 rounded-xl border border-lime-400/30"
                    style={{
                      shadowColor: '#32CD32',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 4,
                    }}
                  >
                    <Text className="text-lime-400 font-bold text-sm" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      Sign in here
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>

      {/* Centered Loader for full-screen loading */}
      <CenteredLoader 
        visible={isLoading || isValidating}
        text="Sending reset code..."
        size="large"
        spinnerColor="#32CD32"
        textColor="#ffffff"
      />
    </View>
  );
}
