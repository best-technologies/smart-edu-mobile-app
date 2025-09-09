import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/api';
import { StudentSubjectDetailsData } from '../services/types/apiTypes';

interface UseStudentSubjectDetailsOptions {
  subjectId: string;
  enabled?: boolean;
}

export const useStudentSubjectDetails = ({ subjectId, enabled = true }: UseStudentSubjectDetailsOptions) => {
  return useQuery<StudentSubjectDetailsData>({
    queryKey: ['student-subject-details', subjectId],
    queryFn: async () => {
      const response = await ApiService.student.getSubjectDetails(subjectId);
      return response.data;
    },
    enabled: enabled && !!subjectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
