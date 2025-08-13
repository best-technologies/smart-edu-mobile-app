// Role to navigation mapping utility
export const ROLE_ROUTE_MAP = {
  'school_director': 'SchoolDirector',
  'director': 'SchoolDirector', // Handle both backend and frontend role names
  'teacher': 'Teacher',
  'student': 'Student',
  'developer': 'Developer',
  'admin': 'SchoolDirector', // Admin can access director dashboard
} as const;

export type UserRole = keyof typeof ROLE_ROUTE_MAP;
export type RouteName = typeof ROLE_ROUTE_MAP[UserRole];

/**
 * Maps a user role to its corresponding navigation route
 */
export function getRouteForRole(role: string): RouteName | null {
  const normalizedRole = role.toLowerCase();
  
  // Handle both backend and frontend role naming conventions
  if (normalizedRole === 'school_director' || normalizedRole === 'director') {
    return 'SchoolDirector';
  }
  
  if (normalizedRole === 'teacher') {
    return 'Teacher';
  }
  
  if (normalizedRole === 'student') {
    return 'Student';
  }
  
  if (normalizedRole === 'developer') {
    return 'Developer';
  }
  
  if (normalizedRole === 'admin') {
    return 'SchoolDirector'; // Admin gets director access
  }
  
  return null;
}

/**
 * Checks if a role is valid and has a corresponding route
 */
export function isValidRole(role: string): boolean {
  return getRouteForRole(role) !== null;
}

/**
 * Gets the display name for a role
 */
export function getRoleDisplayName(role: string): string {
  const normalizedRole = role.toLowerCase();
  
  switch (normalizedRole) {
    case 'school_director':
    case 'director':
      return 'School Director';
    case 'teacher':
      return 'Teacher';
    case 'student':
      return 'Student';
    case 'developer':
      return 'Developer';
    case 'admin':
      return 'Administrator';
    default:
      return 'Unknown Role';
  }
}
