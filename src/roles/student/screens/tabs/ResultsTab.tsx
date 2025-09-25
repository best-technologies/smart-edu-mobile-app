import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ResultsTabProps {
  navigation: any;
}

interface ClassItem {
  id: string;
  name: string;
  year: string;
  isCurrent: boolean;
  studentPosition?: number;
  totalStudents?: number;
}

interface SubjectResult {
  id: string;
  subject: string;
  code: string;
  caScore: number;
  examScore: number;
  totalScore: number;
  grade: string;
  color: string;
}

export default function ResultsTab({ navigation }: ResultsTabProps) {
  const [selectedClass, setSelectedClass] = useState<string>('current');

  // Mock data for classes and results
  const classes: ClassItem[] = [
    { id: 'current', name: 'Current Class', year: '2024', isCurrent: true, studentPosition: 3, totalStudents: 25 },
    { id: '2023', name: 'Previous Class', year: '2023', isCurrent: false, studentPosition: 5, totalStudents: 28 },
    { id: '2022', name: 'Previous Class', year: '2022', isCurrent: false, studentPosition: 8, totalStudents: 30 },
  ];

  const mockResults: Record<string, SubjectResult[]> = {
    current: [
      {
        id: '1',
        subject: 'Mathematics',
        code: 'MATH101',
        caScore: 85,
        examScore: 78,
        totalScore: 81.5,
        grade: 'A',
        color: '#3b82f6'
      },
      {
        id: '2',
        subject: 'English Language',
        code: 'ENG101',
        caScore: 92,
        examScore: 88,
        totalScore: 90,
        grade: 'A+',
        color: '#10b981'
      },
      {
        id: '3',
        subject: 'Physics',
        code: 'PHY101',
        caScore: 76,
        examScore: 82,
        totalScore: 79,
        grade: 'B+',
        color: '#f59e0b'
      },
      {
        id: '4',
        subject: 'Chemistry',
        code: 'CHEM101',
        caScore: 88,
        examScore: 85,
        totalScore: 86.5,
        grade: 'A',
        color: '#8b5cf6'
      }
    ],
    '2023': [
      {
        id: '1',
        subject: 'Mathematics',
        code: 'MATH101',
        caScore: 78,
        examScore: 82,
        totalScore: 80,
        grade: 'A',
        color: '#3b82f6'
      },
      {
        id: '2',
        subject: 'English Language',
        code: 'ENG101',
        caScore: 85,
        examScore: 90,
        totalScore: 87.5,
        grade: 'A',
        color: '#10b981'
      }
    ],
    '2022': [
      {
        id: '1',
        subject: 'Mathematics',
        code: 'MATH101',
        caScore: 72,
        examScore: 75,
        totalScore: 73.5,
        grade: 'B',
        color: '#3b82f6'
      }
    ]
  };

  // Helper functions for results
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return '#10b981'; // green
      case 'B+':
      case 'B':
        return '#3b82f6'; // blue
      case 'C+':
      case 'C':
        return '#f59e0b'; // yellow
      case 'D+':
      case 'D':
        return '#ef4444'; // red
      case 'F':
        return '#dc2626'; // dark red
      default:
        return '#6b7280'; // gray
    }
  };

  const getGradeBackgroundColor = (grade: string) => {
    const color = getGradeColor(grade);
    return color + '20'; // Add 20% opacity
  };

  const getCurrentResults = () => {
    return mockResults[selectedClass] || [];
  };

  const getPositionSuffix = (position: number) => {
    if (position % 100 >= 11 && position % 100 <= 13) {
      return 'th';
    }
    switch (position % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const getSelectedClassInfo = () => {
    return classes.find(c => c.id === selectedClass);
  };

  return (
    <View className="flex-1">
      {/* Class Selection */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Select Academic Year
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          <View className="flex-row items-center gap-3">
            {classes.map((classItem) => (
              <TouchableOpacity
                key={classItem.id}
                onPress={() => setSelectedClass(classItem.id)}
                className={`px-4 py-3 rounded-lg border-2 ${
                  selectedClass === classItem.id
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                }`}
                activeOpacity={0.7}
              >
                <View className="items-center">
                  <Text className={`text-sm font-semibold ${
                    selectedClass === classItem.id
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {classItem.name}
                  </Text>
                  <Text className={`text-xs ${
                    selectedClass === classItem.id
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {classItem.year}
                  </Text>
                  {classItem.isCurrent && (
                    <View className="mt-1 px-2 py-1 bg-green-500 rounded-full">
                      <Text className="text-xs font-bold text-white">
                        Current
                      </Text>
                    </View>
                  )}
                  {classItem.studentPosition && classItem.totalStudents && (
                    <View className="mt-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      <Text className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {classItem.studentPosition}{getPositionSuffix(classItem.studentPosition)}/{classItem.totalStudents}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Student Position Display */}
      {getSelectedClassInfo()?.studentPosition && getSelectedClassInfo()?.totalStudents && (
        <View className="mb-6">
          <View className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                  Class Position
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {getSelectedClassInfo()?.year} Academic Year
                </Text>
              </View>
              
              <View className="items-center">
                <View className="bg-blue-600 rounded-full w-16 h-16 items-center justify-center mb-2">
                  <Text className="text-2xl font-bold text-white">
                    {getSelectedClassInfo()?.studentPosition}
                  </Text>
                </View>
                <Text className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {getSelectedClassInfo()?.studentPosition}{getPositionSuffix(getSelectedClassInfo()?.studentPosition || 0)} out of {getSelectedClassInfo()?.totalStudents}
                </Text>
              </View>
            </View>
            
            {/* Performance Indicator */}
            <View className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons 
                    name="trophy" 
                    size={16} 
                    color={(() => {
                      const position = getSelectedClassInfo()?.studentPosition;
                      return position && position <= 3 ? '#f59e0b' : '#6b7280';
                    })()} 
                  />
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {(() => {
                      const position = getSelectedClassInfo()?.studentPosition;
                      if (position && position <= 3) return 'Top Performer';
                      if (position && position <= 10) return 'Above Average';
                      return 'Good Performance';
                    })()}
                  </Text>
                </View>
                
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(((getSelectedClassInfo()?.totalStudents || 0) - (getSelectedClassInfo()?.studentPosition || 0) + 1) / (getSelectedClassInfo()?.totalStudents || 1) * 100)}%
                  </Text>
                  <Ionicons name="trending-up" size={12} color="#10b981" />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Results List */}
      {getCurrentResults().length === 0 ? (
        <View className="flex-1 items-center justify-center py-16">
          <Ionicons name="trophy-outline" size={64} color="#9ca3af" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
            No Results Available
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            Results for this academic year are not available yet
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Subject Results - {classes.find(c => c.id === selectedClass)?.year}
          </Text>
          
          {getCurrentResults().map((result) => (
            <View
              key={result.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-3 border border-gray-200 dark:border-gray-700"
            >
              {/* Subject Header */}
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <View 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: result.color }}
                    />
                    <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {result.subject}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {result.code}
                  </Text>
                </View>
                
                {/* Grade Badge */}
                <View 
                  className="px-3 py-2 rounded-lg"
                  style={{ 
                    backgroundColor: getGradeBackgroundColor(result.grade),
                    borderColor: getGradeColor(result.grade),
                    borderWidth: 1
                  }}
                >
                  <Text 
                    className="text-lg font-bold"
                    style={{ color: getGradeColor(result.grade) }}
                  >
                    {result.grade}
                  </Text>
                </View>
              </View>

              {/* Scores Grid */}
              <View className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <View className="flex-row justify-between items-center">
                  <View className="flex-1 items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      CA Score
                    </Text>
                    <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {result.caScore}
                    </Text>
                  </View>
                  
                  <View className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
                  
                  <View className="flex-1 items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Exam Score
                    </Text>
                    <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {result.examScore}
                    </Text>
                  </View>
                  
                  <View className="w-px h-8 bg-gray-300 dark:bg-gray-600" />
                  
                  <View className="flex-1 items-center">
                    <Text className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Total Score
                    </Text>
                    <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {result.totalScore}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
