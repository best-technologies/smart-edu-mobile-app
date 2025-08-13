import React from 'react';
import { View, Text, Modal, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CenteredLoaderProps {
  visible: boolean;
  text?: string;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  spinnerColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showBackdrop?: boolean;
}

export default function CenteredLoader({
  visible,
  text = 'Loading...',
  size = 'large',
  backgroundColor = 'rgba(15, 23, 42, 0.95)',
  spinnerColor = '#32CD32',
  textColor = '#ffffff',
  style,
  textStyle,
  showBackdrop = true,
}: CenteredLoaderProps) {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 60;
      case 'large':
        return 80;
      default:
        return 80;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-lg';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'medium':
        return 30;
      case 'large':
        return 40;
      default:
        return 40;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View 
        className="flex-1 justify-center items-center"
        style={[
          { backgroundColor: showBackdrop ? backgroundColor : 'transparent' },
          style
        ]}
      >
        <LinearGradient
          colors={['rgba(15, 23, 42, 0.9)', 'rgba(26, 26, 26, 0.8)', 'rgba(50, 205, 50, 0.7)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            padding: 40,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
          }}
        >
          {/* Animated Spinner */}
          <View 
            className="border-4 border-t-transparent rounded-full animate-spin mb-4"
            style={{
              width: getSpinnerSize(),
              height: getSpinnerSize(),
              borderColor: spinnerColor,
              borderTopColor: 'transparent',
            }}
          />
          
          {/* Loading Text */}
          <Text 
            className={`font-semibold text-center ${getTextSize()}`}
            style={[
              { 
                color: textColor,
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              },
              textStyle
            ]}
          >
            {text}
          </Text>
        </LinearGradient>
      </View>
    </Modal>
  );
}
