import { Text, View } from "react-native";

export default function Hello() {
  return (
    <View className="p-6 rounded-xl bg-white dark:bg-black items-center gap-2">
      <Text className="text-2xl font-bold text-blue-600">Welcome to NativeWind!</Text>
      <Text className="text-gray-600 dark:text-gray-300">This component lives in the components folder.</Text>
    </View>
  );
}

