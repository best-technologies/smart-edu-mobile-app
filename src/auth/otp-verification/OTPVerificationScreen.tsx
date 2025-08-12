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
import { User } from '@/services/types/apiTypes';
import { CenteredLoader, InlineSpinner } from '@/components';

type OTPVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OTPVerification'>;

interface OTPVerificationScreenProps {
  navigation: OTPVerificationScreenNavigationProp;
}

export default function OTPVerificationScreen({ navigation }: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  
  const { verifyOTP, error, clearError, getPendingUser, isAuthenticated, requiresOTP } = useAuth();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Input refs for OTP fields
  const otpRefs = useRef<TextInput[]>([]);

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

    // Get pending user data
    loadPendingUser();
  }, []);

  // Handle successful OTP verification and navigation
  useEffect(() => {
    if (isAuthenticated && !requiresOTP) {
      // Navigate to role selection after successful OTP verification
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelect' }],
      });
    }
  }, [isAuthenticated, requiresOTP, navigation]);

  const loadPendingUser = async () => {
    try {
      const user = await getPendingUser();
      if (user) {
        setPendingUser(user);
      } else {
        // If no pending user, go back to login
        Alert.alert('Error', 'No pending verification found. Please login again.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error loading pending user:', error);
      Alert.alert('Error', 'Failed to load verification data. Please login again.');
      navigation.goBack();
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    if (!pendingUser) {
      Alert.alert('Error', 'No pending user found. Please login again.');
      navigation.goBack();
      return;
    }

    setIsLoading(true);

    try {
      await verifyOTP({ email: pendingUser.email, otp: otpString });
      // Navigation will be handled by useEffect when isAuthenticated becomes true
    } catch (error) {
      // Error is handled by the context and displayed via toast
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
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

    handleVerifyOTP();
  };

  const handleResendOTP = () => {
    Alert.alert(
      'Resend OTP',
      'A new OTP has been sent to your email address.',
      [{ text: 'OK' }]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (!pendingUser) {
    return (
      <View className="flex-1">
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="transparent" 
          translucent={true}
        />
        <LinearGradient
          colors={['#0f172a', '#1e3a8a', '#0d9488']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <CenteredLoader 
            visible={true}
            text="Loading verification..."
            size="large"
            spinnerColor="#14b8a6"
            textColor="#ffffff"
            showBackdrop={false}
          />
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent={true}
      />
      
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

        <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={handleGoBack}
            className="absolute top-12 left-6 z-10 w-10 h-10 bg-white/10 rounded-full items-center justify-center border border-white/20"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>

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
                {/* Header */}
                <View className="items-center mb-8">
                  <Text className="text-2xl font-bold text-white text-center" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                    Verify OTP
                  </Text>
                </View>

                {/* Main Content */}
                <View className="items-center mb-12">
                  <Animated.View 
                    style={{ transform: [{ scale: iconScale }] }}
                    className="mb-6"
                  >
                    <View className="w-24 h-24 bg-white/10 rounded-3xl items-center justify-center backdrop-blur-sm border border-white/20">
                      <Ionicons name="shield-checkmark" size={48} color="#14b8a6" />
                    </View>
                  </Animated.View>
                  
                  <Text className="text-2xl font-bold text-white mb-3 text-center" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                    Verify Your Email
                  </Text>
                  <Text className="text-white/90 text-center text-base leading-6 mb-4 font-medium" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    We've sent a 6-digit verification code to
                  </Text>
                  <Text className="text-cyan-300 text-center text-base font-semibold mb-6" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    {pendingUser.email}
                  </Text>
                  <Text className="text-white/90 text-center text-sm font-medium" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Please enter the code to continue
                  </Text>
                </View>

                {/* OTP Input */}
                <View className="mb-8">
                  <View className="flex-row justify-between space-x-3">
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => {
                          if (ref) otpRefs.current[index] = ref;
                        }}
                        style={{
                          width: 45,
                          height: 55,
                          backgroundColor: 'rgba(255, 255, 255, 0.15)',
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: digit ? '#14b8a6' : 'rgba(255, 255, 255, 0.3)',
                          textAlign: 'center',
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: '#ffffff',
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        autoFocus={index === 0}
                      />
                    ))}
                  </View>
                </View>

                {/* Verify Button */}
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    onPress={handleButtonPress}
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full h-14 rounded-xl items-center justify-center overflow-hidden"
                    style={{
                      shadowColor: '#14b8a6',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      elevation: 12,
                    }}
                  >
                    <LinearGradient
                      colors={isLoading || otp.join('').length !== 6 
                        ? ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'] 
                        : ['#14b8a6', '#0d9488', '#0891b2']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {isLoading ? (
                        <InlineSpinner 
                          size="medium"
                          color="#ffffff"
                          text="Verifying..."
                          textColor="#ffffff"
                        />
                      ) : (
                        <Text className="text-white font-bold text-base" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                          Verify OTP
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                {/* Resend OTP */}
                <View className="items-center mt-8">
                  <Text className="text-white/90 text-sm text-center mb-2 font-medium" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Didn't receive the code?
                  </Text>
                  <TouchableOpacity onPress={handleResendOTP}>
                    <Text className="text-cyan-300 font-semibold text-base" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>

      {/* Centered Loader for full-screen loading */}
      <CenteredLoader 
        visible={isLoading}
        text="Verifying OTP..."
        size="large"
        spinnerColor="#14b8a6"
        textColor="#ffffff"
      />
    </View>
  );
}
