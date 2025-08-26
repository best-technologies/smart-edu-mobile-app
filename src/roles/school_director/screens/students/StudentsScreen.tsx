import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SchoolDirectorStackParamList } from '../../SchoolDirectorNavigator';
import Section from '../../components/shared/Section';
import StudentStats from '../../components/students/StudentStats';
import StudentCard from '../../components/students/StudentCard';
import StudentPagination from '../../components/students/StudentPagination';
import SearchBar from '../../components/subjects/SearchBar';
import ClassFilter from '../../components/students/ClassFilter';
import EmptyState from '../../components/shared/EmptyState';
import CenteredLoader from '@/components/CenteredLoader';
import { useStudentsData } from '@/hooks/useDirectorData';
import AddStudentModal from '../../components/students/AddStudentModal';
import EditStudentModal from '../../components/students/EditStudentModal';
import { SuccessModal } from '@/components';
import { useToast } from '@/contexts/ToastContext';

export default function StudentsScreen() {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [addStudentModalVisible, setAddStudentModalVisible] = useState(false);
  const [editStudentModalVisible, setEditStudentModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { showError } = useToast();
  const navigation = useNavigation<NativeStackNavigationProp<SchoolDirectorStackParamList>>();

  const {
    students,
    pagination,
    basicDetails,
    availableClasses,
    isLoading,
    error,
    refetch,
    goToPage,
    searchStudents,
    filterByClass,
    filterByStatus,
  } = useStudentsData();

  const handleRefresh = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    goToPage(page);
  };

  const handleSearch = useCallback((query: string) => {
    searchStudents(query);
  }, [searchStudents]);

  const handleClassSelect = useCallback((classId: string | null) => {
    setSelectedClassId(classId);
    filterByClass(classId);
  }, [filterByClass]);

  const handleViewAllStudents = () => {
    navigation.navigate('AllStudentsList');
  };

  const handleAddStudent = () => {
    setAddStudentModalVisible(true);
  };

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setEditStudentModalVisible(true);
  };

  const handleViewProfile = (student: any) => {
    // TODO: Implement view profile functionality
    console.log('View profile for student:', student);
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <EmptyState 
            title="Error loading students" 
            subtitle="Unable to load students data. Please try again." 
          />
          <TouchableOpacity 
            onPress={handleRefresh}
            className="mt-4 px-6 py-3 bg-blue-600 rounded-xl flex-row items-center gap-2"
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={18} color="#ffffff" />
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <ScrollView 
        className="flex-1" 
        contentContainerClassName="px-4 pb-24 pt-2"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={["#3b82f6"]}
            progressBackgroundColor="#ffffff"
          />
        }
      >
        <Section 
          title="Overview"
          action={
            <TouchableOpacity
              onPress={handleAddStudent}
              className="flex-row items-center bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg"
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle" size={16} color="#10b981" />
              <Text className="text-emerald-600 dark:text-emerald-400 text-sm font-medium ml-1">
                Enroll Student
              </Text>
            </TouchableOpacity>
          }
        >
          {basicDetails && <StudentStats stats={basicDetails} />}
        </Section>

        <Section 
          title="All Students"
          action={
            <TouchableOpacity
              onPress={handleViewAllStudents}
              className="flex-row items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg"
              activeOpacity={0.7}
            >
              <Text className="text-blue-600 dark:text-blue-400 text-sm font-medium mr-1">
                View All
              </Text>
              <Ionicons name="arrow-forward" size={14} color="#2563eb" />
            </TouchableOpacity>
          }
        >
          {/* Search Bar */}
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search students by name, ID, or email..."
            className="mb-4"
          />

          {/* Class Filter */}
          {availableClasses.length > 0 && (
            <ClassFilter
              availableClasses={availableClasses}
              selectedClassId={selectedClassId}
              onClassSelect={handleClassSelect}
            />
          )}

          {isLoading && students.length === 0 ? (
            <CenteredLoader visible={true} text="Loading students..." />
          ) : students.length > 0 ? (
            <View className="gap-4">
              {students.map((student) => (
                <StudentCard 
                  key={student.id} 
                  student={student}
                  onEditStudent={handleEditStudent}
                  onViewProfile={handleViewProfile}
                />
              ))}
              
              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <StudentPagination 
                  pagination={pagination} 
                  onPageChange={handlePageChange}
                />
              )}
            </View>
          ) : (
            <EmptyState 
              title="No students found" 
              subtitle={
                selectedClassId 
                  ? `No students found in the selected class.`
                  : "No students are currently registered."
              }
            />
          )}
        </Section>
      </ScrollView>

      {/* Add Student Modal */}
      <AddStudentModal
        visible={addStudentModalVisible}
        onClose={() => setAddStudentModalVisible(false)}
        onSuccess={() => {
          setAddStudentModalVisible(false);
          refetch();
        }}
        onShowSuccess={(message) => {
          setSuccessMessage(message);
          setSuccessModalVisible(true);
        }}
        onShowError={(message) => {
          showError('Student Enrollment Failed', message);
        }}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        visible={editStudentModalVisible}
        student={selectedStudent}
        onClose={() => {
          setEditStudentModalVisible(false);
          setSelectedStudent(null);
        }}
        onSuccess={() => {
          setEditStudentModalVisible(false);
          setSelectedStudent(null);
          refetch();
        }}
        onShowSuccess={(message) => {
          setSuccessMessage(message);
          setSuccessModalVisible(true);
        }}
        onShowError={(message) => {
          showError('Student Update Failed', message);
        }}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        title="Success!"
        message={successMessage}
        onClose={() => {
          setSuccessModalVisible(false);
          setSuccessMessage('');
        }}
        confirmText="OK"
        autoClose={true}
        autoCloseDelay={3000}
      />
    </SafeAreaView>
  );
}
