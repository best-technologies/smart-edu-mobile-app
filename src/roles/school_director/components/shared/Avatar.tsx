import { Image, Text, View } from 'react-native';

export function Avatar({ name, uri }: { name: string; uri?: string }) {
  if (uri) {
    return <Image source={{ uri }} className="h-12 w-12 rounded-full" />;
  }
  const initials = name
    .split(/\s|_|\./)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase?.())
    .join('') || 'DR';
  return (
    <View className="h-12 w-12 rounded-full bg-indigo-600 items-center justify-center">
      <Text className="text-white font-bold">{initials}</Text>
    </View>
  );
}

export default Avatar;


