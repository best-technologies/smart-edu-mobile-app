import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function OverviewCard({ icon, iconTint, label, value, sublabel }: { icon: keyof typeof Ionicons.glyphMap; iconTint: string; label: string; value?: number | string; sublabel?: string }) {
  return (
    <View className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className={`h-12 w-12 items-center justify-center rounded-xl ${iconTint} shadow-sm`}>
            <Ionicons name={icon} size={20} color="currentColor" />
          </View>
          <View>
            <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium">{label}</Text>
            <Text className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">{value ?? '—'}</Text>
          </View>
        </View>
      </View>
      {sublabel ? <Text className="mt-3 text-xs text-gray-500 dark:text-gray-400 font-medium">{sublabel}</Text> : null}
    </View>
  );
}

export function SmallOverviewCard({ icon, label, value, tint }: { icon: keyof typeof Ionicons.glyphMap; label: string; value?: number | string; tint: string }) {
  return (
    <View className="flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className={`h-10 w-10 items-center justify-center rounded-xl ${tint} shadow-sm`}>
          <Ionicons name={icon} size={18} color="currentColor" />
        </View>
        <Text className="text-xl font-extrabold text-gray-900 dark:text-gray-100">{value ?? '—'}</Text>
      </View>
      <Text className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</Text>
    </View>
  );
}

export default OverviewCard;


