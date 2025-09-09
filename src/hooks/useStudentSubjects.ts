import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/api';
import { StudentSubjectsData } from '@/services/types/apiTypes';

export const useStudentSubjects = () => {
  return useQuery<StudentSubjectsData>({
    queryKey: ['student-subjects'],
    queryFn: async () => {
      const response = await ApiService.student.getSubjects();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
