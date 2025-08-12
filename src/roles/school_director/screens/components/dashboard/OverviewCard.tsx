import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function OverviewCard({ icon, iconTint, label, value, sublabel }: { icon: keyof typeof Ionicons.glyphMap; iconTint: string; label: string; value?: number | string; sublabel?: string }) {
  return (
    <View className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className={`h-10 w-10 items-center justify-center rounded-xl ${iconTint}`}>
            <Ionicons name={icon} size={18} color="currentColor" />
          </View>
          <View>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">{label}</Text>
            <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{value ?? '—'}</Text>
          </View>
        </View>
      </View>
      {sublabel ? <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400">{sublabel}</Text> : null}
    </View>
  );
}

export function SmallOverviewCard({ icon, label, value, tint }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: number | string; tint: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4">
      <View className="flex-row items-center justify-between">
        <View className={`h-9 w-9 items-center justify-center rounded-xl ${tint}`}>
          <Ionicons name={icon} size={16} color="currentColor" />
        </View>
        <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{value ?? '—'}</Text>
      </View>
      <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400">{label}</Text>
    </View>
  );
}

export default OverviewCard;


