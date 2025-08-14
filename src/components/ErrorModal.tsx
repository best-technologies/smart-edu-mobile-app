import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

export interface ErrorModalProps {
  visible: boolean;
  title: string;
  message?: string;
  icon?: string;
  onClose: () => void;
  onRetry?: () => void;
  retryText?: string;
  closeText?: string;
  showRetryButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function ErrorModal({
  visible,
  title,
  message,
  icon = 'alert-circle',
  onClose,
  onRetry,
  retryText = 'Try Again',
  closeText = 'Close',
  showRetryButton = false,
  autoClose = false,
  autoCloseDelay = 5000,
}: ErrorModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const iconShakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Icon shake animation
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(iconShakeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(iconShakeAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(iconShakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close
      if (autoClose) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, autoClose, autoCloseDelay]);

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={handleClose}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
          }}
        >
          <Pressable onPress={() => {}}>
            <View
              style={{
                width: Math.min(screenWidth - 80, 400),
                backgroundColor: 'white',
                borderRadius: 24,
                padding: 32,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 20 },
                shadowOpacity: 0.25,
                shadowRadius: 40,
                elevation: 20,
              }}
            >
              {/* Error Icon */}
              <Animated.View
                style={{
                  transform: [
                    {
                      translateX: iconShakeAnim.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-5, 5],
                      }),
                    },
                  ],
                  marginBottom: 24,
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#ef4444',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#ef4444',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 8,
                  }}
                >
                  <Ionicons name={icon as any} size={40} color="#ffffff" />
                </View>
              </Animated.View>

              {/* Title */}
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                {title}
              </Text>

              {/* Message */}
              {message && (
                <Text
                  style={{
                    fontSize: 16,
                    color: '#6b7280',
                    textAlign: 'center',
                    lineHeight: 24,
                    marginBottom: 32,
                  }}
                >
                  {message}
                </Text>
              )}

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: '#e5e7eb',
                    backgroundColor: 'white',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#6b7280',
                      textAlign: 'center',
                    }}
                  >
                    {closeText}
                  </Text>
                </TouchableOpacity>

                {showRetryButton && (
                  <TouchableOpacity
                    onPress={handleRetry}
                    style={{
                      flex: 1,
                      paddingVertical: 16,
                      paddingHorizontal: 24,
                      borderRadius: 12,
                      shadowColor: '#ef4444',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <LinearGradient
                      colors={['#ef4444', '#dc2626']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        borderRadius: 12,
                        paddingVertical: 16,
                        paddingHorizontal: 24,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: '#ffffff',
                          textAlign: 'center',
                        }}
                      >
                        {retryText}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
