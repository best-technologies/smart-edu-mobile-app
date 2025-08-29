export const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'all':
      return 'megaphone-outline';
    case 'teachers':
      return 'school-outline';
    case 'students':
      return 'people-outline';
    case 'school_director':
      return 'business-outline';
    case 'admin':
      return 'shield-outline';
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
    case 'school_director':
      return '#8B5CF6';
    case 'admin':
      return '#EF4444';
    default:
      return '#6B7280';
  }
};

export const formatNotificationDate = (dateString: string) => {
  if (!dateString) return 'No date';
  
  // Handle the new format: "Sep 15, 2024, 10:00 AM"
  if (dateString.includes(',')) {
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
  }
  
  // Handle ISO format as fallback
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
  if (!dateString) return 'No date';
  
  // Handle the new format: "Sep 15, 2024, 10:00 AM"
  if (dateString.includes(',')) {
    return dateString; // Return as is since it's already formatted
  }
  
  // Handle ISO format as fallback
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
  if (!dateString) return 'No date';
  
  // Handle the new format: "Sep 15, 2024, 10:00 AM"
  if (dateString.includes(',')) {
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
  }
  
  // Handle ISO format as fallback
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
