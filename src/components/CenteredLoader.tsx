import React from 'react';
import { View, Text, Modal, ViewStyle, TextStyle } from 'react-native';

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
  // backgroundColor = 'transparent',
  spinnerColor = '#3b82f6',
  textColor = '#6b7280',
  style,
  textStyle,
  showBackdrop = false,
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
          { backgroundColor: 'transparent' },
          style
        ]}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
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
            className={`font-medium text-center ${getTextSize()}`}
            style={[
              { 
                color: textColor,
              },
              textStyle
            ]}
          >
            {text}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
