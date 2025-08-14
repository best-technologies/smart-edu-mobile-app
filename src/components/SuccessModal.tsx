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

export interface SuccessModalProps {
  visible: boolean;
  title: string;
  message?: string;
  icon?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function SuccessModal({
  visible,
  title,
  message,
  icon = 'checkmark-circle',
  onClose,
  onConfirm,
  confirmText = 'Continue',
  cancelText = 'Close',
  showCancelButton = false,
  autoClose = true,
  autoCloseDelay = 3000,
}: SuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;

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

      // Icon bounce animation
      Animated.sequence([
        Animated.delay(200),
        Animated.spring(iconScaleAnim, {
          toValue: 1.2,
          tension: 200,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          tension: 200,
          friction: 3,
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

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
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
              {/* Success Icon */}
              <Animated.View
                style={{
                  transform: [{ scale: iconScaleAnim }],
                  marginBottom: 24,
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#10b981',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#10b981',
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
                {showCancelButton && (
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
                      {cancelText}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={handleConfirm}
                  style={{
                    flex: 1,
                    paddingVertical: 16,
                    paddingHorizontal: 24,
                    borderRadius: 12,
                    shadowColor: '#10b981',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <LinearGradient
                    colors={['#10b981', '#059669']}
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
                      {confirmText}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
