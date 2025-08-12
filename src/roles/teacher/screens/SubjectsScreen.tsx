import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type TeacherStackParamList = {
  TeacherTabs: undefined;
  SubjectDetail: { subject: Subject };
};

type TeacherNavigationProp = NativeStackNavigationProp<TeacherStackParamList>;
import TopBar from './components/shared/TopBar';
import SubjectCard from './components/subjects/SubjectCard';
import SubjectStats from './components/subjects/SubjectStats';
import FloatingActionButton from './components/shared/FloatingActionButton';
import CourseModal from './components/subjects/CourseModal';

const { width } = Dimensions.get('window');

interface Subject {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  totalStudents: number;
  progress: number;
  status: 'active' | 'draft' | 'archived';
  lastUpdated: string;
}

export default function SubjectsScreen() {
  const navigation = useNavigation<TeacherNavigationProp>();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showContentGuide, setShowContentGuide] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for subjects
  const subjects: Subject[] = [
    {
      id: '1',
      name: 'Mathematics JSS2',
      description: 'Comprehensive course covering algebra, geometry, and calculus for JSS2 students',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
      totalTopics: 12,
      totalVideos: 45,
      totalMaterials: 23,
      totalStudents: 156,
      progress: 85,
      status: 'active',
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Mathematics JSS3',
      description: 'Advanced mathematics concepts for JSS3 students',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
      totalTopics: 8,
      totalVideos: 32,
      totalMaterials: 18,
      totalStudents: 89,
      progress: 60,
      status: 'active',
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      name: 'Physics SS1',
      description: 'Core concepts in mechanics, thermodynamics, and electromagnetism for SS1',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      totalTopics: 6,
      totalVideos: 28,
      totalMaterials: 15,
      totalStudents: 67,
      progress: 40,
      status: 'draft',
      lastUpdated: '2024-01-08'
    },
    {
      id: '4',
      name: 'English Language SS3',
      description: 'Grammar, literature, and communication skills for SS3 students',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      totalTopics: 10,
      totalVideos: 38,
      totalMaterials: 25,
      totalStudents: 134,
      progress: 95,
      status: 'active',
      lastUpdated: '2024-01-12'
    }
  ];

  const stats = {
    totalSubjects: subjects.length,
    totalVideos: subjects.reduce((sum, subject) => sum + subject.totalVideos, 0),
    totalStudents: subjects.reduce((sum, subject) => sum + subject.totalStudents, 0),
    totalMaterials: subjects.reduce((sum, subject) => sum + subject.totalMaterials, 0)
  };

  const handleCreateSubject = () => {
    setShowCourseModal(true);
  };

  const handleSubjectCreated = (newSubject: Subject) => {
    // Add the new subject to the list
    subjects.push(newSubject);
    setShowCourseModal(false);
    setSelectedSubject(newSubject);
    setShowContentGuide(true);
  };

  const handleSubjectPress = (subject: Subject) => {
    setSelectedSubject(subject);
    // Navigate to subject detail screen
    navigation.navigate('SubjectDetail', { subject });
  };

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowCourseModal(true);
  };

  const handleManageContent = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowContentGuide(true);
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <TopBar />
      
      <ScrollView className="flex-1" contentContainerClassName="pb-20">
        {/* Header Section */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between mb-2">
            <View>
              <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                My Subjects
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Manage your subjects and teaching materials
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCreateSubject}
              activeOpacity={0.7}
              className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-semibold text-sm">Create Subject</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Section */}
        <View className="px-6 py-4">
          <SubjectStats stats={stats} />
        </View>



        {/* View Mode Toggle */}
        <View className="px-6 py-2 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {subjects.length} Subject{subjects.length !== 1 ? 's' : ''}
            </Text>
            <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <TouchableOpacity
                onPress={() => setViewMode('grid')}
                activeOpacity={0.7}
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : ''
                }`}
              >
                <Ionicons 
                  name="grid-outline" 
                  size={16} 
                  color={viewMode === 'grid' ? '#374151' : '#9ca3af'} 
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('list')}
                activeOpacity={0.7}
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-700 shadow-sm' 
                    : ''
                }`}
              >
                <Ionicons 
                  name="list-outline" 
                  size={16} 
                  color={viewMode === 'list' ? '#374151' : '#9ca3af'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Subjects Grid/List */}
        <View className="px-6 py-4">
          {viewMode === 'grid' ? (
            <View className="flex-row flex-wrap gap-4">
              {subjects.map((subject) => (
                <View key={subject.id} className="w-full sm:w-[calc(50%-8px)]">
                  <SubjectCard 
                    subject={subject}
                    onPress={() => handleSubjectPress(subject)}
                    onEdit={() => handleEditSubject(subject)}
                    onManageContent={() => handleManageContent(subject)}
                    viewMode="grid"
                  />
                </View>
              ))}
            </View>
                      ) : (
              <View className="gap-3">
                {subjects.map((subject) => (
                <SubjectCard 
                  key={subject.id}
                  subject={subject}
                  onPress={() => handleSubjectPress(subject)}
                  onEdit={() => handleEditSubject(subject)}
                  onManageContent={() => handleManageContent(subject)}
                  viewMode="list"
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Course Modal */}
      <CourseModal 
        visible={showCourseModal}
        subject={selectedSubject}
        onClose={() => {
          setShowCourseModal(false);
          setSelectedSubject(null);
        }}
        onSubjectCreated={handleSubjectCreated}
      />

      {/* Content Guide Modal */}
      {showContentGuide && selectedSubject && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
          <View className="bg-white dark:bg-black rounded-2xl p-6 mx-6 max-w-sm">
            <View className="items-center mb-4">
              <View className="h-16 w-16 bg-green-100 dark:bg-green-900/40 rounded-full items-center justify-center mb-3">
                <Ionicons name="checkmark" size={32} color="#10b981" />
              </View>
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 text-center">
                Subject Created!
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                {selectedSubject.name} has been created successfully
              </Text>
            </View>

            <Text className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Next Steps:
            </Text>

            <View className="space-y-3 mb-6">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 bg-purple-100 dark:bg-purple-900/40 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-purple-600 dark:text-purple-400">1</Text>
                </View>
                <Text className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                  Add topics to organize your content
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 bg-blue-100 dark:bg-blue-900/40 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-blue-600 dark:text-blue-400">2</Text>
                </View>
                <Text className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                  Upload videos for each topic
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 bg-green-100 dark:bg-green-900/40 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-green-600 dark:text-green-400">3</Text>
                </View>
                <Text className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                  Add PDF materials and resources
                </Text>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 bg-orange-100 dark:bg-orange-900/40 rounded-full items-center justify-center">
                  <Text className="text-sm font-bold text-orange-600 dark:text-orange-400">4</Text>
                </View>
                <Text className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                  Write instructions for students
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowContentGuide(false)}
                activeOpacity={0.7}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <Text className="text-center font-medium text-gray-700 dark:text-gray-300">
                  Later
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowContentGuide(false);
                  // Navigate to subject detail screen
                  navigation.navigate('SubjectDetail', { subject: selectedSubject });
                }}
                activeOpacity={0.7}
                className="flex-1 py-3 px-4 bg-purple-600 rounded-lg"
              >
                <Text className="text-center font-medium text-white">
                  Start Adding Content
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton 
        icon="add"
        onPress={handleCreateSubject}
      />
    </View>
  );
}
