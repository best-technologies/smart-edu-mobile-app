import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InlineSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function InlineSpinner({
  size = 'medium',
  color = '#32CD32',
  text,
  textColor = '#ffffff',
  style,
  textStyle,
}: InlineSpinnerProps) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <View className="flex-row items-center" style={style}>
      <View 
        className="border-2 border-t-transparent rounded-full animate-spin mr-2"
        style={{
          width: getSize(),
          height: getSize(),
          borderColor: color,
          borderTopColor: 'transparent',
        }}
      />
      {text && (
        <Text 
          className={`font-medium ${getTextSize()}`}
          style={[{ color: textColor }, textStyle]}
        >
          {text}
        </Text>
      )}
    </View>
  );
}
