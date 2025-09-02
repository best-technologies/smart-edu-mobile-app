import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import TopBar from './components/shared/TopBar';
import TopicCard from './components/subjects/TopicCard';
import VideoUploadModal from './components/subjects/VideoUploadModal';
import MaterialUploadModal from './components/subjects/MaterialUploadModal';
import InstructionModal from './components/subjects/InstructionModal';
import { capitalizeWords } from '@/utils/textFormatter';

const { width } = Dimensions.get('window');

interface Topic {
  id: string;
  title: string;
  description: string;
  videos: Video[];
  materials: Material[];
  instructions: string;
  order: number;
}

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
  uploadedAt: string;
  class: string;
  subject: string;
  topic: string;
}

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'other';
  size: string;
  url: string;
  uploadedAt: string;
  class: string;
  subject: string;
  topic: string;
}

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
  classes: string[];
}

export default function SubjectDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { subject }: { subject: Subject } = route.params as any;
  
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);

  // Mock data for topics
  const [topics, setTopics] = useState<Topic[]>([
    {
      id: '1',
      title: 'Introduction to Calculus',
      description: 'Basic concepts and fundamentals of calculus',
      order: 1,
      videos: [
        {
          id: 'v1',
          title: 'What is Calculus?',
          duration: '15:30',
          thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
          url: 'https://example.com/video1.mp4',
          uploadedAt: '2024-01-10',
          class: 'SS1',
          subject: subject?.name || 'Mathematics',
          topic: 'Introduction to Calculus'
        },
        {
          id: 'v2',
          title: 'Limits and Continuity',
          duration: '22:15',
          thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
          url: 'https://example.com/video2.mp4',
          uploadedAt: '2024-01-12',
          class: 'SS1',
          subject: subject?.name || 'Mathematics',
          topic: 'Introduction to Calculus'
        }
      ],
      materials: [
        {
          id: 'm1',
          title: 'Calculus Fundamentals PDF',
          type: 'pdf',
          size: '2.3 MB',
          url: 'https://example.com/calc-fundamentals.pdf',
          uploadedAt: '2024-01-10',
          class: 'SS1',
          subject: subject?.name || 'Mathematics',
          topic: 'Introduction to Calculus'
        }
      ],
      instructions: 'Watch the introduction videos and complete the practice problems in the PDF.'
    },
    {
      id: '2',
      title: 'Derivatives',
      description: 'Understanding derivatives and their applications',
      order: 2,
      videos: [
        {
          id: 'v3',
          title: 'Derivative Rules',
          duration: '18:45',
          thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
          url: 'https://example.com/video3.mp4',
          uploadedAt: '2024-01-15',
          class: 'SS1',
          subject: subject?.name || 'Mathematics',
          topic: 'Derivatives'
        }
      ],
      materials: [
        {
          id: 'm2',
          title: 'Derivative Practice Problems',
          type: 'pdf',
          size: '1.8 MB',
          url: 'https://example.com/derivative-practice.pdf',
          uploadedAt: '2024-01-15',
          class: 'SS1',
          subject: subject?.name || 'Mathematics',
          topic: 'Derivatives'
        }
      ],
      instructions: 'Learn the derivative rules and practice with the provided problems.'
    }
  ]);

  const handleAddTopic = () => {
    setShowAddTopicModal(true);
  };

  const handleAddVideo = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowVideoModal(true);
  };

  const handleAddMaterial = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowMaterialModal(true);
  };

  const handleEditInstructions = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowInstructionModal(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      
      <ScrollView className="flex-1" contentContainerClassName="pb-20">
        {/* Course Header */}
        <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={handleBack} className="p-2">
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Image 
              source={{ uri: subject.thumbnail }} 
              className="w-16 h-16 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {capitalizeWords(subject.name)}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {capitalizeWords(subject.description)}
              </Text>
              <View className="flex-row items-center gap-4 mt-2">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="play-circle-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalVideos} videos</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="document-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalMaterials} materials</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="people-outline" size={14} color="#6b7280" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400">{subject.totalStudents} students</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Course Stats */}
        <View className="px-6 py-4">
          <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Course Progress
            </Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</Text>
              <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {subject.progress}%
              </Text>
            </View>
            <View className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <View 
                className="h-full bg-purple-500"
                style={{ width: `${subject.progress}%` }}
              />
            </View>
          </View>
        </View>

        {/* Topics Section */}
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Course Topics
            </Text>
            <TouchableOpacity
              onPress={handleAddTopic}
              activeOpacity={0.7}
              className="bg-purple-600 px-4 py-2 rounded-lg flex-row items-center gap-2"
            >
              <Ionicons name="add" size={16} color="white" />
              <Text className="text-white font-semibold text-sm">Add Topic</Text>
            </TouchableOpacity>
          </View>

          {topics.length > 0 ? (
            <View className="gap-4">
              {topics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onAddVideo={() => handleAddVideo(topic)}
                  onAddMaterial={() => handleAddMaterial(topic)}
                  onEditInstructions={() => handleEditInstructions(topic)}
                />
              ))}
            </View>
          ) : (
            <View className="bg-white dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-8 items-center">
              <Ionicons name="folder-outline" size={64} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                No Topics Yet
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2 mb-4">
                Start by adding your first topic to organize your content
              </Text>
              <TouchableOpacity
                onPress={handleAddTopic}
                activeOpacity={0.7}
                className="bg-purple-600 px-6 py-3 rounded-lg flex-row items-center gap-2"
              >
                <Ionicons name="add" size={16} color="white" />
                <Text className="text-white font-semibold">Add Your First Topic</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modals */}
      <VideoUploadModal
        visible={showVideoModal}
        topic={selectedTopic}
        onClose={() => {
          setShowVideoModal(false);
          setSelectedTopic(null);
        }}
      />

      <MaterialUploadModal
        visible={showMaterialModal}
        topic={selectedTopic}
        onClose={() => {
          setShowMaterialModal(false);
          setSelectedTopic(null);
        }}
      />

      <InstructionModal
        visible={showInstructionModal}
        topic={selectedTopic}
        onClose={() => {
          setShowInstructionModal(false);
          setSelectedTopic(null);
        }}
      />

      {/* Add Topic Modal - Simple Alert for now */}
      {showAddTopicModal && (
        <View className="absolute inset-0 bg-black/50 items-center justify-center z-50">
          <View className="bg-white dark:bg-black rounded-2xl p-6 mx-6 max-w-sm">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Add New Topic
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Topic creation functionality will be implemented here. For now, you can add videos and materials to existing topics.
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddTopicModal(false)}
              activeOpacity={0.7}
              className="bg-purple-600 py-3 px-4 rounded-lg"
            >
              <Text className="text-center font-medium text-white">
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
