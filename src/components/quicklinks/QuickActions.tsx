import React, { useEffect, useRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
  isAnimated?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  className?: string;
}

const AnimatedAction = React.forwardRef<View, { action: QuickAction }>(({ action }, ref) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!action.isAnimated) return;

    const createBreathingAnimation = () => {
      return Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.08,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.8,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    const animation = createBreathingAnimation();
    animation.start();

    return () => {
      animation.stop();
    };
  }, [action.isAnimated, scaleAnim, opacityAnim, glowAnim]);

  if (action.isAnimated) {
    return (
      <Animated.View
        ref={ref}
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <TouchableOpacity
          onPress={action.onPress}
          activeOpacity={0.7}
          className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 items-center min-w-[80px]"
        >
          <Animated.View 
            className="w-10 h-10 rounded-full items-center justify-center mb-2"
            style={{ 
              backgroundColor: `${action.color}20`,
              shadowColor: action.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.6],
              }),
              shadowRadius: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 8],
              }),
              elevation: 5,
              transform: [{ scale: scaleAnim }],
            }}
          >
            <Ionicons name={action.icon} size={20} color={action.color} />
          </Animated.View>
          <Text className="text-xs font-medium text-gray-900 dark:text-gray-100 text-center">
            {action.title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      onPress={action.onPress}
      activeOpacity={0.8}
      className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 items-center min-w-[80px]"
    >
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${action.color}20` }}
      >
        <Ionicons name={action.icon} size={20} color={action.color} />
      </View>
      <Text className="text-xs font-medium text-gray-900 dark:text-gray-100 text-center">
        {action.title}
      </Text>
    </TouchableOpacity>
  );
});

export default function QuickActions({ 
  actions, 
  title = "Quick Actions",
  className = "mb-6"
}: QuickActionsProps) {
  return (
    <View className={className}>
      <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-1"
      >
        {actions.map((action) => (
          <AnimatedAction key={action.id} action={action} />
        ))}
      </ScrollView>
    </View>
  );
}
