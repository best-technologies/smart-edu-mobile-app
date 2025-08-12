import { AuthService } from './authService';
import { TeacherService } from './roleServices';
import { DirectorService } from './roleServices';
import { StudentService } from './roleServices';
import { UserService } from './roleServices';
import { TokenManager } from './tokenManager';

// Create service instances
const authService = new AuthService();
const teacherService = new TeacherService();
const directorService = new DirectorService();
const studentService = new StudentService();
const userService = new UserService();

// Main API Service Class
export class ApiService {
  // Authentication
  static auth = authService;
  
  // Role-specific services
  static teacher = teacherService;
  static director = directorService;
  static student = studentService;
  static user = userService;
  
  // Token management
  static tokens = TokenManager;
  
  // Utility methods
  static async isAuthenticated(): Promise<boolean> {
    return authService.isAuthenticated();
  }
  
  static async getUserData(): Promise<any | null> {
    return authService.getUserData();
  }
}

// Export individual services for direct access
export { authService, teacherService, directorService, studentService, userService };
export { TokenManager };
