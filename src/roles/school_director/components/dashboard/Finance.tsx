import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function FinanceCard({ revenue, expenses, outstanding, netBalance }: { revenue: number; expenses: number; outstanding: number; netBalance: number }) {
  const safeRevenue = Number.isFinite(revenue) && revenue > 0 ? revenue : 0;
  const outstandingPct = safeRevenue > 0 ? Math.min(100, Math.max(0, Math.round((outstanding / safeRevenue) * 100))) : 0;
  return (
    <View className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 shadow-sm">
            <Ionicons name="cash-outline" size={20} color="currentColor" />
          </View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">Finance Overview</Text>
        </View>
        <View className="flex-row gap-2">
          <Badge colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" label="Healthy" />
        </View>
      </View>

      <View className="mt-4 gap-4">
        <FinanceRow icon="trending-up-outline" label="Total Revenue" value={revenue} valueClass="text-emerald-700 dark:text-emerald-300" />
        <FinanceRow icon="trending-down-outline" label="Total Expenses" value={expenses} valueClass="text-rose-600 dark:text-rose-300" />
        <FinanceRow icon="card-outline" label="Outstanding Fees" value={outstanding} valueClass="text-amber-600 dark:text-amber-300" />
        <FinanceRow icon="wallet-outline" label="Net Balance" value={netBalance} valueClass="text-indigo-700 dark:text-indigo-300" />
      </View>

      <View className="mt-4">
        <Text className="text-xs text-gray-500 dark:text-gray-400 font-medium">Outstanding as % of revenue</Text>
        <View className="mt-2 h-3 w-full rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden">
          <View style={{ width: `${outstandingPct}%` }} className="h-full rounded-full bg-amber-500" />
        </View>
        <View className="mt-2 flex-row justify-between">
          <Text className="text-xs text-gray-500 dark:text-gray-400">0%</Text>
          <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">{outstandingPct}%</Text>
        </View>
      </View>
    </View>
  );
}

export function FinanceRow({ icon, label, value, valueClass }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: number; valueClass?: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <Ionicons name={icon} size={18} color="#6b7280" />
        <Text className="text-sm text-gray-600 dark:text-gray-300 font-medium">{label}</Text>
      </View>
      <Text className={`text-base font-bold ${valueClass ?? 'text-gray-900 dark:text-gray-100'}`}>{value?.toLocaleString?.() ?? '—'}</Text>
    </View>
  );
}

export function Badge({ colorClass, label }: { colorClass: string; label: string }) {
  return (
    <View className={`self-start rounded-lg px-2 py-1 ${colorClass}`}>
      <Text className="text-[10px] font-semibold">{label}</Text>
    </View>
  );
}

export default FinanceCard;


