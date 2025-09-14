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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { CenteredLoader, InlineSpinner } from '@/components';
import { useAuthNavigation } from '@/hooks/useAuthNavigation';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, error, clearError } = useAuth();
  useAuthNavigation(); // Handle navigation logic centrally

  // Navigation is now handled centrally by useAuthNavigation hook

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return;
    }

    try {
      await login({ email: email.trim(), password });
      // Navigation will be handled by useAuthNavigation hook
    } catch (error) {
      // Error is handled by the context and displayed via toast
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Coming Soon', 'Google login will be available soon!');
  };

  const handleTestLogin = async () => {
    console.log('🧪 Test login initiated');
    try {
      // Test with sample credentials
      await login({ email: 'test@example.com', password: 'testpassword' });
    } catch (error) {
      console.log('🧪 Test login error:', error);
    }
  };

  const handleAppleLogin = () => {
    Alert.alert('Coming Soon', 'Apple login will be available soon!');
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
                    <Ionicons name="school" size={48} color="#14b8a6" />
                  </View>
                  
                  <Text className="text-3xl font-bold text-white mb-2 text-center" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                    Welcome Back
                  </Text>
                  <Text className="text-white/90 text-center text-base font-medium" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Sign in to your Smart Edu Hub account
                  </Text>
                </View>

                {/* Login Form */}
                <View className="space-y-6 mb-4">
                  {/* Email Input */}
                  <View>
                    <Text className="text-white font-semibold text-sm mb-1 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      Email Address
                    </Text>
                    <View className="relative">
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="w-full h-14 bg-white/15 rounded-xl px-4 text-white text-base border border-white/25"
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
                  </View>

                  {/* Password Input */}
                  <View>
                    <Text className="text-white font-semibold text-sm mt-4 mb-1 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      Password
                    </Text>
                    <View className="relative">
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="w-full h-14 bg-white/15 rounded-xl px-4 pr-12 text-white text-base border border-white/25"
                        style={{
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.15,
                          shadowRadius: 4,
                          elevation: 4,
                          fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-0 bottom-0 justify-center"
                      >
                        <Ionicons 
                          name={showPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color="rgba(255, 255, 255, 0.8)" 
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Forgot Password */}
                  <TouchableOpacity onPress={handleForgotPassword} className="self-end">
                    <Text className="text-cyan-300 mt-4 font-semibold text-sm" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
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
                      colors={isLoading ? ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'] : ['#32CD32', '#28a745', '#20c997']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                    
                      <Text className="text-white font-bold text-base" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        Sign In
                      </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-8">
                  <View className="flex-1 h-px bg-white/25" />
                  <Text className="text-white/80 font-medium text-sm mx-4" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    or continue with
                  </Text>
                  <View className="flex-1 h-px bg-white/25" />
                </View>

                {/* Social Login Buttons */}
                <View className="flex-row space-x-4 mb-8">
                  <TouchableOpacity
                    onPress={handleGoogleLogin}
                    className="flex-1 h-14 bg-white/15 rounded-xl items-center justify-center border border-white/25"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="logo-google" size={20} color="#0f172a" />
                      <Text className="text-white font-semibold ml-2" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        Google
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="items-center bg-white/5 rounded-2xl p-6 border border-white/10">
                  <Text className="text-white/90 text-sm text-center font-medium mb-2" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Don't have an account?
                  </Text>
                  <TouchableOpacity 
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
                      Contact your administrator
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
        visible={isLoading}
        text="Signing you in..."
        size="large"
        spinnerColor="#32CD32"
        textColor="#ffffff"
      />
    </View>
  );
}
