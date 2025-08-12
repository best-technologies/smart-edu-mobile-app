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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';

type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp;
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Clear error when component mounts or when error changes
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  const handleSendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
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
      ]).start();
      
      // Auto navigate back after showing success
      setTimeout(() => {
        navigation.goBack();
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

    handleSendEmail();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0f172a' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <LinearGradient
        colors={['#0f172a', '#1e3a8a', '#0d9488']}
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

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View 
              style={{ 
                flex: 1,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
              className="px-8 justify-center"
            >
              {/* Header with back button */}
              <View className="flex-row items-center mb-8">
                <TouchableOpacity 
                  onPress={handleBack}
                  className="w-10 h-10 bg-white/10 rounded-full items-center justify-center border border-white/20"
                >
                  <Ionicons name="arrow-back" size={20} color="#ffffff" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold text-white ml-4">
                  Forgot Password
                </Text>
              </View>

              {/* Main Content */}
              <View className="items-center mb-12">
                <Animated.View 
                  style={{ transform: [{ scale: iconScale }] }}
                  className="mb-6"
                >
                  <View className="w-24 h-24 bg-white/10 rounded-3xl items-center justify-center backdrop-blur-sm border border-white/20">
                    <Ionicons 
                      name={isEmailSent ? "checkmark-circle" : "lock-closed"} 
                      size={48} 
                      color={isEmailSent ? "#10b981" : "#14b8a6"} 
                    />
                  </View>
                </Animated.View>
                
                <Text className="text-2xl font-bold text-white mb-3 text-center">
                  {isEmailSent ? 'Email Sent!' : 'Reset Your Password'}
                </Text>
                <Text className="text-white/70 text-center text-base leading-6">
                  {isEmailSent 
                    ? 'We\'ve sent a password reset code to your email address. Please check your inbox.'
                    : 'Enter your email address and we\'ll send you a code to reset your password.'
                  }
                </Text>
              </View>

              {/* Form */}
              {!isEmailSent && (
                <View className="space-y-6">
                  {/* Email Input */}
                  <View>
                    <Text className="text-white/90 text-sm font-medium mb-2 ml-1">
                      Email Address
                    </Text>
                    <View className="relative">
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email address"
                        placeholderTextColor="#94a3b8"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="w-full h-14 bg-white/10 rounded-xl px-4 text-white text-base border border-white/20 focus:border-cyan-400"
                        style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}
                      />
                      <View className="absolute right-4 top-4">
                        <Ionicons name="mail-outline" size={20} color="#94a3b8" />
                      </View>
                    </View>
                  </View>

                  {/* Send Email Button */}
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                      onPress={handleButtonPress}
                      disabled={isLoading}
                      className={`w-full h-14 rounded-xl items-center justify-center ${
                        isLoading ? 'bg-white/20' : 'bg-gradient-to-r from-cyan-500 to-teal-500'
                      }`}
                      style={{
                        shadowColor: '#14b8a6',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                      }}
                    >
                      {isLoading ? (
                        <View className="flex-row items-center">
                          <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          <Text className="text-white font-semibold text-base">
                            Sending...
                          </Text>
                        </View>
                      ) : (
                        <Text className="text-white font-semibold text-base">
                          Send Reset Code
                        </Text>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}

              {/* Success Message */}
              {isEmailSent && (
                <View className="space-y-6">
                  <View className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                    <View className="flex-row items-center">
                      <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                      <Text className="text-green-400 font-medium text-sm ml-2">
                        Reset code sent successfully
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    onPress={handleBack}
                    className="w-full h-14 bg-white/10 rounded-xl items-center justify-center border border-white/20"
                  >
                    <Text className="text-white font-semibold text-base">
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Footer */}
              <View className="items-center mt-8">
                <Text className="text-white/50 text-sm text-center">
                  Remember your password?{' '}
                  <TouchableOpacity onPress={handleBack}>
                    <Text className="text-cyan-400 font-medium">
                      Sign in here
                    </Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
