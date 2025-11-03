import { ScrollView, View, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { TopBar } from '../components/shared';
import { StudentSelector, AssignmentTypeSelector, StatusFilter, AssignmentCard } from '../components/reports';
import { mockChildren } from '../mock/parentMockData';
import { 
  mockAssignments, 
  AssignmentType, 
  AssignmentStatus,
  getAssignmentsByChildAndType 
} from '../mock/assignmentMockData';

export default function ParentReportsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState(mockChildren[0]?.id || '1');
  const [selectedType, setSelectedType] = useState<AssignmentType>('assignment');
  const [selectedStatus, setSelectedStatus] = useState<'all' | AssignmentStatus>('all');

  const handleRefresh = async () => {
    setRefreshing(true);
    // Add refresh logic here
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAssignmentPress = (assignment: any) => {
    // Navigate to assignment detail screen
    console.log('Assignment pressed:', assignment);
  };

  // Filter assignments based on selections
  const filteredAssignments = useMemo(() => {
    let assignments = getAssignmentsByChildAndType(selectedChildId, selectedType);
    
    if (selectedStatus !== 'all') {
      assignments = assignments.filter(a => a.status === selectedStatus);
    }
    
    return assignments;
  }, [selectedChildId, selectedType, selectedStatus]);

  // Calculate counts for status filter
  const statusCounts = useMemo(() => {
    const allAssignments = getAssignmentsByChildAndType(selectedChildId, selectedType);
    
    return {
      all: allAssignments.length,
      graded: allAssignments.filter(a => a.status === 'graded').length,
      pending_submission: allAssignments.filter(a => a.status === 'pending_submission').length,
      pending_grading: allAssignments.filter(a => a.status === 'pending_grading').length,
    };
  }, [selectedChildId, selectedType]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      <TopBar />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="p-6">
          {/* Student Selector */}
          <StudentSelector
            students={mockChildren}
            selectedStudentId={selectedChildId}
            onSelectStudent={setSelectedChildId}
          />

          {/* Assignment Type Selector */}
          <AssignmentTypeSelector
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />

          {/* Status Filter */}
          <StatusFilter
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            counts={statusCounts}
          />

          {/* Assignments List */}
          {filteredAssignments.length > 0 ? (
            <>
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {filteredAssignments.length} {selectedType === 'assignment' ? 'Assignment' : selectedType === 'classwork' ? 'Classwork' : selectedType === 'ca_test' ? 'CA Test' : 'Exam'}{filteredAssignments.length !== 1 ? 's' : ''}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedStatus === 'all' ? 'All statuses' : selectedStatus === 'graded' ? 'Graded' : selectedStatus === 'pending_submission' ? 'Pending submission' : 'Pending grading'}
                </Text>
              </View>

              {filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onPress={handleAssignmentPress}
                />
              ))}
            </>
          ) : (
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-12 items-center justify-center border border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                No {selectedType}s found
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                {selectedStatus === 'all' 
                  ? 'No assignments available at the moment'
                  : `No ${selectedStatus === 'graded' ? 'graded' : selectedStatus === 'pending_submission' ? 'pending submission' : 'pending grading'} assignments`
                }
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing for Tab Bar */}
        <View className="h-32" />
      </ScrollView>
    </SafeAreaView>
  );
}

