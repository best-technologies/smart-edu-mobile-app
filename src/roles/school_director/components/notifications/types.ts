export interface Notification {
  id: string;
  school_id: string;
  academic_session_id: string;
  title: string;
  description: string;
  type: string;
  comingUpOn: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  variant?: 'dashboard' | 'list';
}
