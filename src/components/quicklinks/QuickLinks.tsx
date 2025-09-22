import React from 'react';
import { useNavigation } from '@react-navigation/native';
import QuickActions, { QuickAction } from './QuickActions';

export type UserRole = 'director' | 'teacher' | 'student';

interface QuickLinksProps {
  role: UserRole;
  className?: string;
}

export default function QuickLinks({ role, className }: QuickLinksProps) {
  const navigation = useNavigation<any>();

  const getActionsForRole = (role: UserRole): QuickAction[] => {
    const commonActions: QuickAction[] = [
      {
        id: 'ai-assistance',
        title: 'AI Assistance',
        icon: 'sparkles',
        color: '#8B5CF6',
        onPress: () => navigation.navigate('AIChatMain'),
        isAnimated: true,
      },
    ];

    switch (role) {
      case 'director':
        return [
          ...commonActions,
          {
            id: 'attendance',
            title: 'Attendance',
            icon: 'checkmark-circle-outline',
            color: '#10B981',
            onPress: () => navigation.navigate('Attendance', { role: 'director' }),
          },
          {
            id: 'assessment',
            title: 'Assessment',
            icon: 'clipboard-outline',
            color: '#EF4444',
            onPress: () => console.log('Assessment'),
          },
          {
            id: 'results',
            title: 'Results',
            icon: 'stats-chart-outline',
            color: '#F59E0B',
            onPress: () => console.log('Results'),
          },
        ];

      case 'teacher':
        return [
          ...commonActions,
          {
            id: 'attendance',
            title: 'Attendance',
            icon: 'checkmark-circle-outline',
            color: '#10B981',
            onPress: () => navigation.navigate('Attendance', { role: 'teacher' }),
          },
          {
            id: 'assessment',
            title: 'Assessment',
            icon: 'clipboard-outline',
            color: '#EF4444',
            onPress: () => navigation.navigate('AssessmentsList'),
          },
          {
            id: 'results',
            title: 'Results',
            icon: 'stats-chart-outline',
            color: '#F59E0B',
            onPress: () => console.log('Results'),
          },
        ];

      case 'student':
        return [
          ...commonActions,
          {
            id: 'attendance',
            title: 'Attendance',
            icon: 'checkmark-circle-outline',
            color: '#10B981',
            onPress: () => navigation.navigate('StudentAttendanceHistory', { role: 'student' }),
          },
          {
            id: 'results',
            title: 'Results',
            icon: 'stats-chart-outline',
            color: '#F59E0B',
            onPress: () => navigation.navigate('Results'),
          },
          {
            id: 'schedules',
            title: 'Schedules',
            icon: 'calendar-outline',
            color: '#EC4899',
            onPress: () => navigation.navigate('Schedules'),
          },
        ];

      default:
        return commonActions;
    }
  };

  const actions = getActionsForRole(role);

  return (
    <QuickActions 
      actions={actions} 
      title="Quick Actions"
      className={className}
    />
  );
}
