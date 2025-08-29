import { useState, useEffect, useCallback } from 'react';
import { notificationService, Notification, NotificationsResponse, CreateNotificationRequest } from '@/services/api/notificationService';
import { useToast } from '@/contexts/ToastContext';

interface UseNotificationsOptions {
  initialType?: string;
  initialPage?: number;
  initialLimit?: number;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { initialType = 'all', initialPage = 1, initialLimit = 10 } = options;
  const { showToast } = useToast();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    all: 0,
    teachers: 0,
    students: 0,
    school_director: 0,
    admin: 0,
  });
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedFilter, setSelectedFilter] = useState(initialType);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (params: {
    page?: number;
    limit?: number;
    type?: string;
    search?: string;
    sort_by?: 'createdAt' | 'title' | 'type';
    sort_order?: 'asc' | 'desc';
  } = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: NotificationsResponse = await notificationService.fetchNotifications({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        type: params.type || selectedFilter,
        search: params.search,
        sort_by: params.sort_by || 'createdAt',
        sort_order: params.sort_order || 'desc',
      });

      setNotifications(response.notifications);
      setStats(response.stats);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      showToast('error', err.message || 'Failed to fetch notifications');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, selectedFilter, showToast]);

  const createNotification = useCallback(async (data: CreateNotificationRequest) => {
    try {
      setIsCreating(true);
      setError(null);
      
      const newNotification = await notificationService.createNotification(data);
      
      // Add the new notification to the beginning of the list
      setNotifications(prev => [newNotification, ...prev]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        [data.type]: prev[data.type as keyof typeof prev] + 1,
      }));
      
      showToast('success', 'Notification created successfully!');
      return newNotification;
    } catch (err: any) {
      setError(err.message || 'Failed to create notification');
      showToast('error', err.message || 'Failed to create notification');
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [showToast]);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      
      // Remove the notification from the list
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        total: prev.total - 1,
      }));
      
      showToast('success', 'Notification deleted successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete notification');
      throw err;
    }
  }, [showToast]);

  const updateNotification = useCallback(async (id: string, data: Partial<CreateNotificationRequest>) => {
    try {
      const updatedNotification = await notificationService.updateNotification(id, data);
      
      // Update the notification in the list
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? updatedNotification : notification
        )
      );
      
      showToast('success', 'Notification updated successfully!');
      return updatedNotification;
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update notification');
      throw err;
    }
  }, [showToast]);

  const changeFilter = useCallback((newFilter: string) => {
    setSelectedFilter(newFilter);
    fetchNotifications({ type: newFilter, page: 1 });
  }, [fetchNotifications]);

  const loadMore = useCallback(() => {
    if (pagination.hasNext && !isLoading) {
      fetchNotifications({ page: pagination.page + 1 });
    }
  }, [pagination.hasNext, pagination.page, isLoading, fetchNotifications]);

  const refresh = useCallback(() => {
    fetchNotifications({ page: 1 });
  }, [fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    // Data
    notifications,
    stats,
    pagination,
    selectedFilter,
    
    // State
    isLoading,
    isCreating,
    error,
    
    // Actions
    fetchNotifications,
    createNotification,
    deleteNotification,
    updateNotification,
    changeFilter,
    loadMore,
    refresh,
  };
}
