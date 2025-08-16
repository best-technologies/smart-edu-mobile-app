import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  icon?: string;
  onPress?: () => void;
  text?: string;
  color?: string;
}

export function FloatingActionButton({ 
  icon = "add", 
  onPress, 
  text,
  color = "bg-green-500"
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      className={`absolute bottom-6 right-4 ${color} px-4 py-3 rounded-full flex-row items-center gap-2 shadow-lg`}
      style={{
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      <Ionicons name={icon as any} size={20} color="white" />
      {text && (
        <Text className="text-white font-semibold text-sm">
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default FloatingActionButton;
