import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  duration = 1000, // 1 second
  onClose,
  onPress,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      
      // Set initial values immediately
      translateY.setValue(0);
      opacity.setValue(1);
      scale.setValue(1);

      // Auto hide after duration
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, translateY, opacity, scale, onClose]);

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
    <View
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        zIndex: 9999999,
        elevation: 9999999,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={config.colors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 12,
          borderWidth: 1,
          borderColor: config.borderColor,
          padding: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Icon */}
          <View style={{ marginRight: 10, marginTop: 1 }}>
            <Ionicons name={config.icon as any} size={20} color={config.iconColor} />
          </View>

          {/* Content */}
          <View style={{ flex: 1, marginRight: 6 }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 13, 
              fontWeight: 'bold',
              textShadowColor: 'rgba(0, 0, 0, 0.2)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
            }}>
              {title}
            </Text>
            {message && (
              <Text style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: 10, 
                marginTop: 2,
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 1,
              }}>
                {message}
              </Text>
            )}
          </View>

          {/* Close Button */}
          <TouchableOpacity
            onPress={() => {
              console.log('Manual close button pressed');
              onClose();
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
