import React from 'react';
import { SubjectDetailScreen } from '@/components';
import { useRoute } from '@react-navigation/native';

export default function GlobalSubjectDetailScreen() {
  const route = useRoute();
  const { subject } = route.params as any;

  return (
    <SubjectDetailScreen
      userRole="teacher"
      subject={subject}
    />
  );
}
