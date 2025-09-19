import React from 'react';
import { useRoute } from '@react-navigation/native';
import SubjectDetailScreen from '@/components/SubjectDetailScreen';

export default function StudentSubjectDetailsScreen() {
  const route = useRoute();
  const { subject } = route.params as any;

  return (
    <SubjectDetailScreen
      userRole="student"
      subject={subject}
    />
  );
}
