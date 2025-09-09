import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import { StudentDashboardData } from '@/services/types/apiTypes';

export const useStudentDashboard = () => {
  return useQuery<StudentDashboardData>({
    queryKey: ['student-dashboard'],
    queryFn: async () => {
      const response = await ApiService.student.getDashboard();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
