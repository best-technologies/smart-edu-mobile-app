import { ScrollView, Text, TouchableOpacity, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuickAction } from '@/mock';
import { useEffect, useRef } from 'react';

// Animated Action Component
const AnimatedAction = ({ action }: { action: QuickAction }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (action.isAnimated) {
      const createBreathingAnimation = () => {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.8,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => createBreathingAnimation());
      };

      createBreathingAnimation();
    }
  }, [action.isAnimated, scaleAnim, opacityAnim]);

  if (action.isAnimated) {
    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <TouchableOpacity
          onPress={action.onPress}
          activeOpacity={0.7}
          className="items-center"
        >
          <View 
            className="h-16 w-16 items-center justify-center rounded-full mb-2"
            style={{ 
              backgroundColor: `${action.color}15`,
              shadowColor: action.color,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Ionicons name={action.icon as any} size={24} color={action.color} />
          </View>
          <Text 
            className="text-sm font-semibold text-center text-gray-900 dark:text-gray-100"
          >
            {action.title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <TouchableOpacity
      onPress={action.onPress}
      activeOpacity={0.7}
      className="items-center"
    >
      <View 
        className="h-16 w-16 items-center justify-center rounded-full mb-2"
        style={{ backgroundColor: `${action.color}15` }}
      >
        <Ionicons name={action.icon as any} size={24} color={action.color} />
      </View>
      <Text 
        className="text-sm font-semibold text-center text-gray-900 dark:text-gray-100"
      >
        {action.title}
      </Text>
    </TouchableOpacity>
  );
};

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <View className="mb-8">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Quick Actions
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerClassName="gap-6"
      >
      {actions.map((action) => (
        <AnimatedAction key={action.id} action={action} />
      ))}
      </ScrollView>
    </View>
  );
}

export default QuickActions;
