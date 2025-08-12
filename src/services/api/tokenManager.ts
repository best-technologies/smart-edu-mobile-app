import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../config/apiConfig';
import { User } from '../types/apiTypes';

export class TokenManager {
  // Get stored access token
  static async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  // Get stored refresh token
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  // Store tokens (updated for new structure)
  static async storeTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      // Calculate expiry time (assuming 7 days for refresh token)
      const expiryTime = Date.now() + (7 * 24 * 60 * 60 * 1000);
      
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString()],
      ]);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  // Clear stored tokens
  static async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.TOKEN_EXPIRY,
        STORAGE_KEYS.PENDING_USER,
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  }

  // Check if token is expired
  static async isTokenExpired(): Promise<boolean> {
    try {
      const expiryTime = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);
      if (!expiryTime) return true;
      
      return Date.now() > parseInt(expiryTime);
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return true;
    }
  }

  // Store user data
  static async storeUserData(userData: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  // Get user data
  static async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Store pending user for OTP verification
  static async storePendingUser(userData: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_USER, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing pending user:', error);
    }
  }

  // Get pending user for OTP verification
  static async getPendingUser(): Promise<User | null> {
    try {
      const pendingUser = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_USER);
      return pendingUser ? JSON.parse(pendingUser) : null;
    } catch (error) {
      console.error('Error getting pending user:', error);
      return null;
    }
  }

  // Clear pending user after successful OTP verification
  static async clearPendingUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_USER);
    } catch (error) {
      console.error('Error clearing pending user:', error);
    }
  }
}
