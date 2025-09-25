import React, { useEffect, useState } from 'react';
import { View, Text, Image, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Show content after a short delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500); // Increased delay to 500ms

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Auto-finish after 3 seconds
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(finishTimer);
      clearInterval(progressInterval);
    };
  }, [onFinish]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#0f172a' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      
      <View style={{ flex: 1, opacity: isVisible ? 1 : 0 }}>
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
            {/* Logo container */}
            <View className="items-center mb-8">
              <View className="relative">
                {/* Glow effect */}
                <View 
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: -10,
                    right: -10,
                    bottom: -10,
                    borderRadius: 20,
                    backgroundColor: '#32CD32',
                    opacity: 0.2,
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
              </View>
            </View>

            {/* App title */}
            <Text 
              className="text-4xl font-bold text-white mb-2 text-center tracking-tight" 
              style={{ 
                textShadowColor: 'rgba(0,0,0,0.3)', 
                textShadowOffset: { width: 0, height: 2 }, 
                textShadowRadius: 4,
              }}
            >
              Smart Edu Hub
            </Text>

            {/* Tagline */}
            <View className="items-center mb-12">
              <Text className="text-lg text-white/90 text-center font-medium tracking-wide">
                Learn. Manage. Grow.
              </Text>
            </View>

            {/* Loading section */}
            <View className="w-full max-w-xs">
              {/* Progress bar */}
              <View className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-6">
                <View 
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: '#32CD32',
                    borderRadius: 4,
                  }}
                />
              </View>

              {/* Loading dots */}
              <View className="flex-row justify-center space-x-3 mb-4">
                <View className="w-3 h-3 bg-white/80 rounded-full" />
                <View className="w-3 h-3 bg-white/80 rounded-full" />
                <View className="w-3 h-3 bg-white/80 rounded-full" />
              </View>

              {/* Loading text */}
              <Text className="text-white/70 text-center text-sm">
                Loading...
              </Text>
            </View>
          </View>

          {/* Bottom version info */}
          <View className="absolute bottom-8 left-0 right-0 items-center">
            <Text className="text-white/50 text-xs font-medium">
              Version 1.0.0
            </Text>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}