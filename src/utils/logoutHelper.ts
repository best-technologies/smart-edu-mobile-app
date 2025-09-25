import { navigationRef } from '@/navigation/RootNavigation';

/**
 * Force navigation to login screen
 * This is a utility function to ensure logout always redirects to login
 */
export const forceNavigateToLogin = () => {
//   console.log('🔄 Force navigating to login screen');
  
  if (navigationRef.isReady()) {
    try {
      navigationRef.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
      console.log('✅ Force navigation to login completed');
      return true;
    } catch (error) {
        // console.log('❌ Force navigation to login failed:', error);
      return false;
    }
  } else {
    // console.log('⚠️ Navigation ref not ready for force navigation');
    return false;
  }
};

/**
 * Emergency logout navigation - tries multiple approaches
 */
export const emergencyNavigateToLogin = () => {
//   console.log('🚨 Emergency navigation to login - trying all methods');
  
  // Method 1: Direct navigation ref
  if (forceNavigateToLogin()) {
    return;
  }
  
  // Method 2: Try with delay
  setTimeout(() => {
    if (forceNavigateToLogin()) {
      return;
    }
    
    // Method 3: Try navigate instead of reset
    if (navigationRef.isReady()) {
      try {
        navigationRef.navigate('Login');
        // console.log('✅ Emergency navigation via navigate completed');
      } catch (error) {
        console.log('❌ Emergency navigation via navigate failed:', error);
      }
    }
  }, 100);
  
  // Method 4: Final retry with longer delay
  setTimeout(() => {
    forceNavigateToLogin();
  }, 500);
};

/**
 * Retry navigation to login with delays
 */
export const retryNavigateToLogin = (maxRetries = 3, delay = 200) => {
  let retries = 0;
  
  const attemptNavigation = () => {
    if (retries >= maxRetries) {
      // console.log('❌ Max retries reached for navigation to login');
      return;
    }
    
    retries++;
    // console.log(`🔄 Retry ${retries}/${maxRetries} - navigating to login`);
    
    if (forceNavigateToLogin()) {
        // console.log('✅ Retry navigation to login successful');
      return;
    }
    
    setTimeout(attemptNavigation, delay);
  };
  
  attemptNavigation();
};
