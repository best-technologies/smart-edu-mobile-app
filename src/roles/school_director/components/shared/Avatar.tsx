import { Image, Text, View, TouchableOpacity } from 'react-native';

export function Avatar({ name, uri, onPress }: { name: string; uri?: string; onPress?: () => void }) {
  const content = uri ? (
    <Image source={{ uri }} className="h-12 w-12 rounded-full" />
  ) : (
    <View className="h-12 w-12 rounded-full bg-indigo-600 items-center justify-center">
      <Text className="text-white font-bold">
        {name
          .split(/\s|_|\./)
          .filter(Boolean)
          .slice(0, 2)
          .map((s) => s[0]?.toUpperCase?.())
          .join('') || 'DR'}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export default Avatar;


