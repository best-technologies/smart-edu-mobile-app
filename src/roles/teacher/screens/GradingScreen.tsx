import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Mock data for now
const mockData = {
  currentSession: '2024/2025',
  currentTerm: 'Second Term',
  subjects: [
    { id: '1', name: 'Mathematics', code: 'MATH101' },
    { id: '2', name: 'Physics', code: 'PHY101' },
    { id: '3', name: 'Computer Science', code: 'CS101' },
    { id: '4', name: 'History', code: 'HIST101' },
    { id: '5', name: 'Biology', code: 'BIO101' },
  ],
  classes: [
    { id: '1', name: 'JSS 3C', code: 'JSS3C' },
    { id: '2', name: 'SS 1A', code: 'SS1A' },
    { id: '3', name: 'SS 2B', code: 'SS2B' },
    { id: '4', name: 'SS 3A', code: 'SS3A' },
  ],
  gradeTypes: [
    { id: 'all', name: 'All' },
    { id: 'classwork', name: 'Class Work' },
    { id: 'assignment', name: 'Assignment' },
    { id: 'ca', name: 'CA' },
    { id: 'exam', name: 'Exam' },
  ],
  statusTypes: [
    { id: 'all', name: 'All' },
    { id: 'pending', name: 'Pending' },
    { id: 'graded', name: 'Graded' },
  ],
};

type SelectionState = {
  subject: string | null;
  class: string | null;
  gradeType: string | null;
  status: string;
};

export default function GradingScreen() {
  const [activeTab, setActiveTab] = useState<'submissions' | 'termResult'>('submissions');
  const [selections, setSelections] = useState<SelectionState>({
    subject: null,
    class: null,
    gradeType: null,
    status: 'all',
  });

  const handleSelection = (type: keyof SelectionState, value: string) => {
    setSelections(prev => {
      const newSelections = { ...prev, [type]: value };
      
      // Reset dependent selections when parent selection changes
      if (type === 'subject') {
        newSelections.class = null;
        newSelections.gradeType = null;
      } else if (type === 'class') {
        newSelections.gradeType = null;
      }
      
      return newSelections;
    });
  };

  const isClassSelectable = selections.subject !== null;
  const isGradeTypeSelectable = selections.class !== null;
  const isStatusSelectable = selections.gradeType !== null;

  const HorizontalList = ({ 
    data, 
    selectedId, 
    onSelect, 
    disabled = false,
    title 
  }: {
    data: Array<{ id: string; name: string; code?: string }>;
    selectedId: string | null;
    onSelect: (id: string) => void;
    disabled?: boolean;
    title: string;
  }) => (
    <View className="mb-2">
      <Text className="text-xs font-medium text-gray-700 mb-1">{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        {data.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => !disabled && onSelect(item.id)}
            disabled={disabled}
            className={`mr-2 px-3 py-1.5 rounded-lg border ${
              selectedId === item.id
                ? 'bg-blue-500 border-blue-500'
                : disabled
                ? 'bg-gray-100 border-gray-200'
                : 'bg-white border-gray-300'
            }`}
            style={[
              selectedId === item.id && { shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 3 }
            ]}
          >
            <Text
              className={`text-xs font-medium ${
                selectedId === item.id
                  ? 'text-white'
                  : disabled
                  ? 'text-gray-400'
                  : 'text-gray-700'
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-6 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Grading</Text>
        
        {/* Session and Term Display */}
        <View className="flex-row items-center bg-blue-50 p-3 rounded-lg">
          <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
          <View className="ml-3">
            <Text className="text-sm text-gray-600">Current Session</Text>
            <Text className="text-lg font-semibold text-gray-900">{mockData.currentSession}</Text>
          </View>
          <View className="ml-6">
            <Text className="text-sm text-gray-600">Current Term</Text>
            <Text className="text-lg font-semibold text-gray-900">{mockData.currentTerm}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="bg-white border-b border-gray-200">
        <View className="flex-row px-4">
          <TouchableOpacity
            onPress={() => setActiveTab('submissions')}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === 'submissions'
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'submissions'
                  ? 'text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              Submissions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('termResult')}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === 'termResult'
                ? 'border-blue-500'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'termResult'
                  ? 'text-blue-500'
                  : 'text-gray-500'
              }`}
            >
              Term Result
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-4 py-3">
        {activeTab === 'submissions' ? (
          <View>
            {/* Subjects Row */}
            <HorizontalList
              data={mockData.subjects}
              selectedId={selections.subject}
              onSelect={(id) => handleSelection('subject', id)}
              title="Select Subject"
            />

            {/* Classes Row */}
            <HorizontalList
              data={mockData.classes}
              selectedId={selections.class}
              onSelect={(id) => handleSelection('class', id)}
              disabled={!isClassSelectable}
              title="Select Class"
            />

            {/* Grade Types Row */}
            <HorizontalList
              data={mockData.gradeTypes}
              selectedId={selections.gradeType}
              onSelect={(id) => handleSelection('gradeType', id)}
              disabled={!isGradeTypeSelectable}
              title="Select Grade Type"
            />

            {/* Status Row */}
            <HorizontalList
              data={mockData.statusTypes}
              selectedId={selections.status}
              onSelect={(id) => handleSelection('status', id)}
              disabled={!isStatusSelectable}
              title="Select Status"
            />

            {/* Table Placeholder */}
            {isStatusSelectable && (
              <View className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                <Text className="text-lg font-semibold text-gray-900 mb-4">Submissions Table</Text>
                <View className="items-center py-8">
                  <Ionicons name="tablet-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-2">Table will be implemented here</Text>
                  <Text className="text-sm text-gray-400 mt-1">Selected: {mockData.subjects.find(s => s.id === selections.subject)?.name} • {mockData.classes.find(c => c.id === selections.class)?.name} • {mockData.gradeTypes.find(g => g.id === selections.gradeType)?.name} • {mockData.statusTypes.find(s => s.id === selections.status)?.name}</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View className="items-center py-8">
            <Ionicons name="bar-chart-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">Term Result functionality</Text>
            <Text className="text-sm text-gray-400 mt-1">Coming soon...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
