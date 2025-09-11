import { useQuery } from '@tanstack/react-query';
import { StudentService } from '@/services/api/roleServices';
import { StudentAssessmentsResponse } from '@/services/types/apiTypes';

const studentService = new StudentService();

interface UseStudentAssessmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  assessment_type?: string;
  status?: string;
}

export const useStudentAssessments = (params?: UseStudentAssessmentsParams) => {
  return useQuery<StudentAssessmentsResponse>({
    queryKey: ['studentAssessments', params],
    queryFn: () => studentService.getAssessments(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
