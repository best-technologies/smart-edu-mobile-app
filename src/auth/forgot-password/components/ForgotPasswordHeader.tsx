import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ForgotPasswordHeaderProps {
  onBack: () => void;
  iconScale: Animated.Value;
  isEmailSent: boolean;
}

export default function ForgotPasswordHeader({ 
  onBack, 
  iconScale, 
  isEmailSent 
}: ForgotPasswordHeaderProps) {
  return (
    <>
      {/* Header with back button */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity 
          onPress={onBack}
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
          <Animated.View className="w-24 h-24 bg-white/10 rounded-3xl items-center justify-center backdrop-blur-sm border border-white/20">
            <Ionicons 
              name={isEmailSent ? "checkmark-circle" : "lock-closed"} 
              size={48} 
              color={isEmailSent ? "#10b981" : "#14b8a6"} 
            />
          </Animated.View>
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
    </>
  );
}
