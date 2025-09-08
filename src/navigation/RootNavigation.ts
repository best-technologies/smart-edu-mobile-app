import { createNavigationContainerRef } from '@react-navigation/native';

// Use 'any' to bypass strict typing for navigationRef
export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn('Navigation is not ready yet.');
  }
}
