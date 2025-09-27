import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DirectorProfileData } from '@/mock/directorProfile';

interface ResultsAnalyticsTabProps {
  data: DirectorProfileData['resultsAnalytics'];
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
  trend?: 'up' | 'down' | 'stable';
}

const MetricCard = ({ title, value, subtitle, color, icon, trend }: MetricCardProps) => (
  <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
    <View className="flex-row items-center justify-between mb-3">
      <View 
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      {trend && (
        <View className={`flex-row items-center px-2 py-1 rounded-full ${
          trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 
          trend === 'down' ? 'bg-red-100 dark:bg-red-900/30' : 
          'bg-gray-100 dark:bg-gray-700'
        }`}>
          <Ionicons 
            name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove'} 
            size={12} 
            color={trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#6B7280'} 
          />
        </View>
      )}
    </View>
    <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
      {typeof value === 'number' ? value.toFixed(1) : value}
    </Text>
    <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
      {title}
    </Text>
    {subtitle && (
      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {subtitle}
      </Text>
    )}
  </View>
);

interface PerformanceRowProps {
  grade: string;
  students: number;
  score: number;
  passRate: number;
  topSubject: string;
  isLast?: boolean;
}

const PerformanceRow = ({ grade, students, score, passRate, topSubject, isLast }: PerformanceRowProps) => (
  <View className={`py-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
        {grade}
      </Text>
      <View className="flex-row items-center">
        <View className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full mr-2">
          <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
            {students} students
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${
          passRate >= 95 ? 'bg-green-100 dark:bg-green-900/30' :
          passRate >= 85 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
          'bg-red-100 dark:bg-red-900/30'
        }`}>
          <Text className={`text-xs font-medium ${
            passRate >= 95 ? 'text-green-700 dark:text-green-300' :
            passRate >= 85 ? 'text-yellow-700 dark:text-yellow-300' :
            'text-red-700 dark:text-red-300'
          }`}>
            {passRate}% pass
          </Text>
        </View>
      </View>
    </View>
    <View className="flex-row items-center justify-between">
      <Text className="text-xs text-gray-500 dark:text-gray-400">
        Avg Score: <Text className="font-medium text-gray-700 dark:text-gray-300">{score}%</Text>
      </Text>
      <Text className="text-xs text-gray-500 dark:text-gray-400">
        Top: <Text className="font-medium text-gray-700 dark:text-gray-300">{topSubject}</Text>
      </Text>
    </View>
  </View>
);

const TrendBar = ({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) => (
  <View className="mb-4">
    <View className="flex-row justify-between mb-2">
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">{value}%</Text>
    </View>
    <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
      <View 
        className="h-full rounded-full"
        style={{ 
          width: `${(value / maxValue) * 100}%`,
          backgroundColor: color 
        }}
      />
    </View>
  </View>
);

export default function ResultsAnalyticsTab({ data }: ResultsAnalyticsTabProps) {
  return (
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Overall Performance Metrics */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Overall Performance
        </Text>
        <View className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Average Grade"
            value={`${data.overallPerformance.averageGrade}/4.0`}
            subtitle="GPA across all students"
            color="#3B82F6"
            icon="school-outline"
            trend="up"
          />
          <MetricCard
            title="Pass Rate"
            value={`${data.overallPerformance.passRate}%`}
            subtitle="Students passing grades"
            color="#10B981"
            icon="checkmark-circle-outline"
            trend="up"
          />
          <MetricCard
            title="Improvement Rate"
            value={`+${data.overallPerformance.improvementRate}%`}
            subtitle="Year-over-year growth"
            color="#F59E0B"
            icon="trending-up-outline"
            trend="up"
          />
          <MetricCard
            title="Teacher Rating"
            value={`${data.teacherPerformance.avgStudentRating}/5.0`}
            subtitle="Average student rating"
            color="#8B5CF6"
            icon="star-outline"
            trend="up"
          />
        </View>
      </View>

      {/* Subject Performance */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Subject Performance
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Top Performing Subjects
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {data.overallPerformance.topPerformingSubjects.map((subject, index) => (
                <View key={index} className="bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-full">
                  <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                    {subject}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Areas of Concern
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {data.overallPerformance.areasOfConcern.map((subject, index) => (
                <View key={index} className="bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded-full">
                  <Text className="text-xs font-medium text-red-700 dark:text-red-300">
                    {subject}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Grade-wise Performance */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Grade-wise Performance
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          {data.gradeWisePerformance.map((grade, index) => (
            <PerformanceRow
              key={grade.grade}
              grade={grade.grade}
              students={grade.totalStudents}
              score={grade.averageScore}
              passRate={grade.passRate}
              topSubject={grade.topSubject}
              isLast={index === data.gradeWisePerformance.length - 1}
            />
          ))}
        </View>
      </View>

      {/* Monthly Trends */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Monthly Trends
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          {data.monthlyTrends.map((trend, index) => (
            <View key={trend.month} className={`${index !== data.monthlyTrends.length - 1 ? 'mb-6 pb-6 border-b border-gray-100 dark:border-gray-700' : ''}`}>
              <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                {trend.month} 2024
              </Text>
              <TrendBar label="Attendance" value={trend.attendance} maxValue={100} color="#3B82F6" />
              <TrendBar label="Performance" value={trend.performance} maxValue={100} color="#10B981" />
              <TrendBar label="Assignments" value={trend.assignments} maxValue={100} color="#F59E0B" />
            </View>
          ))}
        </View>
      </View>

      {/* Teacher Performance Summary */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Teacher Performance
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Teachers
            </Text>
            <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {data.teacherPerformance.totalTeachers}
            </Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Top Performers
            </Text>
            <View className="space-y-2">
              {data.teacherPerformance.topPerformers.map((teacher, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mr-3">
                    <Ionicons name="star" size={16} color="#10B981" />
                  </View>
                  <Text className="text-sm text-gray-900 dark:text-gray-100">{teacher}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Needs Support
            </Text>
            <View className="space-y-2">
              {data.teacherPerformance.needsSupport.map((teacher, index) => (
                <View key={index} className="flex-row items-center">
                  <View className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full items-center justify-center mr-3">
                    <Ionicons name="help-circle" size={16} color="#F59E0B" />
                  </View>
                  <Text className="text-sm text-gray-900 dark:text-gray-100">{teacher}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row" style={{ gap: 12 }}>
        <TouchableOpacity className="flex-1 bg-blue-600 rounded-xl p-4 items-center">
          <Ionicons name="bar-chart-outline" size={24} color="white" />
          <Text className="text-white font-medium mt-2">View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-green-600 rounded-xl p-4 items-center">
          <Ionicons name="download-outline" size={24} color="white" />
          <Text className="text-white font-medium mt-2">Export Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
