# User Profile Management System

## Overview

The user profile system is designed to efficiently manage user profile data across the app, fetching it only when necessary and caching it appropriately.

## When Profile Data is Fetched

### 1. **App Initialization**
- When the app starts and user is already authenticated
- Only fetches if no profile data exists or if user ID has changed

### 2. **After Successful Login**
- After direct login (no OTP required)
- After OTP verification (for roles requiring OTP)
- Automatically triggered by the auth context

### 3. **After Email Verification**
- When user completes email verification process
- Updates profile to reflect verified status

### 4. **Manual Refresh**
- When explicitly called via `refreshProfile()`
- Useful for updating profile after changes

## Key Features

### ✅ **Efficient API Usage**
- No unnecessary API calls
- Caches profile data
- Only fetches when user is authenticated
- Prevents duplicate requests

### ✅ **Automatic Integration**
- Works with existing auth system
- No manual setup required
- Handles loading and error states

### ✅ **Type Safety**
- Full TypeScript support
- Proper typing for all profile data
- Includes school information

## Usage Examples

### Basic Usage in Components

```tsx
import { useUserProfileContext } from '@/contexts/UserProfileContext';

function MyComponent() {
  const { userProfile, isLoading, error, refreshProfile } = useUserProfileContext();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <View>
      <Text>Welcome, {userProfile?.first_name} {userProfile?.last_name}</Text>
      <Text>School: {userProfile?.school?.name}</Text>
      <Text>Email: {userProfile?.email}</Text>
    </View>
  );
}
```

### Using the Hook Directly

```tsx
import { useUserProfile } from '@/hooks/useUserProfile';

function MyComponent() {
  const { userProfile, isLoading, error, refreshProfile } = useUserProfile();

  const handleRefresh = async () => {
    await refreshProfile();
  };

  return (
    <View>
      <Button onPress={handleRefresh} title="Refresh Profile" />
      {/* Component content */}
    </View>
  );
}
```

### Profile Data Structure

```tsx
interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: 'admin' | 'school_director' | 'teacher' | 'student' | 'developer';
  status: string;
  is_email_verified: boolean;
  school_id: string;
  display_picture: string | null;
  gender: string;
  created_at: string;
  updated_at: string;
  school: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    type: string;
    ownership: string;
    status: string;
  };
}
```

## API Endpoint

- **URL**: `/director/user/profile`
- **Method**: GET
- **Authentication**: Required (Bearer token)
- **Works for**: All roles (director, teacher, student)

## Best Practices

### ✅ **Do**
- Use the context in components that need profile data
- Handle loading and error states
- Use fallback values when profile is not available
- Refresh profile when needed (e.g., after profile updates)

### ❌ **Don't**
- Call the API directly in components
- Fetch profile on every render
- Ignore loading/error states
- Assume profile data is always available

## Integration with Auth System

The profile system automatically integrates with the auth context:

1. **Login Flow**: Profile is fetched after successful authentication
2. **Logout Flow**: Profile is cleared when user logs out
3. **Token Refresh**: Profile is maintained during token refresh
4. **Email Verification**: Profile is updated after email verification

## Error Handling

The system handles various error scenarios:

- **Network errors**: Retry mechanism available
- **Authentication errors**: Automatic logout
- **Server errors**: User-friendly error messages
- **Invalid data**: Graceful fallbacks

## Performance Considerations

- **Caching**: Profile data is cached in memory
- **Minimal API calls**: Only fetches when necessary
- **Efficient updates**: Only updates when data changes
- **Memory management**: Clears data on logout

## Future Enhancements

- **Offline support**: Cache profile data locally
- **Real-time updates**: WebSocket integration
- **Profile editing**: In-app profile management
- **Avatar upload**: Profile picture management
