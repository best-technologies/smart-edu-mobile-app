import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StudentResultView, StudentResultData } from '@/components';

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
  submissions: [
    {
      id: '1',
      type: 'Assignment',
      student: {
        name: 'John Doe',
        avatar: null,
        id: 'S001'
      },
      attached: {
        type: 'document',
        name: 'Math_Assignment_1.pdf',
        url: '#'
      },
      status: 'pending',
      score: null,
      submittedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      type: 'Quiz',
      student: {
        name: 'Jane Smith',
        avatar: null,
        id: 'S002'
      },
      attached: {
        type: 'video',
        name: 'Problem_Solving_Video.mp4',
        url: '#'
      },
      status: 'graded',
      score: 85,
      submittedAt: '2024-01-14T14:20:00Z'
    },
    {
      id: '3',
      type: 'Class Work',
      student: {
        name: 'Mike Johnson',
        avatar: null,
        id: 'S003'
      },
      attached: {
        type: 'image',
        name: 'Handwritten_Notes.jpg',
        url: '#'
      },
      status: 'pending',
      score: null,
      submittedAt: '2024-01-16T09:15:00Z'
    },
    {
      id: '4',
      type: 'Assignment',
      student: {
        name: 'Sarah Wilson',
        avatar: null,
        id: 'S004'
      },
      attached: {
        type: 'link',
        name: 'Online_Research_Link',
        url: 'https://example.com'
      },
      status: 'graded',
      score: 92,
      submittedAt: '2024-01-13T16:45:00Z'
    },
    {
      id: '5',
      type: 'Exam',
      student: {
        name: 'David Brown',
        avatar: null,
        id: 'S005'
      },
      attached: {
        type: 'document',
        name: 'Final_Exam_Answers.pdf',
        url: '#'
      },
      status: 'pending',
      score: null,
      submittedAt: '2024-01-17T11:00:00Z'
    },
    {
      id: '6',
      type: 'Assignment',
      student: {
        name: 'Emily Davis',
        avatar: null,
        id: 'S006'
      },
      attached: {
        type: 'image',
        name: 'Math_Problem_Solution.jpg',
        url: '#'
      },
      status: 'graded',
      score: 78,
      submittedAt: '2024-01-16T15:30:00Z'
    },
    {
      id: '7',
      type: 'Quiz',
      student: {
        name: 'Michael Wilson',
        avatar: null,
        id: 'S007'
      },
      attached: {
        type: 'video',
        name: 'Science_Experiment_Demo.mp4',
        url: '#'
      },
      status: 'pending',
      score: null,
      submittedAt: '2024-01-18T09:45:00Z'
    },
    {
      id: '8',
      type: 'Class Work',
      student: {
        name: 'Sarah Johnson',
        avatar: null,
        id: 'S008'
      },
      attached: {
        type: 'document',
        name: 'History_Essay.docx',
        url: '#'
      },
      status: 'graded',
      score: 95,
      submittedAt: '2024-01-15T14:20:00Z'
    },
    {
      id: '9',
      type: 'Assignment',
      student: {
        name: 'James Miller',
        avatar: null,
        id: 'S009'
      },
      attached: {
        type: 'link',
        name: 'Research_Article_Link',
        url: 'https://example.com/research'
      },
      status: 'pending',
      score: null,
      submittedAt: '2024-01-19T12:15:00Z'
    },
    {
      id: '10',
      type: 'Exam',
      student: {
        name: 'Lisa Anderson',
        avatar: null,
        id: 'S010'
      },
      attached: {
        type: 'document',
        name: 'Physics_Exam_Answers.pdf',
        url: '#'
      },
      status: 'graded',
      score: 88,
      submittedAt: '2024-01-14T16:00:00Z'
    },
    {
      id: '11',
      type: 'Quiz',
      student: {
        name: 'Robert Taylor',
        avatar: null,
        id: 'S011'
      },
      attached: {
        type: 'image',
        name: 'Chemistry_Lab_Results.png',
        url: '#'
      },
      status: 'pending',
      score: null,
      submittedAt: '2024-01-20T10:30:00Z'
    },
    {
      id: '12',
      type: 'Class Work',
      student: {
        name: 'Jennifer White',
        avatar: null,
        id: 'S012'
      },
      attached: {
        type: 'video',
        name: 'Literature_Presentation.mp4',
        url: '#'
      },
      status: 'graded',
      score: 92,
      submittedAt: '2024-01-13T13:45:00Z'
    },
    {
      id: '13',
      type: 'Assignment',
      student: {
        name: 'Christopher Lee',
        avatar: null,
        id: 'S013'
      },
      attached: {
        type: 'document',
        name: 'Geography_Project_Report.pdf',
        url: '#'
      },
      status: 'pending',
      score: null,
      submittedAt: '2024-01-21T11:20:00Z'
    },
    {
      id: '14',
      type: 'Exam',
      student: {
        name: 'Amanda Garcia',
        avatar: null,
        id: 'S014'
      },
      attached: {
        type: 'link',
        name: 'Online_Quiz_Submission',
        url: 'https://example.com/quiz'
      },
      status: 'graded',
      score: 76,
      submittedAt: '2024-01-12T15:10:00Z'
    },
    {
      id: '15',
      type: 'Quiz',
      student: {
        name: 'Daniel Martinez',
        avatar: null,
        id: 'S015'
      },
      attached: {
        type: 'image',
        name: 'Biology_Diagram_Labeled.jpg',
        url: '#'
      },
      status: 'pending',
      score: null,
      submittedAt: '2024-01-22T08:45:00Z'
    }
  ]
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
  const [selectedAssignment, setSelectedAssignment] = useState<string>('1');
  const [selectedResult, setSelectedResult] = useState<StudentResultData | null>(null);

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

  // Get available assignment numbers based on grade type
  const getAvailableAssignments = () => {
    const gradeType = selections.gradeType;
    if (gradeType === 'assignment') return ['1', '2', '3', '4', '5'];
    if (gradeType === 'quiz') return ['1', '2', '3'];
    if (gradeType === 'classwork') return ['1', '2', '3', '4'];
    if (gradeType === 'exam') return ['1', '2'];
    return ['1', '2', '3', '4', '5']; // default for 'all'
  };

  // Get filtered submissions based on selections
  const getFilteredSubmissions = () => {
    return mockData.submissions.filter(submission => {
      const gradeTypeMatch = selections.gradeType === 'all' || 
        submission.type.toLowerCase().replace(' ', '') === selections.gradeType;
      const statusMatch = selections.status === 'all' || 
        submission.status === selections.status;
      return gradeTypeMatch && statusMatch;
    });
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'document': return 'document-text-outline';
      case 'video': return 'videocam-outline';
      case 'image': return 'image-outline';
      case 'link': return 'link-outline';
      default: return 'attach-outline';
    }
  };

  const getAttachmentColor = (type: string) => {
    switch (type) {
      case 'document': return '#ef4444';
      case 'video': return '#8b5cf6';
      case 'image': return '#10b981';
      case 'link': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'graded': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleViewSubmission = (submission: any) => {
    // console.log('View submission clicked:', submission);
    
    // Convert submission to StudentResultData format
    const resultData: StudentResultData = {
      id: submission.id,
      type: submission.type as 'Class Work' | 'Assignment' | 'CA' | 'Exam',
      student: {
        id: submission.student.id,
        name: submission.student.name,
        avatar: submission.student.avatar,
        studentId: submission.student.id,
        class: 'SS 1A', // This should come from the actual data
      },
      subject: {
        id: '1',
        name: 'Mathematics', // This should come from the actual data
        code: 'MATH101',
      },
      attached: submission.attached,
      status: submission.status,
      score: submission.score,
      maxScore: 100, // This should come from the actual data
      submittedAt: submission.submittedAt,
      gradedAt: submission.gradedAt,
      gradedBy: submission.gradedBy,
      feedback: submission.feedback || 'Great work on this submission! Keep up the excellent effort.',
      comments: submission.comments || 'Well done!',
      rubric: submission.rubric || [
        {
          criteria: 'Understanding',
          points: submission.score ? Math.round(submission.score * 0.4) : 0,
          maxPoints: 40,
          feedback: 'Good understanding of the concepts'
        },
        {
          criteria: 'Presentation',
          points: submission.score ? Math.round(submission.score * 0.3) : 0,
          maxPoints: 30,
          feedback: 'Clear and well-organized presentation'
        },
        {
          criteria: 'Accuracy',
          points: submission.score ? Math.round(submission.score * 0.3) : 0,
          maxPoints: 30,
          feedback: 'Accurate calculations and reasoning'
        }
      ],
    };
    
    // console.log('Setting selected result:', resultData);
    setSelectedResult(resultData);
  };

  const handleGradeSubmission = (submission: any) => {
    console.log('Grade submission:', submission);
    // This would open a grading modal/form
  };

  const handleEditResult = (result: StudentResultData) => {
    console.log('Edit result:', result);
    // This would open an edit modal/form
  };

  const handleGradeResult = (result: StudentResultData) => {
    console.log('Grade result:', result);
    // This would open a grading modal/form
  };

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

            {/* Submissions Table */}
            {isStatusSelectable && (
              <View className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-lg font-semibold text-gray-900">Submissions</Text>
                      <Text className="text-sm text-gray-500 mt-1">
                        {getFilteredSubmissions().length} submission{getFilteredSubmissions().length !== 1 ? 's' : ''} found
                      </Text>
                    </View>
                    
                    {/* Assignment Selector Dropdown */}
                    {isStatusSelectable && (
                      <View className="flex-row items-center">
                        <Text className="text-sm text-gray-600 mr-2">Assignment:</Text>
                        <View className="bg-white border border-gray-300 rounded-lg px-3 py-1">
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row">
                              {getAvailableAssignments().map((assignmentNum) => (
                                <TouchableOpacity
                                  key={assignmentNum}
                                  onPress={() => setSelectedAssignment(assignmentNum)}
                                  className={`px-3 py-1 rounded-md mr-1 ${
                                    selectedAssignment === assignmentNum
                                      ? 'bg-blue-500'
                                      : 'bg-gray-100'
                                  }`}
                                >
                                  <Text className={`text-sm font-medium ${
                                    selectedAssignment === assignmentNum
                                      ? 'text-white'
                                      : 'text-gray-700'
                                  }`}>
                                    {assignmentNum}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </View>
                          </ScrollView>
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                {/* Horizontal Scrollable Table */}
                <ScrollView horizontal showsHorizontalScrollIndicator={true} className="flex-1">
                  <View style={{ minWidth: 600 }}>
                    {/* Table Header */}
                    <View className="flex-row bg-gray-100 px-4 py-3 border-b border-gray-200 items-center">
                      <View className="w-20">
                        <Text className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Type</Text>
                      </View>
                      <View className="w-32 ml-4 items-center">
                        <Ionicons name="person-outline" size={16} color="#6b7280" />
                      </View>
                      <View className="w-40 ml-4 items-center">
                        <Ionicons name="attach-outline" size={16} color="#6b7280" />
                      </View>
                      <View className="w-20 ml-4 items-center">
                        <Ionicons name="checkmark-circle-outline" size={16} color="#6b7280" />
                      </View>
                      <View className="w-16 ml-4 items-center">
                        <Ionicons name="trophy-outline" size={16} color="#6b7280" />
                      </View>
                      <View className="w-20 ml-4 items-center">
                        <Ionicons name="settings-outline" size={16} color="#6b7280" />
                      </View>
                    </View>

                    {/* Table Rows - Fixed Height Container */}
                    <View style={{ maxHeight: 400 }}>
                      <ScrollView 
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        bounces={true}
                      >
                        {getFilteredSubmissions().map((submission, index) => (
                          <View key={submission.id} className={`flex-row px-4 py-3 border-b border-gray-100 items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                            {/* Type Column */}
                            <View className="w-20 items-center">
                              <Text className="text-xs font-medium text-gray-900">{submission.type}</Text>
                            </View>

                            {/* Student Column */}
                            <View className="w-32 ml-4 flex-row items-center">
                              <View className="w-6 h-6 bg-gray-300 rounded-full items-center justify-center mr-2">
                                <Ionicons name="person-outline" size={12} color="#6b7280" />
                              </View>
                              <Text className="text-sm text-gray-900 flex-1" numberOfLines={1}>{submission.student.name}</Text>
                            </View>

                            {/* Attached Column */}
                            <View className="w-40 ml-4 flex-row items-center">
                              <Ionicons 
                                name={getAttachmentIcon(submission.attached.type) as any} 
                                size={16} 
                                color={getAttachmentColor(submission.attached.type)} 
                              />
                              <Text className="text-sm text-gray-900 ml-2 flex-1" numberOfLines={1}>{submission.attached.name}</Text>
                            </View>

                            {/* Status Column */}
                            <View className="w-20 ml-4 items-center">
                              <Text className={`text-xs font-medium capitalize ${
                                submission.status === 'pending' ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                {submission.status}
                              </Text>
                            </View>

                            {/* Score Column */}
                            <View className="w-16 ml-4 items-center">
                              {submission.score !== null ? (
                                <Text className="text-sm font-semibold text-gray-900">{submission.score}%</Text>
                              ) : (
                                <Text className="text-sm text-gray-400">-</Text>
                              )}
                            </View>

                            {/* Action Column */}
                            <View className="w-20 ml-4 flex-row items-center justify-center">
                              <TouchableOpacity
                                onPress={() => handleViewSubmission(submission)}
                                className="p-1 mr-1"
                              >
                                <Ionicons name="eye-outline" size={16} color="#6b7280" />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleGradeSubmission(submission)}
                                className="p-1"
                              >
                                <Ionicons name="create-outline" size={16} color="#3b82f6" />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                    </View>

                    {getFilteredSubmissions().length === 0 && (
                      <View className="items-center py-8">
                        <Ionicons name="document-outline" size={48} color="#9CA3AF" />
                        <Text className="text-gray-500 mt-2">No submissions found</Text>
                        <Text className="text-sm text-gray-400 mt-1">Try adjusting your filters</Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
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

      {/* Student Result View Modal */}
      {selectedResult && (
        <StudentResultView
          result={selectedResult}
          role="teacher"
          onClose={() => {
            // console.log('Closing result modal');
            setSelectedResult(null);
          }}
          onEdit={handleEditResult}
          onGrade={handleGradeResult}
        />
      )}
    </SafeAreaView>
  );
}
