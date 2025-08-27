import { AuthService } from './authService';
import { TeacherService } from './roleServices';
import { DirectorService } from './roleServices';
import { StudentService } from './roleServices';
import { UserService } from './roleServices';
import { TokenManager } from './tokenManager';
import { directorService as directorDashboardService } from './directorService';

// Create service instances
const authService = new AuthService();
const teacherService = new TeacherService();
const directorService = new DirectorService();
const studentService = new StudentService();
const userService = new UserService();

// Ensure all methods are available
console.log('🔧 TeacherService methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(teacherService)));
console.log('🔧 TeacherService getScheduleTab method:', typeof teacherService.getScheduleTab);

// Unified API Service class
export class ApiService {
  // Authentication
  static auth = authService;
  
  // Role-specific services
  static teacher = teacherService;
  static director = directorService;
  static student = studentService;
  static user = userService;
  
  // Dashboard services
  static directorDashboard = directorDashboardService;
  
  // Token management
  static tokens = TokenManager;
  
  // Authentication status check
  static async isAuthenticated(): Promise<boolean> {
    return authService.isAuthenticated();
  }
  
  // Get user data
  static async getUserData() {
    return authService.getUserData();
  }
  
  // Check if user requires OTP
  static async requiresOTP(): Promise<boolean> {
    return authService.requiresOTP();
  }
  
  // Get pending user for OTP verification
  static async getPendingUser() {
    return authService.getPendingUser();
  }
}

// Export individual service instances
export { authService, teacherService, directorService, studentService, userService };
export { TokenManager };
