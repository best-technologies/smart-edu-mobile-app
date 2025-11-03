import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Communication } from '../../mock/parentMockData';

interface MessageCardProps {
  message: Communication;
  onPress?: (message: Communication) => void;
}

export default function MessageCard({ message, onPress }: MessageCardProps) {
  const getTypeIcon = (type: Communication['type']) => {
    switch (type) {
      case 'message':
        return 'mail' as keyof typeof Ionicons.glyphMap;
      case 'notification':
        return 'notifications' as keyof typeof Ionicons.glyphMap;
      case 'alert':
        return 'alert-circle' as keyof typeof Ionicons.glyphMap;
      case 'announcement':
        return 'megaphone' as keyof typeof Ionicons.glyphMap;
      default:
        return 'information-circle' as keyof typeof Ionicons.glyphMap;
    }
  };

  const getPriorityColor = (priority: Communication['priority']) => {
    switch (priority) {
      case 'high':
        return { bg: '#ef444420', text: '#ef4444', border: '#ef444440' };
      case 'medium':
        return { bg: '#f59e0b20', text: '#f59e0b', border: '#f59e0b40' };
      case 'low':
        return { bg: '#6b728020', text: '#6b7280', border: '#6b728040' };
      default:
        return { bg: '#6b728020', text: '#6b7280', border: '#6b728040' };
    }
  };

  const colors = getPriorityColor(message.priority);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      onPress={() => onPress?.(message)}
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border ${
        !message.read ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'
      }`}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        {/* Icon */}
        <View 
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: colors.bg }}
        >
          <Ionicons name={getTypeIcon(message.type)} size={20} color={colors.text} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <View className="flex-1 mr-2">
              <Text className={`text-sm font-semibold ${!message.read ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                {message.subject}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                From: {message.from} ({message.fromRole})
              </Text>
            </View>
            {!message.read && (
              <View className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1" />
            )}
          </View>

          <Text 
            className="text-sm text-gray-600 dark:text-gray-400 mt-2"
            numberOfLines={2}
          >
            {message.message}
          </Text>

          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(message.date)}
            </Text>
            <View 
              className="px-2 py-1 rounded-full border"
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
            >
              <Text className="text-xs font-semibold capitalize" style={{ color: colors.text }}>
                {message.priority}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

