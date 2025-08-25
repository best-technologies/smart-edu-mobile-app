import React, { useState } from 'react';
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SchoolDirectorStackParamList } from '../../SchoolDirectorNavigator';
import Section from '../../components/shared/Section';
import SubjectStats from '../../components/subjects/SubjectStats';
import SubjectCard from '../../components/subjects/SubjectCard';
import SubjectPagination from '../../components/subjects/Pagination';
import SearchBar from '../../components/subjects/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import CenteredLoader from '@/components/CenteredLoader';
import { useSubjectsData } from '@/hooks/useDirectorData';
import AddSubjectModal from '../../components/subjects/AddSubjectModal';
import { SuccessModal } from '@/components';
import { useToast } from '@/contexts/ToastContext';

export default function SubjectsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SchoolDirectorStackParamList>>();
  const [addSubjectModalVisible, setAddSubjectModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { showError } = useToast();
  
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

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
        <View className="flex-1 items-center justify-center px-4">
          <EmptyState 
            title="Error loading subjects" 
            subtitle="Unable to load subjects data. Please try again." 
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
        {/* Manual Refresh Button */}
        {/* <View className="flex-row justify-end mb-4">
          <TouchableOpacity 
            onPress={handleRefresh}
            disabled={isLoading}
            className="flex-row items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            activeOpacity={0.7}
          >
            <Ionicons 
              name="refresh" 
              size={16} 
              color={isLoading ? "#9ca3af" : "#3b82f6"} 
            />
            <Text className={`text-sm font-medium ${
              isLoading ? "text-gray-400" : "text-blue-600 dark:text-blue-400"
            }`}>
              {isLoading ? "Refreshing..." : "Refresh"}
            </Text>
          </TouchableOpacity>
        </View> */}

        <Section 
          title="Overview"
          action={
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
          }
        >
          <SubjectStats subjects={subjects} />
        </Section>

        <Section 
          title="All Subjects"
          action={
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
          }
        >
          {/* Search Bar */}
          <SearchBar 
            onSearch={searchSubjects}
            placeholder="Search subjects by name or code..."
            className="mb-4"
          />

          {isLoading && subjects.length === 0 ? (
            <CenteredLoader visible={true} text="Loading subjects..." />
          ) : subjects.length > 0 ? (
            <View className="gap-4">
              {subjects.map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  onUpdate={(updatedSubject) => {
                    // The hook will handle the update through refetch
                    refetch();
                  }}
                />
              ))}
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <SubjectPagination 
                  pagination={pagination} 
                  onPageChange={handlePageChange}
                />
              )}
            </View>
          ) : (
            <EmptyState 
              title="No subjects found" 
              subtitle={filters?.search 
                ? `No subjects match "${filters.search}"` 
                : "No subjects are currently registered."
              } 
            />
          )}
        </Section>
      </ScrollView>

      {/* Add Subject Modal */}
      <AddSubjectModal
        visible={addSubjectModalVisible}
        onClose={() => setAddSubjectModalVisible(false)}
        onSuccess={() => {
          setAddSubjectModalVisible(false);
          refetch();
        }}
        onShowSuccess={(message) => {
          setSuccessMessage(message);
          setSuccessModalVisible(true);
        }}
        onShowError={(message) => {
          showError('Subject Creation Failed', message);
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
