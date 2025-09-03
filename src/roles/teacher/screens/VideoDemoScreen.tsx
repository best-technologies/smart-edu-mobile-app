import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import VideoPlayer from './components/subjects/VideoPlayer';

export default function VideoDemoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | undefined>();
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [topicTitle, setTopicTitle] = useState<string>('');
  const [topicDescription, setTopicDescription] = useState<string>('');
  const [topicInstructions, setTopicInstructions] = useState<string>('');
  const [subjectName, setSubjectName] = useState<string>('');
  const [subjectCode, setSubjectCode] = useState<string>('');

  // Get video data from route params
  useEffect(() => {
    const params = route.params as any;
    if (params?.videoUri) {
      setSelectedVideoUri(params.videoUri);
      setVideoTitle(params.videoTitle || 'Video Player');
      setVideoDescription(params.videoDescription || '');
      setTopicTitle(params.topicTitle || 'Untitled Topic');
      setTopicDescription(params.topicDescription || 'No description available');
      setTopicInstructions(params.topicInstructions || 'Watch this video carefully and take notes on the key concepts. Pay attention to the examples shown and practice the problems discussed in the video.');
      setSubjectName(params.subjectName || 'Subject');
      setSubjectCode(params.subjectCode || 'SUB');
    }
  }, [route.params]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleVideoSelected = (uri: string) => {
    setSelectedVideoUri(uri);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900" edges={['top']}>
      {/* Header */}
      <View className="bg-white dark:bg-black px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={handleBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {videoTitle || 'Video Player'}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {videoDescription || 'Watch your video content'}
            </Text>
          </View>
        </View>
      </View>

      {/* Video Player - Takes full remaining space */}
      <View className="flex-1">
        <VideoPlayer
          videoUri={selectedVideoUri}
          videoTitle={videoTitle}
          onVideoSelected={handleVideoSelected}
          onClose={handleBack}
          topicTitle={topicTitle}
          topicDescription={topicDescription}
          topicInstructions={topicInstructions}
          subjectName={subjectName}
          subjectCode={subjectCode}
        />
      </View>
    </SafeAreaView>
  );
}
