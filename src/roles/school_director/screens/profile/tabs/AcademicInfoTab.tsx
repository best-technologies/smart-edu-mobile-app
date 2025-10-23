import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface AcademicInfoTabProps {
  data: {
    qualifications: string[];
    specializations: string[];
    experience: string;
    certifications: string[];
    currentAcademicYear: string;
    academicCalendar: { startDate: string; endDate: string; termStart: string; termEnd: string; holidays: any[] };
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    totalSubjects: number;
    schoolType: string;
    curriculum: any[];
    accreditation: any[];
    gradeStructure: any[];
  };
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: number | string;
  color: string;
  subtitle?: string;
}

const StatCard = ({ icon, title, value, color, subtitle }: StatCardProps) => (
  <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
    <View className="flex-row items-center justify-between mb-3">
      <View 
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
    </View>
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

interface GradeRowProps {
  grade: string;
  classes: number;
  students: number;
  isLast?: boolean;
}

const GradeRow = ({ grade, classes, students, isLast }: GradeRowProps) => (
  <View className={`flex-row items-center justify-between py-3 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
    <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">
      {grade}
    </Text>
    <Text className="text-sm text-gray-600 dark:text-gray-400 w-16 text-center">
      {classes}
    </Text>
    <Text className="text-sm text-gray-600 dark:text-gray-400 w-16 text-center">
      {students}
    </Text>
  </View>
);

export default function AcademicInfoTab({ data }: AcademicInfoTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Academic Year Header */}
      <LinearGradient
        colors={['#059669', '#2563EB']} // green-600 to blue-600
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-2xl p-6 mb-6"
      >
        <View className="items-center">
          <Text className="text-white text-lg font-semibold mb-2">
            Academic Year {data.currentAcademicYear}
          </Text>
          <Text className="text-green-100 text-sm">
            {formatDate(data.academicCalendar.termStart)} - {formatDate(data.academicCalendar.termEnd)}
          </Text>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          School Overview
        </Text>
        <View className="grid grid-cols-2 gap-4">
          <StatCard
            icon="people-outline"
            title="Total Students"
            value={data.totalStudents}
            color="#3B82F6"
            subtitle="Enrolled this year"
          />
          <StatCard
            icon="person-outline"
            title="Total Teachers"
            value={data.totalTeachers}
            color="#10B981"
            subtitle="Active faculty"
          />
          <StatCard
            icon="library-outline"
            title="Total Classes"
            value={data.totalClasses}
            color="#F59E0B"
            subtitle="Active sections"
          />
          <StatCard
            icon="book-outline"
            title="Subjects Offered"
            value={data.totalSubjects}
            color="#8B5CF6"
            subtitle="Across all grades"
          />
        </View>
      </View>

      {/* School Information */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          School Information
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 space-y-4">
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500 dark:text-gray-400">School Type:</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {data.schoolType}
            </Text>
          </View>
          
          <View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">Curriculum:</Text>
            <View className="flex-row flex-wrap gap-2">
              {data.curriculum.map((curr, index) => (
                <View key={index} className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    {curr}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          <View>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">Accreditation:</Text>
            <View className="flex-row flex-wrap gap-2">
              {data.accreditation.map((acc, index) => (
                <View key={index} className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium text-green-700 dark:text-green-300">
                    {acc}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Grade Structure */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Grade Structure
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-xl">
            <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex-1">
              Grade
            </Text>
            <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-16 text-center">
              Classes
            </Text>
            <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 w-16 text-center">
              Students
            </Text>
          </View>
          
          {/* Grade Rows */}
          <View className="p-4">
            {data.gradeStructure.map((grade, index) => (
              <GradeRow
                key={grade.grade}
                grade={grade.grade}
                classes={grade.classes}
                students={grade.students}
                isLast={index === data.gradeStructure.length - 1}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Academic Calendar */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Important Dates
        </Text>
        <View className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          {data.academicCalendar.holidays.map((holiday, index) => (
            <View 
              key={index}
              className={`flex-row items-center justify-between py-3 ${
                index !== data.academicCalendar.holidays.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
              }`}
            >
              <View className="flex-row items-center flex-1">
                <View 
                  className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                    holiday.type === 'Holiday' 
                      ? 'bg-red-100 dark:bg-red-900/30' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}
                >
                  <Ionicons 
                    name={holiday.type === 'Holiday' ? 'calendar' : 'time'} 
                    size={16} 
                    color={holiday.type === 'Holiday' ? '#EF4444' : '#3B82F6'} 
                  />
                </View>
                <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {holiday.name}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(holiday.date)}
                </Text>
                <View 
                  className={`px-2 py-1 rounded-full mt-1 ${
                    holiday.type === 'Holiday' 
                      ? 'bg-red-100 dark:bg-red-900/30' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}
                >
                  <Text 
                    className={`text-xs font-medium ${
                      holiday.type === 'Holiday' 
                        ? 'text-red-700 dark:text-red-300' 
                        : 'text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {holiday.type}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row" style={{ gap: 12 }}>
        <TouchableOpacity className="flex-1 bg-green-600 rounded-xl p-4 items-center">
          <Ionicons name="calendar-outline" size={24} color="white" />
          <Text className="text-white font-medium mt-2">Manage Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-blue-600 rounded-xl p-4 items-center">
          <Ionicons name="school-outline" size={24} color="white" />
          <Text className="text-white font-medium mt-2">View Classes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
