# API Calling with TanStack Query

## Quick Setup (One Time)
- TanStack Query is already configured globally in `App.tsx`
- No additional setup needed for new API calls

## Pattern for New API Endpoint

### 1. Add API Method to Service
```tsx
// src/services/api/directorService.ts
export interface YourData {
  // Define your data structure
}

export type YourResponse = ApiResponse<YourData>;

class DirectorService {
  async fetchYourData(): Promise<YourResponse> {
    try {
      const response = await this.httpClient.makeRequest<YourData>('/your/endpoint');
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
```

### 2. Create Hook File
```tsx
// src/hooks/useYourData.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import type { YourData } from '@/services/api/directorService';
import { directorQueryKeys } from './useDirectorDashboard';

export function useYourData() {
  return useQuery({
    queryKey: directorQueryKeys.yourKey, // Add to directorQueryKeys
    queryFn: async (): Promise<YourData> => {
      const response = await ApiService.directorDashboard.fetchYourData();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch data');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useRefreshYourData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<YourData> => {
      const response = await ApiService.directorDashboard.fetchYourData();
      if (!response.success) {
        throw new Error(response.message || 'Failed to refresh data');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(directorQueryKeys.yourKey, data);
    },
  });
}
```

### 3. Use in Component
```tsx
// In your component
import { useYourData, useRefreshYourData } from '@/hooks/useYourData';

export default function YourScreen() {
  const { data, isLoading, error, refetch } = useYourData();
  const refreshMutation = useRefreshYourData();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshMutation.isPending}
          onRefresh={() => refreshMutation.mutate()}
        />
      }
    >
      {/* Your content */}
    </ScrollView>
  );
}
```

## Benefits You Get Automatically
- ✅ Smart caching (5min fresh, 10min cache)
- ✅ No duplicate requests
- ✅ Background updates
- ✅ Pull-to-refresh
- ✅ Error recovery
- ✅ Loading states

## Query Keys
```tsx
// Add to directorQueryKeys in useDirectorDashboard.ts
export const directorQueryKeys = {
  dashboard: ['director', 'dashboard'] as const,
  teachers: ['director', 'teachers'] as const,
  students: ['director', 'students'] as const,
  yourKey: ['director', 'yourKey'] as const, // Add this
} as const;
```

## That's It!
Follow this pattern for any new API endpoint. TanStack Query handles everything else automatically.
