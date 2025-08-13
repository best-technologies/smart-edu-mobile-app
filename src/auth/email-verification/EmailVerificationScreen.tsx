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
import { CenteredLoader, InlineSpinner } from '@/components';

type EmailVerificationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmailVerification'>;

interface EmailVerificationScreenProps {
  navigation: EmailVerificationScreenNavigationProp;
  route: {
    params: {
      email: string;
    };
  };
}

export default function EmailVerificationScreen({ navigation, route }: EmailVerificationScreenProps) {
  const [email, setEmail] = useState(route.params?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  
  const { verifyEmail, requestEmailVerificationOTP } = useAuth();
  
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

    // Send OTP on mount
    handleSendOTP();
  }, []);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Email address is required');
      return;
    }

    setIsSendingOTP(true);
    try {
      await requestEmailVerificationOTP(email.trim());
      setOtpSent(true);
      setCountdown(180); // 3 minutes = 180 seconds
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP();
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

  const handleVerifyEmail = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      await verifyEmail({ email: email.trim(), otp: otpString });
      // Navigation will be handled by the auth context
    } catch (error) {
      console.error('Email verification error:', error);
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

    handleVerifyEmail();
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                    Verify Email Address
                  </Text>
                </View>

                {/* Main Content */}
                <View className="items-center mb-12">
                  <Animated.View 
                    style={{ transform: [{ scale: iconScale }] }}
                    className="mb-6"
                  >
                    <View className="w-24 h-24 bg-white/10 rounded-3xl items-center justify-center backdrop-blur-sm border border-white/20">
                      <Ionicons name="mail" size={48} color="#32CD32" />
                    </View>
                  </Animated.View>
                  
                  <Text className="text-2xl font-bold text-white mb-3 text-center" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                    Verify Your Email
                  </Text>
                  <Text className="text-white/90 text-center text-base leading-6 mb-4 font-medium" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    We've sent a 6-digit verification code to
                  </Text>
                  <Text className="text-lime-400 text-center text-base font-semibold mb-6" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    {email}
                  </Text>
                  <Text className="text-white/90 text-center text-sm font-medium" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Please enter the code to verify your email address
                  </Text>
                </View>

                {/* Email Input (Read-only) */}
                <View className="mb-6">
                  <Text className="text-white font-semibold text-sm mb-3 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Email Address
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={email}
                      editable={false}
                      className="w-full h-14 bg-white/10 rounded-xl px-4 text-white/70 text-base border border-white/20"
                      style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
                      }}
                    />
                    <View className="absolute right-4 top-0 bottom-0 justify-center">
                      <Ionicons name="lock-closed" size={20} color="rgba(255, 255, 255, 0.5)" />
                    </View>
                  </View>
                </View>

                {/* OTP Input */}
                <View className="mb-8">
                  <Text className="text-white font-semibold text-sm mb-3 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Verification Code
                  </Text>
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
                          borderColor: digit ? '#32CD32' : 'rgba(255, 255, 255, 0.3)',
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
                      shadowColor: '#32CD32',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.4,
                      shadowRadius: 12,
                      elevation: 12,
                    }}
                  >
                    <LinearGradient
                      colors={isLoading || otp.join('').length !== 6 
                        ? ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)'] 
                        : ['#32CD32', '#28a745', '#20c997']}
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
                          Verify Email
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
                  <TouchableOpacity 
                    onPress={handleResendOTP}
                    disabled={countdown > 0 || isSendingOTP}
                    className={`px-6 py-3 rounded-xl border ${
                      countdown > 0 || isSendingOTP 
                        ? 'bg-white/10 border-white/20' 
                        : 'bg-lime-500/20 border-lime-400/30'
                    }`}
                                          style={{
                        shadowColor: '#32CD32',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: countdown > 0 ? 0.1 : 0.2,
                        shadowRadius: 4,
                        elevation: countdown > 0 ? 2 : 4,
                      }}
                  >
                    {isSendingOTP ? (
                      <InlineSpinner 
                        size="small"
                        color="#ffffff"
                        text="Sending..."
                        textColor="#ffffff"
                      />
                    ) : countdown > 0 ? (
                      <Text className="text-white/70 font-medium text-sm" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        Resend in {formatCountdown(countdown)}
                      </Text>
                    ) : (
                      <Text className="text-lime-400 font-semibold text-sm" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        Resend Code
                      </Text>
                    )}
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
        text="Verifying email..."
        size="large"
        spinnerColor="#32CD32"
        textColor="#ffffff"
      />
    </View>
  );
}
