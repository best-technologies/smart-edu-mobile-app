import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
}

export default function LoginForm({
  email,
  password,
  showPassword,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) {
  return (
    <View className="space-y-6">
      {/* Email/Phone Input */}
      <View>
        <Text className="text-white/90 text-sm font-medium mb-2 ml-1">
          Email or Phone Number
        </Text>
        <View className="relative">
          <TextInput
            value={email}
            onChangeText={onEmailChange}
            placeholder="Enter your email or phone"
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

      {/* Password Input */}
      <View>
        <Text className="text-white/90 text-sm font-medium mb-2 ml-1">
          Password
        </Text>
        <View className="relative">
          <TextInput
            value={password}
            onChangeText={onPasswordChange}
            placeholder="Enter your password"
            placeholderTextColor="#94a3b8"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            className="w-full h-14 bg-white/10 rounded-xl px-4 pr-12 text-white text-base border border-white/20 focus:border-cyan-400"
            style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}
          />
          <TouchableOpacity 
            onPress={onTogglePassword}
            className="absolute right-4 top-4"
          >
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#94a3b8" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity 
        onPress={onForgotPassword}
        className="items-end"
      >
        <Text className="text-cyan-400 text-sm font-medium">
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        onPress={onSubmit}
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
            <View className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full  mr-2" />
            <Text className="text-white font-semibold text-base">
              Signing In...
            </Text>
          </View>
        ) : (
          <Text className="text-white font-semibold text-base">
            Sign In
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
