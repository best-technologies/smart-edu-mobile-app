export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'all':
      return 'megaphone-outline';
    case 'teachers':
      return 'school-outline';
    case 'students':
      return 'people-outline';
    case 'directors':
      return 'business-outline';
    default:
      return 'notifications-outline';
  }
};

export const getNotificationColor = (type: string) => {
  switch (type) {
    case 'all':
      return '#3B82F6';
    case 'teachers':
      return '#10B981';
    case 'students':
      return '#F59E0B';
    case 'directors':
      return '#8B5CF6';
    default:
      return '#6B7280';
  }
};

export const formatNotificationDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Past';
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    return `In ${diffDays} days`;
  }
};

export const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTimeLabel = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Past Event';
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else {
    return `In ${diffDays} days`;
  }
};
