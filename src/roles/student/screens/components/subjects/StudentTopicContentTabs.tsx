import React from 'react';
import { View } from 'react-native';
import { TopicContentTabs } from '@/components';
import { StudentTopic, StudentTopicVideo, StudentTopicMaterial } from './studentTopicTypes';

interface StudentTopicContentTabsProps {
  topic: StudentTopic;
  topicTitle: string;
  topicDescription: string;
  topicInstructions?: string;
  subjectName?: string;
  subjectCode?: string;
  subjectColor: string;
  onVideoPress: (video: StudentTopicVideo) => void;
  onMaterialPress: (material: StudentTopicMaterial) => void;
  onRefresh?: () => void;
}

export function StudentTopicContentTabs({ 
  topic,
  topicTitle,
  topicDescription,
  topicInstructions,
  subjectName,
  subjectCode,
  subjectColor,
  onVideoPress,
  onMaterialPress,
  onRefresh
}: StudentTopicContentTabsProps) {
  return (
    <View className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
      <TopicContentTabs
        topic={topic}
        topicTitle={topicTitle}
        topicDescription={topicDescription}
        topicInstructions={topicInstructions}
        subjectName={subjectName}
        subjectCode={subjectCode}
        userRole="student"
        onVideoPress={undefined}
        onMaterialPress={(material) => onMaterialPress(material as any)}
        onRefresh={onRefresh}
      />
    </View>
  );
}
