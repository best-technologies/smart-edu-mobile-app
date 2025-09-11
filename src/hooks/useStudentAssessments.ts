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
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
    retry: 2,
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: true, // Only refetch when reconnecting to network
  });
};
