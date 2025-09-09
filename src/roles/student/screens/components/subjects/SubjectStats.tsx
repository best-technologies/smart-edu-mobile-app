import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SubjectStats as SubjectStatsType, AcademicSession } from './types';

interface SubjectStatsProps {
  stats: SubjectStatsType;
  academicSession: AcademicSession;
}

export function SubjectStats({ stats, academicSession }: SubjectStatsProps) {
  const formatTerm = (term: string) => {
    switch (term?.toLowerCase()) {
      case 'first':
        return '1st Term';
      case 'second':
        return '2nd Term';
      case 'third':
        return '3rd Term';
      default:
        return term || 'N/A';
    }
  };

  const statsCards = [
    {
      id: 'subjects',
      title: 'Subjects',
      value: stats.totalSubjects,
      subtitle: 'Enrolled',
      icon: 'book-outline' as const,
      color: '#3B82F6',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      textColor: 'text-blue-700 dark:text-blue-300',
      valueColor: 'text-blue-900 dark:text-blue-100',
      subtitleColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'videos',
      title: 'Videos',
      value: stats.totalVideos,
      subtitle: 'Available',
      icon: 'play-circle-outline' as const,
      color: '#10B981',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      textColor: 'text-green-700 dark:text-green-300',
      valueColor: 'text-green-900 dark:text-green-100',
      subtitleColor: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'materials',
      title: 'Materials',
      value: stats.totalMaterials,
      subtitle: 'Resources',
      icon: 'document-outline' as const,
      color: '#8B5CF6',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      textColor: 'text-purple-700 dark:text-purple-300',
      valueColor: 'text-purple-900 dark:text-purple-100',
      subtitleColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      value: stats.totalAssignments,
      subtitle: 'Tasks',
      icon: 'library-outline' as const,
      color: '#F59E0B',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconBg: 'bg-orange-100 dark:bg-orange-900/40',
      textColor: 'text-orange-700 dark:text-orange-300',
      valueColor: 'text-orange-900 dark:text-orange-100',
      subtitleColor: 'text-orange-600 dark:text-orange-400'
    }
  ];

  return (
    <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
      {/* Academic Session */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
          Academic Session
        </Text>
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
          {academicSession.academic_year} • {formatTerm(academicSession.term)}
        </Text>
      </View>

      {/* Stats Cards - Horizontal Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-1"
      >
        {statsCards.map((card) => (
          <View key={card.id} className={`${card.bgColor} rounded-xl p-3 min-w-[140px]`}>
            <View className="flex-row items-center gap-2 mb-2">
              <View className={`h-8 w-8 rounded-lg ${card.iconBg} items-center justify-center`}>
                <Ionicons name={card.icon} size={16} color={card.color} />
              </View>
              <Text className={`text-sm font-semibold ${card.textColor}`}>
                {card.title}
              </Text>
            </View>
            <Text className={`text-2xl font-bold ${card.valueColor}`}>
              {card.value}
            </Text>
            <Text className={`text-xs ${card.subtitleColor}`}>
              {card.subtitle}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default SubjectStats;
