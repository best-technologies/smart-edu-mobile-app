import React from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoginHeaderProps {
  logoScale: Animated.Value;
}

export default function LoginHeader({ logoScale }: LoginHeaderProps) {
  return (
    <View className="items-center mb-12">
      <Animated.View 
        style={{ transform: [{ scale: logoScale }] }}
        className="mb-6"
      >
        <View className="w-20 h-20 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-sm border border-white/20">
          <Ionicons name="school" size={40} color="#14b8a6" />
        </View>
      </Animated.View>
      
      <Text className="text-3xl font-bold text-white mb-2 text-center">
        Welcome Back
      </Text>
      <Text className="text-white/70 text-center text-base">
        Sign in to continue to Smart Edu Hub
      </Text>
    </View>
  );
}
