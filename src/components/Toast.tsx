import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
  onPress?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function Toast({
  visible,
  type,
  title,
  message,
  duration = 4000,
  onClose,
  onPress,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const isVisible = useRef(false);

  const hideToast = useCallback(() => {
    if (!isVisible.current) return;
    
    isVisible.current = false;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [translateY, opacity, scale, onClose]);

  useEffect(() => {
    if (visible) {
      isVisible.current = true;
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Only hide if we're transitioning from visible to not visible
      if (isVisible.current) {
        hideToast();
      }
    }
  }, [visible, duration, hideToast]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          colors: ['#10b981', '#059669', '#047857'],
          icon: 'checkmark-circle',
          iconColor: '#ffffff',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        };
      case 'error':
        return {
          colors: ['#ef4444', '#dc2626', '#b91c1c'],
          icon: 'close-circle',
          iconColor: '#ffffff',
          borderColor: 'rgba(239, 68, 68, 0.3)',
        };
      case 'warning':
        return {
          colors: ['#f59e0b', '#d97706', '#b45309'],
          icon: 'warning',
          iconColor: '#ffffff',
          borderColor: 'rgba(245, 158, 11, 0.3)',
        };
      case 'info':
        return {
          colors: ['#3b82f6', '#2563eb', '#1d4ed8'],
          icon: 'information-circle',
          iconColor: '#ffffff',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        };
      default:
        return {
          colors: ['#6b7280', '#4b5563', '#374151'],
          icon: 'information-circle',
          iconColor: '#ffffff',
          borderColor: 'rgba(107, 114, 128, 0.3)',
        };
    }
  };

  const config = getToastConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        zIndex: 999999,
        elevation: 999999,
        transform: [{ translateY }, { scale }],
        opacity,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 999999,
          zIndex: 999999,
        }}
      >
        <LinearGradient
          colors={config.colors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            borderWidth: 1,
            borderColor: config.borderColor,
            overflow: 'hidden',
          }}
        >
          <View className="flex-row items-start p-4">
            {/* Icon */}
            <View className="mr-3 mt-0.5">
              <Ionicons name={config.icon as any} size={24} color={config.iconColor} />
            </View>

            {/* Content */}
            <View className="flex-1 mr-2">
              <Text className="text-white font-bold text-base mb-1" style={{ textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
                {title}
              </Text>
              {message && (
                <Text className="text-white/90 text-sm leading-5" style={{ textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 1 }}>
                  {message}
                </Text>
              )}
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={hideToast}
              className="w-6 h-6 items-center justify-center rounded-full bg-white/20"
            >
              <Ionicons name="close" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}
