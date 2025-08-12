import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuickStat } from '@/mock';

export function QuickStats({ stats }: { stats: QuickStat[] }) {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'remove';
    }
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View className="mb-8">
      <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
        Quick Stats
      </Text>
      <View className="gap-3">
      {/* First Row */}
      <View className="flex-row gap-3">
        {stats.slice(0, 2).map((stat) => (
          <View key={stat.id} className="flex-1 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4">
            <View className="flex-row items-center justify-between mb-2">
              <View 
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              {stat.trend && (
                <Ionicons 
                  name={getTrendIcon(stat.trend) as any} 
                  size={16} 
                  color={getTrendColor(stat.trend)} 
                />
              )}
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {stat.value}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {stat.title}
            </Text>
          </View>
        ))}
      </View>

      {/* Second Row */}
      <View className="flex-row gap-3">
        {stats.slice(2, 4).map((stat) => (
          <View key={stat.id} className="flex-1 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-4">
            <View className="flex-row items-center justify-between mb-2">
              <View 
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              {stat.trend && (
                <Ionicons 
                  name={getTrendIcon(stat.trend) as any} 
                  size={16} 
                  color={getTrendColor(stat.trend)} 
                />
              )}
            </View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {stat.value}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {stat.title}
            </Text>
          </View>
        ))}
      </View>
      </View>
    </View>
  );
}

export default QuickStats;
