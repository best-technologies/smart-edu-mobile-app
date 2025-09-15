import React, { useEffect, useRef } from 'react';
import { View, Text, ViewStyle, TextStyle, Animated, Easing } from 'react-native';
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
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
    return () => spinAnimation.stop();
  }, [spinValue]);

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

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-row items-center" style={style}>
      <Animated.View
        style={{
          width: getSize(),
          height: getSize(),
          borderWidth: 2,
          borderColor: color,
          borderTopColor: 'transparent',
          borderRadius: 9999,
          marginRight: 8,
          transform: [{ rotate: spin }],
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
