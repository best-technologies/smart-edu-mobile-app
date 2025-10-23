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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/RootNavigator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import OTPInput from '@/components/OTPInput';

type PasswordResetOTPScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PasswordResetOTP'>;
type PasswordResetOTPScreenRouteProp = RouteProp<RootStackParamList, 'PasswordResetOTP'>;

interface PasswordResetOTPScreenProps {
  navigation: PasswordResetOTPScreenNavigationProp;
  route: PasswordResetOTPScreenRouteProp;
}

export default function PasswordResetOTPScreen({ navigation, route }: PasswordResetOTPScreenProps) {
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
  // const [newPassword, setNewPassword] = useState('Maximus123');
  // const [confirmPassword, setConfirmPassword] = useState('Maximus123');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const { verifyOTPAndResetPassword, isLoading, error, clearError } = useAuth();
  const { showError, showSuccess } = useToast();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Input refs for password fields
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  React.useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(iconScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle errors from auth context
  useEffect(() => {
    if (error) {
      showError('Reset Failed', error);
      clearError();
    }
  }, [error, clearError, showError]);


  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters with at least one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (text: string) => {
    setNewPassword(text);
    setPasswordError('');
    
    // Clear confirm password error if passwords now match
    if (confirmPassword && text === confirmPassword) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError('');
  };

  const handleResetPassword = async () => {
    // Clear previous errors
    setOtpError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate OTP
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    // Additional validation: check if all digits are filled
    if (otp.some(digit => !digit || digit.trim() === '')) {
      setOtpError('Please enter all 6 digits');
      return;
    }

    // Validate password
    if (!newPassword.trim()) {
      setPasswordError('Password is required');
      return;
    }

    if (!validatePassword(newPassword)) {
      setPasswordError('Password must be at least 8 characters with uppercase, lowercase, and number');
      return;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      showError('Password Mismatch', 'The passwords you entered do not match. Please try again.');
      return;
    }

    try {
      await verifyOTPAndResetPassword({
        email,
        otp: otpString,
        new_password: newPassword
      });
      
      // Show success message and navigate back to login
      setTimeout(() => {
        navigation.navigate('Login');
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

    handleResetPassword();
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
              <Animated.View 
                style={{ 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
                className="flex-1 px-8 justify-center"
              >
                {/* Header */}
                <View className="items-center mb-12">
                  <Animated.View 
                    style={{ transform: [{ scale: iconScale }] }}
                    className="w-24 h-24 bg-white/10 rounded-3xl items-center justify-center backdrop-blur-sm border border-white/20 mb-6"
                  >
                    <Ionicons name="key" size={48} color="#14b8a6" />
                  </Animated.View>
                  
                  <Text className="text-3xl font-bold text-white mb-2 text-center" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                    Reset Password
                  </Text>
                  <Text className="text-white/90 text-center text-base font-medium" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                    Enter the 6-digit code sent to {email} and create a new password
                  </Text>
                </View>

                {/* OTP Input */}
                <View className="space-y-6 mb-4">
                  <View>
                    <Text className="text-white font-semibold text-sm mb-1 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      Verification Code
                    </Text>
                    
                    <OTPInput
                      value={otp}
                      onChange={(newOtp) => {
                        setOtp(newOtp);
                        setOtpError(''); // Clear error immediately when user types
                        // Check if OTP is complete and trigger validation
                        if (newOtp.join('').length === 6) {
                          // Clear any existing errors before auto-submit
                          setOtpError('');
                          setPasswordError('');
                          setConfirmPasswordError('');
                          setTimeout(() => {
                            const otpString = newOtp.join('');
                            // if (otpString.length === 6) {
                            //   // Auto-submit when OTP is complete
                            //   handleResetPassword();
                            // }
                          }, 100); // Small delay to ensure state is updated
                        }
                      }}
                      length={6}
                      autoFocus={true}
                      keyboardType="number-pad"
                      containerStyle={{ marginBottom: 16 }}
                      inputStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderColor: otpError ? '#ef4444' : 'rgba(255, 255, 255, 0.25)',
                        borderWidth: 2,
                        color: '#ffffff',
                        fontSize: 20,
                        fontWeight: 'bold',
                        letterSpacing: 4,
                      }}
                    />
                    
                    {otpError && (
                      <Text className="text-red-300 text-sm mt-4 text-center" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        {otpError}
                      </Text>
                    )}
                  </View>

                  {/* New Password Input */}
                  <View>
                    <Text className="text-white font-semibold text-sm mb-1 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      New Password
                    </Text>
                    <View className="relative">
                      <TextInput
                        ref={passwordRef}
                        value={newPassword}
                        onChangeText={handlePasswordChange}
                        placeholder="Enter new password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        className={`w-full h-14 bg-white/15 rounded-xl px-4 pr-12 text-white text-base border ${
                          passwordError ? 'border-red-500' : 'border-white/25'
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
                    {passwordError && (
                      <Text className="text-red-300 text-sm mt-2 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        {passwordError}
                      </Text>
                    )}
                  </View>

                  {/* Confirm Password Input */}
                  <View>
                    <Text className="text-white font-semibold text-sm mb-1 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                      Confirm Password
                    </Text>
                    <View className="relative">
                      <TextInput
                        ref={confirmPasswordRef}
                        value={confirmPassword}
                        onChangeText={handleConfirmPasswordChange}
                        placeholder="Confirm new password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        className={`w-full h-14 bg-white/15 rounded-xl px-4 pr-12 text-white text-base border ${
                          confirmPasswordError ? 'border-red-500' : 'border-white/25'
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
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-0 bottom-0 justify-center"
                      >
                        <Ionicons 
                          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                          size={20} 
                          color="rgba(255, 255, 255, 0.8)" 
                        />
                      </TouchableOpacity>
                    </View>
                    {confirmPasswordError && (
                      <Text className="text-red-300 text-sm mt-2 ml-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                        {confirmPasswordError}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Reset Password Button */}
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <TouchableOpacity
                    onPress={handleButtonPress}
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
                      {isLoading ? (
                        <View className="flex-row items-center">
                          <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 12 }} />
                          <Text className="text-white font-bold text-base" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                            Resetting Password...
                          </Text>
                        </View>
                      ) : (
                        <Text className="text-white font-bold text-base" style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                          Reset Password
                        </Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

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
              </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
