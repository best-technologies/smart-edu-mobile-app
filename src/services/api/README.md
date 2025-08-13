# Professional Data Fetching Implementation

This document describes the professional data fetching solution implemented for the Smart Edu Mobile App using React Query (TanStack Query).

## 🏗️ Architecture Overview

### Core Components

1. **React Query Provider** (`QueryProvider.tsx`)
   - Global query client configuration
   - Caching, retry, and error handling settings
   - Development tools integration

2. **API Services** (`directorService.ts`)
   - Type-safe API endpoints
   - Centralized error handling
   - Consistent response formatting

3. **Custom Hooks** (`useDirectorDashboard.ts`, `useDirectorData.ts`)
   - Reusable data fetching logic
   - Loading and error states
   - Cache management

4. **Data Prefetching** (`useDataPrefetching.ts`)
   - Role-based data prefetching
   - Improved user experience
   - Background data loading

## 🚀 Key Features

### ✅ Smart Caching
- **Stale Time**: Data considered fresh for 5 minutes
- **Cache Time**: Data cached for 10 minutes
- **Background Updates**: Automatic refetching when data becomes stale
- **Optimistic Updates**: Immediate UI updates with background sync

### ✅ Error Handling
- **Retry Logic**: Automatic retry with exponential backoff
- **Error Boundaries**: Graceful error states with retry options
- **Toast Notifications**: User-friendly error messages
- **Offline Support**: Cached data available when offline

### ✅ Performance Optimization
- **No Unnecessary Requests**: Data fetched only when needed
- **Background Prefetching**: Data loaded before navigation
- **Request Deduplication**: Multiple components requesting same data share one request
- **Memory Management**: Automatic cache cleanup

### ✅ Developer Experience
- **TypeScript Support**: Full type safety
- **DevTools**: React Query DevTools in development
- **Consistent API**: Standardized patterns across the app
- **Easy Testing**: Mockable and testable hooks

## 📖 Usage Examples

### Basic Usage in Component

```tsx
import { useDirectorData } from '@/hooks/useDirectorData';

export default function DirectorDashboardScreen() {
  const { data, isLoading, error, refresh } = useDirectorData();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;

  return (
    <View>
      <Text>Welcome, {data?.basic_details?.email}</Text>
      <Button onPress={refresh} title="Refresh" />
    </View>
  );
}
```

### Advanced Usage with Custom Hooks

```tsx
import { useDirectorDashboard, useRefreshDirectorDashboard } from '@/hooks/useDirectorDashboard';

export default function DirectorDashboardScreen() {
  const { data, isLoading, error, refetch } = useDirectorDashboard();
  const refreshMutation = useRefreshDirectorDashboard();

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshMutation.isPending}
          onRefresh={handleRefresh}
        />
      }
    >
      {/* Dashboard content */}
    </ScrollView>
  );
}
```

### Data Prefetching

```tsx
import { useDataPrefetching } from '@/hooks/useDataPrefetching';

export default function NavigationHandler() {
  const { prefetchDirectorDashboard } = useDataPrefetching();
  
  // Data is automatically prefetched based on user role
  // No manual intervention needed
}
```

## 🔧 Configuration

### Query Client Settings

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### API Service Structure

```tsx
class DirectorService {
  async fetchDashboardData(): Promise<DirectorDashboardResponse> {
    try {
      const response = await httpClient.get<DirectorDashboardResponse>(
        '/director/dashboard/fetch-dashboard-data'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching director dashboard data:', error);
      throw error;
    }
  }
}
```

## 📊 Benefits Over Traditional Approaches

### ❌ Traditional Approach Problems
- **Frequent API Calls**: Data fetched on every component mount
- **Poor Performance**: No caching, repeated network requests
- **Bad UX**: Loading states on every navigation
- **Error Handling**: Inconsistent error management
- **Memory Issues**: No cache management

### ✅ Our Solution Benefits
- **Smart Caching**: Data cached and reused intelligently
- **Background Updates**: Fresh data without blocking UI
- **Optimistic Updates**: Immediate feedback to users
- **Error Recovery**: Automatic retry and graceful fallbacks
- **Performance**: Reduced network requests and improved responsiveness

## 🔄 Data Flow

1. **Component Mount**: Hook checks cache for fresh data
2. **Cache Hit**: Returns cached data immediately
3. **Cache Miss**: Fetches from API and caches result
4. **Background Update**: Refetches stale data in background
5. **User Interaction**: Manual refresh available via pull-to-refresh
6. **Error Handling**: Graceful error states with retry options

## 🧪 Testing

### Mocking Queries

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);
```

### Testing Hooks

```tsx
import { renderHook, waitFor } from '@testing-library/react-hooks';
import { useDirectorData } from '@/hooks/useDirectorData';

test('should fetch dashboard data', async () => {
  const { result } = renderHook(() => useDirectorData(), { wrapper });
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  
  expect(result.current.data).toBeDefined();
});
```

## 🚀 Future Enhancements

- **Offline Support**: Service worker integration
- **Real-time Updates**: WebSocket integration
- **Optimistic Mutations**: Immediate UI updates for mutations
- **Infinite Queries**: Pagination support
- **Query Persistence**: Cache persistence across app restarts

## 📝 Best Practices

1. **Use Custom Hooks**: Encapsulate data fetching logic
2. **Handle Loading States**: Always show loading indicators
3. **Provide Error Recovery**: Give users retry options
4. **Optimize Cache Keys**: Use consistent, descriptive keys
5. **Monitor Performance**: Use React Query DevTools
6. **Type Everything**: Full TypeScript support
7. **Test Thoroughly**: Mock queries and test error states

This implementation provides a robust, performant, and user-friendly data fetching solution that scales with your application needs.
