import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studentsDashboardData } from '@/mock';
import TopBar from './components/shared/TopBar';
import StudentCard from './components/students/StudentCard';
import StudentStats from './components/students/StudentStats';
import SearchBar from './components/students/SearchBar';
import FilterChips from './components/students/FilterChips';
import QuickActions from './components/students/QuickActions';
import FloatingActionButton from './components/shared/FloatingActionButton';

export default function StudentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  const data = studentsDashboardData.data;

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <Text className="text-lg text-gray-500 dark:text-gray-400">No data available</Text>
      </View>
    );
  }

  const filteredStudents = data.students.filter(student => {
    const matchesSearch = student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.current_class.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && student.status === 'active') ||
                         (selectedFilter === 'inactive' && student.status === 'inactive') ||
                         (selectedFilter === 'suspended' && student.status === 'suspended');
    
    return matchesSearch && matchesFilter;
  });

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for students:`, selectedStudents);
    setSelectedStudents([]);
  };

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <TopBar />
      
      <ScrollView className="flex-1" contentContainerClassName="pb-20">
        {/* Header Section */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Students
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor your students
          </Text>
        </View>

        {/* Stats Section */}
        <View className="px-6 py-4">
          <StudentStats stats={data.basic_details} />
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-2">
          <QuickActions onAction={handleQuickAction} />
        </View>

        {/* Search and Filters */}
        <View className="px-6 py-4 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search students by name, ID, or class..."
          />
          <View className="mt-3">
            <FilterChips 
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </View>
        </View>

        {/* Students List */}
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {filteredStudents.length} Student{filteredStudents.length !== 1 ? 's' : ''}
            </Text>
            {selectedStudents.length > 0 && (
              <View className="flex-row items-center gap-2">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedStudents.length} selected
                </Text>
                <TouchableOpacity 
                  onPress={() => setSelectedStudents([])}
                  className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
                >
                  <Text className="text-sm text-gray-600 dark:text-gray-300">Clear</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {filteredStudents.length > 0 ? (
            <View className="gap-3">
              {filteredStudents.map((student) => (
                <StudentCard 
                  key={student.id} 
                  student={student}
                  isSelected={selectedStudents.includes(student.id)}
                  onSelect={() => handleStudentSelect(student.id)}
                />
              ))}
            </View>
          ) : (
            <View className="items-center justify-center py-12">
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-500 dark:text-gray-400 mt-4">
                No students found
              </Text>
              <Text className="text-sm text-gray-400 dark:text-gray-500 text-center mt-2">
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4">
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => handleBulkAction('message')}
              className="flex-1 bg-blue-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Message Selected</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleBulkAction('export')}
              className="flex-1 bg-gray-500 py-3 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Export</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon="add"
        onPress={() => console.log('Add new student')}
      />
    </View>
  );
}
