import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { notificationService } from './api/notificationService';
import Constants from 'expo-constants';
import { API_CONFIG } from '@/services/config/apiConfig';
import { TokenManager } from '@/services/api/tokenManager';
import { ApiService } from '@/services';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushToken {
  id: string;
  token: string;
  deviceType: 'ios' | 'android';
  userId: string;
  schoolId: string;
}

class PushNotificationService {
  private expoPushToken: string | null = null;
  private isRegistered: boolean = false;

  // Register device for push notifications
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    // Prevent duplicate registrations
    if (this.isRegistered) {
      console.log('Push notifications already registered');
      return this.expoPushToken;
    }

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      // Get push token
      // If running in a dev client/bare, Expo requires a projectId (UUID).
      const projectId = (Constants as any)?.expoConfig?.extra?.eas?.projectId
        || (Constants as any)?.easConfig?.projectId;

      let token: Notifications.ExpoPushToken;
      if (projectId) {
        token = await Notifications.getExpoPushTokenAsync({ projectId });
      } else {
        token = await Notifications.getExpoPushTokenAsync();
      }

      this.expoPushToken = token.data;
      console.log('Push token:', this.expoPushToken);

      // Register token with backend
      await this.registerTokenWithBackend(token.data);

      // Set up notification listeners
      this.setupNotificationListeners();

      // Mark as registered
      this.isRegistered = true;

      return token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  // Register token with your backend
  private async registerTokenWithBackend(token: string) {
    try {
      const userId = await this.getCurrentUserId();
      const schoolId = await this.getCurrentSchoolId();
      
      // Don't register if user data isn't available yet
      if (!userId || !schoolId) {
        console.log('Skipping push notification registration - user data not available yet');
        return;
      }
      
      // Build absolute URL (relative URLs fail on device)
      const url = `${API_CONFIG.BASE_URL}/push-notifications/register-device`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          token,
          deviceType: Platform.OS,
          userId,
          schoolId,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.error('Register device failed', {
          url,
          status: res.status,
          statusText: res.statusText,
          body: text,
        });
      }
    } catch (error) {
      console.error('Error registering token with backend:', error);
    }
  }

  // Set up notification listeners
  private setupNotificationListeners() {
    // Handle notifications when app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received in foreground:', notification);
      // You can show a custom in-app notification here
    });

    // Handle notification taps
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
      // Navigate to specific screen based on notification data
      this.handleNotificationTap(response);
    });
  }

  // Handle notification tap
  private handleNotificationTap(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;
    
    // Navigate based on notification type
    if (data?.type === 'notification') {
      // Navigate to notifications screen
      // You'll need to implement navigation logic here
      console.log('Navigate to notification:', data.notificationId);
    }
  }

  // Get current auth token (implement based on your auth system)
  private async getAuthToken(): Promise<string> {
    const token = await TokenManager.getAccessToken();
    return token ?? '';
  }

  // Get current user ID (implement based on your auth system)
  private async getCurrentUserId(): Promise<string> {
    const user = await ApiService.getUserData();
    // try common id fields
    return (user as any)?.id || (user as any)?.user_id || '';
  }

  // Get current school ID (implement based on your auth system)
  private async getCurrentSchoolId(): Promise<string> {
    const user = await ApiService.getUserData();
    return (user as any)?.school_id || (user as any)?.school?.id || '';
  }

  // Get current push token
  getPushToken(): string | null {
    return this.expoPushToken;
  }

  // Unregister device
  async unregisterDevice() {
    if (this.expoPushToken) {
      try {
        const url = `${API_CONFIG.BASE_URL}/push-notifications/unregister-device`;
        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await this.getAuthToken()}`,
          },
          body: JSON.stringify({
            token: this.expoPushToken,
          }),
        });
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          console.error('Unregister device failed', {
            url,
            status: res.status,
            statusText: res.statusText,
            body: text,
          });
        }
      } catch (error) {
        console.error('Error unregistering device:', error);
      }
    }
  }
}

export const pushNotificationService = new PushNotificationService();
