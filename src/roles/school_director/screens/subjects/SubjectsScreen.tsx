import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SchoolDirectorStackParamList } from '../../SchoolDirectorNavigator';
import { useSubjectsData } from '@/hooks/useDirectorData';
import AddSubjectModal from '../../components/subjects/AddSubjectModal';
import { useToast } from '@/contexts/ToastContext';
import { SubjectsListScreen } from '@/components';

export default function SubjectsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SchoolDirectorStackParamList>>();
  const [addSubjectModalVisible, setAddSubjectModalVisible] = useState(false);
  const { showError, showSuccess } = useToast();
  
  // Reset modal state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset modal states when screen is focused
      setAddSubjectModalVisible(false);
    }, [])
  );
  
  const {
    subjects,
    pagination,
    filters,
    availableClasses,
    isLoading,
    error,
    refetch,
    goToPage,
    searchSubjects,
    filterByClass,
  } = useSubjectsData();

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleViewAllSubjects = () => {
    navigation.navigate('AllSubjectsList');
  };

  const handleAddSubject = () => {
    setAddSubjectModalVisible(true);
  };

  const handleSubjectPress = (subject: any) => {
    console.log('Subject pressed:', subject.name);
    navigation.navigate('SubjectDetail', { subject });
  };

  const handleSubjectEdit = (subject: any) => {
    console.log('Edit subject:', subject.name);
    // TODO: Implement edit functionality
  };

  const handleSubjectManage = (subject: any) => {
    console.log('Manage subject:', subject.name);
    // TODO: Implement manage functionality
  };

  const handleSearch = (query: string) => {
    searchSubjects(query);
  };

  const handleClassFilter = (classId: string | null) => {
    filterByClass(classId);
  };

  // Additional actions for the header
  const additionalActions = (
    <View className="flex-row items-center gap-3">
      <TouchableOpacity
        onPress={handleAddSubject}
        className="flex-row items-center bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg"
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle" size={16} color="#10b981" />
        <Text className="text-emerald-600 dark:text-emerald-400 text-sm font-medium ml-1">
          Add Subject
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleViewAllSubjects}
        className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg"
        activeOpacity={0.7}
      >
        <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium mr-1">
          View All
        </Text>
        <Ionicons name="arrow-forward" size={14} color="#2563eb" />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <SubjectsListScreen
        // Data
        subjects={subjects}
        classes={availableClasses}
        isLoading={isLoading}
        isRefreshing={isLoading}
        error={error?.message || null}
        
        // Actions
        onRefresh={handleRefresh}
        onSubjectPress={handleSubjectPress}
        onSubjectEdit={handleSubjectEdit}
        onSubjectManage={handleSubjectManage}
        onSearch={handleSearch}
        onClassFilter={handleClassFilter}
        onPageChange={handlePageChange}
        
        // Configuration
        userRole="director"
        showStats={false}
        showClasses={true}
        showSearch={true}
        showFilters={true}
        showPagination={pagination && pagination.totalPages > 1}
        showRefresh={true}
        showLoadMore={false}
        enableEdit={true}
        enableManage={true}
        
        // UI customization
        title="Subjects"
        subtitle="Manage all subjects in your school"
        emptyStateTitle="No subjects found"
        emptyStateSubtitle={
          filters?.search 
            ? `No subjects match "${filters.search}"` 
            : "No subjects are currently registered."
        }
        searchPlaceholder="Search subjects by name or code..."
        
        // Additional actions
        additionalActions={additionalActions}
      />

      {/* Add Subject Modal */}
      <AddSubjectModal
        visible={addSubjectModalVisible}
        onClose={() => setAddSubjectModalVisible(false)}
        onSuccess={() => {
          setAddSubjectModalVisible(false);
          refetch();
          showSuccess('Subject Created', 'Subject has been created successfully');
        }}
      />
    </>
  );
}
