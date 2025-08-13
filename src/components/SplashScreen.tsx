import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, Dimensions, StatusBar, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation refs
  const backgroundFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(20)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const progressBar = useRef(new Animated.Value(0)).current;
  const dotAnim1 = useRef(new Animated.Value(0)).current;
  const dotAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim3 = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  const startAnimations = useCallback(() => {
    // Background fade in
    Animated.timing(backgroundFade, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Logo animation (gentle scale-up with fade)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);

    // Tagline animation
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(taglineSlide, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);

    // Progress bar animation
    setTimeout(() => {
      Animated.timing(progressBar, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }, 1200);

    // Bouncing dots animation
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 500,
            delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    };

    setTimeout(() => {
      createDotAnimation(dotAnim1, 0).start();
      createDotAnimation(dotAnim2, 150).start();
      createDotAnimation(dotAnim3, 300).start();
    }, 1400);

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [backgroundFade, logoScale, logoOpacity, taglineSlide, taglineOpacity, progressBar, dotAnim1, dotAnim2, dotAnim3, glowPulse]);

  useEffect(() => {
    // Start animations after component is mounted
    const animationTimer = setTimeout(() => {
      startAnimations();
    }, 100);

    // Auto-finish after 3 seconds
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(finishTimer);
    };
  }, [startAnimations, onFinish]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0f172a' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <Animated.View style={{ flex: 1, opacity: backgroundFade }}>
        {/* Deep blue to lemon green gradient background */}
        <LinearGradient
          colors={['#0f172a', '#1a1a1a', '#32CD32']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          {/* Subtle geometric patterns for depth */}
          <View className="absolute inset-0 opacity-5">
            <View className="absolute top-24 left-12 w-24 h-24 border border-white/30 rounded-full" />
            <View className="absolute top-48 right-16 w-20 h-20 border border-white/30 rotate-45" />
            <View className="absolute bottom-48 left-20 w-16 h-16 border border-white/30 rounded-full" />
            <View className="absolute bottom-32 right-12 w-28 h-28 border border-white/30 rotate-12" />
            <View className="absolute top-1/3 left-1/2 w-12 h-12 border border-white/30 rounded-full" />
          </View>

          {/* Main content container */}
          <View className="flex-1 items-center justify-center px-8">
            {/* Logo container with authority and innovation feel */}
            <View className="items-center mb-8">
                              <Animated.View 
                  style={{ 
                    transform: [{ scale: logoScale }],
                    opacity: logoOpacity,
                  }}
                  className="relative"
                >
                  {/* Glow effect container */}
                  <Animated.View 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 16,
                      backgroundColor: '#32CD32',
                      opacity: glowPulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.3],
                      }),
                      transform: [{ scale: glowPulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.1],
                      })}],
                    }}
                  />
                {/* Professional logo container */}
                <View className="w-32 h-32 bg-white/10 rounded-2xl items-center justify-center backdrop-blur-sm border border-white/20">
                  <Image
                    source={require('../../assets/accessstudy-logo.png')}
                    style={{ width: 70, height: 70 }}
                    resizeMode="contain"
                  />
                </View>
              </Animated.View>
            </View>

            {/* App title with authority */}
            <Text className="text-4xl font-bold text-white mb-2 text-center tracking-tight" 
              style={{ 
                textShadowColor: 'rgba(0,0,0,0.3)', 
                textShadowOffset: { width: 0, height: 2 }, 
                textShadowRadius: 4,
              }}
            >
              Smart Edu Hub
            </Text>

            {/* Tagline with welcoming feel */}
            <Animated.View 
              style={{ 
                transform: [{ translateY: taglineSlide }],
                opacity: taglineOpacity,
              }}
              className="items-center mb-12"
            >
              <Text className="text-lg text-white/90 text-center font-medium tracking-wide">
                Learn. Manage. Grow.
              </Text>
            </Animated.View>

            {/* Loading section */}
            <View className="w-full max-w-xs">
              {/* Progress bar */}
              <View className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-6">
                <Animated.View 
                  style={{
                    width: progressBar.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  }}
                  className="h-full bg-gradient-to-r from-lime-400 to-green-400 rounded-full"
                />
              </View>

              {/* Bouncing dots */}
              <View className="flex-row justify-center space-x-3 mb-4">
                <Animated.View 
                  style={{ 
                    transform: [{ scale: dotAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    })}],
                    opacity: dotAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1],
                    }),
                  }}
                  className="w-3 h-3 bg-white/80 rounded-full"
                />
                <Animated.View 
                  style={{ 
                    transform: [{ scale: dotAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    })}],
                    opacity: dotAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1],
                    }),
                  }}
                  className="w-3 h-3 bg-white/80 rounded-full"
                />
                <Animated.View 
                  style={{ 
                    transform: [{ scale: dotAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 1],
                    })}],
                    opacity: dotAnim3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 1],
                    }),
                  }}
                  className="w-3 h-3 bg-white/80 rounded-full"
                />
              </View>
            </View>
          </View>

          {/* Bottom version info */}
          <View className="absolute bottom-8 left-0 right-0 items-center">
            <Text className="text-white/50 text-xs font-medium">
              Version 1.0.0
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </SafeAreaView>
  );
}
