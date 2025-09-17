import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Create animated View component with forwardRef
const AnimatedView = React.forwardRef<View, any>((props, ref) => (
  <View ref={ref} {...props} />
));

interface AddClassButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline';
}

export default function AddClassButton({
  onPress,
  disabled = false,
  loading = false,
  size = 'medium',
  variant = 'primary',
}: AddClassButtonProps) {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 12,
          fontSize: 14,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          fontSize: 18,
          iconSize: 24,
        };
      default: // medium
        return {
          paddingVertical: 12,
          paddingHorizontal: 16,
          fontSize: 16,
          iconSize: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: 'bg-gray-100 dark:bg-gray-700',
          text: 'text-gray-700 dark:text-gray-300',
          icon: '#6b7280',
        };
      case 'outline':
        return {
          container: 'border-2 border-blue-500 bg-transparent',
          text: 'text-blue-600 dark:text-blue-400',
          icon: '#3b82f6',
        };
      default: // primary
        return {
          container: '',
          text: 'text-white',
          icon: '#ffffff',
        };
    }
  };

  const variantStyles = getVariantStyles();

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={{
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <LinearGradient
          colors={disabled ? ['#9ca3af', '#6b7280'] : ['#3b82f6', '#2563eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 12,
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <View className="flex-row items-center justify-center">
            {loading ? (
              <AnimatedView className="w-4 h-4 border-2 border-white border-t-transparent rounded-full  mr-2" />
            ) : (
              <Ionicons 
                name="add-circle" 
                size={sizeStyles.iconSize} 
                color={variantStyles.icon} 
                style={{ marginRight: 6 }}
              />
            )}
            <Text 
              className={`font-semibold ${variantStyles.text}`}
              style={{ fontSize: sizeStyles.fontSize }}
            >
              {loading ? 'Adding...' : 'Add Class'}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`rounded-xl ${variantStyles.container} ${
        disabled ? 'opacity-60' : ''
      }`}
      style={{
        paddingVertical: sizeStyles.paddingVertical,
        paddingHorizontal: sizeStyles.paddingHorizontal,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center justify-center">
        {loading ? (
          <AnimatedView className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full  mr-2" />
        ) : (
          <Ionicons 
            name="add-circle" 
            size={sizeStyles.iconSize} 
            color={variantStyles.icon} 
            style={{ marginRight: 6 }}
          />
        )}
        <Text 
          className={`font-semibold ${variantStyles.text}`}
          style={{ fontSize: sizeStyles.fontSize }}
        >
          {loading ? 'Adding...' : 'Add Class'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
