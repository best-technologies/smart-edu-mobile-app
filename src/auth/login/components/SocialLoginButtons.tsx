import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialLoginButtonsProps {
  onGoogleLogin?: () => void;
  onAppleLogin?: () => void;
}

export default function SocialLoginButtons({ 
  onGoogleLogin, 
  onAppleLogin 
}: SocialLoginButtonsProps) {
  return (
    <View className="space-y-3">
      <TouchableOpacity 
        onPress={onGoogleLogin}
        className="w-full h-14 bg-white/10 rounded-xl items-center justify-center border border-white/20"
      >
        <View className="flex-row items-center">
          <Ionicons name="logo-google" size={20} color="#ea4335" />
          <Text className="text-white font-medium text-base ml-3">
            Continue with Google
          </Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={onAppleLogin}
        className="w-full h-14 bg-white/10 rounded-xl items-center justify-center border border-white/20"
      >
        <View className="flex-row items-center">
          <Ionicons name="logo-apple" size={20} color="#ffffff" />
          <Text className="text-white font-medium text-base ml-3">
            Continue with Apple
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
