import { HttpClient } from './httpClient';

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

export interface NotificationStats {
  total: number;
  all: number;
  teachers: number;
  students: number;
  school_director: number;
  admin: number;
}

export interface NotificationPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface NotificationsResponse {
  pagination: NotificationPagination;
  stats: NotificationStats;
  notifications: Notification[];
}

export interface CreateNotificationRequest {
  title: string;
  description: string;
  type: string;
  comingUpOn: string;
}

export interface CreateNotificationResponse {
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

export interface FetchNotificationsParams {
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
  sort_by?: 'createdAt' | 'title' | 'type';
  sort_order?: 'asc' | 'desc';
}

class NotificationService {
  private baseUrl = '/director/notifications';
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async fetchNotifications(params: FetchNotificationsParams = {}): Promise<NotificationsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.type) queryParams.append('type', params.type);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = `${this.baseUrl}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await this.httpClient.makeRequest<NotificationsResponse>(url, 'GET');
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async createNotification(data: CreateNotificationRequest): Promise<CreateNotificationResponse> {
    const response = await this.httpClient.makeRequest<CreateNotificationResponse>(this.baseUrl, 'POST', data);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }

  async deleteNotification(id: string): Promise<void> {
    await this.httpClient.makeRequest(`${this.baseUrl}/${id}`, 'DELETE');
  }

  async updateNotification(id: string, data: Partial<CreateNotificationRequest>): Promise<CreateNotificationResponse> {
    const response = await this.httpClient.makeRequest<CreateNotificationResponse>(`${this.baseUrl}/${id}`, 'PUT', data);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  }
}

export const notificationService = new NotificationService();
