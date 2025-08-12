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
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestGuard } from '@/hooks/useAuthGuard';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, error, clearError } = useAuth();
  const { isAuthenticated } = useGuestGuard();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
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
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Clear error when component mounts or when error changes
  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
      clearError();
    }
  }, [error, clearError]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    try {
      await login({ email: email.trim(), password });
      // Navigation will be handled by useGuestGuard hook
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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

    handleLogin();
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
              {/* Header Section */}
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

              {/* Login Form */}
              <View className="space-y-6">
                {/* Email/Phone Input */}
                <View>
                  <Text className="text-white/90 text-sm font-medium mb-2 ml-1">
                    Email or Phone Number
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
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
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#94a3b8"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="w-full h-14 bg-white/10 rounded-xl px-4 pr-12 text-white text-base border border-white/20 focus:border-cyan-400"
                      style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}
                    />
                    <TouchableOpacity 
                      onPress={() => setShowPassword(!showPassword)}
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
                  onPress={handleForgotPassword}
                  className="items-end"
                >
                  <Text className="text-cyan-400 text-sm font-medium">
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
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
                          Signing In...
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-white font-semibold text-base">
                        Sign In
                      </Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-px bg-white/20" />
                  <Text className="text-white/50 text-sm mx-4">or</Text>
                  <View className="flex-1 h-px bg-white/20" />
                </View>

                {/* Alternative Sign In Options */}
                <View className="space-y-3">
                  <TouchableOpacity className="w-full h-14 bg-white/10 rounded-xl items-center justify-center border border-white/20">
                    <View className="flex-row items-center">
                      <Ionicons name="logo-google" size={20} color="#ea4335" />
                      <Text className="text-white font-medium text-base ml-3">
                        Continue with Google
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                </View>
              </View>

              {/* Footer */}
              <View className="items-center mt-8">
                <Text className="text-white/50 text-sm text-center">
                  Don't have an account?{' '}
                  <Text className="text-cyan-400 font-medium">
                    Contact your administrator
                  </Text>
                </Text>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}
