import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface InlineLoaderProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  spinnerColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function InlineLoader({
  text,
  size = 'medium',
  spinnerColor = '#3b82f6',
  textColor = '#6b7280',
  style,
  textStyle,
}: InlineLoaderProps) {
  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'medium':
        return 30;
      case 'large':
        return 40;
      default:
        return 30;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-xs';
      case 'medium':
        return 'text-sm';
      case 'large':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <View 
      className="items-center justify-center"
      style={style}
    >
      {/* Animated Spinner */}
      <View 
        className="border-2 border-t-transparent rounded-full animate-spin"
        style={{
          width: getSpinnerSize(),
          height: getSpinnerSize(),
          borderColor: spinnerColor,
          borderTopColor: 'transparent',
        }}
      />
      
      {/* Loading Text */}
      {text && (
        <Text 
          className={`font-medium text-center mt-2 ${getTextSize()}`}
          style={[
            { color: textColor },
            textStyle
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
}






